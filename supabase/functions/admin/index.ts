// ============================================================
// PNRM – Edge Function: /admin
// All routes require admin role.
//
// TASKS
//   GET    /admin/tasks            → list all tasks (with filters)
//   POST   /admin/tasks            → create task
//   PUT    /admin/tasks/:id        → update task
//   DELETE /admin/tasks/:id        → soft-delete (is_required = false)
//
// PHASES
//   GET    /admin/phases           → list all phases
//   PUT    /admin/phases/:id       → update phase metadata
//
// USERS
//   GET    /admin/users            → list users with progress summary
//   GET    /admin/users/:id        → single user detail
//   POST   /admin/users/:id/grant-phase → manually unlock phase for user
//
// STATS
//   GET    /admin/stats            → aggregate dashboard
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  )

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Unauthorized' }, 401)

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authError || !user) return json({ error: 'Unauthorized' }, 401)

  // Verify admin role
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminRow) return json({ error: 'Forbidden — admin access required' }, 403)

  const url        = new URL(req.url)
  const segments   = url.pathname.split('/').filter(Boolean)
  const resource   = segments[1]   // 'tasks' | 'phases' | 'users' | 'stats'
  const resourceId = segments[2]
  const subAction  = segments[3]   // e.g. 'grant-phase'

  // ════════════════════════════════════════════════════════
  // TASKS
  // ════════════════════════════════════════════════════════

  if (resource === 'tasks') {

    // GET /admin/tasks
    if (req.method === 'GET' && !resourceId) {
      const phaseFilter    = url.searchParams.get('phase_id')
      const categoryFilter = url.searchParams.get('category')
      const requiredOnly   = url.searchParams.get('required') !== 'false'

      let query = supabase
        .from('tasks')
        .select('*, phases(number, title)')
        .order('phase_id', { ascending: true })
        .order('day_number', { ascending: true })

      if (phaseFilter)    query = query.eq('phase_id', phaseFilter)
      if (categoryFilter) query = query.eq('category', categoryFilter)
      if (requiredOnly)   query = query.eq('is_required', true)

      const { data, error } = await query
      if (error) return json({ error: error.message }, 500)
      return json({ data })
    }

    // POST /admin/tasks
    if (req.method === 'POST' && !resourceId) {
      const body = await req.json()
      const { phase_id, day_number, title, description, psychological_purpose, category } = body

      if (!phase_id || !day_number || !title || !description || !psychological_purpose) {
        return json({ error: 'phase_id, day_number, title, description, psychological_purpose are required' }, 400)
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          phase_id,
          day_number,
          title,
          description,
          psychological_purpose,
          category: category || 'emotional_control',
          is_required: true,
        })
        .select()
        .single()

      if (error) return json({ error: error.message }, 500)
      return json({ data }, 201)
    }

    // PUT /admin/tasks/:id
    if (req.method === 'PUT' && resourceId) {
      const body = await req.json()
      const allowedFields = [
        'title', 'description', 'psychological_purpose',
        'category', 'day_number', 'phase_id', 'is_required',
      ]
      const updates: Record<string, unknown> = {}
      for (const field of allowedFields) {
        if (field in body) updates[field] = body[field]
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', resourceId)
        .select()
        .single()

      if (error) return json({ error: error.message }, 500)
      return json({ data })
    }

    // DELETE /admin/tasks/:id  (soft delete via is_required = false)
    if (req.method === 'DELETE' && resourceId) {
      const { data, error } = await supabase
        .from('tasks')
        .update({ is_required: false })
        .eq('id', resourceId)
        .select('id, is_required')
        .single()

      if (error) return json({ error: error.message }, 500)
      return json({ data, message: 'Task deactivated' })
    }
  }

  // ════════════════════════════════════════════════════════
  // PHASES
  // ════════════════════════════════════════════════════════

  if (resource === 'phases') {

    // GET /admin/phases
    if (req.method === 'GET' && !resourceId) {
      const { data, error } = await supabase
        .from('phases')
        .select('*, tasks(count)')
        .order('number', { ascending: true })

      if (error) return json({ error: error.message }, 500)
      return json({ data })
    }

    // PUT /admin/phases/:id
    if (req.method === 'PUT' && resourceId) {
      const body = await req.json()
      const allowed = ['title', 'description', 'duration_days', 'psychological_goal']
      const updates: Record<string, unknown> = {}
      for (const f of allowed) {
        if (f in body) updates[f] = body[f]
      }

      const { data, error } = await supabase
        .from('phases')
        .update(updates)
        .eq('id', resourceId)
        .select()
        .single()

      if (error) return json({ error: error.message }, 500)
      return json({ data })
    }
  }

  // ════════════════════════════════════════════════════════
  // USERS
  // ════════════════════════════════════════════════════════

  if (resource === 'users') {

    // GET /admin/users
    if (req.method === 'GET' && !resourceId) {
      const page  = parseInt(url.searchParams.get('page')  || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const from  = (page - 1) * limit
      const to    = from + limit - 1

      const { data, error, count } = await supabase
        .from('users')
        .select(`
          id, email, name, created_at,
          protocol_progress(total_progress_percentage, current_phase, last_update),
          diagnosis_sessions(emotional_state, reconquest_probability, attachment_profile)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) return json({ error: error.message }, 500)
      return json({ data, meta: { total: count, page, limit } })
    }

    // GET /admin/users/:id
    if (req.method === 'GET' && resourceId && !subAction) {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          protocol_progress(*),
          diagnosis_sessions(*, created_at),
          user_phase_progress(phase_id, completion_percentage, unlocked, completed, phases(number, title))
        `)
        .eq('id', resourceId)
        .single()

      if (error) return json({ error: error.message }, 500)
      return json({ data })
    }

    // POST /admin/users/:id/grant-phase
    if (req.method === 'POST' && resourceId && subAction === 'grant-phase') {
      const body = await req.json()
      const { phase_id } = body

      if (!phase_id) return json({ error: 'phase_id is required' }, 400)

      const { data, error } = await supabase
        .from('user_phase_progress')
        .upsert(
          { user_id: resourceId, phase_id, unlocked: true, unlocked_at: new Date().toISOString() },
          { onConflict: 'user_id,phase_id' }
        )
        .select()
        .single()

      if (error) return json({ error: error.message }, 500)
      return json({ data, message: `Phase ${phase_id} granted to user ${resourceId}` }, 201)
    }
  }

  // ── GET /admin/stats ──────────────────────────────────
  if (resource === 'stats' && req.method === 'GET') {
    const [usersRes, tasksRes, completionsRes, diagnosisRes] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('is_required', true),
      supabase.from('user_tasks').select('id', { count: 'exact', head: true }).eq('completed', true),
      supabase.from('diagnosis_sessions').select('emotional_state'),
    ])

    const emotionalBreakdown = diagnosisRes.data?.reduce((acc, r) => {
      acc[r.emotional_state] = (acc[r.emotional_state] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return json({
      data: {
        total_users:         usersRes.count   || 0,
        total_tasks:         tasksRes.count   || 0,
        total_completions:   completionsRes.count || 0,
        emotional_breakdown: emotionalBreakdown,
      },
    })
  }

  return json({ error: 'Not found' }, 404)
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ============================================================
// PNRM – Edge Function: /tasks
//
// GET  /tasks/phase/:phaseId   → list tasks for a phase
// GET  /tasks/today            → current user's next task
// POST /tasks/complete         → mark task complete
// POST /tasks/uncomplete       → undo completion
// GET  /tasks/:id              → get single task details
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

  const url      = new URL(req.url)
  const segments = url.pathname.split('/').filter(Boolean)
  // segments: ['tasks', 'phase', '2']  OR  ['tasks', 'complete']  etc.
  const action = segments[1]

  // ── GET /tasks/phase/:phaseId ─────────────────────────
  if (req.method === 'GET' && action === 'phase') {
    const phaseId = parseInt(segments[2])
    if (isNaN(phaseId)) return json({ error: 'Invalid phaseId' }, 400)

    // Verify user has access to this phase
    const { data: accessRow } = await supabase
      .from('user_phase_progress')
      .select('phase_id')
      .eq('user_id', user.id)
      .eq('phase_id', phaseId)
      .eq('unlocked', true)
      .single()

    if (!accessRow) return json({ error: 'Phase not unlocked' }, 403)

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        id, day_number, title, description, psychological_purpose,
        category, is_required,
        user_tasks!left(completed, completed_at, notes)
      `)
      .eq('phase_id', phaseId)
      .eq('user_tasks.user_id', user.id)
      .order('day_number', { ascending: true })

    if (error) return json({ error: error.message }, 500)

    const enriched = tasks?.map(t => {
      const ut = Array.isArray(t.user_tasks) ? t.user_tasks[0] : t.user_tasks
      return {
        id: t.id,
        day_number: t.day_number,
        title: t.title,
        description: t.description,
        psychological_purpose: t.psychological_purpose,
        category: t.category,
        is_required: t.is_required,
        completed: ut?.completed || false,
        completed_at: ut?.completed_at || null,
        notes: ut?.notes || null,
      }
    }) || []

    return json({ data: enriched })
  }

  // ── GET /tasks/today ──────────────────────────────────
  if (req.method === 'GET' && action === 'today') {
    // Get the highest unlocked phase for the user
    const { data: accessRows } = await supabase
      .from('user_phase_progress')
      .select('phase_id, phases(number)')
      .eq('user_id', user.id)
      .eq('unlocked', true)
      .order('phase_id', { ascending: false })
      .limit(1)

    const currentPhaseId = accessRows?.[0]?.phase_id
    if (!currentPhaseId) return json({ data: null })

    const { data: phaseTasks } = await supabase
      .from('tasks')
      .select(`
        id, day_number, title, description, psychological_purpose, category,
        user_tasks!left(completed)
      `)
      .eq('phase_id', currentPhaseId)
      .eq('user_tasks.user_id', user.id)
      .order('day_number', { ascending: true })

    const incomplete = phaseTasks?.find(t => {
      const ut = Array.isArray(t.user_tasks) ? t.user_tasks[0] : t.user_tasks
      return !ut?.completed
    })

    return json({ data: incomplete || null, phase_id: currentPhaseId })
  }

  // ── POST /tasks/complete ──────────────────────────────
  if (req.method === 'POST' && action === 'complete') {
    const body = await req.json()
    const { task_id, notes } = body

    if (!task_id) return json({ error: 'task_id is required' }, 400)

    // Verify task exists and user has access to its phase
    const { data: task } = await supabase
      .from('tasks')
      .select('id, phase_id')
      .eq('id', task_id)
      .single()

    if (!task) return json({ error: 'Task not found' }, 404)

    const { data: access } = await supabase
      .from('user_phase_progress')
      .select('phase_id')
      .eq('user_id', user.id)
      .eq('phase_id', task.phase_id)
      .eq('unlocked', true)
      .single()

    if (!access) return json({ error: 'Phase not unlocked' }, 403)

    const { data, error } = await supabase
      .from('user_tasks')
      .upsert({
        user_id:      user.id,
        task_id,
        completed:    true,
        completed_at: new Date().toISOString(),
        notes:        notes || null,
      }, { onConflict: 'user_id,task_id' })
      .select()
      .single()

    if (error) return json({ error: error.message }, 500)
    return json({ data }, 201)
  }

  // ── POST /tasks/uncomplete ────────────────────────────
  if (req.method === 'POST' && action === 'uncomplete') {
    const body = await req.json()
    const { task_id } = body

    if (!task_id) return json({ error: 'task_id is required' }, 400)

    const { data, error } = await supabase
      .from('user_tasks')
      .update({ completed: false, completed_at: null })
      .eq('user_id', user.id)
      .eq('task_id', task_id)
      .select()
      .single()

    if (error) return json({ error: error.message }, 500)
    return json({ data })
  }

  // ── GET /tasks/:id ────────────────────────────────────
  if (req.method === 'GET' && action && action !== 'phase' && action !== 'today') {
    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        id, day_number, title, description, psychological_purpose,
        category, is_required, phase_id,
        phases(number, title),
        user_tasks!left(completed, completed_at, notes)
      `)
      .eq('id', action)
      .eq('user_tasks.user_id', user.id)
      .single()

    if (error) return json({ error: 'Task not found' }, 404)
    return json({ data: task })
  }

  return json({ error: 'Not found' }, 404)
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

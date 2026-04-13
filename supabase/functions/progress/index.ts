// ============================================================
// PNRM – Edge Function: /progress
//
// GET  /progress              → overall + per-phase progress
// GET  /progress/phase/:id    → specific phase progress
// POST /progress/recalculate  → force recalculation (all phases)
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
  const action   = segments[1]  // undefined | 'phase' | 'recalculate'

  // ── GET /progress ─────────────────────────────────────
  if (req.method === 'GET' && !action) {
    // Overall weighted progress from protocol_progress
    const { data: overall } = await supabase
      .from('protocol_progress')
      .select('total_progress_percentage, current_phase, task_score, emotional_score, consistency_score, diagnosis_score, last_update')
      .eq('user_id', user.id)
      .single()

    // Per-phase progress from user_phase_progress
    const { data: phases, error } = await supabase
      .from('user_phase_progress')
      .select(`
        phase_id, completion_percentage, unlocked, unlocked_at,
        completed, completed_at,
        phases(number, slug, title, description)
      `)
      .eq('user_id', user.id)
      .eq('unlocked', true)
      .order('phase_id', { ascending: true })

    if (error) return json({ error: error.message }, 500)

    // Current active phase (unlocked but not yet complete)
    const activePhase = phases?.find(p => !p.completed) || phases?.[phases.length - 1]

    return json({
      data: {
        overall: {
          total_progress_percentage: overall?.total_progress_percentage || 0,
          task_score:                overall?.task_score || 0,
          emotional_score:           overall?.emotional_score || 0,
          consistency_score:         overall?.consistency_score || 0,
          diagnosis_score:           overall?.diagnosis_score || 0,
          last_update:               overall?.last_update || null,
        },
        current_phase: activePhase ? {
          phase_id:   activePhase.phase_id,
          title:      (activePhase.phases as { title: string } | null)?.title,
          percentage: activePhase.completion_percentage,
        } : null,
        phases: phases || [],
      },
    })
  }

  // ── GET /progress/phase/:phaseId ──────────────────────
  if (req.method === 'GET' && action === 'phase') {
    const phaseId = parseInt(segments[2])
    if (isNaN(phaseId)) return json({ error: 'Invalid phaseId' }, 400)

    const { data, error } = await supabase
      .from('user_phase_progress')
      .select(`
        phase_id, completion_percentage, unlocked, unlocked_at,
        completed, completed_at,
        phases(number, slug, title, description)
      `)
      .eq('user_id', user.id)
      .eq('phase_id', phaseId)
      .single()

    if (error && error.code !== 'PGRST116') return json({ error: error.message }, 500)
    if (!data) return json({ data: { phase_id: phaseId, completion_percentage: 0, unlocked: false } })

    return json({ data })
  }

  // ── POST /progress/recalculate ────────────────────────
  if (req.method === 'POST' && action === 'recalculate') {
    // Delegate to the PostgreSQL function (handles all phases + protocol_progress)
    const { error } = await supabase.rpc('fn_recalculate_protocol_progress', {
      p_user_id: user.id,
    })

    if (error) return json({ error: error.message }, 500)

    // Return updated state
    const { data: updated } = await supabase
      .from('protocol_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return json({ data: { recalculated: true, protocol_progress: updated } })
  }

  return json({ error: 'Not found' }, 404)
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

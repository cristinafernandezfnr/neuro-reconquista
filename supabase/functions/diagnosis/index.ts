// ============================================================
// PNRM – Edge Function: /diagnosis
//
// GET  /diagnosis/questionnaire → return questions (no scores)
// POST /diagnosis/submit        → analyze answers, save session
// GET  /diagnosis/result        → get user's latest diagnosis
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Questionnaire definition ────────────────────────────────

export const QUESTIONNAIRE = [
  // Domain: Emotional State (q1–q4)
  {
    id: 'q1', domain: 'emotional',
    text: 'Como você descreveria seu estado emocional atual?',
    options: [
      { value: 'devastated',  label: 'Devastado — não consigo funcionar',       score: 0 },
      { value: 'very_bad',    label: 'Muito mal — choro com frequência',         score: 2 },
      { value: 'unstable',    label: 'Instável — oscilo muito',                  score: 4 },
      { value: 'difficult',   label: 'Difícil, mas estou agindo',                score: 6 },
      { value: 'coping',      label: 'Conseguindo me manter',                    score: 8 },
      { value: 'stable',      label: 'Estável e com clareza',                    score: 10 },
    ],
  },
  {
    id: 'q2', domain: 'emotional',
    text: 'Você está conseguindo dormir e se alimentar normalmente?',
    options: [
      { value: 'no',          label: 'Não — sono e apetite prejudicados',        score: 0 },
      { value: 'barely',      label: 'Dificilmente',                             score: 3 },
      { value: 'sometimes',   label: 'Com alguma dificuldade',                   score: 6 },
      { value: 'yes',         label: 'Sim, sem problemas',                       score: 10 },
    ],
  },
  {
    id: 'q3', domain: 'emotional',
    text: 'Com que frequência você pensa nela ao longo do dia?',
    options: [
      { value: 'constantly',  label: 'Constantemente — não consigo parar',       score: 0 },
      { value: 'very_often',  label: 'Muito frequente — várias vezes por hora',  score: 2 },
      { value: 'often',       label: 'Frequente — várias vezes ao dia',          score: 4 },
      { value: 'sometimes',   label: 'Às vezes — consigo me distrair',           score: 7 },
      { value: 'rarely',      label: 'Raramente',                               score: 10 },
    ],
  },
  {
    id: 'q4', domain: 'emotional',
    text: 'Como está sua autoestima atualmente?',
    options: [
      { value: 'destroyed',   label: 'Destruída — me sinto inútil',              score: 0 },
      { value: 'very_low',    label: 'Muito baixa',                              score: 2 },
      { value: 'low',         label: 'Baixa, mas estou tentando',                score: 5 },
      { value: 'moderate',    label: 'Moderada',                                 score: 7 },
      { value: 'good',        label: 'Boa — sei meu valor',                      score: 10 },
    ],
  },

  // Domain: Behavior / Contact (q5–q7)
  {
    id: 'q5', domain: 'behavior',
    text: 'Você entrou em contato com ela após o término?',
    options: [
      { value: 'many_times',  label: 'Sim, muitas vezes — supliquei ou implorei',score: 0 },
      { value: 'several',     label: 'Sim, várias vezes',                        score: 2 },
      { value: 'few',         label: 'Poucas vezes',                             score: 5 },
      { value: 'once',        label: 'Uma vez',                                  score: 7 },
      { value: 'no',          label: 'Não entrei em contato',                    score: 10 },
    ],
  },
  {
    id: 'q6', domain: 'behavior',
    text: 'Você monitora o perfil dela nas redes sociais?',
    options: [
      { value: 'obsessively', label: 'Obsessivamente — várias vezes ao dia',     score: 0 },
      { value: 'often',       label: 'Frequentemente',                           score: 3 },
      { value: 'sometimes',   label: 'Às vezes',                                 score: 6 },
      { value: 'rarely',      label: 'Raramente',                               score: 8 },
      { value: 'no',          label: 'Não — fiz mute ou bloqueei',               score: 10 },
    ],
  },
  {
    id: 'q7', domain: 'behavior',
    text: 'Você mudou sua rotina completamente por causa do término?',
    options: [
      { value: 'completely',  label: 'Completamente — parei tudo',               score: 0 },
      { value: 'mostly',      label: 'Na maior parte',                           score: 3 },
      { value: 'somewhat',    label: 'Parcialmente',                             score: 6 },
      { value: 'little',      label: 'Pouco',                                    score: 8 },
      { value: 'no',          label: 'Não — mantive minha vida',                 score: 10 },
    ],
  },

  // Domain: Relationship (q8–q10)
  {
    id: 'q8', domain: 'relationship',
    text: 'Qual foi o motivo principal do término?',
    options: [
      { value: 'betrayal',    label: 'Traição (minha)',                          score: 0 },
      { value: 'conflict',    label: 'Conflitos frequentes e graves',            score: 2 },
      { value: 'drift',       label: 'Distanciamento gradual',                   score: 5 },
      { value: 'pressure',    label: 'Pressão externa (família, trabalho)',       score: 7 },
      { value: 'unclear',     label: 'Não sei ao certo',                         score: 5 },
      { value: 'fear',        label: 'Ela estava com medo de comprometimento',   score: 8 },
    ],
  },
  {
    id: 'q9', domain: 'relationship',
    text: 'Há quanto tempo estão separados?',
    options: [
      { value: '1_week',      label: 'Menos de 1 semana',                        score: 3 },
      { value: '2_weeks',     label: '1–2 semanas',                              score: 5 },
      { value: '1_month',     label: '2–4 semanas',                              score: 7 },
      { value: '3_months',    label: '1–3 meses',                                score: 9 },
      { value: '6_months',    label: '3–6 meses',                                score: 8 },
      { value: '1_year_plus', label: 'Mais de 6 meses',                          score: 6 },
    ],
  },
  {
    id: 'q10', domain: 'relationship',
    text: 'Ela demonstrou algum sinal de interesse após o término?',
    options: [
      { value: 'blocked',     label: 'Me bloqueou em tudo',                      score: 0 },
      { value: 'cold',        label: 'Fria e distante',                          score: 3 },
      { value: 'neutral',     label: 'Neutra — responde quando necessário',      score: 5 },
      { value: 'warm',        label: 'Às vezes amigável',                        score: 7 },
      { value: 'interested',  label: 'Claramente ainda se importa',              score: 10 },
    ],
  },

  // Domain: Attachment Style Indicators (q11–q12)
  {
    id: 'q11', domain: 'attachment',
    text: 'Como você reage quando sente que vai perder alguém importante?',
    options: [
      { value: 'panic',       label: 'Entro em pânico e faço qualquer coisa para segurar', score: 0, style: 'anxious' },
      { value: 'distant',     label: 'Me afasto para me proteger',               score: 5, style: 'avoidant' },
      { value: 'talk',        label: 'Converso abertamente sobre o que sinto',   score: 10, style: 'secure' },
      { value: 'freeze',      label: 'Fico paralisado, não sei o que fazer',     score: 2, style: 'disorganized' },
    ],
  },
  {
    id: 'q12', domain: 'attachment',
    text: 'No relacionamento, você era mais propenso a:',
    options: [
      { value: 'need_reassurance', label: 'Precisar de constante reasseguramento dela',  score: 2, style: 'anxious' },
      { value: 'need_space',       label: 'Precisar de muito espaço e independência',    score: 5, style: 'avoidant' },
      { value: 'balanced',         label: 'Equilíbrio entre proximidade e independência', score: 10, style: 'secure' },
      { value: 'inconsistent',     label: 'Oscilar entre aproximação e distanciamento', score: 3, style: 'disorganized' },
    ],
  },
]

// ── Analysis Engine ─────────────────────────────────────────

interface Answer {
  questionId: string
  value: string
}

interface DiagnosisAnalysis {
  emotional_state: 'critical' | 'unstable' | 'stable' | 'recovering'
  reconquest_probability: number
  attachment_profile: 'anxious' | 'avoidant' | 'secure' | 'disorganized'
  recommended_phase: number
  raw_score: number
  breakdown: { emotional: number; behavior: number; relationship: number; attachment: number }
}

export function analyzeDiagnosis(answers: Answer[]): DiagnosisAnalysis {
  const domainScores: Record<string, { total: number; count: number }> = {
    emotional:    { total: 0, count: 0 },
    behavior:     { total: 0, count: 0 },
    relationship: { total: 0, count: 0 },
    attachment:   { total: 0, count: 0 },
  }

  const attachmentVotes: Record<string, number> = {
    anxious: 0, avoidant: 0, secure: 0, disorganized: 0,
  }

  for (const answer of answers) {
    const question = QUESTIONNAIRE.find(q => q.id === answer.questionId)
    if (!question) continue

    const option = question.options.find(o => o.value === answer.value)
    if (!option) continue

    const d = domainScores[question.domain]
    if (d) {
      d.total += option.score
      d.count++
    }

    if ('style' in option && option.style) {
      attachmentVotes[option.style as string] = (attachmentVotes[option.style as string] || 0) + 1
    }
  }

  const normalize = (d: { total: number; count: number }) =>
    d.count > 0 ? Math.round((d.total / (d.count * 10)) * 100) : 0

  const breakdown = {
    emotional:    normalize(domainScores.emotional),
    behavior:     normalize(domainScores.behavior),
    relationship: normalize(domainScores.relationship),
    attachment:   normalize(domainScores.attachment),
  }

  const raw_score = Math.round(
    breakdown.emotional    * 0.35 +
    breakdown.behavior     * 0.30 +
    breakdown.relationship * 0.25 +
    breakdown.attachment   * 0.10
  )

  const emotional_state: DiagnosisAnalysis['emotional_state'] =
    raw_score < 30 ? 'critical' :
    raw_score < 50 ? 'unstable' :
    raw_score < 70 ? 'stable'   : 'recovering'

  const reconquest_probability = Math.min(100, Math.round(
    breakdown.relationship * 0.45 +
    breakdown.behavior     * 0.30 +
    breakdown.emotional    * 0.25
  ))

  const attachment_profile = (Object.entries(attachmentVotes)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'anxious') as DiagnosisAnalysis['attachment_profile']

  const recommended_phase =
    raw_score < 30 ? 1 :
    raw_score < 50 ? 1 :
    raw_score < 70 ? 2 : 3

  return { emotional_state, reconquest_probability, attachment_profile, recommended_phase, raw_score, breakdown }
}

// ── Handler ─────────────────────────────────────────────────

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
  if (!authHeader) {
    return json({ error: 'Unauthorized' }, 401)
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authError || !user) {
    return json({ error: 'Unauthorized' }, 401)
  }

  const url  = new URL(req.url)
  const path = url.pathname.split('/').pop()

  // ── GET /diagnosis/questionnaire ──────────────────────
  if (req.method === 'GET' && path === 'questionnaire') {
    const questions = QUESTIONNAIRE.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options.map(o => ({ value: o.value, label: o.label })),
    }))
    return json({ data: questions })
  }

  // ── GET /diagnosis/result ─────────────────────────────
  if (req.method === 'GET' && path === 'result') {
    const { data, error } = await supabase
      .from('diagnosis_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      return json({ error: error.message }, 500)
    }

    return json({ data: data || null })
  }

  // ── POST /diagnosis/submit ────────────────────────────
  if (req.method === 'POST' && path === 'submit') {
    const body = await req.json()
    const answers: Answer[] = body.answers

    if (!answers || !Array.isArray(answers)) {
      return json({ error: 'answers array is required' }, 400)
    }

    const analysis = analyzeDiagnosis(answers)

    // Insert new diagnosis session (multiple sessions per user allowed)
    const { data: saved, error: saveError } = await supabase
      .from('diagnosis_sessions')
      .insert({
        user_id:                 user.id,
        answers_json:            answers,
        emotional_state:         analysis.emotional_state,
        attachment_profile:      analysis.attachment_profile,
        reconquest_probability:  analysis.reconquest_probability,
        raw_score:               analysis.raw_score,
      })
      .select()
      .single()

    if (saveError) {
      return json({ error: saveError.message }, 500)
    }

    // Unlock recommended phase if not already unlocked
    // (trigger fn_diagnosis_submitted handles protocol_progress recalculation)
    const { data: phaseData } = await supabase
      .from('phases')
      .select('id')
      .eq('number', analysis.recommended_phase)
      .single()

    if (phaseData) {
      await supabase
        .from('user_phase_progress')
        .upsert(
          { user_id: user.id, phase_id: phaseData.id, unlocked: true, unlocked_at: new Date().toISOString() },
          { onConflict: 'user_id,phase_id' }
        )
    }

    return json({ data: saved, analysis }, 201)
  }

  return json({ error: 'Not found' }, 404)
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

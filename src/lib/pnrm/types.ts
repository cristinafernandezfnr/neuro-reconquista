// ============================================================
// PNRM – Shared TypeScript types (003 schema)
// ============================================================

// ── Phases ──────────────────────────────────────────────────

export interface Phase {
  id: number
  number: number
  slug: string
  title: string
  description: string
  duration_days: number
  psychological_goal: string
  created_at: string
}

// ── Tasks ───────────────────────────────────────────────────

export type TaskCategory =
  | 'emotional_control'
  | 'silence_discipline'
  | 'self_reconstruction'
  | 'attraction_rebuilding'
  | 're_approach_strategy'

export interface Task {
  id: string
  phase_id: number
  title: string
  description: string
  psychological_purpose: string
  category: TaskCategory
  day_number: number
  is_required: boolean
  created_at: string
  updated_at: string
}

export interface UserTask {
  id: string
  user_id: string
  task_id: string
  completed: boolean
  completed_at: string | null
  notes: string | null
  created_at: string
}

// Enriched task (Task + user completion status)
export interface TaskWithProgress extends Task {
  completed: boolean
  completed_at: string | null
  notes: string | null
}

// ── Diagnosis ────────────────────────────────────────────────

export type EmotionalState  = 'critical' | 'unstable' | 'stable' | 'recovering'
export type AttachmentProfile = 'anxious' | 'avoidant' | 'secure' | 'disorganized'

export interface DiagnosisSession {
  id: string
  user_id: string
  answers_json: QuestionnaireAnswer[]
  emotional_state: EmotionalState
  attachment_profile: AttachmentProfile
  reconquest_probability: number   // 0–100
  raw_score: number
  created_at: string
}

export interface QuestionnaireAnswer {
  questionId: string
  value: string
}

// ── Phase Progress ───────────────────────────────────────────

export interface UserPhaseProgress {
  id: string
  user_id: string
  phase_id: number
  completion_percentage: number
  unlocked: boolean
  unlocked_at: string | null
  completed: boolean
  completed_at: string | null
  phases?: Pick<Phase, 'number' | 'slug' | 'title' | 'description'>
}

// ── Protocol Progress ────────────────────────────────────────
// One row per user. Weighted: tasks×0.40 + emotional×0.25 + consistency×0.20 + diagnosis×0.15

export interface ProtocolProgress {
  id: string
  user_id: string
  total_progress_percentage: number
  current_phase: number | null
  task_score: number
  emotional_score: number
  consistency_score: number
  diagnosis_score: number
  last_update: string
}

// ── Progress Summary (API response) ─────────────────────────

export interface ProgressSummary {
  overall: {
    total_progress_percentage: number
    task_score: number
    emotional_score: number
    consistency_score: number
    diagnosis_score: number
    last_update: string | null
  }
  current_phase: {
    phase_id: number
    title: string | undefined
    percentage: number
  } | null
  phases: UserPhaseProgress[]
}

// ── API response wrappers ────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  error?: never
}

export interface ApiError {
  data?: never
  error: string
}

export type ApiResult<T> = ApiResponse<T> | ApiError

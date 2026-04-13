// ============================================================
// PNRM – Client-side API helpers (003 schema)
// Wraps Supabase Edge Function calls with typed responses.
// ============================================================

import { supabase } from '../supabase'
import type {
  DiagnosisSession,
  QuestionnaireAnswer,
  TaskWithProgress,
  ProgressSummary,
  UserPhaseProgress,
  ApiResult,
} from './types'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

async function callFunction<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) return { error: 'Not authenticated' }

  try {
    const res = await fetch(`${FUNCTIONS_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error || 'Request failed' }
    return { data: json.data ?? json }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ── Diagnosis ────────────────────────────────────────────────

export const diagnosisApi = {
  /** Fetch questions (no scores exposed) */
  getQuestionnaire: () =>
    callFunction<{ id: string; text: string; options: { value: string; label: string }[] }[]>(
      '/diagnosis/questionnaire'
    ),

  /** Submit answers and get analysis result */
  submit: (answers: QuestionnaireAnswer[]) =>
    callFunction<DiagnosisSession>('/diagnosis/submit', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  /** Get user's latest diagnosis session */
  getResult: () =>
    callFunction<DiagnosisSession | null>('/diagnosis/result'),
}

// ── Tasks ───────────────────────────────────────────────────

export const tasksApi = {
  /** Get all tasks for a phase (with user completion status) */
  getByPhase: (phaseId: number) =>
    callFunction<TaskWithProgress[]>(`/tasks/phase/${phaseId}`),

  /** Get today's recommended next task */
  getToday: () =>
    callFunction<TaskWithProgress | null>('/tasks/today'),

  /** Get single task */
  getById: (taskId: string) =>
    callFunction<TaskWithProgress>(`/tasks/${taskId}`),

  /** Mark a task complete */
  complete: (taskId: string, options?: { notes?: string }) =>
    callFunction<{ id: string; completed: boolean }>('/tasks/complete', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId, ...options }),
    }),

  /** Undo a task completion */
  uncomplete: (taskId: string) =>
    callFunction<{ id: string; completed: boolean }>('/tasks/uncomplete', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId }),
    }),
}

// ── Progress ────────────────────────────────────────────────

export const progressApi = {
  /** Get overall + per-phase progress summary */
  getAll: () =>
    callFunction<ProgressSummary>('/progress'),

  /** Get progress for a specific phase */
  getPhase: (phaseId: number) =>
    callFunction<UserPhaseProgress>(`/progress/phase/${phaseId}`),

  /** Force recalculation of all phase progress */
  recalculate: () =>
    callFunction<{ recalculated: boolean; protocol_progress: unknown }>('/progress/recalculate', {
      method: 'POST',
    }),
}

// ── Admin ───────────────────────────────────────────────────

export const adminApi = {
  tasks: {
    list: (filters?: { phase_id?: number; category?: string; required?: boolean }) => {
      const params = new URLSearchParams()
      if (filters?.phase_id !== undefined) params.set('phase_id', String(filters.phase_id))
      if (filters?.category)              params.set('category', filters.category)
      if (filters?.required !== undefined) params.set('required', String(filters.required))
      return callFunction<unknown[]>(`/admin/tasks?${params}`)
    },
    create: (task: {
      phase_id: number; day_number: number; title: string;
      description: string; psychological_purpose: string; category?: string
    }) => callFunction<unknown>('/admin/tasks', { method: 'POST', body: JSON.stringify(task) }),
    update: (id: string, updates: Record<string, unknown>) =>
      callFunction<unknown>(`/admin/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
    delete: (id: string) =>
      callFunction<unknown>(`/admin/tasks/${id}`, { method: 'DELETE' }),
  },
  phases: {
    list: () => callFunction<unknown[]>('/admin/phases'),
    update: (id: number, updates: Record<string, unknown>) =>
      callFunction<unknown>(`/admin/phases/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  },
  users: {
    list: (page = 1, limit = 20) =>
      callFunction<{ data: unknown[]; meta: { total: number; page: number; limit: number } }>(
        `/admin/users?page=${page}&limit=${limit}`
      ),
    getById: (id: string) =>
      callFunction<unknown>(`/admin/users/${id}`),
    grantPhase: (userId: string, phaseId: number) =>
      callFunction<unknown>(`/admin/users/${userId}/grant-phase`, {
        method: 'POST',
        body: JSON.stringify({ phase_id: phaseId }),
      }),
  },
  stats: {
    get: () => callFunction<{
      total_users: number
      total_tasks: number
      total_completions: number
      emotional_breakdown: Record<string, number>
    }>('/admin/stats'),
  },
}

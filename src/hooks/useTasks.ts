import { useState, useEffect, useCallback } from 'react'
import { TaskCompletion } from '../types'
import { supabase, isDemoSupabase } from '../lib/supabase'
import { safeJsonParse } from '../lib/utils'

const DEMO_TASKS_KEY = 'nr_demo_tasks'

export const useTasks = (userId: string | null, dayNumber: number) => {
  const [completions, setCompletions] = useState<TaskCompletion[]>([])
  const [loading, setLoading] = useState(false)

  const getDemoTasks = (): TaskCompletion[] => {
    return safeJsonParse<TaskCompletion[]>(localStorage.getItem(DEMO_TASKS_KEY), [])
      .filter(t => t.user_id === userId && t.day_number === dayNumber)
  }

  const fetchTasks = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    if (isDemoSupabase()) {
      setCompletions(getDemoTasks())
      setLoading(false)
      return
    }
    try {
      const { data } = await supabase
        .from('task_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('day_number', dayNumber)
      setCompletions((data as TaskCompletion[]) || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [userId, dayNumber])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const completeTask = async (taskType: string, data?: { exercise_response?: string; emotion?: string }) => {
    if (!userId) return

    // Preserve original completed_at — editing a response never changes the first completion date
    const existing = completions.find(t => t.task_type === taskType)
    const completion: TaskCompletion = {
      id: `${userId}-${dayNumber}-${taskType}`,
      user_id: userId,
      day_number: dayNumber,
      task_type: taskType,
      exercise_response: data?.exercise_response,
      emotion: data?.emotion,
      completed_at: existing?.completed_at || new Date().toISOString(),
    }
    setCompletions(prev => {
      const filtered = prev.filter(t => t.task_type !== taskType)
      return [...filtered, completion]
    })
    if (isDemoSupabase()) {
      const all = safeJsonParse<TaskCompletion[]>(localStorage.getItem(DEMO_TASKS_KEY), [])
      const filtered = all.filter(t => !(t.user_id === userId && t.day_number === dayNumber && t.task_type === taskType))
      localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify([...filtered, completion]))
      return
    }
    try {
      // For Supabase: only update content fields, never overwrite completed_at if row exists
      await supabase.from('task_completions').upsert(completion, { onConflict: 'user_id,day_number,task_type', ignoreDuplicates: false })
    } catch { /* ignore */ }
  }

  const isCompleted = (taskType: string) => completions.some(t => t.task_type === taskType)
  const isDayComplete = () => completions.some(t => t.task_type === 'checkin')

  return { completions, loading, completeTask, isCompleted, isDayComplete, refetch: fetchTasks }
}

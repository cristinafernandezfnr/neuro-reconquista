import { useMemo } from 'react'
import { User } from '../types'

export const useStreak = (user: User | null) => {
  const streak = user?.streak || 0
  // Day always starts at 1 regardless of anamnese result — progression is set server-side via daily check-in
  const currentDay = user?.current_day || 1

  const weekNumber = useMemo(() => Math.ceil(currentDay / 7), [currentDay])
  const dayInWeek = useMemo(() => ((currentDay - 1) % 7) + 1, [currentDay])
  const progressPercent = useMemo(() => {
    try {
      const completedDays = JSON.parse(localStorage.getItem('nr_completed_days') || '[]') as number[]
      return Math.round((completedDays.length / 35) * 100)
    } catch { return 0 }
  }, [currentDay])

  return { streak, currentDay, weekNumber, dayInWeek, progressPercent }
}

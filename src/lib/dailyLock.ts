const LOCK_KEY = 'nr_day_started'

export interface DayLock {
  day: number
  startedAt: string  // ISO timestamp
  unlocksAt: string  // midnight of next day ISO
}

export function startDay(day: number): void {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const lock: DayLock = {
    day,
    startedAt: now.toISOString(),
    unlocksAt: tomorrow.toISOString(),
  }
  localStorage.setItem(LOCK_KEY, JSON.stringify(lock))
}

export function canAccessDay(day: number): boolean {
  // Day 1 always accessible
  if (day === 1) return true
  try {
    const completed: number[] = JSON.parse(localStorage.getItem('nr_completed_days') || '[]')
    if (!completed.includes(day - 1)) return false
    const lock: Partial<DayLock> = JSON.parse(localStorage.getItem(LOCK_KEY) || '{}')
    if (lock.day !== day - 1) return false
    return new Date() >= new Date(lock.unlocksAt!)
  } catch { return false }
}

export function getUnlockTime(day: number): Date | null {
  try {
    const lock: Partial<DayLock> = JSON.parse(localStorage.getItem(LOCK_KEY) || '{}')
    if (lock.day === day - 1 && lock.unlocksAt) return new Date(lock.unlocksAt)
    return null
  } catch { return null }
}

export function getTimeUntilUnlock(day: number): string {
  const unlockTime = getUnlockTime(day)
  if (!unlockTime) return ''
  const diff = unlockTime.getTime() - Date.now()
  if (diff <= 0) return 'Disponível agora!'
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  return `${hours}h ${minutes}min`
}

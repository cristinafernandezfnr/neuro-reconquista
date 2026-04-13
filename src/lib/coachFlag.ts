const KEY = 'nr_coach_enabled'

export function isCoachEnabled(): boolean {
  try {
    if (localStorage.getItem(KEY) === 'false') return false
  } catch { /* ignore */ }
  return true
}

export function setCoachEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(KEY, enabled ? 'true' : 'false')
  } catch { /* ignore */ }
}

import { User } from '../types'

type DemoPlan = 'free' | 'protocol' | 'pro'

function getDemoPlan(): DemoPlan {
  try {
    const val = localStorage.getItem('nr_demo_plan')
    if (val === 'free' || val === 'protocol' || val === 'pro') return val
  } catch { /* ignore */ }
  return 'protocol' // default — preserves existing behavior
}

export function setDemoPlan(plan: DemoPlan): void {
  localStorage.setItem('nr_demo_plan', plan)
}

export const canAccessProtocol = (user: User | null): boolean => {
  if (!user) return false
  if (user.banned) return false
  return user.protocol_access === true
}

export const canAccessPro = (user: User | null): boolean => {
  if (!user) return false
  if (user.banned) return false
  if (user.email === 'demo@teste.com') {
    return getDemoPlan() === 'pro'
  }
  return user.pro_access === true
}

export const isBanned = (user: User | null): boolean => {
  return user?.banned === true
}

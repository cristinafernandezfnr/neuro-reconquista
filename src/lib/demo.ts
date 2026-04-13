import { User } from '../types'

export const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'demo@teste.com',
  name: 'Demo',
  language: 'pt',
  user_gender: 'male',
  target_gender: 'female',
  streak: 0,
  current_day: 1,
  protocol_access: true,
  pro_access: true,
  banned: false,
}

export const isDemoMode = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL || ''
  return !url || url.includes('placeholder') || !url.includes('supabase.co')
}

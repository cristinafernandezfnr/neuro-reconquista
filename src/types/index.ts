export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  language: string
  user_gender?: 'male' | 'female'
  target_gender?: 'male' | 'female'
  streak: number
  current_day: number
  last_activity?: string
  protocol_access: boolean
  protocol_source?: string
  protocol_stripe_sub_id?: string
  pro_access: boolean
  pro_stripe_sub_id?: string
  banned: boolean
  ban_reason?: string
  anamnese_score?: number
  anamnese_nivel?: number
  anamnese_reconnect_day?: number
  created_at?: string
}

export interface AnamneseRecord {
  id: string
  user_id: string
  respostas: Record<number, string>
  score_total: number
  nivel: number
  created_at: string
}

export interface TaskCompletion {
  id: string
  user_id: string
  day_number: number
  task_type: string
  exercise_response?: string
  emotion?: string
  completed_at: string
}

export interface AIMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: string
  status: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  valid_until?: string
  created_at: string
}

export type Lang = 'pt' | 'es' | 'en'
export type UserGender = 'male' | 'female'
export type TargetGender = 'male' | 'female'
export type EmotionType = 'anxious' | 'missing' | 'focused' | 'neutral' | 'good'

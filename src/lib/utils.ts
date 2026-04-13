import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const safeJsonParse = <T>(str: string | null, fallback: T): T => {
  if (!str) return fallback
  try { return JSON.parse(str) as T } catch { return fallback }
}

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export const getGreeting = (): 'morning' | 'afternoon' | 'evening' => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

export const getDaysSince = (dateStr: string): number => {
  const then = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
}

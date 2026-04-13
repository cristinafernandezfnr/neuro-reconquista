import { useState, useEffect } from 'react'
import { User } from '../types'
import { supabase, isDemoSupabase } from '../lib/supabase'

export const useProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    if (isDemoSupabase()) {
      try {
        const stored = localStorage.getItem('nr_demo_user')
        if (stored) setProfile(JSON.parse(stored))
      } catch { /* ignore */ }
      return
    }
    setLoading(true)
    supabase.from('users').select('*').eq('id', userId).single()
      .then(({ data }) => { if (data) setProfile(data as User) })
      .then(() => setLoading(false), () => setLoading(false))
  }, [userId])

  const updateProfile = async (updates: Partial<User>) => {
    if (!userId) return
    setProfile(prev => prev ? { ...prev, ...updates } : null)
    if (isDemoSupabase()) {
      const stored = localStorage.getItem('nr_demo_user')
      if (stored) {
        try {
          const u = JSON.parse(stored)
          localStorage.setItem('nr_demo_user', JSON.stringify({ ...u, ...updates }))
        } catch { /* ignore */ }
      }
      return
    }
    await supabase.from('users').update(updates).eq('id', userId)
  }

  return { profile, loading, updateProfile }
}

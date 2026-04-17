import { useState, useEffect } from 'react'
import { User } from '../types'
import { supabase, isDemoSupabase } from '../lib/supabase'
import { DEMO_USER } from '../lib/demo'
import { clearDemoFlow } from '../lib/demoFlow'

export function resetDemoStorage() {
  const keysToPreserve = ['nr_language', 'nr_audio_muted']
  const preserved: Record<string, string> = {}
  keysToPreserve.forEach(k => {
    const v = localStorage.getItem(k)
    if (v !== null) preserved[k] = v
  })
  localStorage.clear()
  Object.entries(preserved).forEach(([k, v]) => localStorage.setItem(k, v))
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for demo session first (works in any Supabase mode)
    const hasSession = sessionStorage.getItem('nr_demo_session') === 'true'
    if (hasSession) {
      const stored = localStorage.getItem('nr_demo_user')
      if (stored) {
        try { setUser(JSON.parse(stored) as User) } catch { setUser(null) }
      }
      setLoading(false)
      return
    }

    if (isDemoSupabase()) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUser = async (id: string) => {
    try {
      let { data } = await supabase.from('users').select('*').eq('id', id).single()

      // If user row doesn't exist yet (trigger may have failed), create it
      if (!data) {
        const { data: authUser } = await supabase.auth.getUser()
        const email = authUser?.user?.email || ''
        const name = authUser?.user?.user_metadata?.full_name || ''
        await supabase.from('users').upsert({ id, email, name }, { onConflict: 'id' })
        const { data: created } = await supabase.from('users').select('*').eq('id', id).single()
        data = created
      }

      setUser(data as User)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (isDemoSupabase() && email === 'demo@teste.com') {
      resetDemoStorage()
      const demoUser = { ...DEMO_USER, current_day: 1, streak: 0 }
      localStorage.setItem('nr_demo_user', JSON.stringify(demoUser))
      sessionStorage.setItem('nr_demo_session', 'true')
      setUser(demoUser)
      return { error: null }
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (e) {
      return { error: e }
    }
  }

  const signInWithMagicLink = async (email: string) => {
    if (isDemoSupabase()) return { error: new Error('Demo mode — use demo@teste.com') }
    try {
      const redirectTo = window.location.origin
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
      })
      return { error }
    } catch (e) {
      return { error: e }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (isDemoSupabase()) return { error: new Error('Demo mode — use demo@teste.com') }
    try {
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: name } }
      })
      return { error }
    } catch (e) {
      return { error: e }
    }
  }

  const signInDemo = () => {
    resetDemoStorage()
    const demoUser = { ...DEMO_USER, current_day: 1, streak: 0 }
    localStorage.setItem('nr_demo_user', JSON.stringify(demoUser))
    sessionStorage.setItem('nr_demo_session', 'true')
    setUser(demoUser)
  }

  const signOut = async () => {
    clearDemoFlow()
    localStorage.removeItem('nr_demo_user')
    localStorage.removeItem('nr_demo_tasks')
    localStorage.removeItem('nr_completed_days')
    localStorage.removeItem('nr_just_completed_day')
    sessionStorage.removeItem('nr_demo_session')
    setUser(null)
    if (!isDemoSupabase()) {
      await supabase.auth.signOut()
    }
  }

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      if (isDemoSupabase()) {
        localStorage.setItem('nr_demo_user', JSON.stringify(updated))
      }
      return updated
    })
  }

  return { user, loading, signIn, signInWithMagicLink, signUp, signInDemo, signOut, updateUser }
}

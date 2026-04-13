import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { t } from '../data/i18n'
import { useAuth } from '../hooks/useAuth'
import { supabase, isDemoSupabase } from '../lib/supabase'
import { setOnboardingDone } from '../lib/demoFlow'
import { UserGender, TargetGender } from '../types'

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [step, setStep] = useState(0)
  const [userGender, setUserGender] = useState<UserGender | null>(null)
  const [targetGender, setTargetGender] = useState<TargetGender | null>(null)

  const handleFinish = async () => {
    if (!userGender || !targetGender) return
    const updates = { user_gender: userGender, target_gender: targetGender }
    updateUser(updates)
    setOnboardingDone(userGender, targetGender)
    if (!isDemoSupabase() && user) {
      await supabase.from('users').update(updates).eq('id', user.id)
    }
    navigate('/home')
  }

  const steps = [
    // Step 0: Your gender
    <motion.div key="gender1" className="flex flex-col items-center gap-6 w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center">
        <p className="text-text-muted text-sm mb-2">1 {t('onboarding.step')} 2</p>
        <h2 className="font-display text-2xl text-text-primary">{t('onboarding.gender.q1')}</h2>
      </div>
      <div className="w-full grid grid-cols-2 gap-4">
        {(['male', 'female'] as UserGender[]).map(g => (
          <button
            key={g}
            onClick={() => setUserGender(g)}
            className={`p-6 rounded-xl border flex flex-col items-center gap-2 transition-all ${userGender === g ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
          >
            <span className="text-4xl">{g === 'male' ? '👨' : '👩'}</span>
            <span className="text-text-primary font-medium">{t(`onboarding.gender.${g}`)}</span>
          </button>
        ))}
      </div>
      <Button fullWidth size="lg" disabled={!userGender} onClick={() => setStep(1)}>
        {t('onboarding.next')}
      </Button>
    </motion.div>,

    // Step 1: Target gender
    <motion.div key="gender2" className="flex flex-col items-center gap-6 w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center">
        <p className="text-text-muted text-sm mb-2">2 {t('onboarding.step')} 2</p>
        <h2 className="font-display text-2xl text-text-primary">{t('onboarding.gender.q2')}</h2>
      </div>
      <div className="w-full grid grid-cols-2 gap-4">
        {(['male', 'female'] as TargetGender[]).map(g => (
          <button
            key={g}
            onClick={() => setTargetGender(g)}
            className={`p-6 rounded-xl border flex flex-col items-center gap-2 transition-all ${targetGender === g ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
          >
            <span className="text-4xl">{g === 'male' ? '👨' : '👩'}</span>
            <span className="text-text-primary font-medium">{t(`onboarding.gender.${g}`)}</span>
          </button>
        ))}
      </div>
      <Button fullWidth size="lg" disabled={!targetGender} onClick={handleFinish}>
        {t('onboarding.start')}
      </Button>
    </motion.div>,
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-bold text-primary">NR</p>
        </div>
        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </div>
    </div>
  )
}

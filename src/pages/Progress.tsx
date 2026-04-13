import React from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '../components/layout/AppLayout'
import { t } from '../data/i18n'
import { useAuth } from '../hooks/useAuth'
import { useStreak } from '../hooks/useStreak'
import { ProgressBlock } from '../components/ProgressBlock'

export default function Progress() {
  const { user } = useAuth()
  const { streak, currentDay } = useStreak(user)

  return (
    <AppLayout>
      <motion.div className="space-y-5 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="pt-2">
          <h1 className="font-display text-2xl font-bold text-text-primary">{t('progress.title')}</h1>
          <p className="text-text-muted text-sm">Acompanhe sua evolução emocional</p>
        </div>
        <ProgressBlock user={user} streak={streak} currentDay={currentDay} />
      </motion.div>
    </AppLayout>
  )
}

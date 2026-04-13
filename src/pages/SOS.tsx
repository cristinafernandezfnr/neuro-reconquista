import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { t } from '../data/i18n'

type SOSType = 'text' | 'anxiety' | 'lonely' | 'miss' | 'quit' | null

const SOS_ITEMS = [
  { key: 'text' as SOSType, emoji: '💬', labelKey: 'sos.text', subKey: 'sos.text.sub' },
  { key: 'anxiety' as SOSType, emoji: '😰', labelKey: 'sos.anxiety', subKey: 'sos.anxiety.sub' },
  { key: 'lonely' as SOSType, emoji: '😔', labelKey: 'sos.lonely', subKey: 'sos.lonely.sub' },
  { key: 'miss' as SOSType, emoji: '💔', labelKey: 'sos.miss', subKey: 'sos.miss.sub' },
  { key: 'quit' as SOSType, emoji: '🏳️', labelKey: 'sos.quit', subKey: 'sos.quit.sub' },
]

const SOS_RESPONSE_KEYS: Record<string, string> = {
  text: 'sos.response.text',
  anxiety: 'sos.response.anxiety',
  lonely: 'sos.response.lonely',
  miss: 'sos.response.miss',
  quit: 'sos.response.quit',
}

export default function SOS() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<SOSType>(null)
  const [unsentMsg, setUnsentMsg] = useState('')
  const [timerSeconds, setTimerSeconds] = useState(600) // 10 min
  const [timerActive, setTimerActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in')
  const [breathCount, setBreathCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      intervalRef.current = setInterval(() => setTimerSeconds(s => s - 1), 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerActive])

  // Breathing animation cycle: 4s in, 4s hold, 4s out
  useEffect(() => {
    if (selected !== 'anxiety') return
    const phases: ('in' | 'hold' | 'out')[] = ['in', 'hold', 'out']
    let phaseIdx = 0
    const interval = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % 3
      setBreathPhase(phases[phaseIdx])
      if (phaseIdx === 0) setBreathCount(c => c + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [selected])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-background px-4 py-6 max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted mb-6">
        <ArrowLeft size={20} />{t('sos.back')}
      </button>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="font-display text-2xl font-bold text-text-primary mb-2">{t('sos.title')}</h1>
            <p className="text-text-secondary text-sm mb-6">{t('sos.subtitle')}</p>
            <div className="space-y-3">
              {SOS_ITEMS.map(item => (
                <button
                  key={item.key}
                  onClick={() => { setSelected(item.key); if (item.key === 'text') setTimerActive(true) }}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all text-left"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="text-text-primary font-medium">{t(item.labelKey)}</p>
                    <p className="text-text-muted text-xs">{t(item.subKey)}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="response" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mb-6">
              <p className="text-primary font-medium leading-relaxed mb-4">{t(SOS_RESPONSE_KEYS[selected!])}</p>
            </div>

            {/* Text impulse — unsent message + timer */}
            {selected === 'text' && (
              <div className="space-y-4">
                <textarea
                  value={unsentMsg}
                  onChange={e => setUnsentMsg(e.target.value)}
                  placeholder={t('sos.unsent')}
                  rows={5}
                  className="w-full bg-surface border border-border rounded-xl p-4 text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none"
                />
                <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
                  <p className="text-text-secondary text-sm">{t('sos.timer')}</p>
                  <span className="font-display text-2xl font-bold text-primary">{formatTime(timerSeconds)}</span>
                </div>
                {timerSeconds === 0 && (
                  <p className="text-text-muted text-sm text-center">Tempo esgotado. Você ainda precisa enviar?</p>
                )}
              </div>
            )}

            {/* Anxiety — breathing exercise */}
            {selected === 'anxiety' && (
              <div className="flex flex-col items-center py-6">
                <p className="text-text-muted text-sm mb-6">{t('sos.breathing')}</p>
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30 bg-primary/10"
                    animate={{
                      scale: breathPhase === 'in' ? 1.4 : breathPhase === 'hold' ? 1.4 : 1,
                    }}
                    transition={{ duration: 4, ease: 'easeInOut' }}
                  />
                  <div className="text-center z-10">
                    <p className="text-primary font-display text-lg font-bold">
                      {breathPhase === 'in' ? t('sos.breathe.in') : breathPhase === 'hold' ? t('sos.breathe.hold') : t('sos.breathe.out')}
                    </p>
                    <p className="text-text-muted text-xs">{breathCount} ciclos</p>
                  </div>
                </div>
              </div>
            )}

            <Button variant="secondary" fullWidth className="mt-6" onClick={() => setSelected(null)}>
              {t('sos.back')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

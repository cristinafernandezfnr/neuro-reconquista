import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, AlertTriangle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { t } from '../data/i18n'
import { QUESTIONS, computeScore, getLevelFromScore, LEVEL_DATA } from '../data/anamnese'
import { useAuth } from '../hooks/useAuth'
import { supabase, isDemoSupabase } from '../lib/supabase'
import { IMAGES } from '../lib/images'
import { sleep } from '../lib/utils'
import { setAnamneseDone, FLOW_KEYS } from '../lib/demoFlow'

type Phase = 'intro' | 'questions' | 'loading' | 'result'
const QUESTIONS_PER_SCREEN = 5

export default function Anamnese() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const [phase, setPhase] = useState<Phase>(() => {
    try {
      const saved = localStorage.getItem(FLOW_KEYS.anamneseProgress)
      return saved ? 'questions' : 'intro'
    } catch { return 'intro' }
  })
  const [screenIdx, setScreenIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(FLOW_KEYS.anamneseProgress)
      return saved ? JSON.parse(saved).screenIdx || 0 : 0
    } catch { return 0 }
  })
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(FLOW_KEYS.anamneseProgress)
      return saved ? JSON.parse(saved).answers || {} : {}
    } catch { return {} }
  })
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(3)
  const [loadingStep, setLoadingStep] = useState(0)
  const [alertKey, setAlertKey] = useState<string | null>(null)

  const screenQuestions = QUESTIONS.slice(screenIdx * QUESTIONS_PER_SCREEN, (screenIdx + 1) * QUESTIONS_PER_SCREEN)
  const totalScreens = Math.ceil(QUESTIONS.length / QUESTIONS_PER_SCREEN)
  const screenAnswered = screenQuestions.every(q => answers[q.id])
  const totalAnswered = Object.keys(answers).length

  // Persist progress to localStorage while in questions phase
  useEffect(() => {
    if (phase === 'questions') {
      try {
        localStorage.setItem(FLOW_KEYS.anamneseProgress, JSON.stringify({ screenIdx, answers }))
      } catch { /* ignore */ }
    }
  }, [screenIdx, answers, phase])

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screenIdx])

  const handleAnswer = (qId: number, label: string) => {
    const q = QUESTIONS.find(q => q.id === qId)
    if (q?.alertKey && (label === 'A' || label === 'B')) {
      setAlertKey(q.alertKey)
    }
    setAnswers(prev => ({ ...prev, [qId]: label }))
  }

  const handleNext = () => {
    if (screenIdx < totalScreens - 1) {
      setScreenIdx((i: number) => i + 1)
    } else {
      finishQuestions()
    }
  }

  const finishQuestions = async () => {
    const s = computeScore(answers)
    const l = getLevelFromScore(s)
    setScore(s)
    setLevel(l)
    setPhase('loading')

    const steps = [t('anamnese.loading.1'), t('anamnese.loading.2'), t('anamnese.loading.3')]
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(i)
      await sleep(1200)
    }
    setPhase('result')

    // Mark anamnese complete and clear progress
    setAnamneseDone(s, l)
    try { localStorage.removeItem(FLOW_KEYS.anamneseProgress) } catch { /* ignore */ }

    // Save to DB
    if (user) {
      const updates = { anamnese_score: s, anamnese_nivel: l, anamnese_reconnect_day: LEVEL_DATA[l].reconnectWeek * 7 }
      updateUser(updates)
      if (!isDemoSupabase()) {
        await supabase.from('users').update(updates).eq('id', user.id)
        await supabase.from('anamnese').insert({ user_id: user.id, respostas: answers, score_total: s, nivel: l })
      }
    }
  }

  const levelData = LEVEL_DATA[level]

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div
          className="flex-shrink-0 flex items-end p-6"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.2), rgba(17,17,17,1)), url(${IMAGES.psychologyFemale})`,
            backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '250px',
          }}
        />
        <div className="flex-1 px-6 py-6 max-w-md mx-auto w-full">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            {t('anamnese.intro.title')} <br />
            <span className="text-primary">{t('anamnese.intro.highlight')}</span>
          </h1>
          <p className="text-text-secondary mb-6 leading-relaxed">{t('anamnese.intro.desc')}</p>
          <div className="flex items-center gap-2 text-text-muted text-sm mb-8">
            <span>⏱</span><span>{t('anamnese.time')}</span>
            <span className="mx-2">•</span>
            <span>30 {t('anamnese.question').toLowerCase()}s</span>
          </div>
          <Button fullWidth size="lg" onClick={() => { setPhase('questions'); setScreenIdx(0); setAnswers({}) }}>
            {t('anamnese.start')}
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'loading') {
    const steps = [t('anamnese.loading.1'), t('anamnese.loading.2'), t('anamnese.loading.3')]
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-8" />
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-text-primary font-medium text-lg"
            >
              {steps[loadingStep]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6 py-8 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill border mb-4" style={{ borderColor: levelData.color, backgroundColor: `${levelData.color}20` }}>
              <span className="text-sm font-bold" style={{ color: levelData.color }}>
                {t('anamnese.result.level')} {level} — {score} pts
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
              {t(`anamnese.level.${level}.title`)}
            </h2>
            <p className="text-text-secondary text-sm">{t(`anamnese.level.${level}.subtitle`)}</p>
          </div>

          <div className="bg-card rounded-xl p-5 mb-4 border border-border">
            <p className="text-text-secondary text-sm leading-relaxed">{t(`anamnese.level.${level}.message`)}</p>
          </div>

          <div className="bg-surface rounded-xl p-4 mb-6 border border-border">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('anamnese.result.strategy')}</p>
            <p className="text-text-primary text-sm">{t(`anamnese.level.${level}.strategy`)}</p>
          </div>

          <Button fullWidth size="lg" onClick={() => navigate('/onboarding')}>
            {t('anamnese.result.cta')} <ChevronRight size={18} />
          </Button>
        </motion.div>
      </div>
    )
  }

  // Questions phase
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress */}
      <div className="px-4 pt-8 pb-4 sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-text-muted text-xs">{t('anamnese.question')} {totalAnswered} {t('anamnese.of')} {QUESTIONS.length}</p>
          <p className="text-primary text-xs font-medium">{Math.round((totalAnswered / QUESTIONS.length) * 100)}%</p>
        </div>
        <div className="h-1 bg-border rounded-pill">
          <div className="h-full bg-primary rounded-pill transition-all" style={{ width: `${(totalAnswered / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      {/* Alert */}
      {alertKey && (
        <div className="mx-4 mb-4 p-4 bg-gold/10 border border-gold/30 rounded-xl flex gap-3">
          <AlertTriangle size={20} className="text-gold flex-shrink-0 mt-0.5" />
          <p className="text-gold text-sm">{t(alertKey)}</p>
          <button onClick={() => setAlertKey(null)} className="ml-auto text-gold/60 text-xs">✕</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6"
          >
            {screenQuestions.map(q => (
              <div key={q.id}>
                <p className="text-text-primary font-medium mb-3 leading-relaxed">
                  {q.id}. {t(`anamnese.q${q.id}`)}
                </p>
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswer(q.id, opt.label)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                        answers[q.id] === opt.label
                          ? 'border-primary bg-primary/10 text-text-primary'
                          : 'border-border bg-card text-text-secondary hover:border-border/60'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-pill flex items-center justify-center text-sm font-bold flex-shrink-0 ${answers[q.id] === opt.label ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
                        {opt.label}
                      </span>
                      <span className="text-sm">{t(`anamnese.q${q.id}.${opt.label.toLowerCase()}`)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-4 py-4 bg-background border-t border-border">
        <Button
          fullWidth
          size="lg"
          disabled={!screenAnswered}
          onClick={handleNext}
        >
          {screenIdx < totalScreens - 1 ? t('onboarding.next') : t('anamnese.result.cta')}
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  )
}

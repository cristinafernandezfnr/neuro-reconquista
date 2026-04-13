import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckSquare, Eye } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { CardRenderer } from '../components/tasks/ContentCard'
import { parseProtocolDayToCards } from '../lib/contentParser'
import { t } from '../data/i18n'
import { useAuth } from '../hooks/useAuth'
import { useStreak } from '../hooks/useStreak'
import { useTasks } from '../hooks/useTasks'
import { getDayContent } from '../data/protocol'
import { EmotionType } from '../types'
import { canAccessDay, getTimeUntilUnlock, startDay } from '../lib/dailyLock'
import { isDemoSupabase } from '../lib/supabase'

// ── Day locked screen ─────────────────────────────────────────────────────

function DayLockedScreen({ day }: { day: number }) {
  const [countdown, setCountdown] = useState(getTimeUntilUnlock(day))

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getTimeUntilUnlock(day)), 30_000)
    return () => clearInterval(interval)
  }, [day])

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-5 text-center px-4">
        <div style={{ fontSize: 56 }}>🔒</div>
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-2">{t('tasks.day.locked').replace('{day}', String(day))}</h2>
          <p className="text-text-muted text-sm">{t('tasks.day.locked.msg')}</p>
        </div>
        {countdown && (
          <div
            className="px-5 py-3 rounded-2xl"
            style={{ backgroundColor: '#c8102e15', border: '1px solid #c8102e30' }}
          >
            <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">{t('tasks.available.in')}</p>
            <p className="text-primary font-bold text-xl">{countdown}</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

// ── Celebration overlay ───────────────────────────────────────────────────
const CONFETTI_COLORS = ['#c8102e', '#7c6ef5', '#4ecb8a', '#e0a020', '#60a5fa', '#f472b6']

function CelebrationOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 4000)
    return () => clearTimeout(timer)
  }, [onDone])

  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * 360
      const distance = 140 + Math.random() * 80
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
      const size = 8 + Math.random() * 10
      const rad = (angle * Math.PI) / 180
      return { x: Math.cos(rad) * distance, y: Math.sin(rad) * distance, color, size }
    })
  , [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.5 }}
          transition={{ duration: 1.6, delay: 0.2 + i * 0.03, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="text-center z-10 px-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="font-display text-3xl font-bold text-white mb-2">{t('tasks.celebration.title')}</h2>
        <p className="text-text-muted text-base">{t('tasks.celebration.msg')}</p>
        <motion.div className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden mx-auto" style={{ width: 200 }}>
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ duration: 3.8, ease: 'linear', delay: 0.2 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ── Card slide variants ───────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 320 : -320, opacity: 0 }),
}

// ── Progress dots ─────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  const MAX_VISIBLE = 9
  const start = Math.max(0, Math.min(current - Math.floor(MAX_VISIBLE / 2), total - MAX_VISIBLE))
  const visible = Array.from({ length: Math.min(total, MAX_VISIBLE) }, (_, i) => start + i)

  return (
    <div className="flex items-center justify-center gap-1.5">
      {visible.map(i => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            backgroundColor: i < current ? '#c8102e' : i === current ? '#c8102e' : '#333',
            opacity: i === current ? 1 : i < current ? 0.6 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function Tasks() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { currentDay } = useStreak(user)

  // viewDay: when coming from Home/Progress clicking a specific day
  const viewDay: number | undefined = (location.state as { viewDay?: number } | null)?.viewDay
  // effectiveDay: the day whose content we display
  const effectiveDay = viewDay ?? currentDay
  // isViewMode: reviewing a day other than today (read-only, no task saving)
  const isViewMode = viewDay !== undefined && viewDay !== currentDay

  const dayContent = getDayContent(effectiveDay)
  const { completions, completeTask, isCompleted, isDayComplete } = useTasks(user?.id || null, effectiveDay)
  const targetGender = user?.target_gender || 'female'

  // Parse cards from content — wrapped defensively to prevent black screen on parse errors
  const cards = useMemo(() => {
    if (!dayContent) return []
    try {
      return parseProtocolDayToCards(dayContent, t, targetGender)
    } catch (e) {
      console.error('[Tasks] parseProtocolDayToCards failed:', e)
      return []
    }
  }, [dayContent, targetGender])

  // Auto-restore last position for this day
  const savedCardKey = `nr_day_pos_${effectiveDay}`
  const [currentCard, setCurrentCard] = useState(() => {
    try { return Math.min(parseInt(localStorage.getItem(savedCardKey) || '0', 10), Math.max(0, cards.length - 1)) }
    catch { return 0 }
  })
  const [direction, setDirection] = useState(1)
  const [celebrating, setCelebrating] = useState(false)
  const [emotion, setEmotion] = useState<EmotionType | null>(null)

  // Celebration fires once per day (never in view mode)
  const alreadyCelebrated = isViewMode || localStorage.getItem('nr_celebrated_day') === String(effectiveDay)
  const celebratedRef = useRef(alreadyCelebrated)

  // Restore saved emotion from completions
  const checkinCompletion = completions.find(t => t.task_type === 'checkin')
  useEffect(() => {
    if (checkinCompletion?.emotion) setEmotion(checkinCompletion.emotion as EmotionType)
  }, [checkinCompletion?.emotion])

  const dayComplete = isDayComplete()

  const handleCelebrationDone = useCallback(() => {
    setCelebrating(false)
    try {
      // Record completed day for Progress grid
      const existing: number[] = JSON.parse(localStorage.getItem('nr_completed_days') || '[]')
      if (!existing.includes(effectiveDay)) {
        existing.push(effectiveDay)
        localStorage.setItem('nr_completed_days', JSON.stringify(existing))
      }
      // Lock next day until midnight
      startDay(effectiveDay)
      // Advance demo user to next day
      const stored = localStorage.getItem('nr_demo_user')
      if (stored) {
        const u = JSON.parse(stored)
        u.current_day = (u.current_day || 1) + 1
        u.streak = (u.streak || 0) + 1
        localStorage.setItem('nr_demo_user', JSON.stringify(u))
      }
    } catch { /* ignore */ }
    localStorage.setItem('nr_just_completed_day', 'true')
    localStorage.setItem('nr_just_completed_at', Date.now().toString())
    navigate('/home')  // vai direto para home, evitando redirecionamento para anamnese
  }, [navigate, effectiveDay])

  // Auto-save position on change
  useEffect(() => {
    try { localStorage.setItem(savedCardKey, String(currentCard)) } catch { /* ignore */ }
  }, [currentCard, savedCardKey])

  // Navigation
  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= cards.length) return
    setDirection(idx > currentCard ? 1 : -1)
    setCurrentCard(idx)
  }, [currentCard, cards.length])

  const goNext = useCallback(() => goTo(currentCard + 1), [goTo, currentCard])
  const goPrev = useCallback(() => goTo(currentCard - 1), [goTo, currentCard])

  // Swipe/pan handler
  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const threshold = 60
    if (info.offset.x < -threshold) goNext()
    else if (info.offset.x > threshold) goPrev()
  }, [goNext, goPrev])

  // Task actions
  const handleSaveExercise = useCallback(async (text: string) => {
    await completeTask('exercise', { exercise_response: text })
  }, [completeTask])

  const handleToggleChecklist = useCallback(async (idx: number) => {
    if (dayComplete) return
    await completeTask(`checklist_${idx}`)
  }, [completeTask, dayComplete])

  const handleCompletePractice = useCallback(async () => {
    await completeTask('practice')
  }, [completeTask])

  const handleSelectEmotion = useCallback((e: EmotionType) => {
    setEmotion(e)
  }, [])

  // emotion is passed directly from the button click to avoid stale closure issues
  const handleConclude = useCallback(async (e: EmotionType) => {
    await completeTask('checkin', { emotion: e })
    // Trigger celebration only in normal (non-view) mode
    if (!celebratedRef.current && !isViewMode) {
      celebratedRef.current = true
      localStorage.setItem('nr_celebrated_day', String(effectiveDay))
      setCelebrating(true)
    }
  }, [completeTask, effectiveDay, isViewMode])

  // canConclude: for new 4-block protocol always allow; legacy needs exercise + checklist
  const hasBlockStructure = dayContent ? dayContent.tasks.some(t => t.type === 'block1_arsenal') : false
  const checklistCount = dayContent ? dayContent.tasks.filter(t => t.type === 'checklist').length : 0
  const checklistDone = checklistCount === 0 || Array.from({ length: checklistCount }, (_, i) => i).every(i => isCompleted(`checklist_${i}`))
  const canConclude = !isViewMode && (hasBlockStructure || (isCompleted('exercise') && checklistDone))

  // Derived state for card renderer
  const exerciseCompletion = completions.find(c => c.task_type === 'exercise')
  const savedExerciseText = exerciseCompletion?.exercise_response || ''

  // Daily lock: bypass in demo mode or when viewing a specific day
  const isLocked = !isDemoSupabase() && !isViewMode && !canAccessDay(effectiveDay)
  if (isLocked) {
    return <DayLockedScreen day={effectiveDay} />
  }

  if (!dayContent) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-4">
          <p className="text-text-muted text-sm">{t('tasks.day.not.found').replace('{day}', String(effectiveDay))}</p>
        </div>
      </AppLayout>
    )
  }

  if (cards.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-text-muted">{t('common.loading')}</p>
        </div>
      </AppLayout>
    )
  }

  const card = cards[currentCard] ?? cards[0]
  if (!card) return null

  return (
    <>
      <AppLayout noPadding>
        <div className="flex flex-col" style={{ height: 'calc(100dvh - 52px)' }}>

          {/* View mode banner */}
          {isViewMode && (
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border flex-shrink-0" style={{ backgroundColor: '#1a1a1a' }}>
              <Eye size={15} className="text-text-muted flex-shrink-0" />
              <p className="text-text-muted text-xs font-medium">
                {t('tasks.reviewing').replace('{day}', String(effectiveDay))}
              </p>
            </div>
          )}

          {/* Day complete banner */}
          {!isViewMode && dayComplete && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-success/10 border-b border-success/20 flex-shrink-0">
              <CheckSquare size={15} className="text-success flex-shrink-0" />
              <p className="text-success text-xs font-medium">
                {t('tasks.day.done.review').replace('{day}', String(effectiveDay))}
              </p>
            </div>
          )}

          {/* Card area — swipeable */}
          <div className="flex-1 overflow-hidden relative px-4 pt-3 pb-2">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={card.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-x-4 top-3 bottom-2 overflow-y-auto"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
              >
                <CardRenderer
                  card={card}
                  dayComplete={dayComplete}
                  savedExerciseText={savedExerciseText}
                  exerciseSaved={isCompleted('exercise')}
                  savedEmotion={emotion}
                  isChecklistItemDone={idx => isCompleted(`checklist_${idx}`)}
                  isPracticeDone={isCompleted('practice')}
                  canConclude={canConclude}
                  onNext={goNext}
                  onSaveExercise={handleSaveExercise}
                  onToggleChecklist={handleToggleChecklist}
                  onCompletePractice={handleCompletePractice}
                  onSelectEmotion={handleSelectEmotion}
                  onConclude={handleConclude}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation bar */}
          <div
            className="flex-shrink-0 flex items-center gap-4 px-4 py-3 border-t border-border"
            style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', marginBottom: 64 }}
          >
            <button
              onClick={goPrev}
              disabled={currentCard === 0}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex-1 flex flex-col items-center gap-1.5">
              <ProgressDots total={cards.length} current={currentCard} />
              <span className="text-text-muted text-[10px] uppercase tracking-wider">
                {currentCard + 1} / {cards.length}
              </span>
            </div>

            <button
              onClick={goNext}
              disabled={currentCard === cards.length - 1}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </AppLayout>

      <AnimatePresence>
        {celebrating && <CelebrationOverlay onDone={handleCelebrationDone} />}
      </AnimatePresence>
    </>
  )
}

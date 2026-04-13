import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, CheckSquare, ChevronRight, X, Check, AlertTriangle, BarChart2, Clipboard, Bot, Clock } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { t } from '../data/i18n'
import { useAuth } from '../hooks/useAuth'
import { useStreak } from '../hooks/useStreak'
import { getDayContent, getDayModule } from '../data/protocol'
import { getGreeting } from '../lib/utils'
import { getTimeUntilUnlock } from '../lib/dailyLock'
import { canAccessPro } from '../lib/access'
import { ProgressBlock } from '../components/ProgressBlock'

const WEEK_NAMES: Record<number, string> = { 1: 'week.1', 2: 'week.2', 3: 'week.3', 4: 'week.4', 5: 'week.5' }
const WEEK_COLORS: Record<number, string> = { 1: '#c8102e', 2: '#7c6ef5', 3: '#4ecb8a', 4: '#e0a020', 5: '#e86c4d' }

function truncate(s: string, n: number) { return s.length > n ? s.slice(0, n - 1) + '…' : s }

// ── Day bottom sheet ──────────────────────────────────────────────────────
interface DaySheetProps {
  day: number
  onClose: () => void
  onNavigate: () => void
}

function DaySheet({ day, onClose, onNavigate }: DaySheetProps) {
  const dayContent = getDayContent(day)
  if (!dayContent) return null
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg mx-auto bg-card rounded-t-2xl p-5 pb-8"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">{day}</span>
            <p className="text-text-primary font-display font-bold">{t('common.day')} {day}</p>
          </div>
          <button onClick={onClose} className="text-text-muted"><X size={20} /></button>
        </div>
        <p className="text-text-primary font-medium text-sm mb-2">{t(dayContent.titleKey)}</p>
        <p className="text-text-muted text-xs mb-4 leading-relaxed">{t(getDayModule(day)?.goalKey || '')}</p>
        <div className="space-y-1.5 mb-4">
          {dayContent.tasks.slice(0, 5).map((task, i) => (
            <div key={i} className="flex items-start gap-2 text-text-secondary text-xs">
              <Check size={12} className="text-success mt-0.5 flex-shrink-0" />
              <span>{t(task.titleKey)}</span>
            </div>
          ))}
        </div>
        <p className="text-text-muted text-xs text-center mb-3 italic">{t('home.day.readonly')}</p>
        <button
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary rounded-xl text-white text-sm font-semibold"
        >
          {t('home.view.tasks')} <ChevronRight size={14} />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Week accordion ────────────────────────────────────────────────────────
function WeekAccordion({
  week, currentDay, onDayTap,
}: {
  week: number; currentDay: number; onDayTap: (day: number) => void
}) {
  const weekStart = (week - 1) * 7 + 1
  const weekEnd = week * 7
  const isCompleted = currentDay > weekEnd
  const isActive = currentDay >= weekStart && currentDay <= weekEnd
  // toggled=false → open if isActive, closed otherwise
  // toggled=true  → inverts the default
  const [toggled, setToggled] = useState(false)
  const open = isActive ? !toggled : toggled

  const completedInWeek = Math.min(Math.max(currentDay - weekStart, 0), 7)

  return (
    <div className={`rounded-xl border ${isActive ? 'border-primary/40' : 'border-border'}`}
      style={isActive ? { borderLeft: '3px solid #c8102e' } : {}}>
      <button
        onClick={() => setToggled(t => !t)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {isCompleted ? (
          <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
            <Check size={12} className="text-success" />
          </span>
        ) : (
          <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{week}</span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">
            {t('home.phase.word')} {week} — {t(WEEK_NAMES[week])}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-border rounded-pill">
              <div className="h-full rounded-pill transition-all"
                style={{ width: `${(completedInWeek / 7) * 100}%`, backgroundColor: WEEK_COLORS[week] }} />
            </div>
            <span className="text-text-muted text-[10px]">{completedInWeek}/7</span>
          </div>
        </div>
        <ChevronRight size={16} className={`text-text-muted transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-3 space-y-1">
          {Array.from({ length: 7 }, (_, i) => {
            const day = weekStart + i
            const isDone = day < currentDay
            const isCurrent = day === currentDay
            const dayContent = getDayContent(day)
            return (
              <button
                key={day}
                onClick={() => onDayTap(day)}
                className="w-full flex items-center gap-3 py-2.5 text-left"
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isDone ? 'bg-primary/20 text-primary' :
                  isCurrent ? 'bg-primary text-white' :
                  'bg-surface text-text-muted'
                }`}>{day}</span>
                <span className={`text-xs flex-1 ${isDone || isCurrent ? 'text-text-secondary' : 'text-text-muted'}`}>
                  {dayContent ? truncate(t(dayContent.titleKey), 40) : `Dia ${day}`}
                </span>
                {isDone && <Check size={12} className="text-success flex-shrink-0" />}
                {isCurrent && <ChevronRight size={12} className="text-primary flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Day complete modal (shown after returning from tasks) ─────────────────
function DayCompleteModal({ day, onClose, onSOS }: { day: number; onClose: () => void; onSOS: () => void }) {
  const nextDayCountdown = getTimeUntilUnlock(day + 1)
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg mx-auto bg-card rounded-t-2xl p-6 pb-10"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted"><X size={20} /></button>
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-1">{t('day.complete.title').replace('{day}', String(day))}</h2>
          <p className="text-text-muted text-sm">{t('day.complete.desc')}</p>
        </div>
        {nextDayCountdown && nextDayCountdown !== 'Disponível agora!' && (
          <div
            className="flex items-center justify-center gap-2 py-3 rounded-xl mb-4"
            style={{ backgroundColor: '#c8102e15', border: '1px solid #c8102e30' }}
          >
            <Clock size={14} className="text-primary" />
            <div className="text-center">
              <p className="text-text-muted text-xs">{t('day.next.label').replace('{day}', String(day + 1))}</p>
              <p className="text-primary font-bold text-sm">{nextDayCountdown}</p>
            </div>
          </div>
        )}
        <Button fullWidth onClick={onClose} className="mb-3">
          {t('day.continue')} <ChevronRight size={16} />
        </Button>
        <button
          onClick={onSOS}
          className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-text-muted text-sm"
        >
          <AlertTriangle size={14} className="text-gold" />
          {t('day.help')}
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Welcome modal (first login only) ─────────────────────────────────────
function WelcomeModal({ onClose }: { onClose: () => void }) {
  const FEATURES = [
    { icon: <Clipboard size={16} className="text-primary" />, key: 'welcome.feature1' },
    { icon: <Bot size={16} className="text-primary" />, key: 'welcome.feature2' },
    { icon: <BarChart2 size={16} className="text-primary" />, key: 'welcome.feature3' },
  ]
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="w-full max-w-sm"
        style={{ backgroundColor: '#1a1a1a', border: '1px solid #c8102e', borderRadius: 20, padding: 24 }}
      >
        <div className="text-center mb-5">
          <p style={{ fontSize: 48 }}>🔥</p>
          <h1 className="font-display text-xl font-extrabold text-white mt-2 leading-tight">
            {t('welcome.title')}
          </h1>
          <p className="text-text-muted text-sm mt-2 leading-relaxed">
            {t('welcome.desc')}
          </p>
        </div>

        <div style={{ height: 1, backgroundColor: '#333', marginBottom: 16 }} />

        <div className="space-y-3 mb-6">
          {FEATURES.map(({ icon, key }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#c8102e20' }}>
                {icon}
              </div>
              <span className="text-text-secondary text-sm">{t(key)}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-full font-bold text-white text-base"
          style={{ backgroundColor: '#c8102e', boxShadow: '0 0 24px rgba(200,16,46,0.35)' }}
        >
          {t('welcome.cta')}
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { streak, currentDay, weekNumber, progressPercent } = useStreak(user)
  const dayContent = getDayContent(currentDay)
  const greeting = getGreeting()
  const isPro = canAccessPro(user)
  const [sheetDay, setSheetDay] = useState<number | null>(null)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  // Show welcome modal on first login
  useEffect(() => {
    if (!localStorage.getItem('nr_welcome_shown')) {
      setShowWelcome(true)
    }
  }, [])

  // Show completion modal if returning from a completed day (within last 10 minutes)
  useEffect(() => {
    if (localStorage.getItem('nr_just_completed_day') === 'true') {
      const completedAt = localStorage.getItem('nr_just_completed_at')
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000
      if (completedAt && parseInt(completedAt) > tenMinutesAgo) {
        setShowCompleteModal(true)
      }
      localStorage.removeItem('nr_just_completed_day')
      localStorage.removeItem('nr_just_completed_at')
    }
  }, [])

  // Streak chip shown in the AppLayout header (only when streak > 0)
  const streakChip = streak > 0 ? (
    <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-pill">
      <Flame size={14} className="text-primary" />
      <span className="text-primary text-sm font-bold">{streak}</span>
    </div>
  ) : undefined

  return (
    <AppLayout headerRight={streakChip}>
      <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* Greeting */}
        <div className="pt-1">
          <p className="text-text-muted text-sm">{t(`greeting.${greeting}`)}</p>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {user?.name?.split(' ')[0] || 'você'}
          </h1>
        </div>

        {/* PRO: Full progress block at top */}
        {isPro && (
          <div className="pb-1">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={15} className="text-primary" />
              <p className="text-text-muted text-xs uppercase tracking-wider">{t('home.section.progress')}</p>
            </div>
            <ProgressBlock user={user} streak={streak} currentDay={currentDay} />
            <div className="my-2 border-t border-border" />
          </div>
        )}

        {/* FREE: MEU PROGRESSO mini card (hidden when PRO — PRO shows ProgressBlock above) */}
        {!isPro && (
          <button
            onClick={() => navigate('/progress')}
            className="w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
          >
            <p className="text-text-muted text-xs uppercase tracking-wider mb-3">{t('home.section.progress')}</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <BarChart2 size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{t('home.my.progress')}</p>
                <p className="text-text-muted text-xs">{t('common.day')} {currentDay} {t('home.progress.meta')} {weekNumber}</p>
              </div>
              <div className="relative w-10 h-10 flex-shrink-0">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#2a2a2a" strokeWidth="4" />
                  <circle
                    cx="20" cy="20" r="15" fill="none" stroke="#c8102e" strokeWidth="4"
                    pathLength="100"
                    strokeDasharray={`${progressPercent} 100`}
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    transform="rotate(-90 20 20)"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </button>
        )}

        {/* SEU PROTOCOLO — accordion (FIRST main section) */}
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider mb-3">{t('home.section.protocol')}</p>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(week => (
              <WeekAccordion
                key={week}
                week={week}
                currentDay={currentDay}
                onDayTap={day => setSheetDay(day)}
              />
            ))}
          </div>
          <p className="text-text-muted text-xs text-center mt-3">
            {t('home.protocol.hint')}
          </p>
        </div>

        {/* MISSÃO DE HOJE card */}
        {dayContent && (
          <Card className="p-5">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('home.mission.label')}</p>
            <p className="text-text-primary font-medium leading-relaxed mb-4">{t(dayContent.titleKey)}</p>
            <Button fullWidth onClick={() => navigate('/tasks')}>
              {t('home.start')} <ChevronRight size={16} />
            </Button>
          </Card>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame size={16} className="text-primary" />
              <span className="text-text-muted text-xs uppercase tracking-wider">{t('home.streak')}</span>
            </div>
            <p className="font-display text-3xl font-bold text-text-primary">{streak}</p>
            <p className="text-text-muted text-xs">{t('home.streak')}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare size={16} className="text-success" />
              <span className="text-text-muted text-xs uppercase tracking-wider">{t('common.day')}</span>
            </div>
            <p className="font-display text-3xl font-bold text-text-primary">{currentDay}</p>
            <p className="text-text-muted text-xs">{t('home.tasks.today')}</p>
          </Card>
        </div>

        {/* Week label (subtle, for context) */}
        <p className="text-text-muted text-xs text-center">
          {t('home.phase.word')} {weekNumber} — {t(WEEK_NAMES[Math.min(weekNumber, 5)] || 'week.1')}
        </p>

      </motion.div>

      <AnimatePresence>
        {sheetDay && (
          <DaySheet
            day={sheetDay}
            onClose={() => setSheetDay(null)}
            onNavigate={() => { setSheetDay(null); navigate('/tasks', { state: { viewDay: sheetDay } }) }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompleteModal && (
          <DayCompleteModal
            day={currentDay}
            onClose={() => setShowCompleteModal(false)}
            onSOS={() => { setShowCompleteModal(false); navigate('/sos') }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcome && (
          <WelcomeModal
            onClose={() => {
              localStorage.setItem('nr_welcome_shown', 'true')
              setShowWelcome(false)
            }}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  )
}

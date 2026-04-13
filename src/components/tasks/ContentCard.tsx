import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CheckCircle, Circle, Save, ChevronRight, Play, Pause } from 'lucide-react'
import { Button } from '../ui/Button'
import { getImage } from '../../lib/images'
import {
  GameCard, IntroCard, ConceptCard, InsightCard,
  QuizCard, ChecklistCard, PracticeCard, CheckinCard,
  AffirmationCard, XpQuizCard, VisualizationCard,
  BlockHeaderCard, BlockContentCard,
} from '../../lib/contentParser'
import { EmotionType } from '../../types'
import { t } from '../../data/i18n'

// ── XP helpers ────────────────────────────────────────────────────────────

function awardXp(amount: number) {
  const current = parseInt(localStorage.getItem('nr_total_xp') || '0', 10)
  localStorage.setItem('nr_total_xp', String(current + amount))
  window.dispatchEvent(new Event('nr_xp_updated'))
}

// ── Shared helpers ────────────────────────────────────────────────────────

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {children}
    </span>
  )
}

function HighlightedText({ text, keyPhrase }: { text: string; keyPhrase: string }) {
  if (!keyPhrase || !text.includes(keyPhrase)) return <span>{text}</span>
  const idx = text.indexOf(keyPhrase)
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-bold">{keyPhrase}</span>
      {text.slice(idx + keyPhrase.length)}
    </>
  )
}

// ── Breathing animation ───────────────────────────────────────────────────

const BREATH_PHASES = [
  { label: 'Inspire', duration: 4 },
  { label: 'Segure', duration: 4 },
  { label: 'Expire', duration: 4 },
  { label: 'Segure', duration: 4 },
]

function BreathingCircle() {
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [countdown, setCountdown] = useState(BREATH_PHASES[0].duration)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPhaseIdx(p => (p + 1) % BREATH_PHASES.length)
          return BREATH_PHASES[(phaseIdx + 1) % BREATH_PHASES.length].duration
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phaseIdx])

  const isExpanding = phaseIdx === 0

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="rounded-full bg-primary/20 border-2 border-primary/40"
          animate={{ width: isExpanding ? 120 : 60, height: isExpanding ? 120 : 60 }}
          transition={{ duration: BREATH_PHASES[phaseIdx].duration, ease: 'easeInOut' }}
        />
        <div className="absolute flex flex-col items-center">
          <span className="text-white font-bold text-lg">{countdown}</span>
        </div>
      </div>
      <p className="text-primary font-medium text-lg">{BREATH_PHASES[phaseIdx].label}</p>
    </div>
  )
}

// ── INTRO CARD ─────────────────────────────────────────────────────────────

function IntroCardView({ card, onNext }: { card: IntroCard; onNext: () => void }) {
  return (
    <div
      className="relative flex flex-col justify-between min-h-full rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.2) 0%, rgba(17,17,17,0.97) 55%), url(${getImage(card.imageQuery, 800, 600)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="p-6 pt-8 flex flex-col gap-3">
        <Badge color="#c8102e">DIA {String(card.day).padStart(2, '0')}</Badge>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          {t('card.week.label')} {card.week} — {card.weekName.toUpperCase()}
        </p>
      </div>

      <div className="p-6 pb-8 flex flex-col gap-4">
        <h1 className="font-display text-2xl font-bold text-white leading-tight">
          {card.title}
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">{card.mission}</p>
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary rounded-2xl text-white font-semibold text-base mt-2"
        >
          {t('card.start')} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── AFFIRMATION CARD ──────────────────────────────────────────────────────

function AffirmationCardView({ card }: { card: AffirmationCard }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [accepted, setAccepted] = useState(0)
  const [done, setDone] = useState(false)
  const [xpToast, setXpToast] = useState<string | null>(null)

  const total = card.affirmations.length
  const current = card.affirmations[index]

  const showToast = (msg: string) => {
    setXpToast(msg)
    setTimeout(() => setXpToast(null), 1800)
  }

  const advance = (dir: number) => {
    setDirection(dir)
    if (index >= total - 1) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  const handleAccept = () => {
    awardXp(10)
    showToast('+10 XP')
    setAccepted(a => a + 1)
    advance(1)
  }

  const handleReject = () => {
    advance(-1)
  }

  const stars = Math.round((accepted / total) * 5)

  if (done) {
    return (
      <div
        className="min-h-full flex flex-col items-center justify-center p-8 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #1a1a1a 100%)', border: '1px solid #c8102e30' }}
      >
        <div style={{ fontSize: 56 }} className="mb-4">⭐</div>
        <Badge color="#e0a020">{t('card.affirmations.badge')}</Badge>
        <p className="text-white text-xl font-display font-bold text-center mt-6 mb-2">
          {t('card.affirmations.accepted').replace('{accepted}', String(accepted)).replace('{total}', String(total))}
        </p>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ fontSize: 28, opacity: i < stars ? 1 : 0.25 }}>⭐</span>
          ))}
        </div>
        <p className="text-text-muted text-sm text-center mt-4">
          {t('card.affirmations.continue')}
        </p>
      </div>
    )
  }

  return (
    <div
      className="min-h-full flex flex-col rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)', border: '1px solid #c8102e20' }}
    >
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <Badge color="#c8102e">{t('card.affirmations.label')}</Badge>
        <span className="text-text-muted text-xs">{index + 1} / {total}</span>
      </div>

      <div className="px-6 mb-4">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${(index / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.p
            key={index}
            custom={direction}
            initial={{ x: direction > 0 ? 80 : -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -80 : 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="font-display font-bold text-white text-center leading-tight"
            style={{ fontSize: 22 }}
          >
            {current}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center text-yellow-400 font-bold text-lg mb-2"
          >
            {xpToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 px-6 pb-8 pt-4">
        <button
          onClick={handleReject}
          className="flex-1 py-4 rounded-2xl font-semibold text-text-secondary border border-border bg-surface"
          style={{ fontSize: 14 }}
        >
          ✗ Ainda não acredito
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 py-4 rounded-2xl font-semibold text-white bg-primary"
          style={{ fontSize: 14, boxShadow: '0 0 20px rgba(200,16,46,0.35)' }}
        >
          ✓ Eu aceito isso
        </button>
      </div>
    </div>
  )
}

// ── CONCEPT CARD ──────────────────────────────────────────────────────────

function ConceptCardView({ card }: { card: ConceptCard }) {
  const bgTones = ['#1a1a1a', '#1c1a1c', '#1a1c1a', '#1c1c1a', '#1a1a1c']
  const bg = bgTones[card.conceptIndex % bgTones.length]

  return (
    <div className="min-h-full flex flex-col p-6 rounded-2xl" style={{ backgroundColor: bg }}>
      <div className="flex items-start justify-between mb-5">
        <span style={{ fontSize: 40 }}>{card.emoji}</span>
        <img
          src={getImage(card.imageQuery, 120, 120)}
          alt=""
          className="w-16 h-16 rounded-xl object-cover opacity-70"
        />
      </div>

      <div className="flex-1">
        <p className="text-white leading-relaxed mb-4" style={{ fontSize: 17, lineHeight: 1.75 }}>
          <HighlightedText text={card.text} keyPhrase={card.keyPhrase} />
        </p>

        {card.fact && (
          <div
            className="p-3 rounded-xl flex gap-2 items-start"
            style={{ backgroundColor: '#c8102e12', border: '1px solid #c8102e25' }}
          >
            <span className="text-base flex-shrink-0">🔬</span>
            <p className="text-text-muted text-xs leading-relaxed">{card.fact}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <div className="flex gap-1">
          {Array.from({ length: card.totalConcepts }, (_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i + 1 === card.conceptIndex ? 16 : 6,
                height: 6,
                backgroundColor: i + 1 <= card.conceptIndex ? '#c8102e' : '#333',
              }}
            />
          ))}
        </div>
        <span className="text-text-muted text-xs ml-auto">{card.conceptIndex} de {card.totalConcepts}</span>
      </div>
    </div>
  )
}

// ── INSIGHT CARD ──────────────────────────────────────────────────────────

function InsightCardView({ card }: { card: InsightCard }) {
  return (
    <div
      className="min-h-full flex flex-col p-7 rounded-2xl"
      style={{ background: 'linear-gradient(135deg, #1e1a0e 0%, #1a1a1a 100%)', border: '1px solid #e0a02030' }}
    >
      <Badge color="#e0a020">💡 INSIGHT</Badge>

      <div className="flex-1 flex flex-col justify-center my-4">
        <p
          className="font-display text-white leading-relaxed"
          style={{ fontSize: 20, fontStyle: 'italic', lineHeight: 1.6 }}
        >
          "{card.quote}"
        </p>
        {card.attribution && (
          <p className="text-yellow-400 text-sm font-medium mt-3">— {card.attribution}</p>
        )}
      </div>

      {card.applications && card.applications.length > 0 && (
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Na prática:</p>
          <div className="space-y-1.5">
            {card.applications.map((app, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-yellow-400 text-xs mt-0.5">▸</span>
                <p className="text-text-secondary text-sm leading-relaxed">{app}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── XP QUIZ CARD ──────────────────────────────────────────────────────────

function XpQuizCardView({ card }: { card: XpQuizCard }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [xpFlying, setXpFlying] = useState<{ amount: number; key: number } | null>(null)
  const counterRef = useRef(0)

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    const xp = card.options[idx].xp
    if (xp > 0) {
      awardXp(xp)
      counterRef.current += 1
      setXpFlying({ amount: xp, key: counterRef.current })
      setTimeout(() => setXpFlying(null), 1200)
    }
  }

  return (
    <div className="min-h-full flex flex-col p-6 rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #7c6ef520' }}>
      <Badge color="#7c6ef5">⚡ XP QUIZ</Badge>

      <p className="text-white font-display font-bold mt-5 mb-5 leading-snug" style={{ fontSize: 18 }}>
        {card.question}
      </p>

      <div className="space-y-3 flex-1 relative">
        {card.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isWrong = selected !== null && selected === idx && opt.xp === 0
          const isRight = selected !== null && selected === idx && opt.xp > 0
          const missed = selected !== null && selected !== idx && opt.xp > 0

          return (
            <div key={idx} className="relative">
              <motion.button
                onClick={() => handleSelect(idx)}
                whileTap={selected === null ? { scale: 0.97 } : {}}
                disabled={selected !== null}
                className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                  isRight ? 'bg-success/15 border-success/50 text-white' :
                  isWrong ? 'bg-primary/15 border-primary/40 text-text-muted' :
                  missed ? 'bg-success/8 border-success/20 text-text-muted' :
                  'bg-surface border-border text-text-secondary'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span>{opt.text}</span>
                  {isSelected && (
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: opt.xp > 0 ? '#4ecb8a' : '#c8102e' }}>
                      {opt.xp > 0 ? `+${opt.xp} XP` : '0 XP'}
                    </span>
                  )}
                </div>
              </motion.button>

              {xpFlying && isSelected && (
                <AnimatePresence>
                  <motion.div
                    key={xpFlying.key}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -50 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute right-4 top-1/2 font-bold text-yellow-400 pointer-events-none"
                    style={{ fontSize: 18 }}
                  >
                    +{xpFlying.amount} XP
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl"
            style={{ backgroundColor: '#ffffff08', border: '1px solid #ffffff15' }}
          >
            <p className="text-text-secondary text-sm leading-relaxed">
              💬 {card.options[selected].feedback}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── VISUALIZATION CARD ────────────────────────────────────────────────────

function VisualizationCardView({ card }: { card: VisualizationCard }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
        const next = prev + 1
        if (next >= card.steps.length) {
          clearTimer()
          setRunning(false)
          setDone(true)
          return prev
        }
        return next
      })
    }, card.duration * 1000)
  }, [card.steps.length, card.duration])

  const handleStart = () => {
    setRunning(true)
    startTimer()
  }

  const handlePause = () => {
    clearTimer()
    setRunning(false)
  }

  const handleResume = () => {
    setRunning(true)
    startTimer()
  }

  useEffect(() => () => clearTimer(), [])

  return (
    <div
      className="min-h-full flex flex-col p-6 rounded-2xl"
      style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1a1a 100%)', border: '1px solid #60a5fa30' }}
    >
      <Badge color="#60a5fa">🧠 VISUALIZAÇÃO MENTAL</Badge>
      <h3 className="text-white font-display font-bold text-lg mt-4 mb-6">{card.title}</h3>

      <div className="flex-1 flex items-center justify-center px-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center leading-relaxed font-medium"
            style={{ fontSize: 18, lineHeight: 1.7 }}
          >
            {done ? '✅ Visualização concluída!' : card.steps[stepIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 my-5">
        {card.steps.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === stepIdx ? 20 : 6,
              height: 6,
              backgroundColor: i <= stepIdx ? '#60a5fa' : '#333',
            }}
          />
        ))}
      </div>

      <p className="text-text-muted text-xs text-center mb-4">
        {card.duration}s por passo · {card.steps.length} passos
      </p>

      {!done && (
        <div className="flex justify-center">
          {!running ? (
            <button
              onClick={stepIdx === 0 ? handleStart : handleResume}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 font-medium"
            >
              <Play size={16} />
              {stepIdx === 0 ? 'Iniciar visualização' : 'Continuar'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface border border-border text-text-secondary font-medium"
            >
              <Pause size={16} />
              Pausar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── QUIZ CARD (reflection/exercise) ──────────────────────────────────────

interface QuizCardViewProps {
  card: QuizCard
  savedText: string
  isSaved: boolean
  onSave: (text: string) => Promise<void>
}

function QuizCardView({ card, savedText, isSaved, onSave }: QuizCardViewProps) {
  const [value, setValue] = useState(savedText)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (savedText && !value) setValue(savedText)
  }, [savedText]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!value.trim()) return
    setSaving(true)
    await onSave(value)
    setSaving(false)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2500)
  }

  const hasChanged = value !== savedText
  const canSave = value.trim() && (!isSaved || hasChanged)

  return (
    <div className="min-h-full flex flex-col p-6 rounded-2xl" style={{ backgroundColor: '#1a1a1a' }}>
      <Badge color="#c8102e">🎯 MOMENTO DE REFLEXÃO</Badge>

      <p className="text-white font-medium mt-5 mb-4 leading-relaxed" style={{ fontSize: 16 }}>
        {card.question}
      </p>

      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Escreva sua reflexão aqui..."
        rows={6}
        className="flex-1 w-full bg-surface border border-border rounded-xl p-4 text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-primary leading-relaxed"
      />

      <div className="flex items-center gap-3 mt-4">
        <Button size="sm" disabled={!canSave} loading={saving} onClick={handleSave}>
          <Save size={14} />
          {isSaved ? 'Atualizar' : t('tasks.save')}
        </Button>
        {isSaved && !hasChanged && !justSaved && (
          <span className="flex items-center gap-1.5 text-success text-xs">
            <CheckCircle size={13} /> Reflexão salva
          </span>
        )}
        {justSaved && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-success text-xs"
          >
            <CheckCircle size={13} /> Salvo!
          </motion.span>
        )}
      </div>
    </div>
  )
}

// ── CHECKLIST CARD ────────────────────────────────────────────────────────

interface ChecklistCardViewProps {
  card: ChecklistCard
  isItemCompleted: (idx: number) => boolean
  onToggle: (idx: number) => void
  dayComplete: boolean
}

function ChecklistCardView({ card, isItemCompleted, onToggle, dayComplete }: ChecklistCardViewProps) {
  const doneCount = card.items.filter((_, i) => isItemCompleted(i)).length

  return (
    <div className="min-h-full flex flex-col p-6 rounded-2xl" style={{ backgroundColor: '#1a1a1a' }}>
      <Badge color="#4ecb8a">✅ SUAS TAREFAS DE HOJE</Badge>

      <div className="mt-4 mb-5">
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>{doneCount} de {card.items.length} concluídas</span>
          <span className="text-yellow-400 font-medium">+{doneCount * 15} XP</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-success rounded-full"
            animate={{ width: `${(doneCount / card.items.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
        </div>
      </div>

      <div className="space-y-2 flex-1">
        {card.items.map((item, idx) => {
          const done = isItemCompleted(idx)
          return (
            <motion.button
              key={idx}
              onClick={() => !dayComplete && onToggle(idx)}
              disabled={dayComplete}
              whileTap={!dayComplete ? { scale: 0.97 } : {}}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all ${
                done ? 'bg-success/10 border border-success/20' : 'bg-surface border border-border'
              }`}
            >
              <motion.div
                animate={done ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {done
                  ? <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                  : <Circle size={20} className="text-text-muted flex-shrink-0 mt-0.5" />}
              </motion.div>
              <span className={`text-sm leading-relaxed flex-1 ${done ? 'text-text-muted line-through' : 'text-text-secondary'}`}>
                {item}
              </span>
              {done && <span className="text-yellow-400 text-xs font-bold flex-shrink-0 mt-0.5">+15 XP</span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ── PRACTICE CARD ─────────────────────────────────────────────────────────

interface PracticeCardViewProps {
  card: PracticeCard
  isCompleted: boolean
  onComplete: () => void
}

function PracticeCardView({ card, isCompleted, onComplete }: PracticeCardViewProps) {
  const steps = card.instructions.split(/\.\s+/).filter(s => s.trim().length > 5)
  const [cycles, setCycles] = useState(0)

  const handleComplete = () => {
    awardXp(25)
    onComplete()
  }

  return (
    <div className="min-h-full flex flex-col p-6 rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #7c6ef530' }}>
      <div className="flex items-center justify-between mb-1">
        <Badge color="#7c6ef5">🧘 PRÁTICA GUIADA</Badge>
        <span className="text-yellow-400 text-xs font-bold">+25 XP</span>
      </div>

      <h3 className="text-white font-display font-bold text-lg mt-4 mb-3">{card.title}</h3>

      {card.isBreathing && (
        <div>
          <BreathingCircle />
          <div className="flex items-center justify-center gap-3 mb-3">
            <button
              onClick={() => setCycles(c => Math.max(0, c - 1))}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted"
            >
              −
            </button>
            <span className="text-white text-sm">{cycles} ciclos</span>
            <button
              onClick={() => setCycles(c => c + 1)}
              className="w-8 h-8 rounded-full border border-primary flex items-center justify-center text-primary"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 flex-1 mb-5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ backgroundColor: '#7c6ef520', color: '#7c6ef5' }}
            >
              {i + 1}
            </span>
            <p className="text-text-secondary text-sm leading-relaxed">{step.trim()}</p>
          </div>
        ))}
      </div>

      {card.scienceFact && (
        <div
          className="p-3 rounded-xl mb-4 flex gap-2 items-start"
          style={{ backgroundColor: '#7c6ef512', border: '1px solid #7c6ef525' }}
        >
          <span className="text-sm flex-shrink-0">🔬</span>
          <p className="text-text-muted text-xs leading-relaxed">{card.scienceFact}</p>
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-xl">
          <Check size={16} className="text-success" />
          <span className="text-success text-sm font-medium">Prática concluída! +25 XP</span>
        </div>
      ) : (
        <Button fullWidth onClick={handleComplete}>
          Marcar como feito ✓
        </Button>
      )}
    </div>
  )
}

// ── CHECKIN CARD ──────────────────────────────────────────────────────────

const EMOTIONS: { key: EmotionType; emoji: string; label: string; color: string }[] = [
  { key: 'anxious', emoji: '😤', label: 'Ansioso', color: '#e0a020' },
  { key: 'missing', emoji: '😢', label: 'Com saudade', color: '#7c6ef5' },
  { key: 'focused', emoji: '💪', label: 'Focado', color: '#4ecb8a' },
  { key: 'neutral', emoji: '😐', label: 'Neutro', color: '#9ca3af' },
  { key: 'good', emoji: '✨', label: 'Bem', color: '#c8102e' },
]

interface CheckinCardViewProps {
  card: CheckinCard
  savedEmotion: EmotionType | null
  canConclude: boolean
  onSelectEmotion: (e: EmotionType) => void
  onConclude: (emotion: EmotionType) => void
  dayComplete: boolean
}

function CheckinCardView({ card: _card, savedEmotion, canConclude, onSelectEmotion, onConclude, dayComplete }: CheckinCardViewProps) {
  const [selected, setSelected] = useState<EmotionType | null>(savedEmotion)

  const handleSelect = (key: EmotionType) => {
    setSelected(key)
    onSelectEmotion(key)
  }

  const emotion = EMOTIONS.find(e => e.key === selected)
  const showButton = selected !== null && canConclude

  return (
    <div className="min-h-full flex flex-col p-6 rounded-2xl" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="text-center mb-6">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('card.checkin.final')}</p>
        <h2 className="font-display text-xl font-bold text-white">{t('card.checkin.q')}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {EMOTIONS.map(em => {
          const isSelected = selected === em.key
          return (
            <motion.button
              key={em.key}
              onClick={() => handleSelect(em.key)}
              whileTap={{ scale: 0.95 }}
              animate={isSelected ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                isSelected ? 'border-transparent text-white' : 'bg-surface border-border text-text-secondary'
              }`}
              style={isSelected ? { backgroundColor: `${em.color}25`, borderColor: `${em.color}60` } : {}}
            >
              <span style={{ fontSize: 36 }}>{em.emoji}</span>
              <span className="text-xs font-medium">{em.label}</span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5"
          >
            {!dayComplete ? (
              <button
                onClick={() => selected && onConclude(selected)}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base"
                style={{ boxShadow: '0 0 24px rgba(200,16,46,0.4)' }}
              >
                🏆 {t('tasks.conclude.day')} {emotion ? `— ${t('tasks.i.feel')} ${emotion.label}` : ''}
              </button>
            ) : (
              <div className="w-full py-4 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center gap-2">
                <Check size={18} className="text-success" />
                <span className="text-success font-medium">{t('card.day.done')}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {selected && !canConclude && !dayComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-text-muted text-xs text-center mt-4"
        >
          {t('tasks.complete.tasks.msg')}
        </motion.p>
      )}
    </div>
  )
}

// ── BLOCK HEADER CARD ────────────────────────────────────────────────────

function BlockHeaderCardView({ card }: { card: BlockHeaderCard }) {
  const blockColors = {
    1: { bg: '#7c6ef520', border: '#7c6ef540', text: '#7c6ef5' },   // Roxo - Arsenal
    2: { bg: '#e0a02020', border: '#e0a02040', text: '#e0a020' },   // Laranja - Execução
    3: { bg: '#4ecb8a20', border: '#4ecb8a40', text: '#4ecb8a' },   // Verde - Blindagem
    4: { bg: '#c8102e20', border: '#c8102e40', text: '#c8102e' },   // Vermelho - Consolidação
  }
  const colors = blockColors[card.blockNumber]

  return (
    <div
      className="min-h-full flex flex-col items-center justify-center p-6 rounded-2xl text-center"
      style={{ backgroundColor: colors.bg, border: `2px solid ${colors.border}` }}
    >
      <div className="text-5xl mb-4">{card.blockEmoji}</div>
      <h2 className="font-display font-bold text-xl mb-2" style={{ color: colors.text }}>
        {card.blockTitle}
      </h2>
      <p className="text-text-secondary text-sm">{card.blockSubtitle}</p>
    </div>
  )
}

// ── BLOCK CONTENT CARD ────────────────────────────────────────────────────

function parseQuizOptions(content: string): { label: string; text: string; isAnswer: boolean }[] | null {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean)
  const optLines = lines.filter(l => /^[A-D]\)/.test(l))
  if (optLines.length < 2) return null
  const answerLine = lines.find(l => /^Resposta:/i.test(l))
  const answerLetter = answerLine ? answerLine.replace(/.*Resposta:\s*/i, '').trim().charAt(0).toUpperCase() : ''
  return optLines.map(l => ({
    label: l.charAt(0),
    text: l.slice(2).trim(),
    isAnswer: l.charAt(0) === answerLetter,
  }))
}

function BlockContentCardView({ card }: { card: BlockContentCard }) {
  const [completed, setCompleted] = useState(false)
  const [checkboxes, setCheckboxes] = useState<boolean[]>(
    card.checkboxes ? new Array(card.checkboxes.length).fill(false) : []
  )
  const [quizSelected, setQuizSelected] = useState<number | null>(null)
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [juramentoDone, setJuramentoDone] = useState(false)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [restrText, setRestrText] = useState('')

  const contentTypeLabels: Record<string, { labelKey: string; color: string }> = {
    reading: { labelKey: 'card.label.reading', color: '#7c6ef5' },
    estudo_caso: { labelKey: 'card.label.estudo_caso', color: '#7c6ef5' },
    quiz: { labelKey: 'card.label.quiz', color: '#7c6ef5' },
    missao: { labelKey: 'card.label.missao', color: '#e0a020' },
    regras: { labelKey: 'card.label.regras', color: '#e0a020' },
    bio_hacking: { labelKey: 'card.label.bio_hacking', color: '#4ecb8a' },
    reestruturacao: { labelKey: 'card.label.reestruturacao', color: '#4ecb8a' },
    sobrecarga: { labelKey: 'card.label.sobrecarga', color: '#4ecb8a' },
    checkin: { labelKey: 'card.label.checkin', color: '#c8102e' },
    termometro: { labelKey: 'card.label.termometro', color: '#c8102e' },
    juramento: { labelKey: 'card.label.juramento', color: '#c8102e' },
    recompensa: { labelKey: 'card.label.recompensa', color: '#c8102e' },
  }

  const _metaEntry = contentTypeLabels[card.contentType] || { labelKey: 'card.label.content', color: '#888' }
  const meta = { label: t(_metaEntry.labelKey), color: _metaEntry.color }

  const toggleCheckbox = (idx: number) => {
    const newChecks = [...checkboxes]
    newChecks[idx] = !newChecks[idx]
    setCheckboxes(newChecks)
    if (newChecks.every(c => c)) setCompleted(true)
  }

  const startHold = () => {
    if (juramentoDone) return
    let prog = 0
    holdIntervalRef.current = setInterval(() => {
      prog += 100 / 30 // 3s = 30 ticks of 100ms
      setHoldProgress(Math.min(prog, 100))
      if (prog >= 100) {
        clearInterval(holdIntervalRef.current!)
        setJuramentoDone(true)
        setCompleted(true)
      }
    }, 100)
  }

  const cancelHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    if (!juramentoDone) setHoldProgress(0)
  }

  // Render quiz options
  if (card.contentType === 'quiz') {
    const options = parseQuizOptions(card.content)
    return (
      <div className="min-h-full flex flex-col p-5 rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #7c6ef530' }}>
        <Badge color={meta.color}>{meta.label}</Badge>
        <h3 className="text-white font-display font-bold text-lg mt-4 mb-4">{card.title}</h3>
        {options ? (
          <div className="space-y-3 flex-1">
            {options.map((opt, idx) => {
              const isSelected = quizSelected === idx
              const showResult = quizSelected !== null
              return (
                <button
                  key={idx}
                  disabled={quizSelected !== null}
                  onClick={() => setQuizSelected(idx)}
                  className="w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all"
                  style={{
                    backgroundColor: showResult && opt.isAnswer ? '#4ecb8a20' : isSelected && !opt.isAnswer ? '#c8102e20' : '#ffffff08',
                    border: `1px solid ${showResult && opt.isAnswer ? '#4ecb8a' : isSelected && !opt.isAnswer ? '#c8102e60' : '#ffffff15'}`,
                  }}
                >
                  <span className="font-bold text-sm flex-shrink-0 mt-0.5" style={{ color: meta.color }}>{opt.label})</span>
                  <span className={`text-sm flex-1 ${showResult && opt.isAnswer ? 'text-white font-medium' : 'text-text-secondary'}`}>{opt.text}</span>
                  {showResult && opt.isAnswer && <Check size={16} className="text-success flex-shrink-0 mt-0.5" />}
                </button>
              )
            })}
            {quizSelected !== null && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-success text-sm mt-2 text-center font-medium">
                {options[quizSelected]?.isAnswer ? t('card.quiz.correct') : `${t('card.quiz.wrong')} ${options.find(o => o.isAnswer)?.label}`}
              </motion.p>
            )}
          </div>
        ) : (
          <p className="text-text-secondary text-sm leading-relaxed flex-1 whitespace-pre-line">{card.content}</p>
        )}
        <div className="mt-4">
          <button
            onClick={() => setCompleted(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all"
            style={{ backgroundColor: completed ? `${meta.color}20` : '#ffffff08', border: `1px solid ${completed ? meta.color : '#ffffff15'}`, color: completed ? meta.color : '#fff' }}
          >
            {completed ? <CheckCircle size={18} /> : <Circle size={18} />}
            {completed ? t('card.done') : t('card.mark.done')}
          </button>
        </div>
      </div>
    )
  }

  // Render termômetro
  if (card.contentType === 'termometro') {
    return (
      <div className="min-h-full flex flex-col p-5 rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #c8102e30' }}>
        <Badge color={meta.color}>{meta.label}</Badge>
        <h3 className="text-white font-display font-bold text-lg mt-4 mb-2">{card.title}</h3>
        <p className="text-text-secondary text-sm mb-6">{card.content}</p>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          {moodScore !== null && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-display font-bold" style={{ color: moodScore >= 7 ? '#4ecb8a' : moodScore >= 4 ? '#e0a020' : '#c8102e' }}>
              {moodScore}
            </motion.div>
          )}
          <div className="grid grid-cols-5 gap-2 w-full">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button
                key={n}
                onClick={() => { setMoodScore(n); setCompleted(true) }}
                className="py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  backgroundColor: moodScore === n ? (n >= 7 ? '#4ecb8a' : n >= 4 ? '#e0a020' : '#c8102e') : '#ffffff10',
                  color: moodScore === n ? '#000' : '#fff',
                  transform: moodScore === n ? 'scale(1.1)' : 'scale(1)',
                }}
              >{n}</button>
            ))}
          </div>
          <div className="flex justify-between w-full text-xs text-text-muted px-1">
            <span>{t('card.mood.bad')}</span><span>{t('card.mood.good')}</span>
          </div>
        </div>
        {moodScore !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-xl text-center"
            style={{ backgroundColor: `${meta.color}15`, border: `1px solid ${meta.color}30` }}>
            <span className="text-sm font-medium" style={{ color: meta.color }}>{t('card.mood.recorded').replace('{score}', String(moodScore))}</span>
          </motion.div>
        )}
      </div>
    )
  }

  // Render juramento (hold button)
  if (card.contentType === 'juramento') {
    return (
      <div className="min-h-full flex flex-col p-5 rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #c8102e30' }}>
        <Badge color={meta.color}>{meta.label}</Badge>
        <h3 className="text-white font-display font-bold text-lg mt-4 mb-3">{card.title}</h3>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#c8102e10', border: '1px solid #c8102e20' }}>
            <p className="text-text-secondary text-sm leading-relaxed italic">"{card.content}"</p>
          </div>
          {!juramentoDone ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${holdProgress}%` }} transition={{ duration: 0.1 }} />
              </div>
              <button
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                className="w-full py-5 rounded-2xl font-bold text-white text-lg select-none"
                style={{ backgroundColor: '#c8102e', boxShadow: '0 0 24px rgba(200,16,46,0.4)', touchAction: 'none' }}
              >
                {t('card.juramento.hold')}
              </button>
              <p className="text-text-muted text-xs text-center">{t('card.juramento.hint')}</p>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-success font-bold text-lg">{t('card.juramento.done')}</p>
              <p className="text-text-muted text-sm mt-1">{t('card.juramento.committed')}</p>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // Render reestruturação (with textarea)
  if (card.contentType === 'reestruturacao') {
    const savedKey = `nr_restr_day_${card.id}`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(savedKey) || '' : ''
    return (
      <div className="min-h-full flex flex-col p-5 rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #4ecb8a30' }}>
        <Badge color={meta.color}>{meta.label}</Badge>
        <h3 className="text-white font-display font-bold text-lg mt-4 mb-2">{card.title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3 whitespace-pre-line">{card.content}</p>
        <textarea
          defaultValue={saved}
          onChange={e => { localStorage.setItem(savedKey, e.target.value); setRestrText(e.target.value) }}
          placeholder={t('card.restr.placeholder')}
          rows={5}
          className="flex-1 w-full bg-surface border border-border rounded-xl p-3 text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-success"
        />
        <button
          onClick={() => setCompleted(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all"
          style={{ backgroundColor: completed ? `${meta.color}20` : '#ffffff08', border: `1px solid ${completed ? meta.color : '#ffffff15'}`, color: completed ? meta.color : '#fff' }}
        >
          {completed ? <CheckCircle size={18} /> : <Circle size={18} />}
          {completed ? t('card.restr.saved') : t('card.restr.save')}
        </button>
      </div>
    )
  }

  // Render recompensa
  if (card.contentType === 'recompensa') {
    const [mainText, teaserText] = card.content.split('\n\n🔮')
    const teaserFull = teaserText ? '🔮' + teaserText : card.content.includes('🏆') ? card.content.split('\n\n')[1] : ''
    const bodyText = mainText || card.content
    return (
      <div className="min-h-full flex flex-col p-5 rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #e0a02040' }}>
        <Badge color="#e0a020">{meta.label}</Badge>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-4">
          <div className="text-5xl">🏆</div>
          <h3 className="text-white font-display font-bold text-xl text-center">{card.title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed text-center">{bodyText}</p>
          {teaserFull && (
            <div className="w-full p-4 rounded-xl text-center" style={{ backgroundColor: '#e0a02015', border: '1px solid #e0a02030' }}>
              <p className="text-yellow-400 text-sm font-medium">{teaserFull}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCompleted(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all"
          style={{ backgroundColor: completed ? '#e0a02020' : '#ffffff08', border: `1px solid ${completed ? '#e0a020' : '#ffffff15'}`, color: completed ? '#e0a020' : '#fff' }}
        >
          {completed ? <CheckCircle size={18} /> : <Circle size={18} />}
          {completed ? t('card.recompensa.done') : t('card.recompensa.cta')}
        </button>
      </div>
    )
  }

  // Default render for reading, estudo_caso, missao, regras, bio_hacking, sobrecarga, checkin
  // Format regras content with line breaks
  const formattedContent = card.content.split('\n').map((line, i) => (
    <React.Fragment key={i}>{line}{i < card.content.split('\n').length - 1 && <br />}</React.Fragment>
  ))

  return (
    <div className="min-h-full flex flex-col p-5 rounded-2xl" style={{ backgroundColor: '#1a1a1a' }}>
      <Badge color={meta.color}>{meta.label}</Badge>
      <h3 className="text-white font-display font-bold text-lg mt-4 mb-2">{card.title}</h3>
      {card.content && !card.checkboxes && (
        <p className="text-text-secondary text-sm leading-relaxed mb-4 whitespace-pre-line">{card.content}</p>
      )}

      {card.checkboxes && card.checkboxes.length > 0 && (
        <div className="space-y-2 flex-1 mt-2">
          {card.checkboxes.map((item, idx) => (
            <button
              key={idx}
              onClick={() => toggleCheckbox(idx)}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
              style={{
                backgroundColor: checkboxes[idx] ? `${meta.color}15` : '#ffffff08',
                border: `1px solid ${checkboxes[idx] ? meta.color : '#ffffff15'}`,
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: checkboxes[idx] ? meta.color : 'transparent',
                  border: `2px solid ${checkboxes[idx] ? meta.color : '#666'}`,
                }}
              >
                {checkboxes[idx] && <Check size={12} className="text-black" />}
              </div>
              <span className={checkboxes[idx] ? 'text-text-muted line-through text-sm' : 'text-text-primary text-sm'}>
                {item}
              </span>
            </button>
          ))}
        </div>
      )}

      {!card.checkboxes && (
        <div className="mt-auto pt-4">
          <button
            onClick={() => setCompleted(!completed)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: completed ? `${meta.color}20` : '#ffffff08',
              border: `1px solid ${completed ? meta.color : '#ffffff15'}`,
              color: completed ? meta.color : '#fff',
            }}
          >
            {completed ? <CheckCircle size={18} /> : <Circle size={18} />}
            {completed ? t('card.done') : t('card.mark.done')}
          </button>
        </div>
      )}

      {completed && !card.checkboxes && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-3 rounded-xl text-center"
          style={{ backgroundColor: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
        >
          <span className="text-sm font-medium" style={{ color: meta.color }}>{t('card.completed')}</span>
        </motion.div>
      )}
    </div>
  )
}

// ── Main renderer ─────────────────────────────────────────────────────────

export interface CardRendererProps {
  card: GameCard
  dayComplete: boolean
  savedExerciseText: string
  exerciseSaved: boolean
  savedEmotion: EmotionType | null
  isChecklistItemDone: (idx: number) => boolean
  isPracticeDone: boolean
  canConclude: boolean
  onNext: () => void
  onSaveExercise: (text: string) => Promise<void>
  onToggleChecklist: (idx: number) => void
  onCompletePractice: () => void
  onSelectEmotion: (e: EmotionType) => void
  onConclude: (emotion: EmotionType) => void
}

export function CardRenderer({
  card, dayComplete,
  savedExerciseText, exerciseSaved, savedEmotion,
  isChecklistItemDone, isPracticeDone, canConclude,
  onNext, onSaveExercise, onToggleChecklist, onCompletePractice,
  onSelectEmotion, onConclude,
}: CardRendererProps) {
  switch (card.type) {
    case 'intro':
      return <IntroCardView card={card} onNext={onNext} />
    case 'affirmation':
      return <AffirmationCardView card={card} />
    case 'concept':
      return <ConceptCardView card={card} />
    case 'insight':
      return <InsightCardView card={card} />
    case 'xp_quiz':
      return <XpQuizCardView card={card} />
    case 'visualization':
      return <VisualizationCardView card={card} />
    case 'quiz':
      return (
        <QuizCardView
          card={card}
          savedText={savedExerciseText}
          isSaved={exerciseSaved}
          onSave={onSaveExercise}
        />
      )
    case 'checklist':
      return (
        <ChecklistCardView
          card={card}
          isItemCompleted={isChecklistItemDone}
          onToggle={onToggleChecklist}
          dayComplete={dayComplete}
        />
      )
    case 'practice':
      return (
        <PracticeCardView
          card={card}
          isCompleted={isPracticeDone}
          onComplete={onCompletePractice}
        />
      )
    case 'checkin':
      return (
        <CheckinCardView
          card={card}
          savedEmotion={savedEmotion}
          canConclude={canConclude}
          onSelectEmotion={onSelectEmotion}
          onConclude={onConclude}
          dayComplete={dayComplete}
        />
      )
    // Novos tipos para estrutura de 4 blocos
    case 'block_header':
      return <BlockHeaderCardView card={card} />
    case 'block_content':
      return <BlockContentCardView card={card} />
    default:
      return null
  }
}

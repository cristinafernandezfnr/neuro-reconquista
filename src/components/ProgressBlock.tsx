import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Award, TrendingUp, Calendar, X, ChevronRight } from 'lucide-react'
import { t } from '../data/i18n'
import { getDayContent, getDayModule } from '../data/protocol'
import { isDemoSupabase } from '../lib/supabase'
import { User } from '../types'

// ── Helpers ───────────────────────────────────────────────────────────────

export function getAnamneseNivel(user: User | null): number {
  if (user?.anamnese_nivel) return user.anamnese_nivel
  try {
    const result = localStorage.getItem('nr_anamnese_result')
    return result ? JSON.parse(result).nivel || 1 : 1
  } catch { return 1 }
}

export function getChartData(currentDay: number): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = currentDay - 6 + i
    if (day <= 0) return 0
    const base = Math.min(day * 3.5, 100)
    const variation = Math.sin(day * 0.9) * 9
    return Math.max(0, Math.min(100, Math.round(base + variation)))
  })
}

export function getCompletedDays(): number[] {
  try {
    const stored = localStorage.getItem('nr_completed_days')
    return stored ? (JSON.parse(stored) as number[]) : []
  } catch { return [] }
}

// ── LineChart ─────────────────────────────────────────────────────────────

export function LineChart({ data }: { data: number[] }) {
  const W = 320, H = 130, PL = 8, PR = 8, PT = 10, PB = 24
  const cW = W - PL - PR, cH = H - PT - PB
  const hasData = data.some(d => d > 0)
  const pts = data.map((v, i) => ({
    x: PL + (i / (data.length - 1)) * cW,
    y: PT + (1 - v / 100) * cH,
    v,
  }))
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaD = `${pathD} L${pts[pts.length - 1].x.toFixed(1)},${PT + cH} L${pts[0].x.toFixed(1)},${PT + cH} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
      <defs>
        <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8102e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c8102e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(v => (
        <line key={v} x1={PL} y1={PT + (1 - v / 100) * cH} x2={PL + cW} y2={PT + (1 - v / 100) * cH}
          stroke="#2a2a2a" strokeWidth="1" />
      ))}
      {hasData ? (
        <>
          <path d={areaD} fill="url(#areaGrad2)" />
          <path d={pathD} fill="none" stroke="#c8102e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => p.v > 0 && <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#c8102e" />)}
        </>
      ) : (
        <line x1={PL} y1={PT + cH} x2={PL + cW} y2={PT + cH} stroke="#444" strokeWidth="1.5" strokeDasharray="5,5" />
      )}
      {data.map((_, i) => (
        <text key={i} x={PL + (i / (data.length - 1)) * cW} y={H - 4}
          textAnchor="middle" fontSize="9" fill="#555" fontFamily="sans-serif">
          D{i + 1}
        </text>
      ))}
    </svg>
  )
}

// ── DayModal ──────────────────────────────────────────────────────────────

function DayModal({ day, onClose, onNavigate }: { day: number; onClose: () => void; onNavigate: () => void }) {
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
              <span className="text-success mt-0.5 flex-shrink-0">✓</span>
              <span>{t(task.titleKey)}</span>
            </div>
          ))}
        </div>
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

// ── ProgressBlock ─────────────────────────────────────────────────────────
// Self-contained progress block to embed in Home (PRO) or render in Progress page.

interface ProgressBlockProps {
  user: User | null
  streak: number
  currentDay: number
}

export function ProgressBlock({ user, streak, currentDay }: ProgressBlockProps) {
  const navigate = useNavigate()
  const nivel = getAnamneseNivel(user)
  const chartData = getChartData(currentDay)
  const completedDays = getCompletedDays()
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  return (
    <>
      <div className="space-y-4">
        {/* Streak + Level */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1e1e1e] rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Zap size={22} className="text-primary" />
            </div>
            <p className="font-display text-4xl font-bold text-text-primary">{streak}</p>
            <p className="text-text-muted text-[10px] uppercase tracking-wider mt-1">DIAS DE STREAK</p>
          </div>
          <div className="bg-[#1e1e1e] rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-3">
              <Award size={22} className="text-gold" />
            </div>
            <p className="font-display text-3xl font-bold text-text-primary">Nível {nivel}</p>
            <p className="text-text-muted text-[10px] uppercase tracking-wider mt-1">STATUS ATUAL</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[#1e1e1e] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-primary" />
              <p className="text-text-primary text-xs font-bold uppercase tracking-wider">EVOLUÇÃO DE VALOR</p>
            </div>
            <p className="text-text-muted text-xs">Últimos 7 dias</p>
          </div>
          <LineChart data={chartData} />
        </div>

        {/* 35-day grid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={17} className="text-gold" />
            <p className="text-text-primary text-xs font-bold uppercase tracking-wider">JORNADA DE 35 DIAS</p>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => i + 1).map(day => {
              const isCompleted = completedDays.includes(day)
              const isCurrent = day === currentDay
              const isDemo = isDemoSupabase()
              const canTap = isCompleted || isCurrent || isDemo
              return (
                <button
                  key={day}
                  onClick={() => canTap && setSelectedDay(day)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    isCompleted ? 'bg-primary text-white' :
                    isCurrent ? 'border-2 border-primary text-primary bg-transparent' :
                    isDemo ? 'bg-[#2a2a2a] text-[#888] border border-border/50' :
                    'bg-[#2a2a2a] text-[#555]'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && (
          <DayModal
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
            onNavigate={() => { setSelectedDay(null); navigate('/tasks', { state: { viewDay: selectedDay } }) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

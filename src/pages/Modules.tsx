import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ChevronRight, X, Clock, Crown, Check } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { t } from '../data/i18n'
import { useAuth } from '../hooks/useAuth'
import { useStreak } from '../hooks/useStreak'
import { MODULES, Lesson, Module } from '../data/modules'
import { canAccessPro, setDemoPlan } from '../lib/access'
import { isDemoSupabase } from '../lib/supabase'
import { getImage } from '../lib/images'
import { getPricing } from '../lib/pricing'
import { UpgradeModal } from '../components/ui/UpgradeModal'

export default function Modules() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentDay, progressPercent } = useStreak(user)
  const isPro = canAccessPro(user)
  const [selectedLesson, setSelectedLesson] = useState<{ module: Module; lesson: Lesson } | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const targetGender = user?.target_gender || 'female'
  const pricing = getPricing()

  return (
    <AppLayout>
      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* Layer 1 — Protocol */}
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider mb-3">{t('modules.layer1')}</p>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div className="flex-1">
                <h2 className="font-display text-lg font-bold text-text-primary">{t('modules.layer1.title')}</h2>
                <p className="text-text-muted text-xs">{t('modules.layer1.subtitle')}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-text-secondary text-xs">Dia {currentDay} de 28</span>
                <span className="text-primary text-xs font-medium">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-border rounded-pill">
                <div className="h-full bg-primary rounded-pill transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <Button fullWidth onClick={() => navigate('/tasks')}>
              {t('modules.layer1.cta')} <ChevronRight size={16} />
            </Button>
          </Card>
        </div>

        {/* Pro Wrapper — collapsed accordion */}
        {(() => {
          const [proOpen, setProOpen] = React.useState(false)
          return (
            <div
              style={{
                background: 'linear-gradient(135deg, #1a1500 0%, #111111 60%)',
                border: '1px solid #e0a020',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              {/* Clickable header */}
              <button
                onClick={() => setProOpen(o => !o)}
                className="w-full text-left"
                style={{ padding: '20px', background: 'rgba(224,160,32,0.08)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Crown size={18} style={{ color: '#e0a020' }} />
                    <span
                      className="font-display font-bold text-sm uppercase tracking-wider"
                      style={{ color: '#e0a020' }}
                    >
                      Neuro Reconquista Pro
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPro ? (
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"
                        style={{ backgroundColor: '#4ecb8a20', color: '#4ecb8a', border: '1px solid #4ecb8a40' }}
                      >
                        <Check size={10} /> Ativo
                      </span>
                    ) : (
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-bold"
                        style={{ backgroundColor: '#e0a02020', color: '#e0a020', border: '1px solid #e0a02040' }}
                      >
                        Pro
                      </span>
                    )}
                    <ChevronRight
                      size={16}
                      style={{ color: '#e0a020', transform: proOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    />
                  </div>
                </div>
                <p className="text-text-muted text-xs">
                  {isPro
                    ? `${MODULES.length} módulos avançados desbloqueados`
                    : `${MODULES.length} módulos avançados · Toque para ver`}
                </p>
                {!isPro && isDemoSupabase() && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setDemoPlan('pro')
                      window.location.reload()
                    }}
                    className="mt-3 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: '#e0a02020', color: '#e0a020', border: '1px solid #e0a02060' }}
                  >
                    🧪 Desbloquear tudo (demo)
                  </button>
                )}
              </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {proOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ height: 1, backgroundColor: 'rgba(224,160,32,0.2)' }} />

                    {/* Module list */}
                    <div>
                      {MODULES.map((mod, idx) => (
                        <div key={mod.id}>
                          <ProModuleCard
                            module={mod}
                            targetGender={targetGender}
                            locked={!isPro}
                            onSelectLesson={lesson => setSelectedLesson({ module: mod, lesson })}
                          />
                          {idx < MODULES.length - 1 && (
                            <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA — only when not Pro */}
                    {!isPro && (
                      <>
                        <div style={{ height: 1, backgroundColor: 'rgba(224,160,32,0.2)' }} />
                        <div style={{ padding: '20px', background: 'rgba(224,160,32,0.05)' }}>
                          <div className="text-center mb-4">
                            <p className="font-display text-3xl font-bold" style={{ color: '#e0a020' }}>
                              {pricing.proMonthly}
                            </p>
                          </div>
                          <button
                            onClick={() => setShowUpgrade(true)}
                            className="w-full py-4 rounded-full font-bold text-white text-base mb-3"
                            style={{ backgroundColor: '#c8102e', boxShadow: '0 0 20px rgba(200,16,46,0.3)' }}
                          >
                            Desbloquear Neuro Reconquista Pro →
                          </button>
                          <p className="text-text-muted text-xs text-center">
                            ✓ Acesso imediato &nbsp;·&nbsp; ✓ Cancele quando quiser
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })()}
      </motion.div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            className="fixed inset-0 z-50 bg-background overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="max-w-lg mx-auto px-4 py-6">
              <button onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 text-text-muted mb-6">
                <X size={20} /> {t('common.close')}
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selectedLesson.module.icon}</span>
                <Badge variant="surface"><Clock size={10} className="mr-1" />{selectedLesson.lesson.duration} {t('modules.min')}</Badge>
              </div>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4">{selectedLesson.lesson.title}</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-2">CONCEITO</p>
                  <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{selectedLesson.lesson.concept}</p>
                </div>
                <Card className="p-4">
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-2">EXEMPLO REAL</p>
                  <p className="text-text-secondary text-sm italic">{selectedLesson.lesson.realExample}</p>
                </Card>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-2">EXERCÍCIO</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{selectedLesson.lesson.exercisePrompt}</p>
                </div>
                <Card className="p-4 border-primary/20 bg-primary/5">
                  <p className="text-primary text-xs uppercase tracking-wider mb-2">MISSÃO</p>
                  <p className="text-text-primary text-sm font-medium">{selectedLesson.lesson.mission}</p>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </AppLayout>
  )
}

// ── Inner module card (lives inside the Pro wrapper) ──────────────────────────
function ProModuleCard({ module, targetGender, locked, onSelectLesson }: {
  module: Module
  targetGender: string
  locked: boolean
  onSelectLesson: (l: Lesson) => void
}) {
  const [open, setOpen] = useState(false)
  const title = targetGender === 'male' ? module.titleMaleTarget : module.titleFemaleTarget
  const persuasiveSubtitle = targetGender === 'male' ? module.persuasiveSubtitleMale : module.persuasiveSubtitleFemale
  const futurePacing = targetGender === 'male' ? module.futurePacingMale : module.futurePacingFemale
  const bullets = targetGender === 'male' ? module.bulletsMale : module.bulletsFemale
  const imageQuery = targetGender === 'male' ? module.imageQueryMale : module.imageQueryFemale

  return (
    <div style={{ padding: '16px', background: 'transparent' }}>
      {/* Hero Image */}
      <div
        className="relative rounded-xl overflow-hidden mb-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.15), rgba(17,17,17,0.88)), url(${getImage(imageQuery, 800, 300)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 140,
        }}
      >
        {locked && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.35)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(224,160,32,0.2)', border: '1px solid rgba(224,160,32,0.4)' }}
            >
              <Lock size={18} style={{ color: '#e0a020' }} />
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{module.icon}</span>
          </div>
          <h3 className="font-display text-base font-bold text-white leading-tight">{title}</h3>
          <p className="text-white/60 text-xs mt-0.5">{persuasiveSubtitle}</p>
        </div>
      </div>

      {/* Future pacing quote */}
      <p className="text-text-secondary text-sm italic leading-relaxed mb-3 border-l-2 border-primary/50 pl-3">
        {futurePacing}
      </p>

      {/* Bullets */}
      <div className="space-y-1.5 mb-4">
        {bullets.map((bullet, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-primary text-xs mt-0.5 flex-shrink-0 font-bold">✓</span>
            <p className="text-text-secondary text-xs">{bullet}</p>
          </div>
        ))}
      </div>

      {/* Bottom row — lesson count only when unlocked, CTA */}
      <div className="flex items-center justify-between">
        {!locked && (
          <span className="text-text-muted text-xs">{module.lessons.length} {t('modules.lessons')}</span>
        )}
        {locked ? (
          <span className="text-xs" style={{ color: '#e0a020' }}>
            <Lock size={10} className="inline mr-1" />Bloqueado
          </span>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-primary text-sm font-medium ml-auto"
          >
            {open ? 'Fechar' : t('modules.start')}
            <ChevronRight size={14} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      {/* Expandable lessons */}
      <AnimatePresence>
        {open && !locked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2 border-t mt-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {module.lessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="flex-1">
                    <p className="text-text-primary text-sm font-medium">{lesson.title}</p>
                    <p className="text-text-muted text-xs">{lesson.duration} {t('modules.min')}</p>
                  </div>
                  <ChevronRight size={16} className="text-text-muted" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

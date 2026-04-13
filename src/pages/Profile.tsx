import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LogOut, Globe, ChevronRight, AlertTriangle, ArrowLeft,
  User as UserIcon, Shield, Bell, CreditCard, Settings, Crown, BarChart2,
} from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { t, setLang } from '../data/i18n'
import { useAuth, resetDemoStorage } from '../hooks/useAuth'
import { canAccessPro, setDemoPlan } from '../lib/access'
import { useAppContext } from '../contexts/AppContext'
import { clearDemoFlow } from '../lib/demoFlow'
import { isDemoSupabase } from '../lib/supabase'
import { canAccessProtocol } from '../lib/access'
import { openStripePortal } from '../lib/stripePortal'
import { UpgradeModal, UpgradeLayer1Modal } from '../components/ui/UpgradeModal'
import { isCoachEnabled } from '../lib/coachFlag'
import { Lang } from '../types'

type ProfileView = 'main' | 'personal' | 'privacy' | 'notifications' | 'subscription' | 'settings'
type DemoPlan = 'free' | 'protocol' | 'pro'

const DEMO_PLANS: { key: DemoPlan; label: string; description: string }[] = [
  { key: 'free', label: 'Gratuito', description: 'Acesso restrito — telas bloqueadas em tarefas e módulos.' },
  { key: 'protocol', label: 'Protocolo', description: 'Acesso ao protocolo de 35 dias (5 fases). Módulos PRO bloqueados.' },
  {
    key: 'pro',
    label: 'Pro',
    description: isCoachEnabled()
      ? 'Acesso completo — protocolo + módulos avançados + coach Cristina.'
      : 'Acesso completo — protocolo + módulos avançados.',
  },
]

function DemoPlanSwitcher() {
  const [current, setCurrent] = useState<DemoPlan>(() => {
    try {
      const val = localStorage.getItem('nr_demo_plan')
      if (val === 'free' || val === 'protocol' || val === 'pro') return val
    } catch { /* ignore */ }
    return 'protocol'
  })
  const [toast, setToast] = useState<string | null>(null)

  const handleSwitch = (plan: DemoPlan) => {
    if (plan === current) return
    setDemoPlan(plan)
    setCurrent(plan)
    const name = DEMO_PLANS.find(p => p.key === plan)?.label || plan
    setToast(`Plano alterado para ${name}`)
    setTimeout(() => window.location.reload(), 500)
  }

  const active = DEMO_PLANS.find(p => p.key === current)!

  return (
    <div
      className="relative"
      style={{ backgroundColor: '#1a1a1a', border: '1px solid #e0a020', borderRadius: 16, padding: 16 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span style={{ fontSize: 16 }}>🧪</span>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#e0a020' }}>
          MODO DEMO — Testar planos
        </span>
      </div>
      <p className="text-text-muted text-xs mb-4 leading-relaxed">
        Simule diferentes planos para ver como o app se comporta
      </p>

      {/* Plan pills */}
      <div className="flex gap-2 mb-3">
        {DEMO_PLANS.map(plan => {
          const isActive = current === plan.key
          return (
            <button
              key={plan.key}
              onClick={() => handleSwitch(plan.key)}
              style={{
                height: 36,
                paddingLeft: 14,
                paddingRight: 14,
                borderRadius: 999,
                border: isActive ? 'none' : '1px solid #333',
                backgroundColor: isActive ? '#c8102e' : '#111',
                color: isActive ? '#fff' : '#999',
                fontSize: 13,
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                flex: 1,
              }}
            >
              {plan.label}
            </button>
          )
        })}
      </div>

      {/* Description */}
      <p className="text-text-muted text-xs leading-relaxed">{active.description}</p>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-4 -bottom-10 flex items-center justify-center"
        >
          <span
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ backgroundColor: '#e0a02020', color: '#e0a020', border: '1px solid #e0a02040' }}
          >
            ✓ {toast}
          </span>
        </motion.div>
      )}
    </div>
  )
}

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
]

function formatMemberSince(dateStr?: string): string {
  if (!dateStr) return 'Março 2025'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, c => c.toUpperCase())
  } catch { return 'Março 2025' }
}

function MenuItem({
  icon, iconBg, label, onPress, danger,
}: {
  icon: React.ReactNode; iconBg: string; label: string; onPress: () => void; danger?: boolean
}) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors text-left"
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <span className={`flex-1 text-sm font-medium ${danger ? 'text-danger' : 'text-text-primary'}`}>{label}</span>
      <ChevronRight size={16} className="text-text-muted" />
    </button>
  )
}

function SubPageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-2 pb-4">
      <button onClick={onBack} className="text-text-muted">
        <ArrowLeft size={22} />
      </button>
      <h1 className="font-display text-xl font-bold text-text-primary">{title}</h1>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const isPro = canAccessPro(user)
  const { language, setLanguage } = useAppContext()
  const [view, setView] = useState<ProfileView>('main')
  const [showProModal, setShowProModal] = useState(false)
  const [showL1Modal, setShowL1Modal] = useState(false)

  const handleLanguage = (l: Lang) => { setLanguage(l); setLang(l) }
  const handleResetDemo = async () => { clearDemoFlow(); resetDemoStorage(); await signOut(); navigate('/') }
  const handleLogout = async () => { await signOut(); navigate('/') }

  // ── Sub-pages ────────────────────────────────────────────────────────────
  if (view === 'personal') {
    return (
      <AppLayout>
        <SubPageHeader title="Dados Pessoais" onBack={() => setView('main')} />
        <Card className="p-4 space-y-4">
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{t('auth.name')}</p>
            <p className="text-text-primary text-sm font-medium">{user?.name || '—'}</p>
          </div>
          <div className="h-px bg-border" />
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{t('auth.email')}</p>
            <p className="text-text-primary text-sm font-medium">{user?.email || '—'}</p>
          </div>
          <div className="h-px bg-border" />
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{t('profile.plan')}</p>
            <p className="text-text-primary text-sm font-medium">{isPro ? 'Pro' : t('profile.free')}</p>
          </div>
          <div className="h-px bg-border" />
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{t('profile.protocol')}</p>
            <p className="text-text-primary text-sm font-medium">{user?.protocol_access ? t('profile.active') : 'Inativo'}</p>
          </div>
        </Card>
      </AppLayout>
    )
  }

  if (view === 'privacy') {
    return (
      <AppLayout>
        <SubPageHeader title="Privacidade e Segurança" onBack={() => setView('main')} />
        <Card className="p-5">
          <p className="text-text-secondary text-sm leading-relaxed">
            Seus dados são armazenados com segurança e nunca compartilhados com terceiros.
            O protocolo é processado localmente e no servidor Supabase com RLS ativado.
          </p>
        </Card>
        <button
          onClick={() => navigate('/sos')}
          className="w-full flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors mt-4"
        >
          <AlertTriangle size={18} className="text-primary" />
          <span className="text-primary font-medium">{t('profile.sos')}</span>
          <ChevronRight size={16} className="text-primary ml-auto" />
        </button>
      </AppLayout>
    )
  }

  if (view === 'notifications') {
    return (
      <AppLayout>
        <SubPageHeader title="Notificações" onBack={() => setView('main')} />
        <Card className="p-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-text-primary text-sm">Lembretes diários</span>
            <div className="w-10 h-6 bg-primary rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between py-2">
            <span className="text-text-primary text-sm">Novidades do protocolo</span>
            <div className="w-10 h-6 bg-surface rounded-full flex items-center justify-start px-1">
              <div className="w-4 h-4 bg-text-muted rounded-full" />
            </div>
          </div>
        </Card>
      </AppLayout>
    )
  }

  if (view === 'subscription') {
    const hasProtocol = canAccessProtocol(user)
    const nextBilling = (() => {
      const d = new Date(); d.setDate(d.getDate() + 30)
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    })()
    return (
      <AppLayout>
        <SubPageHeader title={t('profile.subscription')} onBack={() => setView('main')} />
        <div className="space-y-4">
          {isPro ? (
            <>
              {/* Active Pro card */}
              <Card className="p-5 border border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown size={20} className="text-gold" />
                    <p className="text-gold font-bold font-display">Neuro Reconquista Pro</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#4ecb8a20', color: '#4ecb8a' }}>
                    {t('profile.subscription.active')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gold/20">
                  <span className="text-text-muted text-sm">{t('profile.subscription.next.billing')}</span>
                  <span className="text-text-secondary text-sm">R$ 19,90 · {nextBilling}</span>
                </div>
              </Card>
              <button
                onClick={openStripePortal}
                className="w-full py-4 rounded-full font-bold text-white text-base"
                style={{ backgroundColor: '#c8102e', boxShadow: '0 0 20px rgba(200,16,46,0.3)' }}
              >
                {t('profile.subscription.manage')} →
              </button>
              <button
                onClick={openStripePortal}
                className="w-full py-3.5 rounded-full font-medium text-sm border border-border text-text-secondary"
              >
                {t('profile.subscription.change.card')}
              </button>
              <div className="text-center">
                <button onClick={openStripePortal} className="text-text-muted text-xs underline underline-offset-2">
                  {t('profile.subscription.cancel')}
                </button>
              </div>
            </>
          ) : hasProtocol ? (
            <>
              {/* Protocol only */}
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-text-primary font-bold">Protocolo da Reconquista</p>
                    <p className="text-text-muted text-xs">{t('profile.subscription.lifetime')} · {t('profile.subscription.active')}</p>
                  </div>
                </div>
              </Card>
              {/* Upgrade CTA */}
              <Card className="p-5 border border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Crown size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-text-primary font-bold text-sm">Assinar Pro</p>
                    <p className="text-text-muted text-xs">R$ 19,90/mês · Cancele quando quiser</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProModal(true)}
                  className="w-full py-3.5 rounded-full font-bold text-white text-sm"
                  style={{ backgroundColor: '#c8102e' }}
                >
                  {t('profile.subscription.upgrade')} →
                </button>
              </Card>
            </>
          ) : (
            <>
              <Card className="p-5 text-center">
                <p className="text-4xl mb-3">🔒</p>
                <p className="text-text-primary font-bold mb-1">{t('profile.subscription.none')}</p>
                <p className="text-text-muted text-sm">Escolha um plano para começar.</p>
              </Card>
              <button
                onClick={() => setShowL1Modal(true)}
                className="w-full py-4 rounded-full font-bold text-white text-base"
                style={{ backgroundColor: '#c8102e' }}
              >
                Adquirir Protocolo →
              </button>
              <button
                onClick={() => setShowProModal(true)}
                className="w-full py-3.5 rounded-full font-medium text-sm border border-border text-text-secondary"
              >
                Assinar Pro →
              </button>
            </>
          )}
        </div>
        <UpgradeModal open={showProModal} onClose={() => setShowProModal(false)} />
        <UpgradeLayer1Modal open={showL1Modal} onClose={() => setShowL1Modal(false)} />
      </AppLayout>
    )
  }

  if (view === 'settings') {
    return (
      <AppLayout>
        <SubPageHeader title="Configurações" onBack={() => setView('main')} />
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={15} className="text-text-muted" />
            <p className="text-text-muted text-xs uppercase tracking-wider">{t('profile.language')}</p>
          </div>
          <div className="flex gap-2">
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => handleLanguage(l.code)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all ${language === l.code ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-muted'}`}
              >
                <span>{l.flag}</span><span>{l.label}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="mt-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm">{t('profile.version')}</span>
            <span className="text-text-muted text-sm">2.0.0</span>
          </div>
        </Card>
      </AppLayout>
    )
  }

  // ── Main profile view ────────────────────────────────────────────────────
  return (
    <AppLayout>
      <motion.div className="space-y-5 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* Demo plan switcher — only in demo mode */}
        {user?.email === 'demo@teste.com' && <DemoPlanSwitcher />}

        {/* Avatar + name */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center bg-surface">
              <span className="text-3xl font-display font-bold text-primary">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            {isPro && (
              <span className="absolute bottom-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PRO</span>
            )}
          </div>
          <h1 className="font-display text-xl font-bold text-text-primary">{user?.name || 'Usuário'}</h1>
          <p className="text-text-muted text-sm">Membro desde {formatMemberSince(user?.created_at)}</p>
        </div>

        {/* Menu card */}
        <div className="bg-card rounded-2xl overflow-hidden border border-border">
          <MenuItem
            icon={<UserIcon size={16} color="#60a5fa" />}
            iconBg="rgba(96,165,250,0.15)"
            label="Dados Pessoais"
            onPress={() => setView('personal')}
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={<Shield size={16} color="#34d399" />}
            iconBg="rgba(52,211,153,0.15)"
            label="Privacidade e Segurança"
            onPress={() => setView('privacy')}
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={<Bell size={16} color="#fbbf24" />}
            iconBg="rgba(251,191,36,0.15)"
            label="Notificações"
            onPress={() => setView('notifications')}
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={<BarChart2 size={16} color="#4ecb8a" />}
            iconBg="rgba(78,203,138,0.15)"
            label="Ver Progresso Completo"
            onPress={() => navigate('/progress')}
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={<CreditCard size={16} color="#c8102e" />}
            iconBg="rgba(200,16,46,0.15)"
            label="Assinatura PRO"
            onPress={() => setView('subscription')}
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={<Settings size={16} color="#9ca3af" />}
            iconBg="rgba(156,163,175,0.15)"
            label="Configurações"
            onPress={() => setView('settings')}
          />
        </div>

        {/* Demo reset */}
        {isDemoSupabase() && (
          <button
            onClick={handleResetDemo}
            style={{ width: '100%', padding: '14px', borderRadius: 999, border: '1px solid #c8102e', backgroundColor: 'transparent', color: '#c8102e', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            🔄 Resetar demo (refazer fluxo completo)
          </button>
        )}

        {/* Logout card */}
        <div className="bg-card rounded-2xl overflow-hidden border border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-danger/15">
              <LogOut size={16} color="#ef4444" />
            </div>
            <span className="text-danger text-sm font-medium">{t('profile.logout')}</span>
          </button>
        </div>

        {/* Version */}
        <p className="text-text-muted text-[10px] uppercase tracking-wider text-center pb-2">
          NEURO RECONQUISTA APP V2.0.0
        </p>
      </motion.div>
    </AppLayout>
  )
}

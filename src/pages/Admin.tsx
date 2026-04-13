import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BarChart2, CreditCard, Shield, Ban, CheckCircle,
  Copy, Check, X, ChevronDown, Webhook, FileText, Eye, EyeOff,
  ToggleLeft, ToggleRight, Zap,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { supabase, isDemoSupabase } from '../lib/supabase'
import { PROTOCOL, getDayContent } from '../data/protocol'
import { t } from '../data/i18n'
import { MODULES } from '../data/modules'
import { getPricing, savePricing, PricingConfig } from '../lib/pricing'
import { isCoachEnabled, setCoachEnabled } from '../lib/coachFlag'
import { User } from '../types'

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim())

type Tab = 'users' | 'metrics' | 'content' | 'payments' | 'webhooks'

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-card border border-border px-5 py-3 rounded-xl shadow-xl"
    >
      <p className="text-text-primary text-sm font-medium">{message}</p>
    </motion.div>
  )
}

// ── Ban modal ────────────────────────────────────────────────────────────────
function BanModal({ userName, onConfirm, onClose }: {
  userName: string
  onConfirm: (reason: string) => void
  onClose: () => void
}) {
  const [reason, setReason] = useState('')
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-sm bg-card rounded-2xl p-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
        <h3 className="font-display text-lg font-bold text-text-primary mb-1">Banir usuário</h3>
        <p className="text-text-muted text-sm mb-4">{userName}</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Motivo do banimento..."
          className="w-full bg-surface border border-border rounded-xl p-3 text-text-primary text-sm resize-none mb-4"
          rows={3}
        />
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={onClose}>Cancelar</Button>
          <Button variant="danger" fullWidth onClick={() => onConfirm(reason || 'admin_action')}>Banir</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Day edit modal ───────────────────────────────────────────────────────────
function DayEditModal({ day, onClose, onSave }: {
  day: number
  onClose: () => void
  onSave: () => void
}) {
  const base = getDayContent(day)
  const overrides = (() => {
    try { return JSON.parse(localStorage.getItem('nr_day_overrides') || '{}') } catch { return {} }
  })()

  const [title, setTitle] = useState(overrides[day]?.contentTitle || (base ? t(base.titleKey) : ''))
  const [mission, setMission] = useState(overrides[day]?.mission || '')
  const [exercise, setExercise] = useState(overrides[day]?.exercisePrompt || '')
  const [checklist, setChecklist] = useState((overrides[day]?.checklist || []).join('\n'))

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nr_day_overrides') || '{}')
      existing[day] = {
        contentTitle: title,
        mission,
        exercisePrompt: exercise,
        checklist: checklist.split('\n').filter(Boolean),
      }
      localStorage.setItem('nr_day_overrides', JSON.stringify(existing))
    } catch { /* ignore */ }
    onSave()
    onClose()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-md bg-card rounded-2xl p-5 space-y-4"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-text-primary">Editar Dia {day}</h3>
          <button onClick={onClose}><X size={18} className="text-text-muted" /></button>
        </div>
        <div>
          <p className="text-text-muted text-xs mb-1">Título</p>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm" />
        </div>
        <div>
          <p className="text-text-muted text-xs mb-1">Missão</p>
          <textarea value={mission} onChange={e => setMission(e.target.value)} rows={3}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm resize-none" />
        </div>
        <div>
          <p className="text-text-muted text-xs mb-1">Exercício</p>
          <textarea value={exercise} onChange={e => setExercise(e.target.value)} rows={2}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm resize-none" />
        </div>
        <div>
          <p className="text-text-muted text-xs mb-1">Checklist (uma por linha)</p>
          <textarea value={checklist} onChange={e => setChecklist(e.target.value)} rows={4}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm resize-none" />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={onClose}>Cancelar</Button>
          <Button fullWidth onClick={handleSave}>Salvar</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── User action dropdown ─────────────────────────────────────────────────────
function ActionDropdown({ user: u, onAction, onBanClick }: {
  user: User
  onAction: (action: string, userId: string) => void
  onBanClick: (user: User) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const actions = [
    { label: 'Dar Acesso Layer 1', key: 'grant-l1' },
    { label: 'Revogar Layer 1', key: 'revoke-l1' },
    { label: 'Dar Acesso Pro', key: 'grant-pro' },
    { label: 'Revogar Pro', key: 'revoke-pro' },
    { label: 'Resetar progresso', key: 'reset-progress' },
    { label: u.banned ? 'Desbanir' : 'Banir usuário', key: u.banned ? 'unban' : 'ban', danger: !u.banned },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-surface border border-border text-text-secondary"
      >
        Ações <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-8 z-20 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {actions.map(a => (
              <button
                key={a.key}
                onClick={() => {
                  setOpen(false)
                  if (a.key === 'ban') { onBanClick(u); return }
                  onAction(a.key, u.id)
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface transition-colors ${a.danger ? 'text-danger' : 'text-text-secondary'}`}
              >
                {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-surface border border-border text-text-secondary">
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
      {copied ? 'Copiado!' : 'Copiar link'}
    </button>
  )
}

// ── Metrics Tab ──────────────────────────────────────────────────────────────
const MOCK_COMPLETION = [
  { day: 1, pct: 92 }, { day: 3, pct: 80 }, { day: 7, pct: 61 },
  { day: 14, pct: 42 }, { day: 21, pct: 28 }, { day: 28, pct: 15 },
]
const MOCK_DROPOUT = [{ day: 3, count: 12 }, { day: 7, count: 21 }, { day: 14, count: 18 }, { day: 21, count: 9 }]
const MOCK_LANGS = [{ lang: 'PT', pct: 78 }, { lang: 'ES', pct: 16 }, { lang: 'EN', pct: 6 }]
const MOCK_GENDER = [{ label: 'Alvo feminino', pct: 63 }, { label: 'Alvo masculino', pct: 37 }]

function MetricsTab({ users }: { users: User[] }) {
  const metrics = {
    total: users.length,
    withProtocol: users.filter(u => u.protocol_access).length,
    pro: users.filter(u => u.pro_access).length,
    banned: users.filter(u => u.banned).length,
    avgStreak: users.length ? Math.round(users.reduce((a, u) => a + (u.streak || 0), 0) / users.length) : 0,
  }
  const maxDropout = Math.max(...MOCK_DROPOUT.map(d => d.count))
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid grid-cols-2 gap-3">
        {([
          ['Total', metrics.total, 'text-text-primary'],
          ['Com Protocolo', metrics.withProtocol, 'text-primary'],
          ['Pro', metrics.pro, 'text-gold'],
          ['Banidos', metrics.banned, 'text-danger'],
          ['Streak Médio', metrics.avgStreak, 'text-success'],
        ] as const).map(([label, val, color]) => (
          <Card key={String(label)} className="p-4 text-center">
            <p className={`font-display text-3xl font-bold ${color}`}>{val}</p>
            <p className="text-text-muted text-xs mt-1">{label}</p>
          </Card>
        ))}
      </div>

      {/* Day completion rate */}
      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Taxa de Conclusão por Dia</p>
        <div className="space-y-2">
          {MOCK_COMPLETION.map(({ day, pct }) => (
            <div key={day} className="flex items-center gap-2">
              <span className="text-text-muted text-xs w-10">Dia {day}</span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-text-secondary text-xs w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Dropout analysis */}
      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Dropout por Dia (mock)</p>
        <div className="flex items-end gap-3 h-20">
          {MOCK_DROPOUT.map(({ day, count }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-sm bg-danger/70" style={{ height: `${(count / maxDropout) * 64}px` }} />
              <span className="text-text-muted text-[10px]">D{day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Language distribution */}
      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Idiomas</p>
        <div className="space-y-2">
          {MOCK_LANGS.map(({ lang, pct }) => (
            <div key={lang} className="flex items-center gap-2">
              <span className="text-text-muted text-xs w-6">{lang}</span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-text-secondary text-xs w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Gender target */}
      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Gênero Alvo</p>
        <div className="space-y-2">
          {MOCK_GENDER.map(({ label, pct }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-text-muted text-xs flex-1">{label}</span>
              <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-text-secondary text-xs w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

// ── Payments Tab ─────────────────────────────────────────────────────────────
const MOCK_SOURCES = [
  { name: 'Kiwify', count: 0, pct: 0 },
  { name: 'Hotmart', count: 0, pct: 0 },
  { name: 'Stripe', count: 0, pct: 0 },
  { name: 'Manual', count: 0, pct: 0 },
  { name: 'Demo', count: 1, pct: 100 },
]

function PaymentsTab() {
  const l1Url = import.meta.env.VITE_STRIPE_CHECKOUT_LAYER1_URL || ''
  const proUrl = import.meta.env.VITE_STRIPE_CHECKOUT_PRO_URL || ''

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Stripe Dashboard */}
      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Stripe</p>
        <div className="flex gap-2">
          <button
            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ backgroundColor: '#635bff' }}
          >
            Stripe Dashboard ↗
          </button>
        </div>
        <div className="mt-3 p-3 rounded-xl bg-surface border border-border">
          <p className="text-text-muted text-xs leading-relaxed">
            Configure produtos, políticas de cancelamento e aparência do portal em:{' '}
            <span className="text-primary">dashboard.stripe.com/settings/billing/portal</span>
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Links de Checkout</p>
        {[
          { label: 'Layer 1 — Protocolo', url: l1Url || 'Não configurado (VITE_STRIPE_CHECKOUT_LAYER1_URL)' },
          { label: 'Pro — Neuro Reconquista Pro', url: proUrl || 'Não configurado (VITE_STRIPE_CHECKOUT_PRO_URL)' },
        ].map(({ label, url }) => (
          <div key={label} className="mb-4">
            <p className="text-text-secondary text-sm font-medium mb-2">{label}</p>
            <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-border">
              <p className="text-text-muted text-xs flex-1 truncate">{url}</p>
              {url && !url.startsWith('Não') && <CopyButton text={url} />}
            </div>
            {/* QR placeholder */}
            <div className="mt-2 w-20 h-20 bg-surface border border-border rounded-xl flex items-center justify-center">
              <p className="text-text-muted text-[10px] text-center">QR Code</p>
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Distribuição por Fonte</p>
        <div className="space-y-0">
          <div className="flex text-text-muted text-xs py-2 border-b border-border">
            <span className="flex-1">Fonte</span>
            <span className="w-16 text-right">Usuários</span>
            <span className="w-12 text-right">%</span>
          </div>
          {MOCK_SOURCES.map(s => (
            <div key={s.name} className="flex text-text-secondary text-sm py-2.5 border-b border-border/50">
              <span className="flex-1">{s.name}</span>
              <span className="w-16 text-right">{s.count}</span>
              <span className="w-12 text-right">{s.pct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

// ── Webhooks Tab ─────────────────────────────────────────────────────────────
const MOCK_WEBHOOKS = [
  { ts: '22/03 15:30', source: 'Kiwify', event: 'order.approved', email: 'demo@teste.com', ok: true },
  { ts: '21/03 09:12', source: 'Stripe', event: 'checkout.completed', email: 'user2@email.com', ok: true },
  { ts: '20/03 22:45', source: 'Hotmart', event: 'purchase.approved', email: 'user3@email.com', ok: false },
]

function WebhooksTab({ onToast }: { onToast: (msg: string) => void }) {
  const getRawLog = () => {
    try { return JSON.parse(localStorage.getItem('nr_webhook_log') || '[]') } catch { return [] }
  }
  const [log] = useState<typeof MOCK_WEBHOOKS>(isDemoSupabase() ? MOCK_WEBHOOKS : getRawLog())

  // Config state
  const [kiwifyToken, setKiwifyToken] = useState('')
  const [hotmartToken, setHotmartToken] = useState('')
  const [appUrl, setAppUrl] = useState('')
  const [showTokens, setShowTokens] = useState(false)
  const [savingCfg, setSavingCfg] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Load existing config on mount
  useEffect(() => {
    if (isDemoSupabase()) return
    supabase.from('app_settings').select('key, value').in('key', ['kiwify_token', 'hotmart_hottok', 'app_url'])
      .then(({ data }) => {
        if (!data) return
        const m = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))
        setKiwifyToken(m['kiwify_token'] || '')
        setHotmartToken(m['hotmart_hottok'] || '')
        setAppUrl(m['app_url'] || '')
      })
  }, [])

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
  const kiwifyUrl = projectRef ? `https://${projectRef}.supabase.co/functions/v1/kiwify-webhook` : '(configure VITE_SUPABASE_URL)'
  const hotmartUrl = projectRef ? `https://${projectRef}.supabase.co/functions/v1/hotmart-webhook` : '(configure VITE_SUPABASE_URL)'

  const copyUrl = (key: string, val: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    })
  }

  const saveConfig = async () => {
    if (isDemoSupabase()) { onToast('⚠️ Não disponível no modo demo'); return }
    setSavingCfg(true)
    try {
      await supabase.from('app_settings').upsert([
        { key: 'kiwify_token', value: kiwifyToken },
        { key: 'hotmart_hottok', value: hotmartToken },
        { key: 'app_url', value: appUrl },
      ])
      onToast('✅ Configurações salvas!')
    } catch {
      onToast('❌ Erro ao salvar configurações')
    } finally {
      setSavingCfg(false)
    }
  }

  const simulatePurchase = () => {
    try {
      const stored = localStorage.getItem('nr_demo_user')
      if (stored) {
        const u = JSON.parse(stored)
        u.protocol_access = true
        localStorage.setItem('nr_demo_user', JSON.stringify(u))
      }
      const existing = getRawLog()
      existing.unshift({ ts: new Date().toLocaleString('pt-BR').slice(0, 14), source: 'Kiwify', event: 'order.approved', email: 'demo@teste.com', ok: true })
      localStorage.setItem('nr_webhook_log', JSON.stringify(existing.slice(0, 10)))
    } catch { /* ignore */ }
    onToast('✅ Compra simulada — Layer 1 ativado para demo@teste.com')
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* ── Webhook URLs ── */}
      <div>
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">URLs dos Webhooks</p>
        <Card className="p-4 space-y-3">
          {[
            { label: 'Kiwify', url: kiwifyUrl, key: 'kiwify' },
            { label: 'Hotmart', url: hotmartUrl, key: 'hotmart' },
          ].map(({ label, url, key }) => (
            <div key={key}>
              <p className="text-text-muted text-[10px] uppercase mb-1">{label}</p>
              <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2">
                <p className="flex-1 text-text-secondary text-xs truncate font-mono">{url}</p>
                <button onClick={() => copyUrl(key, url)} style={{ outline: 'none' }} className="text-text-muted hover:text-primary flex-shrink-0">
                  {copiedKey === key ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* ── Token config ── */}
      <div>
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Configuração de Tokens</p>
        <Card className="p-4 space-y-3">
          <div>
            <p className="text-text-muted text-[10px] uppercase mb-1">URL do App (redirect após compra)</p>
            <input
              type="text"
              value={appUrl}
              onChange={e => setAppUrl(e.target.value)}
              placeholder="https://seudominio.com"
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <p className="text-text-muted text-[10px] uppercase mb-1">Token Kiwify (configurado no painel Kiwify → Webhooks)</p>
            <div className="relative">
              <input
                type={showTokens ? 'text' : 'password'}
                value={kiwifyToken}
                onChange={e => setKiwifyToken(e.target.value)}
                placeholder="Token secreto Kiwify"
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 pr-10 text-text-primary text-sm focus:outline-none focus:border-primary"
              />
              <button type="button" onClick={() => setShowTokens(!showTokens)} style={{ outline: 'none' }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showTokens ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-text-muted text-[10px] uppercase mb-1">Hottok Hotmart (Hotmart → Ferramentas → Webhooks)</p>
            <div className="relative">
              <input
                type={showTokens ? 'text' : 'password'}
                value={hotmartToken}
                onChange={e => setHotmartToken(e.target.value)}
                placeholder="Hottok Hotmart"
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 pr-10 text-text-primary text-sm focus:outline-none focus:border-primary"
              />
              <button type="button" onClick={() => setShowTokens(!showTokens)} style={{ outline: 'none' }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showTokens ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <Button fullWidth onClick={saveConfig} loading={savingCfg}>
            Salvar configurações
          </Button>
        </Card>
      </div>

      {/* ── Event log ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-text-muted text-xs uppercase tracking-wider">Últimos Eventos</p>
          <button onClick={simulatePurchase}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-white font-medium"
            style={{ backgroundColor: '#c8102e' }}>
            <Zap size={12} /> Simular compra Kiwify
          </button>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="flex text-text-muted text-[11px] px-4 py-2 border-b border-border bg-surface">
            <span className="w-24">Data/Hora</span>
            <span className="w-16">Fonte</span>
            <span className="flex-1">Evento</span>
            <span className="w-20 text-right">Status</span>
          </div>
          {log.length === 0 && (
            <p className="text-text-muted text-sm text-center py-8">Nenhum evento registrado</p>
          )}
          {log.map((entry, i) => (
            <div key={i} className="flex items-center text-xs px-4 py-3 border-b border-border/50">
              <span className="w-24 text-text-muted">{entry.ts}</span>
              <span className="w-16 text-text-secondary">{entry.source}</span>
              <span className="flex-1 text-text-secondary truncate">{entry.event}</span>
              <span className="w-20 text-right">{entry.ok ? '✅ OK' : '❌ Erro'}</span>
            </div>
          ))}
        </Card>
      </div>

    </motion.div>
  )
}

// ── Content Tab ──────────────────────────────────────────────────────────────
function ContentTab({ onToast }: { onToast: (msg: string) => void }) {
  const [pricing, setPricing] = useState<PricingConfig>(getPricing())
  const [coachOn, setCoachOn] = useState(isCoachEnabled())

  const toggleCoach = () => {
    const next = !coachOn
    setCoachEnabled(next)
    setCoachOn(next)
    onToast(next ? '✅ Cristina Virtual habilitada' : '⏸ Cristina Virtual desabilitada')
    setTimeout(() => window.location.reload(), 600)
  }
  const [editDay, setEditDay] = useState<number | null>(null)

  const getVisibility = (): Record<string, boolean> => {
    try { return JSON.parse(localStorage.getItem('nr_module_visibility') || '{}') } catch { return {} }
  }
  const [visibility, setVisibility] = useState<Record<string, boolean>>(getVisibility())

  const handlePricingSave = (updates: Partial<PricingConfig>) => {
    savePricing(updates)
    setPricing(getPricing())
    onToast('✅ Preços salvos')
  }

  const toggleModule = (id: string) => {
    const next = { ...visibility, [id]: !visibility[id] }
    localStorage.setItem('nr_module_visibility', JSON.stringify(next))
    setVisibility(next)
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Cristina Virtual toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary font-medium text-sm">Cristina Virtual (IA)</p>
            <p className="text-text-muted text-xs mt-0.5">
              {coachOn
                ? 'Habilitada — aparece no centro da nav e no plano Pro'
                : 'Desabilitada — centro da nav mostra Progresso'}
            </p>
          </div>
          <button onClick={toggleCoach} className="text-text-muted flex-shrink-0">
            {coachOn
              ? <ToggleRight size={32} className="text-primary" />
              : <ToggleLeft size={32} />}
          </button>
        </div>
      </Card>

      {/* Pricing editor */}
      <Card className="p-4 space-y-4">
        <p className="text-text-muted text-xs uppercase tracking-wider">Layer 1 — Protocolo</p>
        <PricingSection
          priceLabel="Preço"
          price={pricing.layer1Price}
          features={pricing.layer1Features.join('\n')}
          cta={pricing.layer1Cta}
          onSave={(price, features, cta) => handlePricingSave({
            layer1Price: price,
            layer1Features: features.split('\n').filter(Boolean),
            layer1Cta: cta,
          })}
        />
      </Card>

      <Card className="p-4 space-y-4">
        <p className="text-text-muted text-xs uppercase tracking-wider">Pro — Neuro Reconquista Pro</p>
        <PricingSection
          priceLabel="Preço mensal"
          price={pricing.proMonthly}
          features={pricing.proFeatures.join('\n')}
          cta={pricing.proCta}
          onSave={(price, features, cta) => handlePricingSave({
            proMonthly: price,
            proFeatures: features.split('\n').filter(Boolean),
            proCta: cta,
          })}
        />
        <div>
          <p className="text-text-muted text-xs mb-1">Preço anual</p>
          <AnnualPriceEditor value={pricing.proAnnual} onSave={v => handlePricingSave({ proAnnual: v })} />
        </div>
      </Card>

      {/* Protocol days editor */}
      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Dias do Protocolo</p>
        <div className="space-y-0 max-h-80 overflow-y-auto">
          <div className="flex text-text-muted text-[11px] py-2 border-b border-border">
            <span className="w-8">Dia</span>
            <span className="w-8">Sem.</span>
            <span className="flex-1">Título</span>
            <span className="w-16 text-right">Ações</span>
          </div>
          {PROTOCOL.flatMap(m => m.days).map(d => (
            <div key={d.day} className="flex items-center text-xs py-2.5 border-b border-border/50 gap-2">
              <span className="w-8 text-text-muted">{d.day}</span>
              <span className="w-8 text-text-muted">{d.module}</span>
              <span className="flex-1 text-text-secondary truncate">{t(d.titleKey)}</span>
              <button onClick={() => setEditDay(d.day)}
                className="text-primary text-xs underline flex-shrink-0">Editar</button>
            </div>
          ))}
        </div>
      </Card>

      {/* Module visibility */}
      <Card className="p-4">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Visibilidade dos Módulos Pro</p>
        <div className="space-y-2">
          {MODULES.map(mod => {
            const isVisible = visibility[mod.id] !== false
            return (
              <div key={mod.id} className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span>{mod.icon}</span>
                  <span className="text-text-secondary text-sm">{mod.titleFemaleTarget}</span>
                </div>
                <button onClick={() => toggleModule(mod.id)} className="text-text-muted">
                  {isVisible
                    ? <ToggleRight size={24} className="text-primary" />
                    : <ToggleLeft size={24} />}
                </button>
              </div>
            )
          })}
        </div>
      </Card>

      <AnimatePresence>
        {editDay !== null && (
          <DayEditModal
            day={editDay}
            onClose={() => setEditDay(null)}
            onSave={() => onToast(`✅ Dia ${editDay} salvo`)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PricingSection({ priceLabel, price, features, cta, onSave }: {
  priceLabel: string; price: string; features: string; cta: string
  onSave: (price: string, features: string, cta: string) => void
}) {
  const [p, setP] = useState(price)
  const [f, setF] = useState(features)
  const [c, setC] = useState(cta)
  return (
    <div className="space-y-3">
      <div>
        <p className="text-text-muted text-xs mb-1">{priceLabel}</p>
        <input value={p} onChange={e => setP(e.target.value)}
          className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm" />
      </div>
      <div>
        <p className="text-text-muted text-xs mb-1">Inclui (uma por linha)</p>
        <textarea value={f} onChange={e => setF(e.target.value)} rows={4}
          className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm resize-none" />
      </div>
      <div>
        <p className="text-text-muted text-xs mb-1">Texto do botão CTA</p>
        <input value={c} onChange={e => setC(e.target.value)}
          className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm" />
      </div>
      <Button size="sm" onClick={() => onSave(p, f, c)}>Salvar</Button>
    </div>
  )
}

function AnnualPriceEditor({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(value)
  return (
    <div className="flex gap-2">
      <input value={v} onChange={e => setV(e.target.value)}
        className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm" />
      <Button size="sm" onClick={() => onSave(v)}>Salvar</Button>
    </div>
  )
}

// ── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ users, setUsers, loading, onToast }: {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  loading: boolean
  onToast: (msg: string) => void
}) {
  const [banTarget, setBanTarget] = useState<User | null>(null)

  const updateUser = async (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u))
    if (isDemoSupabase()) {
      try {
        const stored = localStorage.getItem('nr_demo_user')
        if (stored) {
          const u = JSON.parse(stored)
          if (u.id === userId) localStorage.setItem('nr_demo_user', JSON.stringify({ ...u, ...updates }))
        }
      } catch { /* ignore */ }
    } else {
      await supabase.from('users').update(updates).eq('id', userId)
    }
  }

  const handleAction = async (action: string, userId: string) => {
    switch (action) {
      case 'grant-l1':
        await updateUser(userId, { protocol_access: true, protocol_source: 'manual' } as Partial<User>)
        onToast('✅ Layer 1 ativado')
        break
      case 'revoke-l1':
        await updateUser(userId, { protocol_access: false } as Partial<User>)
        onToast('Layer 1 revogado')
        break
      case 'grant-pro':
        await updateUser(userId, { pro_access: true } as Partial<User>)
        onToast('✅ Acesso Pro ativado')
        break
      case 'revoke-pro':
        await updateUser(userId, { pro_access: false } as Partial<User>)
        onToast('Acesso Pro revogado')
        break
      case 'unban':
        await updateUser(userId, { banned: false, ban_reason: undefined } as Partial<User>)
        onToast('✅ Usuário reativado')
        break
      case 'reset-progress': {
        if (!isDemoSupabase()) {
          await supabase.from('task_completions').delete().eq('user_id', userId)
        }
        onToast('✅ Progresso resetado')
        break
      }
    }
  }

  const handleBanConfirm = async (reason: string) => {
    if (!banTarget) return
    await updateUser(banTarget.id, { banned: true, ban_reason: reason } as Partial<User>)
    setBanTarget(null)
    onToast('Usuário banido')
  }

  return (
    <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {loading && <p className="text-text-muted text-center py-8">Carregando...</p>}
      {users.map(u => (
        <Card key={u.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-text-primary font-medium">{u.name || 'Sem nome'}</p>
              <p className="text-text-muted text-xs">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-wrap justify-end">
                {u.banned && <Badge variant="danger">Banido</Badge>}
                {u.pro_access && <Badge variant="gold">Pro</Badge>}
                {u.protocol_access && <Badge variant="primary">L1</Badge>}
              </div>
              <ActionDropdown user={u} onAction={handleAction} onBanClick={setBanTarget} />
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>🔥 {u.streak} dias</span>
            <span>📅 Dia {u.current_day}</span>
            <span>🎯 {u.anamnese_nivel || '—'}</span>
          </div>
        </Card>
      ))}
      <AnimatePresence>
        {banTarget && (
          <BanModal
            userName={banTarget.name || banTarget.email}
            onConfirm={handleBanConfirm}
            onClose={() => setBanTarget(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
const TABS: { key: Tab; icon: React.ReactNode; label: string }[] = [
  { key: 'users', icon: <Users size={14} />, label: 'Usuários' },
  { key: 'metrics', icon: <BarChart2 size={14} />, label: 'Métricas' },
  { key: 'content', icon: <FileText size={14} />, label: 'Conteúdo' },
  { key: 'payments', icon: <CreditCard size={14} />, label: 'Pagamentos' },
  { key: 'webhooks', icon: <Webhook size={14} />, label: 'Webhooks' },
]

export default function Admin() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('users')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const isAdmin = user && (ADMIN_EMAILS.includes(user.email) || user.email === 'demo@teste.com')

  useEffect(() => {
    if (!isAdmin) return
    if (isDemoSupabase()) {
      const stored = localStorage.getItem('nr_demo_user')
      if (stored) {
        try { setUsers([JSON.parse(stored)]) } catch { /* ignore */ }
      }
      return
    }
    setLoading(true)
    supabase.from('users').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUsers((data as User[]) || []); setLoading(false) }, () => setLoading(false))
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <Shield size={48} className="text-text-muted mx-auto mb-4" />
          <h2 className="font-display text-xl text-text-primary mb-2">Acesso Restrito</h2>
          <p className="text-text-muted text-sm mb-4">Área exclusiva para administradores.</p>
          <Button onClick={() => navigate('/home')}>Voltar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <Shield size={22} className="text-primary" />
          <h1 className="font-display text-xl font-bold text-text-primary">Admin</h1>
          <Badge variant="primary">Dashboard</Badge>
        </div>

        {/* Tab bar — horizontal scroll */}
        <div className="flex gap-0 mb-6 border-b border-border overflow-x-auto no-scrollbar">
          {TABS.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                tab === key
                  ? 'border-primary text-text-primary font-medium'
                  : 'border-transparent text-text-muted'
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <UsersTab users={users} setUsers={setUsers} loading={loading} onToast={setToast} />
        )}
        {tab === 'metrics' && <MetricsTab users={users} />}
        {tab === 'content' && <ContentTab onToast={setToast} />}
        {tab === 'payments' && <PaymentsTab />}
        {tab === 'webhooks' && <WebhooksTab onToast={setToast} />}
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User as UserIcon, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { t, setLang, getLang } from '../data/i18n'
import { useAuth } from '../hooks/useAuth'
import { useAppContext } from '../contexts/AppContext'
import { IMAGES } from '../lib/images'
import { Lang } from '../types'
import { getNextDemoRoute } from '../lib/demoFlow'

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
]

export default function Auth() {
  const navigate = useNavigate()
  const { signIn, signInWithMagicLink, signUp, signInDemo } = useAuth()
  const { language, setLanguage } = useAppContext()

  // 'magic' = magic link (primary), 'password' = password login (admin), 'signup' = create account
  const [mode, setMode] = useState<'magic' | 'password' | 'signup'>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)

  const handleLanguage = (l: Lang) => {
    setLanguage(l)
    setLang(l)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await signInWithMagicLink(email)
      if (err) {
        setError(t('auth.magic.error'))
        return
      }
      setMagicSent(true)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await signIn(email, password)
      if (err) {
        setError(t('auth.magic.error'))
        return
      }
      navigate(getNextDemoRoute())
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await signUp(email, password, name)
      if (err) {
        setError('Erro ao criar conta. Tente outro e-mail.')
        return
      }
      navigate(getNextDemoRoute())
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    signInDemo()
    navigate('/anamnese')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Language Selector */}
      <div className="flex justify-center gap-2 pt-5 px-6">
        {LANGS.map(l => (
          <button
            key={l.code}
            onClick={() => handleLanguage(l.code)}
            style={{
              outline: 'none',
              backgroundColor: language === l.code ? '#c8102e' : '#222222',
              color: language === l.code ? '#ffffff' : '#aaaaaa',
              border: 'none',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>

      {/* Hero */}
      <div
        className="relative flex-shrink-0 flex items-end p-6 mt-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.3) 0%, rgba(17,17,17,1) 100%), url(${IMAGES.auth})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '240px',
        }}
      >
        <div>
          <p className="text-text-muted text-sm mb-1">{t('app.tagline')}</p>
          <h1 className="font-display text-4xl font-bold text-text-primary leading-tight">
            {t('auth.title')} <br />
            <span className="text-primary">{t('auth.highlight')}</span>
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-6 max-w-md w-full mx-auto">

        <AnimatePresence mode="wait">
          {/* ── Magic link sent confirmation ── */}
          {magicSent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4 pt-4"
            >
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-success" />
              </div>
              <p className="text-text-primary font-display font-bold text-xl">{t('auth.magic.sent')}</p>
              <p className="text-text-muted text-sm">
                {email}
              </p>
              <button
                onClick={() => { setMagicSent(false); setEmail('') }}
                className="text-primary text-sm underline"
                style={{ outline: 'none' }}
              >
                {t('auth.magic.back')}
              </button>
            </motion.div>

          ) : mode === 'magic' ? (
            /* ── Magic link form (primary) ── */
            <motion.div key="magic" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <p className="text-text-muted text-sm mb-5 text-center">{t('auth.magic.desc')}</p>
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
                {error && <p className="text-danger text-sm text-center">{error}</p>}
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  {t('auth.magic.send')}
                </Button>
              </form>

              {/* Password login toggle for admins */}
              <p className="text-center text-xs text-text-muted mt-4">
                <button
                  onClick={() => { setMode('password'); setError('') }}
                  style={{ outline: 'none' }}
                  className="underline hover:text-text-secondary transition-colors"
                >
                  {t('auth.password.login')}
                </button>
              </p>
            </motion.div>

          ) : mode === 'password' ? (
            /* ── Password login (admin / fallback) ── */
            <motion.div key="password" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-10 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ outline: 'none' }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="text-danger text-sm text-center">{error}</p>}
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  {t('auth.login')}
                </Button>
              </form>
              <p className="text-center text-xs text-text-muted mt-4">
                <button
                  onClick={() => { setMode('magic'); setError('') }}
                  style={{ outline: 'none' }}
                  className="underline hover:text-text-secondary transition-colors"
                >
                  {t('auth.magic.back')}
                </button>
              </p>
            </motion.div>

          ) : (
            /* ── Sign up ── */
            <motion.div key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="relative">
                  <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder={t('auth.name')}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-10 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ outline: 'none' }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="text-danger text-sm text-center">{error}</p>}
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  {t('auth.signup')}
                </Button>
              </form>
              <p className="text-center text-sm text-text-muted mt-4">
                {t('auth.have.account')}{' '}
                <button
                  onClick={() => { setMode('magic'); setError('') }}
                  style={{ outline: 'none' }}
                  className="text-primary underline"
                >
                  {t('auth.login')}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!magicSent && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-text-muted text-xs">{t('auth.or')}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={handleDemo}
              style={{
                outline: 'none',
                width: '100%',
                padding: '14px 24px',
                borderRadius: '999px',
                border: '1px solid #c8102e',
                backgroundColor: 'transparent',
                color: '#c8102e',
                fontSize: '16px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '8px',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(200,16,46,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              🧪 {t('auth.demo')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

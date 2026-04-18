import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAppContext } from '../contexts/AppContext'
import { getNextDemoRoute } from '../lib/demoFlow'
import { t, setLang } from '../data/i18n'
import { Lang } from '../types'

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
]

export default function Preview() {
  const { signInDemo } = useAuth()
  const { language, setLanguage } = useAppContext()
  const navigate = useNavigate()

  const handleLanguage = (l: Lang) => {
    setLanguage(l)
    setLang(l)
  }

  useEffect(() => {
    signInDemo()
    navigate(getNextDemoRoute())
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Language Selector */}
      <div className="flex gap-2 mb-8">
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

      <div className="text-center">
        <div className="text-4xl mb-3">🧠</div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Neuro <span className="text-primary">Reconquista</span>
        </h1>
        <p className="text-text-muted text-sm mt-2">{t('common.loading')}</p>
      </div>
    </div>
  )
}

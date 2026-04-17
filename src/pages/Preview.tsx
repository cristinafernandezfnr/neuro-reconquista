import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getNextDemoRoute } from '../lib/demoFlow'

const PREVIEW_PASSWORD = 'neuro@preview2024'

export default function Preview() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const { signInDemo } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === PREVIEW_PASSWORD) {
      signInDemo()
      navigate(getNextDemoRoute())
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🧠</div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Neuro <span className="text-primary">Reconquista</span>
          </h1>
          <p className="text-text-muted text-sm mt-2">Acesso de prévia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            placeholder="Senha de acesso"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: error ? '1px solid #c8102e' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p className="text-primary text-sm text-center">Senha incorreta</p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: '#c8102e',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Acessar
          </button>
        </form>
      </div>
    </div>
  )
}

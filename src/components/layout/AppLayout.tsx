import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { BottomNav } from './BottomNav'

interface AppLayoutProps {
  children: React.ReactNode
  noPadding?: boolean
  headerRight?: React.ReactNode
}

function XpBadge() {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('nr_total_xp') || '0', 10))

  useEffect(() => {
    const sync = () => setXp(parseInt(localStorage.getItem('nr_total_xp') || '0', 10))
    window.addEventListener('nr_xp_updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('nr_xp_updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (xp === 0) return null

  return (
    <span
      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: '#e0a02015', color: '#e0a020', border: '1px solid #e0a02030' }}
    >
      ⚡ {xp} XP
    </span>
  )
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, noPadding, headerRight }) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <span className="font-display font-bold text-sm text-white tracking-tight">
            NEURO RECONQUISTA<span style={{ color: '#c8102e' }}> APP</span>
          </span>
          <div className="flex items-center gap-2">
            <XpBadge />
            {headerRight}
            <button
              onClick={() => navigate('/sos')}
              className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-pill text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              <AlertTriangle size={12} />
              SOS
            </button>
          </div>
        </div>
      </div>

      <main className={noPadding ? 'pb-20' : 'px-4 pt-4 pb-24 max-w-lg mx-auto'}>
        {children}
      </main>

      <BottomNav />
    </div>
  )
}

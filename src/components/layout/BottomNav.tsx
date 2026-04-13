import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, CheckSquare, BookOpen, User, BarChart2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { t } from '../../data/i18n'
import { isCoachEnabled } from '../../lib/coachFlag'

const LEFT_ITEMS = [
  { path: '/home', icon: Home, labelKey: 'nav.home' },
  { path: '/tasks', icon: CheckSquare, labelKey: 'nav.tasks' },
]

const RIGHT_ITEMS = [
  { path: '/modules', icon: BookOpen, labelKey: 'nav.modules' },
  { path: '/profile', icon: User, labelKey: 'nav.profile' },
]

export const BottomNav: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const coachEnabled = isCoachEnabled()
  const [unread, setUnread] = useState(() =>
    parseInt(localStorage.getItem('nr_cristina_unread') || '0', 10)
  )

  useEffect(() => {
    const sync = () => setUnread(parseInt(localStorage.getItem('nr_cristina_unread') || '0', 10))
    window.addEventListener('storage', sync)
    window.addEventListener('nr_cristina_updated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('nr_cristina_updated', sync)
    }
  }, [])

  const isCoach = pathname === '/coach'
  const isProgress = pathname === '/progress'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">

        {/* Left items */}
        {LEFT_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors',
                isActive ? 'text-primary' : 'text-text-muted'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
            </button>
          )
        })}

        {/* Center button: Cristina (enabled) or Progresso (disabled) */}
        {coachEnabled ? (
          <button
            onClick={() => navigate('/coach')}
            className="relative flex flex-col items-center flex-1"
          >
            <div className="relative" style={{ marginTop: '-20px' }}>
              <div
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center transition-all',
                  'shadow-[0_0_20px_rgba(200,16,46,0.4)]',
                  isCoach ? 'bg-primary scale-110' : 'bg-primary'
                )}
              >
                <span
                  className="text-white font-bold leading-none select-none"
                  style={{ fontFamily: 'Syne, sans-serif', fontSize: 22 }}
                >
                  C
                </span>
              </div>
              {unread > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center z-10">
                  <span className="text-black text-[9px] font-bold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                </div>
              )}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium mt-0.5',
                isCoach ? 'text-primary' : 'text-text-muted'
              )}
            >
              Cristina
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/progress')}
            className="relative flex flex-col items-center flex-1"
          >
            <div className="relative" style={{ marginTop: '-20px' }}>
              <div
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center transition-all',
                  'shadow-[0_0_20px_rgba(200,16,46,0.3)]',
                  isProgress ? 'bg-primary scale-110' : 'bg-primary'
                )}
              >
                <BarChart2 size={24} className="text-white" />
              </div>
            </div>
            <span
              className={cn(
                'text-[10px] font-medium mt-0.5',
                isProgress ? 'text-primary' : 'text-text-muted'
              )}
            >
              Progresso
            </span>
          </button>
        )}

        {/* Right items */}
        {RIGHT_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors',
                isActive ? 'text-primary' : 'text-text-muted'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
            </button>
          )
        })}

      </div>
    </nav>
  )
}

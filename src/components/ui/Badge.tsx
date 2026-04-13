import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'gold' | 'success' | 'surface' | 'danger'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'surface', className }) => (
  <span className={cn(
    'inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium',
    {
      'bg-primary/20 text-primary': variant === 'primary',
      'bg-gold/20 text-gold': variant === 'gold',
      'bg-success/20 text-success': variant === 'success',
      'bg-surface text-text-secondary': variant === 'surface',
      'bg-danger/20 text-danger': variant === 'danger',
    },
    className
  )}>
    {children}
  </span>
)

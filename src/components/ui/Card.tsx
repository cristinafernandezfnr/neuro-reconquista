import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className, elevated, onClick }) => (
  <div
    className={cn(
      'rounded-xl border border-border',
      elevated ? 'bg-card-elevated' : 'bg-card',
      onClick && 'cursor-pointer active:scale-98 transition-transform',
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
)

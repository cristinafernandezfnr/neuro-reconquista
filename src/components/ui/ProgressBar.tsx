import React from 'react'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  color?: string
  className?: string
  height?: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = '#c8102e', className, height = 4 }) => (
  <div className={cn('w-full bg-border rounded-pill overflow-hidden', className)} style={{ height }}>
    <div
      className="h-full rounded-pill transition-all duration-500"
      style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
    />
  </div>
)

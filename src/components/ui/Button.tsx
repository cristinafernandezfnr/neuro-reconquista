import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', fullWidth, loading, children, className, disabled, ...props
}) => {
  return (
    <button
      className={cn(
        'font-sans font-medium rounded-pill transition-all duration-200 active:scale-95 flex items-center justify-center gap-2',
        {
          'bg-primary hover:bg-primary-hover text-white': variant === 'primary',
          'bg-card hover:bg-card-elevated text-text-primary border border-border': variant === 'secondary',
          'bg-transparent text-text-secondary hover:text-text-primary': variant === 'ghost',
          'bg-danger hover:bg-red-700 text-white': variant === 'danger',
          'bg-gold hover:bg-gold-light text-black': variant === 'gold',
          'text-sm px-4 py-2': size === 'sm',
          'text-base px-6 py-3': size === 'md',
          'text-lg px-8 py-4': size === 'lg',
          'w-full': fullWidth,
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

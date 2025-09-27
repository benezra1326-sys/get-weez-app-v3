import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 'md', text = 'Loading...', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]}`}
        style={{ color: 'var(--color-primary)' }}
      />
      {text && (
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {text}
        </p>
      )}
    </div>
  )
}

// Variantes spécialisées
export function ChatLoadingSpinner() {
  return (
    <div className="flex justify-start mb-4">
      <div 
        className="bg-gray-700 text-gray-100 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="flex items-center space-x-2">
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <span className="text-sm">Get Weez is typing...</span>
        </div>
      </div>
    </div>
  )
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Loading Get Weez...
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Preparing your luxury experience
        </p>
      </div>
    </div>
  )
}

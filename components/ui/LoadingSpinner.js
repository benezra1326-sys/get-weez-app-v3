import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ 
  size = 'default', 
  variant = 'default',
  className = '',
  text = ''
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const variantClasses = {
    default: 'text-gray-500',
    chat: 'text-gray-400',
    page: 'text-white',
    muted: 'text-gray-400'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}
      />
      {text && (
        <p className={`mt-2 text-sm ${variantClasses[variant]}`}>
          {text}
        </p>
      )}
    </div>
  )
}

// Composants spécialisés
export function ChatLoadingSpinner({ text = 'Get Weez vous prépare une réponse...' }) {
  return (
    <LoadingSpinner 
      size="default" 
      variant="chat" 
      text={text}
      className="p-4"
    />
  )
}

export function PageLoadingSpinner({ text = 'Chargement...' }) {
  return (
    <LoadingSpinner 
      size="large" 
      variant="page" 
      text={text}
      className="py-12"
    />
  )
}
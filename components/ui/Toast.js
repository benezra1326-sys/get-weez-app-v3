import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  position = 'top-right'
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: {
      bg: 'var(--color-success)',
      text: 'white',
      border: 'var(--color-success)'
    },
    error: {
      bg: 'var(--color-error)',
      text: 'white',
      border: 'var(--color-error)'
    },
    warning: {
      bg: 'var(--color-warning)',
      text: 'white',
      border: 'var(--color-warning)'
    },
    info: {
      bg: 'var(--color-info)',
      text: 'white',
      border: 'var(--color-info)'
    }
  }

  const Icon = icons[type]
  const colorScheme = colors[type]

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${
        position === 'top-right' ? 'top-4 right-4' :
        position === 'top-left' ? 'top-4 left-4' :
        position === 'bottom-right' ? 'bottom-4 right-4' :
        'bottom-4 left-4'
      }`}
    >
      <div 
        className="flex items-center p-4 rounded-xl shadow-lg max-w-sm"
        style={{
          backgroundColor: colorScheme.bg,
          border: `1px solid ${colorScheme.border}`,
          color: colorScheme.text
        }}
      >
        <Icon size={20} className="mr-3 flex-shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="ml-3 p-1 rounded-lg hover:bg-black/20 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Hook pour utiliser les toasts
export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now()
    const toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    return id
  }

  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  )

  return {
    showToast,
    hideToast,
    ToastContainer,
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
  }
}

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export function Toast({ 
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

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/90',
      borderColor: 'border-green-400',
      iconColor: 'text-green-100'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500/90',
      borderColor: 'border-red-400',
      iconColor: 'text-red-100'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/90',
      borderColor: 'border-yellow-400',
      iconColor: 'text-yellow-100'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/90',
      borderColor: 'border-blue-400',
      iconColor: 'text-blue-100'
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  return (
    <div 
      className={`fixed z-50 max-w-sm w-full ${positionClasses[position]} transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className={`
        ${config.bgColor} ${config.borderColor} border backdrop-blur-sm rounded-lg shadow-lg p-4
        flex items-start space-x-3
      `}>
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium break-words">
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Hook pour utiliser facilement les toasts
export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString()
    const toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = ({ position = 'top-right' }) => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )

  return {
    showToast,
    removeToast,
    ToastContainer
  }
}
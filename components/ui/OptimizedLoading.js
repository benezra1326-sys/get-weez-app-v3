import { memo } from 'react'

// Composant de chargement optimisé avec animations fluides
const OptimizedLoading = memo(({ 
  size = 'medium', 
  variant = 'spinner', 
  text = 'Chargement...',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  }

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div 
          className={`${sizeClasses[size]} border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin`}
          style={{
            animation: 'spin 1s linear infinite'
          }}
        />
        {text && (
          <p className={`mt-2 text-gray-600 ${textSizes[size]}`}>
            {text}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        {text && (
          <span className={`ml-2 text-gray-600 ${textSizes[size]}`}>
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div 
          className={`${sizeClasses[size]} bg-gray-600 rounded-full animate-pulse`}
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
        {text && (
          <p className={`mt-2 text-gray-600 ${textSizes[size]}`}>
            {text}
          </p>
        )}
      </div>
    )
  }

  return null
})

OptimizedLoading.displayName = 'OptimizedLoading'

export default OptimizedLoading


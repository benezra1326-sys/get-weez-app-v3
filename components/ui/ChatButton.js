import React, { memo, useCallback } from 'react'
import styles from '../../styles/ChatInterface.module.css'
import useChatTheme from '../../hooks/useChatTheme'

/**
 * Composant ChatButton générique et optimisé
 * Bouton réutilisable avec différents styles et états
 */
const ChatButton = memo(({ 
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  style = {},
  ...props 
}) => {
  const { buttonStyles } = useChatTheme()

  // Tailles
  const sizes = {
    small: 'p-2 text-xs',
    medium: 'p-2 lg:p-3 text-sm',
    large: 'p-3 lg:p-4 text-base',
    input: 'p-2 lg:p-4' // Spécial pour les boutons dans l'input
  }

  const iconSizes = {
    small: 12,
    medium: 14,
    large: 16,
    input: 14
  }

  const currentSize = sizes[size] || sizes.medium
  const currentIconSize = iconSizes[size] || iconSizes.medium

  const handleClick = useCallback((e) => {
    if (disabled || loading) return
    onClick?.(e)
  }, [onClick, disabled, loading])

  // Styles basés sur le variant
  const getVariantStyle = useCallback(() => {
    const variantStyle = buttonStyles[variant] || buttonStyles.primary
    return disabled || loading ? buttonStyles.secondary : variantStyle
  }, [variant, disabled, loading, buttonStyles])

  const currentStyle = getVariantStyle()

  const baseClasses = `
    ${styles.button}
    ${currentSize}
    flex
    items-center
    justify-center
    gap-2
    transition-all
    duration-300
  `

  const disabledClasses = (disabled || loading) 
    ? styles.buttonDisabled 
    : ''

  // Rendu conditionnel de l'icône
  const renderIcon = () => {
    if (loading) {
      return (
        <svg 
          width={currentIconSize} 
          height={currentIconSize} 
          className="animate-spin" 
          viewBox="0 0 24 24"
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray="32" 
            strokeDashoffset="32"
          >
            <animate 
              attributeName="stroke-dashoffset" 
              dur="1s" 
              repeatCount="indefinite" 
              values="32;0"
            />
          </circle>
        </svg>
      )
    }
    
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, { size: currentIconSize })
    }
    
    return icon
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      style={{
        backgroundColor: currentStyle.background,
        color: currentStyle.color,
        boxShadow: currentStyle.boxShadow,
        ...style
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return
        const hoverStyle = currentStyle.hover
        if (hoverStyle) {
          e.target.style.backgroundColor = hoverStyle.background
          e.target.style.boxShadow = hoverStyle.boxShadow
        }
      }}
      onMouseLeave={(e) => {
        if (disabled || loading) return
        e.target.style.backgroundColor = currentStyle.background
        e.target.style.boxShadow = currentStyle.boxShadow
      }}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children && <span>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </button>
  )
})

ChatButton.displayName = 'ChatButton'

export default ChatButton
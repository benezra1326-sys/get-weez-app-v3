import React, { memo, useCallback } from 'react'
import useChatTheme from '../../hooks/useChatTheme'

/**
 * Composant FilterButton réutilisable et optimisé
 * Bouton de filtre avec état actif/inactif et styles thématiques
 */
const FilterButton = memo(({ 
  children,
  isActive = false,
  onClick,
  variant = 'default',
  size = 'medium',
  className = '',
  disabled = false,
  ...props 
}) => {
  const { isDarkMode, buttonStyles } = useChatTheme()

  // Variants de couleurs
  const variants = {
    default: {
      active: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
    },
    purple: {
      active: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
    },
    green: {
      active: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
    },
    amber: {
      active: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
    }
  }

  // Tailles
  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-sm',
    large: 'px-6 py-4 text-base'
  }

  const currentVariant = variants[variant] || variants.default
  const currentSize = sizes[size] || sizes.medium

  const handleClick = useCallback((e) => {
    if (disabled) return
    onClick?.(e)
  }, [onClick, disabled])

  const baseClasses = `
    ${currentSize}
    rounded-xl
    font-semibold
    transition-all
    duration-300
    text-center
    shadow-lg
    hover:shadow-xl
    flex
    items-center
    justify-center
    border-none
    cursor-pointer
  `

  const stateClasses = isActive 
    ? `${currentVariant.active} shadow-lg` 
    : `${currentVariant.inactive} hover:bg-opacity-80`

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : ''

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

FilterButton.displayName = 'FilterButton'

export default FilterButton
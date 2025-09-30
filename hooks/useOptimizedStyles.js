import { useMemo, useCallback } from 'react'
import { useTheme } from './useTheme'

/**
 * Hook pour optimiser les styles conditionnels et éviter les recalculs
 */
export const useOptimizedStyles = () => {
  const { isDarkMode } = useTheme()

  // Styles de base memoizés
  const baseStyles = useMemo(() => ({
    primary: isDarkMode ? '#0D0D0D' : '#FFFFFF',
    secondary: isDarkMode ? '#1A1A1A' : '#F9FAFB',
    tertiary: isDarkMode ? '#2D2D2D' : '#F3F4F6',
    textPrimary: isDarkMode ? '#FFFFFF' : '#1F2937',
    textSecondary: isDarkMode ? '#D1D5DB' : '#6B7280',
    border: isDarkMode ? '#374151' : '#E5E7EB',
    accentBlue: '#3B82F6',
    accentPurple: '#8B5CF6',
    accentTeal: '#14B8A6'
  }), [isDarkMode])

  // Générateur de styles pour les boutons
  const getButtonStyle = useCallback((variant = 'primary', size = 'md') => {
    const sizeMap = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    const variantMap = {
      primary: `bg-blue-600 hover:bg-blue-700 text-white`,
      secondary: `bg-gray-600 hover:bg-gray-700 text-white`,
      success: `bg-green-600 hover:bg-green-700 text-white`,
      danger: `bg-red-600 hover:bg-red-700 text-white`,
      outline: `border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white`
    }

    return `${sizeMap[size]} ${variantMap[variant]} rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5`
  }, [])

  // Générateur de styles pour les cartes
  const getCardStyle = useCallback((variant = 'default') => {
    const base = `rounded-xl border transition-all duration-300 cursor-pointer`
    
    const variantMap = {
      default: `border-gray-600 hover:border-blue-500 bg-gray-800/50`,
      highlight: `border-blue-500 bg-blue-600/20`,
      success: `border-green-500 bg-green-600/20`,
      warning: `border-yellow-500 bg-yellow-600/20`
    }

    return `${base} ${variantMap[variant]} hover:scale-105 hover:shadow-xl`
  }, [])

  // Style pour les gradients optimisés
  const gradients = useMemo(() => ({
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    teal: 'bg-gradient-to-r from-teal-600 to-cyan-600',
    amber: 'bg-gradient-to-r from-amber-600 to-orange-600',
    rose: 'bg-gradient-to-r from-rose-600 to-pink-600',
    green: 'bg-gradient-to-r from-green-600 to-emerald-600'
  }), [])

  // Générateur d'animations
  const getAnimationClass = useCallback((animation, duration = '300ms') => {
    return `transition-all duration-${duration.replace('ms', '')} ease-out`
  }, [])

  // Styles pour les messages
  const messageStyles = useMemo(() => ({
    user: {
      container: 'flex justify-end mb-4',
      bubble: 'max-w-[70%] px-4 py-3 rounded-2xl rounded-br-md bg-teal-600 text-white shadow-lg'
    },
    assistant: {
      container: 'flex justify-start mb-4',
      bubble: `max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-md border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-lg`
    }
  }), [isDarkMode])

  // Event handlers optimisés pour hover sans inline functions
  const createHoverHandler = useCallback((normalStyle, hoverStyle) => {
    return {
      onMouseEnter: (e) => Object.assign(e.target.style, hoverStyle),
      onMouseLeave: (e) => Object.assign(e.target.style, normalStyle)
    }
  }, [])

  return {
    baseStyles,
    getButtonStyle,
    getCardStyle,
    gradients,
    getAnimationClass,
    messageStyles,
    createHoverHandler,
    isDarkMode
  }
}

/**
 * Hook pour les classes CSS conditionnelles
 */
export const useConditionalClasses = (...classes) => {
  return useMemo(() => {
    return classes.filter(Boolean).join(' ')
  }, [classes])
}
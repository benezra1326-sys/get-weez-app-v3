import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContextSimple'

/**
 * Hook personnalisé pour la gestion des styles de thème du chat
 * Centralise tous les styles dynamiques basés sur le thème
 */
export const useChatTheme = () => {
  const { isDarkMode } = useTheme()

  // Styles principaux mémorisés
  const themeStyles = useMemo(() => ({
    // Couleurs principales
    background: isDarkMode ? '#0D0D0D' : '#FFFFFF',
    surface: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    surfaceSecondary: isDarkMode ? '#2D2D2D' : '#F3F4F6',
    border: isDarkMode ? '#2D2D2D' : '#E5E7EB',
    borderHover: isDarkMode ? '#374151' : '#D1D5DB',
    
    // Textes
    textPrimary: isDarkMode ? '#FFFFFF' : '#1F2937',
    textSecondary: isDarkMode ? '#D1D5DB' : '#6B7280',
    textTertiary: isDarkMode ? '#9CA3AF' : '#9CA3AF',
    
    // États interactifs
    hover: isDarkMode ? '#374151' : '#F9FAFB',
    active: isDarkMode ? '#4B5563' : '#F3F4F6',
    
    // Messages
    userMessage: '#14B8A6',
    assistantMessage: isDarkMode ? '#2D2D2D' : '#F9FAFB',
    assistantBorder: isDarkMode ? '#374151' : '#E5E7EB',
    
    // Input
    inputBackground: isDarkMode ? '#2D2D2D' : '#F9FAFB',
    inputBorder: isDarkMode ? '#374151' : '#D1D5DB',
    inputFocus: '#3B82F6',
    
    // Overlay
    overlay: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(17, 24, 39, 0.2)',
    backdropBlur: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'
  }), [isDarkMode])

  // Classes CSS conditionnelles
  const themeClasses = useMemo(() => ({
    main: isDarkMode ? 'dark' : 'light',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      tertiary: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    background: {
      primary: isDarkMode ? 'bg-gray-900' : 'bg-white',
      secondary: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
      surface: isDarkMode ? 'bg-gray-800' : 'bg-white'
    },
    border: {
      primary: isDarkMode ? 'border-gray-700' : 'border-gray-200',
      secondary: isDarkMode ? 'border-gray-600' : 'border-gray-300'
    }
  }), [isDarkMode])

  // Styles pour les boutons
  const buttonStyles = useMemo(() => ({
    primary: {
      background: 'linear-gradient(to right, #3B82F6, #2563EB)',
      color: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      hover: {
        background: 'linear-gradient(to right, #2563EB, #1D4ED8)',
        boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
      }
    },
    secondary: {
      background: '#6B7280',
      color: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(107, 114, 128, 0.3)',
      hover: {
        background: '#4B5563',
        boxShadow: '0 4px 12px rgba(107, 114, 128, 0.4)'
      }
    },
    danger: {
      background: '#DC2626',
      color: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
      hover: {
        background: '#B91C1C',
        boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)'
      }
    },
    ghost: {
      background: 'transparent',
      color: isDarkMode ? '#D1D5DB' : '#6B7280',
      border: `1px solid ${isDarkMode ? '#374151' : '#D1D5DB'}`,
      hover: {
        background: isDarkMode ? '#374151' : '#F9FAFB',
        color: isDarkMode ? '#FFFFFF' : '#374151'
      }
    }
  }), [isDarkMode])

  // Styles pour les cartes de suggestions
  const cardGradients = useMemo(() => ({
    blue: isDarkMode 
      ? 'linear-gradient(135deg, #1e3a8a, #1e40af, #2563eb)'
      : 'linear-gradient(135deg, #dbeafe, #bfdbfe, #93c5fd)',
    purple: isDarkMode
      ? 'linear-gradient(135deg, #581c87, #7c3aed, #8b5cf6)'
      : 'linear-gradient(135deg, #f3e8ff, #e9d5ff, #d8b4fe)',
    green: isDarkMode
      ? 'linear-gradient(135deg, #14532d, #16a34a, #22c55e)'
      : 'linear-gradient(135deg, #dcfce7, #bbf7d0, #86efac)',
    amber: isDarkMode
      ? 'linear-gradient(135deg, #92400e, #d97706, #f59e0b)'
      : 'linear-gradient(135deg, #fef3c7, #fed7aa, #fbbf24)',
    rose: isDarkMode
      ? 'linear-gradient(135deg, #9f1239, #e11d48, #f43f5e)'
      : 'linear-gradient(135deg, #ffe4e6, #fecaca, #fca5a5)',
    teal: isDarkMode
      ? 'linear-gradient(135deg, #134e4a, #0d9488, #14b8a6)'
      : 'linear-gradient(135deg, #f0fdfa, #ccfbf1, #99f6e4)',
    indigo: isDarkMode
      ? 'linear-gradient(135deg, #312e81, #4338ca, #6366f1)'
      : 'linear-gradient(135deg, #e0e7ff, #c7d2fe, #a5b4fc)'
  }), [isDarkMode])

  // Fonction helper pour générer des styles inline
  const getInlineStyles = useMemo(() => ({
    container: {
      backgroundColor: themeStyles.background,
      color: themeStyles.textPrimary
    },
    surface: {
      backgroundColor: themeStyles.surface,
      borderColor: themeStyles.border
    },
    input: {
      backgroundColor: themeStyles.inputBackground,
      borderColor: themeStyles.inputBorder,
      color: themeStyles.textPrimary
    },
    userMessage: {
      backgroundColor: themeStyles.userMessage,
      color: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)'
    },
    assistantMessage: {
      backgroundColor: themeStyles.assistantMessage,
      borderColor: themeStyles.assistantBorder,
      color: themeStyles.textPrimary,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    overlay: {
      backgroundColor: themeStyles.overlay,
      backdropFilter: 'blur(8px)'
    },
    mobilePanel: {
      backgroundColor: themeStyles.backdropBlur,
      borderColor: themeStyles.border
    }
  }), [themeStyles])

  return {
    isDarkMode,
    themeStyles,
    themeClasses,
    buttonStyles,
    cardGradients,
    getInlineStyles
  }
}

export default useChatTheme

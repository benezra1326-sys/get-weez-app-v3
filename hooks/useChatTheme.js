import { useTheme } from './useTheme'

/**
 * Hook personnalisé pour le thème du chat
 * Étend le hook useTheme de base avec des classes spécifiques au chat
 */
export function useChatTheme() {
  const { isDarkMode, toggleTheme, isLoaded } = useTheme()

  // Classes de thème spécifiques au chat
  const themeClasses = {
    // Conteneurs principaux
    main: isDarkMode 
      ? 'bg-gray-900 text-white' 
      : 'bg-white text-gray-900',
    
    // Surfaces
    surface: isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-gray-50 border-gray-200',
    
    surfaceElevated: isDarkMode 
      ? 'bg-gray-700 border-gray-600' 
      : 'bg-white border-gray-300',
    
    // Messages
    message: {
      user: isDarkMode 
        ? 'bg-blue-600 text-white' 
        : 'bg-blue-500 text-white',
      assistant: isDarkMode 
        ? 'bg-gray-700 text-gray-100' 
        : 'bg-gray-100 text-gray-900',
      system: isDarkMode 
        ? 'bg-yellow-900 text-yellow-100' 
        : 'bg-yellow-50 text-yellow-800'
    },
    
    // Textes
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      tertiary: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      muted: isDarkMode ? 'text-gray-500' : 'text-gray-400'
    },
    
    // Inputs
    input: isDarkMode 
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    
    inputFocus: isDarkMode 
      ? 'border-blue-500 ring-blue-500' 
      : 'border-blue-500 ring-blue-500',
    
    // Boutons
    button: {
      primary: isDarkMode 
        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
        : 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: isDarkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300',
      danger: isDarkMode 
        ? 'bg-red-600 hover:bg-red-700 text-white' 
        : 'bg-red-500 hover:bg-red-600 text-white',
      ghost: isDarkMode 
        ? 'text-gray-300 hover:bg-gray-800' 
        : 'text-gray-600 hover:bg-gray-100'
    },
    
    // Sidebar
    sidebar: isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-gray-50 border-gray-200',
    
    // Scrollbar
    scrollbar: isDarkMode 
      ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800' 
      : 'scrollbar-thumb-gray-400 scrollbar-track-gray-100',
    
    // Mobile specific
    mobileToolbar: isDarkMode 
      ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
      : 'bg-white/90 backdrop-blur-sm border-gray-200'
  }

  // Styles inline pour certains éléments
  const getInlineStyles = (variant = 'default') => {
    const baseStyles = {
      default: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#111827',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb'
      },
      surface: {
        backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
        color: isDarkMode ? '#f9fafb' : '#111827',
        borderColor: isDarkMode ? '#374151' : '#d1d5db'
      },
      elevated: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        color: isDarkMode ? '#f9fafb' : '#111827',
        borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
      }
    }
    
    return baseStyles[variant] || baseStyles.default
  }

  return {
    isDarkMode,
    toggleTheme,
    isLoaded,
    themeClasses,
    getInlineStyles
  }
}

export default useChatTheme
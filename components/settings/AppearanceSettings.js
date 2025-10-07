import { useState, useEffect } from 'react'
import { Palette, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useTranslation } from 'react-i18next'

export default function AppearanceSettings() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const [themeMode, setThemeMode] = useState('auto')

  useEffect(() => {
    const saved = localStorage.getItem('getweez-theme-mode')
    if (saved) {
      setThemeMode(saved)
    }
  }, [])

  const handleThemeChange = (mode) => {
    setThemeMode(mode)
    localStorage.setItem('getweez-theme-mode', mode)
    
    if (mode === 'light' || mode === 'dark') {
      // Force le thème spécifique
      if ((mode === 'dark' && !isDarkMode) || (mode === 'light' && isDarkMode)) {
        toggleTheme()
      }
    } else if (mode === 'auto') {
      // Utilise la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if ((prefersDark && !isDarkMode) || (!prefersDark && isDarkMode)) {
        toggleTheme()
      }
    }
  }

  const themeOptions = [
    {
      key: 'light',
      title: t('settings.appearance.light'),
      icon: <Sun size={20} className="text-yellow-500" />,
      description: 'Thème clair'
    },
    {
      key: 'dark',
      title: t('settings.appearance.dark'),
      icon: <Moon size={20} className="text-gray-500" />,
      description: 'Thème sombre'
    },
    {
      key: 'auto',
      title: t('settings.appearance.auto'),
      icon: <Monitor size={20} className="text-gray-500" />,
      description: 'Suit les préférences système'
    }
  ]

  return (
    <div 
      className="rounded-2xl p-6 border backdrop-blur-md h-full"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <div 
          className="p-3 rounded-xl mr-4"
          style={{
            background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
            boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)'
          }}
        >
          <Palette size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {t('settings.appearance.title')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            {t('settings.appearance.subtitle')}
          </p>
        </div>
      </div>

      {/* Options de thème */}
      <div className="space-y-3">
        {themeOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleThemeChange(option.key)}
            className={`w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
              themeMode === option.key ? 'scale-105' : ''
            }`}
            style={{
              background: themeMode === option.key
                ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                : isDarkMode 
                  ? 'rgba(55, 65, 81, 0.5)'
                  : 'rgba(255, 255, 255, 0.8)',
              borderColor: themeMode === option.key
                ? 'rgba(192, 192, 192, 0.5)'
                : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
              color: themeMode === option.key
                ? 'white'
                : isDarkMode ? '#FFFFFF' : '#1F2937',
              boxShadow: themeMode === option.key
                ? '0 4px 15px rgba(192, 192, 192, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center space-x-3">
              {option.icon}
              <div className="text-left">
                <div className="font-semibold text-sm mb-1">{option.title}</div>
                <div 
                  className="text-xs"
                  style={{ 
                    color: themeMode === option.key 
                      ? 'rgba(255, 255, 255, 0.8)' 
                      : isDarkMode ? '#9CA3AF' : '#6B7280' 
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Aperçu du thème actuel */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{
          background: isDarkMode 
            ? 'rgba(192, 192, 192, 0.1)'
            : 'rgba(192, 192, 192, 0.05)',
          border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.2)'}`
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Palette size={16} className="text-gray-500" />
          <span 
            className="font-semibold text-sm"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Aperçu
          </span>
        </div>
        <div 
          className="text-xs"
          style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
        >
          Thème actuel: <strong>{isDarkMode ? 'Sombre' : 'Clair'}</strong>
        </div>
        <div 
          className="text-xs mt-1"
          style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
        >
          Mode sélectionné: <strong>{themeOptions.find(o => o.key === themeMode)?.title}</strong>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import Link from 'next/link'
import { Settings, Palette, Sun, Moon, Monitor, Shield, Zap, Lock, Info } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function SimpleSettings() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [themeMode, setThemeMode] = useState('auto')

  const handleThemeChange = (mode) => {
    setThemeMode(mode)
    localStorage.setItem('getweez-theme-mode', mode)
    
    if (mode === 'light' || mode === 'dark') {
      if ((mode === 'dark' && !isDarkMode) || (mode === 'light' && isDarkMode)) {
        toggleTheme()
      }
    }
  }

  const clearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name))
      })
    }
    localStorage.removeItem('getweez-cache')
    alert('Cache vidé avec succès !')
  }

  return (
    <div 
      className="rounded-2xl p-6 border backdrop-blur-md"
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
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}
        >
          <Settings size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Réglages Rapides
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Configuration essentielle
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Thème */}
        <div 
          className="p-4 rounded-xl border"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Palette size={18} className="text-purple-500" />
              <span 
                className="font-semibold text-sm"
                style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
              >
                Thème
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'light', icon: <Sun size={16} />, label: 'Clair' },
              { key: 'dark', icon: <Moon size={16} />, label: 'Sombre' },
              { key: 'auto', icon: <Monitor size={16} />, label: 'Auto' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleThemeChange(option.key)}
                className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  themeMode === option.key ? 'scale-105' : ''
                }`}
                style={{
                  background: themeMode === option.key
                    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                    : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 0.8)',
                  color: themeMode === option.key ? 'white' : isDarkMode ? '#D1D5DB' : '#374151'
                }}
              >
                <div className="flex flex-col items-center space-y-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={clearCache}
            className="p-3 rounded-xl border transition-all duration-200 hover:scale-105"
            style={{
              background: isDarkMode 
                ? 'rgba(55, 65, 81, 0.5)'
                : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
            }}
          >
            <div className="flex items-center space-x-3">
              <Zap size={18} className="text-orange-500" />
              <div className="text-left">
                <div 
                  className="font-semibold text-sm"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  Vider le cache
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  Libérer de l'espace
                </div>
              </div>
            </div>
          </button>

          <Link href="/settings" className="block">
            <div
              className="p-3 rounded-xl border transition-all duration-200 hover:scale-105"
              style={{
                background: isDarkMode 
                  ? 'rgba(55, 65, 81, 0.5)'
                  : 'rgba(255, 255, 255, 0.8)',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
              }}
            >
              <div className="flex items-center space-x-3">
                <Settings size={18} className="text-blue-500" />
                <div className="text-left">
                  <div 
                    className="font-semibold text-sm"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                  >
                    Réglages avancés
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  >
                    Configuration complète
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Version */}
        <div 
          className="p-3 rounded-xl text-center"
          style={{
            background: isDarkMode 
              ? 'rgba(59, 130, 246, 0.1)'
              : 'rgba(59, 130, 246, 0.05)',
            border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
          }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Info size={14} className="text-blue-500" />
            <span 
              className="text-xs font-medium"
              style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
            >
              Get Weez v1.2.3
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

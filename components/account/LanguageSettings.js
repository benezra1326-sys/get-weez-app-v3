import { useState, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function LanguageSettings() {
  const { isDarkMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [autoDetect, setAutoDetect] = useState(true)

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ]

  useEffect(() => {
    const savedAutoDetect = localStorage.getItem('getweez-auto-detect-language')
    if (savedAutoDetect !== null) {
      setAutoDetect(JSON.parse(savedAutoDetect))
    }
  }, [])

  const [currentLanguage, setCurrentLanguage] = useState('fr')

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode)
    setAutoDetect(false)
    localStorage.setItem('getweez-auto-detect-language', 'false')
    localStorage.setItem('getweez-language', languageCode)
    setIsOpen(false)
  }

  const handleAutoDetectToggle = () => {
    const newAutoDetect = !autoDetect
    setAutoDetect(newAutoDetect)
    localStorage.setItem('getweez-auto-detect-language', JSON.stringify(newAutoDetect))
    
    if (newAutoDetect) {
      // Réactiver la détection automatique
      const browserLang = navigator.language.split('-')[0]
      const supportedLang = languages.find(lang => lang.code === browserLang)
      if (supportedLang) {
        setCurrentLanguage(supportedLang.code)
        localStorage.setItem('getweez-language', supportedLang.code)
      }
    }
  }

  const currentLangObj = languages.find(lang => lang.code === currentLanguage) || languages[0]

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
            background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}
        >
          <Globe size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Langue
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Choisir votre langue préférée
          </p>
        </div>
      </div>

      {/* Détection automatique */}
      <div 
        className="p-4 rounded-xl mb-4 border"
        style={{
          background: isDarkMode 
            ? 'rgba(55, 65, 81, 0.5)'
            : 'rgba(255, 255, 255, 0.8)',
          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 
              className="font-semibold text-sm mb-1"
              style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
            >
              Détection automatique
            </h3>
            <p 
              className="text-xs"
              style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
            >
              Utilise la langue de votre navigateur
            </p>
          </div>
          <button
            onClick={handleAutoDetectToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              autoDetect 
                ? 'bg-blue-600' 
                : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                autoDetect ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Sélection manuelle */}
      {!autoDetect && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:scale-105"
            style={{
              background: isDarkMode 
                ? 'rgba(55, 65, 81, 0.5)'
                : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
            }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{currentLangObj.flag}</span>
              <div className="text-left">
                <div 
                  className="font-semibold"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  {currentLangObj.name}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  Sélection manuelle
                </div>
              </div>
            </div>
            <ChevronDown 
              size={20} 
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              style={{ color: isDarkMode ? '#D1D5DB' : '#374151' }}
            />
          </button>

          {isOpen && (
            <div 
              className="absolute top-full left-0 right-0 mt-2 border rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{
                background: isDarkMode 
                  ? 'rgba(31, 41, 55, 0.98)'
                  : 'rgba(255, 255, 255, 0.98)',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full flex items-center justify-between p-4 transition-all duration-200 hover:bg-opacity-50"
                  style={{
                    background: currentLanguage === language.code 
                      ? isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                      : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (currentLanguage !== language.code) {
                      e.target.style.background = isDarkMode 
                        ? 'rgba(55, 65, 81, 0.5)' 
                        : 'rgba(243, 244, 246, 0.8)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentLanguage !== language.code) {
                      e.target.style.background = 'transparent'
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{language.flag}</span>
                    <span 
                      className="font-medium"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                    >
                      {language.name}
                    </span>
                  </div>
                  {currentLanguage === language.code && (
                    <Check size={20} className="text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Langue actuelle */}
      <div 
        className="mt-4 p-3 rounded-lg"
        style={{
          background: isDarkMode 
            ? 'rgba(59, 130, 246, 0.1)'
            : 'rgba(59, 130, 246, 0.05)',
          border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
        }}
      >
        <div className="flex items-center space-x-2">
          <Globe size={16} className="text-blue-500" />
          <span 
            className="text-sm"
            style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
          >
            Langue actuelle: <strong>{currentLangObj.name}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

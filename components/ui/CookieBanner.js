import { useState, useEffect } from 'react'
import { Cookie, X, Check } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('gliitz-cookies-accepted')
    if (!cookiesAccepted) {
      // Délai pour laisser le temps au chargement de la page
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('gliitz-cookies-accepted', 'true')
    setShowBanner(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('gliitz-cookies-accepted', 'false')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 transform transition-all duration-500 ease-out"
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(20px) saturate(150%)',
        borderTop: `2px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.2)'}`,
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Icône et contenu */}
          <div className="flex items-start gap-4 flex-1">
            <div 
              className="p-3 rounded-2xl flex-shrink-0"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.1) 100%)',
                border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.2)'}`,
              }}
            >
              <Cookie size={24} className="text-gray-500" />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🍪 Nous utilisons des cookies
              </h3>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Gliitz utilise des cookies pour améliorer votre expérience, personnaliser le contenu et analyser notre trafic. 
                En continuant à utiliser notre site, vous acceptez notre utilisation des cookies.
              </p>
              <div className="mt-2">
                <a 
                  href="/aide" 
                  className={`text-xs underline hover:no-underline transition-all duration-200 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  En savoir plus sur notre politique de confidentialité
                </a>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={rejectCookies}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 border"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.6) 0%, rgba(55, 65, 81, 0.4) 100%)'
                  : 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.6) 100%)',
                color: isDarkMode ? '#d1d5db' : '#4b5563',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)',
              }}
            >
              <X size={16} className="inline mr-2" />
              Refuser
            </button>
            
            <button
              onClick={acceptCookies}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-white"
              style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)',
              }}
            >
              <Check size={16} className="inline mr-2" />
              Accepter tous les cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

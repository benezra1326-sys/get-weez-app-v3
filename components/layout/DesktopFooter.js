import React, { memo } from 'react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import GliitzLogo from '../ui/GliitzLogo'
import Newsletter from '../ui/Newsletter'

const DesktopFooter = memo(() => {
  const { isDarkMode } = useTheme()

  return (
    <footer 
      className="relative overflow-hidden desktop-footer"
      style={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0,
        borderTop: isDarkMode ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Effets de fond */}
      <div className="absolute inset-0" style={{ opacity: isDarkMode ? 0.05 : 0.08 }}>
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full" style={{
          background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
          filter: 'blur(60px)'
        }}></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full" style={{
          background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
          filter: 'blur(80px)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full" style={{
          background: 'linear-gradient(135deg, #EC4899, #F97316)',
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Section principale du footer */}
        <div className="py-16 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Logo et description centrés */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center mb-6">
                <div 
                  className="px-8 py-4 rounded-2xl shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)'
                  }}
                >
                  <GliitzLogo size="text-3xl lg:text-4xl" />
                </div>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold mb-4" style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Votre concierge IA magique
              </h3>
              
              <p className={`text-lg max-w-2xl mx-auto mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Partout et toujours ✨ Découvrez Marbella comme jamais auparavant avec notre IA personnalisée
              </p>
            </div>

            {/* Grille d'informations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Contact */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center desktop-hover-lift" style={{
                  background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                }}>
                  <span className="text-white text-xl">📧</span>
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  hello@gliitz.com<br />
                  +34 123 456 789
                </p>
              </div>

              {/* Services */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center desktop-hover-lift" style={{
                  background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
                }}>
                  <span className="text-white text-xl">⭐</span>
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Services</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Recommandations IA<br />
                  Réservations VIP<br />
                  Conciergerie 24/7
                </p>
              </div>

              {/* Localisation */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center desktop-hover-lift" style={{
                  background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                }}>
                  <span className="text-white text-xl">📍</span>
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Localisation</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Marbella, Espagne<br />
                  Costa del Sol
                </p>
              </div>
            </div>
            
            {/* Newsletter */}
            <Newsletter isDarkMode={isDarkMode} />

            {/* Liens sociaux et copyright */}
            <div className="pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Liens sociaux */}
                <div className="flex items-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 desktop-hover-scale" style={{
                    background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}>
                    <span className="text-white text-sm">📘</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 desktop-hover-scale" style={{
                    background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}>
                    <span className="text-white text-sm">📷</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 desktop-hover-scale" style={{
                    background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    <span className="text-white text-sm">🐦</span>
                  </a>
                </div>
        
                {/* Copyright */}
                <div className="text-center md:text-right">
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    © 2024 Gliitz. Tous droits réservés.
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Fait avec ❤️ à Marbella
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

DesktopFooter.displayName = 'DesktopFooter'

export default DesktopFooter

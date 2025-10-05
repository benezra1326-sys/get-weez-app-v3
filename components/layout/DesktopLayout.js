import React, { useState, useEffect, memo } from 'react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const DesktopLayout = memo(({ children, className = '' }) => {
  const [isDesktop, setIsDesktop] = useState(false)
  const { isDarkMode, isLoaded } = useTheme()

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Ne pas rendre avant que le thème soit chargé
  if (!isLoaded) {
    return (
      <div 
        className="w-full min-h-screen flex items-center justify-center" 
        style={{ 
          backgroundColor: isDarkMode ? '#0A0A0F' : '#FAFAFA',
          background: isDarkMode 
            ? 'radial-gradient(ellipse at center, #1a1a2e 0%, #0A0A0F 100%)'
            : 'radial-gradient(ellipse at center, #f8fafc 0%, #FAFAFA 100%)'
        }}
      >
        <div className="text-center">
          {/* Loader discret avec sparkling */}
          <div className="relative mb-6">
            {/* Sparkling subtils */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Sparkles flottants */}
              <div 
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(139, 92, 246, 0.8)',
                  top: '20%',
                  left: '30%',
                  animation: 'sparkle-float 3s ease-in-out infinite',
                  boxShadow: isDarkMode ? '0 0 6px rgba(255, 255, 255, 0.6)' : '0 0 6px rgba(139, 92, 246, 0.6)'
                }}
              />
              <div 
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(59, 130, 246, 0.6)',
                  top: '60%',
                  right: '25%',
                  animation: 'sparkle-float 3s ease-in-out infinite 1s',
                  boxShadow: isDarkMode ? '0 0 4px rgba(255, 255, 255, 0.4)' : '0 0 4px rgba(59, 130, 246, 0.4)'
                }}
              />
              <div 
                className="absolute w-0.5 h-0.5 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(6, 182, 212, 0.4)',
                  bottom: '30%',
                  left: '60%',
                  animation: 'sparkle-float 3s ease-in-out infinite 2s',
                  boxShadow: isDarkMode ? '0 0 3px rgba(255, 255, 255, 0.3)' : '0 0 3px rgba(6, 182, 212, 0.3)'
                }}
              />
              <div 
                className="absolute w-0.5 h-0.5 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  top: '40%',
                  right: '40%',
                  animation: 'sparkle-float 3s ease-in-out infinite 0.5s',
                  boxShadow: isDarkMode ? '0 0 3px rgba(255, 255, 255, 0.3)' : '0 0 3px rgba(139, 92, 246, 0.3)'
                }}
              />
            </div>
            
            {/* Cercle principal discret */}
            <div 
              className="relative w-8 h-8 mx-auto"
              style={{
                borderRadius: '50%',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
                animation: 'gentle-pulse 2s ease-in-out infinite',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Point central */}
              <div 
                className="absolute inset-2 rounded-full"
                style={{
                  background: isDarkMode 
                    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                  animation: 'gentle-glow 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          {/* Texte discret */}
          <div className="space-y-3">
            <h2 
              className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              style={{
                opacity: 0.8
              }}
            >
              Préparation...
            </h2>
            
            {/* Points de progression discrets */}
            <div className="flex justify-center space-x-1">
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(139, 92, 246, 0.4)',
                  animation: 'dot-pulse 1.5s ease-in-out infinite'
                }}
              />
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(59, 130, 246, 0.4)',
                  animation: 'dot-pulse 1.5s ease-in-out infinite 0.3s'
                }}
              />
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(6, 182, 212, 0.4)',
                  animation: 'dot-pulse 1.5s ease-in-out infinite 0.6s'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Styles CSS pour les animations modernes */}
        <style jsx>{`
          @keyframes pulse-modern {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 60px rgba(139, 92, 246, 0.6), 0 0 120px rgba(59, 130, 246, 0.3);
            }
          }
          
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          
          @keyframes loading-progress {
            0% {
              width: 0%;
              opacity: 0.8;
            }
            50% {
              width: 70%;
              opacity: 1;
            }
            100% {
              width: 100%;
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    )
  }

  if (!isDesktop) {
    return <div className={className}>{children}</div>
  }

  return (
    <div 
      className={`desktop-layout ${className}`}
      style={{
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  )
})

DesktopLayout.displayName = 'DesktopLayout'

export default DesktopLayout

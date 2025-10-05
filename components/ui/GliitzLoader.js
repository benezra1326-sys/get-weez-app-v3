import React from 'react'
import { useTheme } from '../../contexts/ThemeContextSimple'

/**
 * Loader moderne et élégant avec le logo Gliitz
 * Animation fluide avec disparition progressive
 */
export default function GliitzLoader({ text = 'Chargement...' }) {
  const { isDarkMode } = useTheme()

  return (
    <>
      <style jsx>{`
        @keyframes logo-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes logo-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 60px rgba(99, 102, 241, 0.6));
          }
        }

        @keyframes sparkle-orbit {
          0% {
            transform: rotate(0deg) translateX(80px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateX(80px) rotate(-360deg);
            opacity: 0;
          }
        }

        @keyframes fade-in-text {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer-wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .logo-container {
          animation: logo-pulse 2s ease-in-out infinite;
        }

        .logo-glow {
          animation: logo-glow 2s ease-in-out infinite;
        }

        .sparkle {
          animation: sparkle-orbit 3s linear infinite;
        }

        .sparkle:nth-child(2) {
          animation-delay: 0.5s;
        }

        .sparkle:nth-child(3) {
          animation-delay: 1s;
        }

        .sparkle:nth-child(4) {
          animation-delay: 1.5s;
        }

        .loading-text {
          animation: fade-in-text 0.6s ease-out;
        }

        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer-wave 2s infinite;
        }
      `}</style>

      <div 
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          background: isDarkMode 
            ? 'radial-gradient(ellipse at center, #1a1a2e 0%, #0A0A0F 100%)'
            : 'radial-gradient(ellipse at center, #f8fafc 0%, #FAFAFA 100%)'
        }}
      >
        {/* Effet de particules en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: isDarkMode ? 'rgba(168, 85, 247, 0.6)' : 'rgba(168, 85, 247, 0.4)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `sparkle-orbit ${3 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Container principal centré */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Cercle de fond avec effet glow */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '200px',
              height: '200px',
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
              animation: 'logo-pulse 2s ease-in-out infinite'
            }}
          />

          {/* Sparkles orbitaux */}
          <div className="absolute" style={{ width: '160px', height: '160px' }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="sparkle absolute w-3 h-3 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #fde047, #f59e0b)',
                  boxShadow: '0 0 10px rgba(253, 224, 71, 0.8)',
                  top: '50%',
                  left: '50%',
                  marginTop: '-6px',
                  marginLeft: '-6px'
                }}
              />
            ))}
          </div>

          {/* Logo Gliitz */}
          <div className="logo-container logo-glow relative z-10">
            <div 
              className="shimmer px-8 py-4 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
                boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4), 0 0 80px rgba(168, 85, 247, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <h1 
                className="logo-text"
                style={{
                  fontFamily: '"Proxima Soft Black", "Montserrat", "Proxima Nova", Inter, sans-serif',
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                  margin: 0,
                  lineHeight: 1
                }}
              >
                Gliitz
              </h1>
            </div>
          </div>

          {/* Texte de chargement */}
          <div className="loading-text mt-8 text-center">
            <p 
              className="text-lg font-medium mb-2"
              style={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(31, 41, 55, 0.9)'
              }}
            >
              {text}
            </p>
            
            {/* Dots animés */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #a855f7, #6366f1)'
                      : 'linear-gradient(135deg, #a855f7, #6366f1)',
                    animation: 'logo-pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    boxShadow: '0 0 8px rgba(168, 85, 247, 0.6)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Effet de vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDarkMode
              ? 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 15, 0.4) 100%)'
              : 'radial-gradient(ellipse at center, transparent 0%, rgba(250, 250, 250, 0.4) 100%)'
          }}
        />
      </div>
    </>
  )
}

// Composant pour fade out progressif
export function GliitzLoaderWithFade({ onComplete, duration = 1000 }) {
  const [isVisible, setIsVisible] = React.useState(true)
  const [opacity, setOpacity] = React.useState(1)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Commencer le fade out
      const fadeInterval = setInterval(() => {
        setOpacity((prev) => {
          const newOpacity = prev - 0.02
          if (newOpacity <= 0) {
            clearInterval(fadeInterval)
            setIsVisible(false)
            onComplete?.()
            return 0
          }
          return newOpacity
        })
      }, duration / 50)
    }, 1500) // Attendre 1.5s avant de commencer le fade

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div style={{ opacity, transition: 'opacity 0.3s ease-out' }}>
      <GliitzLoader />
    </div>
  )
}


import React from 'react'
import { Sparkles } from 'lucide-react'

/**
 * Loader simple et élégant avec le texte Gliitz en noir sur fond blanc
 * Icône sparkle qui tourne avec effet d'estompe
 */
export default function GliitzLoader({ text = 'Chargement...' }) {
  return (
    <>
      <style jsx>{`
        @keyframes sparkle-spin {
          0% {
            transform: rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0.8;
          }
        }

        @keyframes fade-pulse {
          0%, 100% {
            opacity: 0.8;
            filter: blur(0px);
          }
          50% {
            opacity: 1;
            filter: blur(1px);
          }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.3);
          }
        }

        .sparkle-rotate {
          animation: sparkle-spin 2s linear infinite;
        }

        .logo-fade {
          animation: fade-pulse 3s ease-in-out infinite;
        }

        .text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          background: '#FFFFFF'
        }}
      >
        {/* Container principal centré */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Logo Gliitz avec effet d'estompe */}
          <div className="logo-fade relative z-10 mb-4">
            <h1 
              className="text-glow"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '4rem',
                fontWeight: '700',
                color: '#000000',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1
              }}
            >
              Gliitz
            </h1>
          </div>

          {/* Icône Sparkle qui tourne */}
          <div className="flex items-center justify-center mb-4">
            <Sparkles 
              size={32} 
              className="sparkle-rotate"
              style={{ 
                color: '#C0C0C0'
              }} 
            />
          </div>

          {/* Texte de chargement */}
          <div className="text-center">
            <p 
              className="text-sm font-medium"
              style={{
                color: '#666666',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {text}
            </p>
          </div>
        </div>
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


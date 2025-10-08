import { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function ThemeTransition() {
  const { isDarkMode } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Déclencher l'animation lors du changement de thème
    setIsTransitioning(true)
    
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 1000) // Durée de l'animation

    return () => clearTimeout(timer)
  }, [isDarkMode])

  if (!isTransitioning) return null

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        animation: 'theme-transition 1s ease-out'
      }}
    >
      {/* Bande animée qui traverse l'écran */}
      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, transparent, rgba(212, 175, 55, 0.3), rgba(244, 229, 161, 0.3), transparent)'
            : 'linear-gradient(135deg, transparent, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3), transparent)',
          animation: 'sweep-across 1s ease-out forwards'
        }}
      />

      <style jsx>{`
        @keyframes theme-transition {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes sweep-across {
          0% {
            transform: translateX(-100%) skewX(-12deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) skewX(-12deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}


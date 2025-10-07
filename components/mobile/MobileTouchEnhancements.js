import { useEffect, useState, useCallback } from 'react'

/**
 * Composant pour améliorer l'expérience tactile mobile
 */
export const MobileTouchEnhancer = ({ children, enableHaptics = true }) => {
  const [touchFeedback, setTouchFeedback] = useState(null)

  // Ajouter feedback tactile
  const addTouchFeedback = useCallback((element) => {
    if (!element) return

    element.classList.add('mobile-touch-feedback')
    
    // Ajouter vibration légère si supportée
    if (enableHaptics && 'vibrate' in navigator) {
      element.addEventListener('touchstart', () => {
        navigator.vibrate(10) // 10ms de vibration légère
      })
    }

    // Feedback visuel au toucher
    element.addEventListener('touchstart', (e) => {
      const rect = element.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setTouchFeedback({ x, y, element })
      
      setTimeout(() => setTouchFeedback(null), 300)
    })
  }, [enableHaptics])

  useEffect(() => {
    // Améliorer tous les éléments interactifs
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], [onClick]')
    interactiveElements.forEach(addTouchFeedback)
  }, [addTouchFeedback])

  return (
    <>
      <style jsx global>{`
        /* Feedback tactile global */
        .mobile-touch-feedback {
          position: relative;
          overflow: hidden;
        }

        .mobile-touch-feedback::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--touch-x, 50%) var(--touch-y, 50%), 
                        rgba(192, 192, 192, 0.3) 0%, 
                        rgba(192, 192, 192, 0.1) 40%, 
                        transparent 70%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }

        .mobile-touch-feedback:active::after {
          opacity: 1;
        }

        /* Amélioration des zones de touch pour mobile */
        @media (max-width: 768px) {
          button, a[href], [role="button"] {
            min-height: 48px !important;
            min-width: 48px !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          /* Espacement amélioré entre éléments tactiles */
          .mobile-button-group button {
            margin: 4px;
          }

          /* Feedback immédiat pour les actions importantes */
          .mobile-primary-action:active {
            transform: scale(0.96) !important;
            box-shadow: 0 2px 8px rgba(192, 192, 192, 0.4) !important;
          }

          /* Amélioration du scroll */
          .mobile-scroll-container {
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: y mandatory;
            overscroll-behavior: contain;
          }

          .mobile-scroll-item {
            scroll-snap-align: start;
          }
        }
      `}</style>
      {children}
      
      {/* Indicateur de feedback tactile */}
      {touchFeedback && (
        <div
          style={{
            position: 'fixed',
            left: touchFeedback.x,
            top: touchFeedback.y,
            width: '20px',
            height: '20px',
            background: 'rgba(192, 192, 192, 0.6)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'mobile-touch-ripple 0.3s ease-out'
          }}
        />
      )}
      
      <style jsx global>{`
        @keyframes mobile-touch-ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

/**
 * Hook pour gérer la navigation par gestes entre pages
 */
export const usePageSwipeNavigation = () => {
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [swipeProgress, setSwipeProgress] = useState(0)

  const handleSwipeNavigation = useCallback((direction, progress = 0) => {
    setSwipeDirection(direction)
    setSwipeProgress(progress)

    // Auto-hide après 2 secondes
    setTimeout(() => {
      setSwipeDirection(null)
      setSwipeProgress(0)
    }, 2000)
  }, [])

  return {
    swipeDirection,
    swipeProgress,
    triggerSwipeNavigation: handleSwipeNavigation
  }
}

/**
 * Composant d'indication de navigation par swipe
 */
export const SwipeNavigationHint = ({ direction, progress }) => {
  if (!direction) return null

  const getIcon = () => {
    switch (direction) {
      case 'left': return '👈'
      case 'right': return '👉'
      case 'up': return '👆'
      case 'down': return '👇'
      default: return '👆'
    }
  }

  const getLabel = () => {
    switch (direction) {
      case 'left': return 'Page précédente'
      case 'right': return 'Page suivante'
      case 'up': return 'Haut de page'
      case 'down': return 'Bas de page'
      default: return 'Navigation'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        opacity: Math.min(progress, 1),
        transition: 'opacity 0.2s ease'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>
          {getIcon()}
        </div>
        <div>{getLabel()}</div>
      </div>
    </div>
  )
}

export default {
  MobileTouchEnhancer,
  usePageSwipeNavigation,
  SwipeNavigationHint
}

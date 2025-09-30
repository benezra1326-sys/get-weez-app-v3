import React, { useEffect, useState } from 'react'
import useMobileDetection from '../../hooks/useMobileDetection'

/**
 * Composant d'optimisations mobiles
 * Gère les améliorations spécifiques aux appareils mobiles
 */
export function MobileOptimizations({ children, className = '' }) {
  const { isMobile, isIOS, isAndroid } = useMobileDetection()
  const [viewportHeight, setViewportHeight] = useState(null)

  // Gestion de la hauteur de viewport dynamique
  useEffect(() => {
    if (isMobile) {
      const updateViewportHeight = () => {
        // Utiliser la hauteur dynamique sur les mobiles
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        setViewportHeight(window.innerHeight)
      }

      updateViewportHeight()
      window.addEventListener('resize', updateViewportHeight)
      window.addEventListener('orientationchange', updateViewportHeight)

      // Attendre un peu après le changement d'orientation
      const handleOrientationChange = () => {
        setTimeout(updateViewportHeight, 100)
      }
      window.addEventListener('orientationchange', handleOrientationChange)

      return () => {
        window.removeEventListener('resize', updateViewportHeight)
        window.removeEventListener('orientationchange', updateViewportHeight)
        window.removeEventListener('orientationchange', handleOrientationChange)
      }
    }
  }, [isMobile])

  // Prévention du rubber band effect sur iOS
  useEffect(() => {
    if (isIOS) {
      const preventRubberBand = (e) => {
        const element = e.target
        const scrollTop = element.scrollTop
        const scrollHeight = element.scrollHeight
        const clientHeight = element.clientHeight

        if (scrollTop === 0) {
          element.scrollTop = 1
        } else if (scrollTop + clientHeight >= scrollHeight) {
          element.scrollTop = scrollHeight - clientHeight - 1
        }
      }

      const scrollableElements = document.querySelectorAll('[data-scroll-lock]')
      scrollableElements.forEach(el => {
        el.addEventListener('touchstart', preventRubberBand)
      })

      return () => {
        scrollableElements.forEach(el => {
          el.removeEventListener('touchstart', preventRubberBand)
        })
      }
    }
  }, [isIOS])

  // Classes CSS dynamiques pour les optimisations mobiles
  const mobileClasses = [
    className,
    isMobile && 'mobile-optimized',
    isIOS && 'ios-device',
    isAndroid && 'android-device',
    'touch-manipulation'
  ].filter(Boolean).join(' ')

  const mobileStyles = {
    ...(isMobile && {
      height: '100vh',
      height: 'calc(var(--vh, 1vh) * 100)',
      WebkitTextSizeAdjust: '100%',
      textSizeAdjust: '100%'
    })
  }

  return (
    <div 
      className={mobileClasses}
      style={mobileStyles}
      data-mobile={isMobile}
      data-ios={isIOS}
      data-android={isAndroid}
      data-viewport-height={viewportHeight}
    >
      {children}
    </div>
  )
}

/**
 * Hook pour la gestion du clavier virtuel
 */
export function useVirtualKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const { isMobile } = useMobileDetection()

  useEffect(() => {
    if (!isMobile) return

    let initialViewportHeight = window.innerHeight

    const handleResize = () => {
      const currentHeight = window.innerHeight
      const heightDifference = initialViewportHeight - currentHeight

      if (heightDifference > 150) {
        // Clavier probablement ouvert
        setKeyboardHeight(heightDifference)
        setIsKeyboardOpen(true)
        document.body.classList.add('keyboard-open')
      } else {
        // Clavier fermé
        setKeyboardHeight(0)
        setIsKeyboardOpen(false)
        document.body.classList.remove('keyboard-open')
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.body.classList.remove('keyboard-open')
    }
  }, [isMobile])

  return {
    keyboardHeight,
    isKeyboardOpen,
    adjustForKeyboard: (element) => {
      if (isKeyboardOpen && element) {
        element.style.paddingBottom = `${keyboardHeight}px`
      }
    }
  }
}

/**
 * Hook pour la gestion des gestes tactiles
 */
export function useTouchGestures(onSwipe) {
  const [startX, setStartX] = useState(null)
  const [startY, setStartY] = useState(null)

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setStartX(touch.clientX)
    setStartY(touch.clientY)
  }

  const handleTouchEnd = (e) => {
    if (!startX || !startY) return

    const touch = e.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY

    const deltaX = endX - startX
    const deltaY = endY - startY

    const minSwipeDistance = 50

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Swipe horizontal
      if (Math.abs(deltaX) > minSwipeDistance) {
        onSwipe?.(deltaX > 0 ? 'right' : 'left', { deltaX, deltaY })
      }
    } else {
      // Swipe vertical
      if (Math.abs(deltaY) > minSwipeDistance) {
        onSwipe?.(deltaY > 0 ? 'down' : 'up', { deltaX, deltaY })
      }
    }

    setStartX(null)
    setStartY(null)
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }
}

/**
 * Composant pour la détection de Pull-to-Refresh
 */
export function PullToRefresh({ onRefresh, children, className = '' }) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(null)

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e) => {
    if (!startY || window.scrollY > 0) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY

    if (distance > 0) {
      e.preventDefault() // Empêche le scroll par défaut
      setPullDistance(distance)
      setIsPulling(distance > 80)
    }
  }

  const handleTouchEnd = () => {
    if (isPulling && pullDistance > 80) {
      onRefresh?.()
    }
    
    setStartY(null)
    setPullDistance(0)
    setIsPulling(false)
  }

  return (
    <div 
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Indicateur de pull-to-refresh */}
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gray-800/90 backdrop-blur-sm transition-transform duration-200 ease-out"
          style={{
            height: Math.min(pullDistance, 80),
            transform: `translateY(-${Math.max(0, 80 - pullDistance)}px)`
          }}
        >
          <div className={`transition-transform duration-200 ${isPulling ? 'scale-110' : 'scale-100'}`}>
            {isPulling ? (
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="text-gray-400 text-sm">
                Tirez pour actualiser...
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

/**
 * Composant de sécurité pour les safe areas
 */
export function SafeAreaView({ children, className = '', edges = ['top', 'bottom'] }) {
  const safeAreaClasses = edges.map(edge => `safe-${edge}`).join(' ')
  
  return (
    <div className={`${safeAreaClasses} ${className}`} style={{
      paddingTop: edges.includes('top') ? 'env(safe-area-inset-top)' : undefined,
      paddingBottom: edges.includes('bottom') ? 'env(safe-area-inset-bottom)' : undefined,
      paddingLeft: edges.includes('left') ? 'env(safe-area-inset-left)' : undefined,
      paddingRight: edges.includes('right') ? 'env(safe-area-inset-right)' : undefined,
    }}>
      {children}
    </div>
  )
}

export default MobileOptimizations
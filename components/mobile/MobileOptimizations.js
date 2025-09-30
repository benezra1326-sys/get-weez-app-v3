import { useState, useEffect, useCallback, memo } from 'react'

/**
 * Hook pour optimiser les performances mobiles
 * Gère le lazy loading, la détection de connexion, et les optimisations tactiles
 */
export const useMobileOptimizations = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [isSlowConnection, setIsSlowConnection] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)

  // Détection du type d'appareil
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    
    checkTouchDevice()
    window.addEventListener('resize', checkTouchDevice)
    return () => window.removeEventListener('resize', checkTouchDevice)
  }, [])

  // Détection de la connexion
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    // Détection de connexion lente
    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection
        setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    checkConnectionSpeed()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Gestion de la hauteur viewport mobile
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      setViewportHeight(vh)
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)
    
    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
    }
  }, [])

  return {
    isOnline,
    isSlowConnection,
    isTouchDevice,
    viewportHeight
  }
}

/**
 * Hook pour optimiser les interactions tactiles
 */
export const useTouchOptimizations = () => {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    return { isLeftSwipe, isRightSwipe, distance }
  }, [touchStart, touchEnd, minSwipeDistance])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    touchStart,
    touchEnd
  }
}

/**
 * Hook pour le lazy loading optimisé mobile
 */
export const useMobileLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useCallback((node) => {
    if (node && !hasLoaded) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setHasLoaded(true)
            observer.disconnect()
          }
        },
        { threshold }
      )
      observer.observe(node)
    }
  }, [hasLoaded, threshold])

  return { isVisible, elementRef }
}

/**
 * Composant pour optimiser les performances sur mobile
 */
export const MobilePerformanceOptimizer = memo(({ children, enableOptimizations = true }) => {
  const { isSlowConnection, isTouchDevice } = useMobileOptimizations()

  useEffect(() => {
    if (!enableOptimizations) return

    // Optimisations CSS pour mobile
    const style = document.createElement('style')
    style.textContent = `
      /* Optimisations de performance mobile */
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      /* Permettre la sélection de texte dans les inputs */
      input, textarea {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      /* Optimisations de scroll */
      .mobile-scroll {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      
      /* Optimisations d'images */
      img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      
      /* Réduction des animations sur connexion lente */
      ${isSlowConnection ? `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      ` : ''}
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [enableOptimizations, isSlowConnection])

  return children
})

MobilePerformanceOptimizer.displayName = 'MobilePerformanceOptimizer'

/**
 * Hook pour gérer les gestes de navigation mobile
 */
export const useMobileNavigation = () => {
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  useEffect(() => {
    const updateNavigationState = () => {
      setCanGoBack(window.history.length > 1)
      setCanGoForward(false) // Pas de forward en SPA
    }

    updateNavigationState()
    window.addEventListener('popstate', updateNavigationState)
    
    return () => window.removeEventListener('popstate', updateNavigationState)
  }, [])

  const goBack = useCallback(() => {
    if (canGoBack) {
      window.history.back()
    }
  }, [canGoBack])

  return { canGoBack, canGoForward, goBack }
}

/**
 * Hook pour optimiser les animations sur mobile
 */
export const useMobileAnimations = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)

  useEffect(() => {
    // Détection des préférences d'accessibilité
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    // Détection d'appareil bas de gamme
    const checkDevicePerformance = () => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const isLowEnd = !gl || navigator.hardwareConcurrency <= 2
      setIsLowEndDevice(isLowEnd)
    }

    checkDevicePerformance()

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const getAnimationClass = useCallback((baseClass) => {
    if (prefersReducedMotion || isLowEndDevice) {
      return `${baseClass}--reduced`
    }
    return baseClass
  }, [prefersReducedMotion, isLowEndDevice])

  return {
    prefersReducedMotion,
    isLowEndDevice,
    getAnimationClass
  }
}

export default {
  useMobileOptimizations,
  useTouchOptimizations,
  useMobileLazyLoading,
  MobilePerformanceOptimizer,
  useMobileNavigation,
  useMobileAnimations
}

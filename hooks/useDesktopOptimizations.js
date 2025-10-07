import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * Hook pour les optimisations desktop
 * Gère les performances, les animations et les interactions spécifiques au desktop
 */
export const useDesktopOptimizations = () => {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLargeDesktop, setIsLargeDesktop] = useState(false)
  const [isUltraWide, setIsUltraWide] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Détection de la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      setIsLargeDesktop(width >= 1280)
      setIsUltraWide(width >= 1536)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Détection des préférences d'accessibilité
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Optimisations de performance
  const performanceOptimizations = useMemo(() => ({
    // GPU acceleration pour les animations
    gpuAcceleration: {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px'
    },
    
    // Optimisations de scroll
    smoothScroll: {
      scrollBehavior: 'smooth',
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--color-primary) transparent'
    },
    
    // Optimisations de rendu
    rendering: {
      willChange: 'transform',
      contain: 'layout style paint'
    }
  }), [])

  // Gestion des animations selon les préférences
  const getAnimationClasses = useCallback((baseClasses = '') => {
    if (prefersReducedMotion) {
      return `${baseClasses} motion-reduce`
    }
    return baseClasses
  }, [prefersReducedMotion])

  // Gestion des breakpoints
  const breakpoints = useMemo(() => ({
    isDesktop,
    isLargeDesktop,
    isUltraWide,
    isMobile: !isDesktop,
    isTablet: !isDesktop && (typeof window !== 'undefined' ? window.innerWidth >= 768 : false)
  }), [isDesktop, isLargeDesktop, isUltraWide])

  // Optimisations de layout selon la taille d'écran
  const layoutOptimizations = useMemo(() => {
    if (isUltraWide) {
      return {
        gridColumns: '400px 1fr 400px',
        maxWidth: '1000px',
        messageMaxWidth: '45%'
      }
    } else if (isLargeDesktop) {
      return {
        gridColumns: '360px 1fr 360px',
        maxWidth: '800px',
        messageMaxWidth: '50%'
      }
    } else if (isDesktop) {
      return {
        gridColumns: '320px 1fr 320px',
        maxWidth: '600px',
        messageMaxWidth: '60%'
      }
    }
    return {}
  }, [isDesktop, isLargeDesktop, isUltraWide])

  // Gestion des interactions desktop
  const desktopInteractions = useMemo(() => ({
    // Hover effects optimisés
    hoverEffects: {
      lift: 'transform: translateY(-2px)',
      scale: 'transform: scale(1.05)',
      glow: 'box-shadow: 0 8px 25px rgba(192, 192, 192, 0.3)'
    },
    
    // Transitions fluides
    transitions: {
      fast: 'transition: all 0.2s ease',
      normal: 'transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'transition: all 0.5s ease'
    },
    
    // Animations personnalisées
    animations: {
      fadeIn: 'animation: fadeIn 0.4s ease-out',
      slideUp: 'animation: slideUp 0.3s ease-out',
      pulse: 'animation: pulse 2s ease-in-out infinite'
    }
  }), [])

  // Gestion de la mémoire et des performances
  const memoryOptimizations = useMemo(() => ({
    // Debounce pour les événements fréquents
    debounce: (func, delay) => {
      let timeoutId
      return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func.apply(null, args), delay)
      }
    },
    
    // Throttle pour les événements de scroll
    throttle: (func, limit) => {
      let inThrottle
      return (...args) => {
        if (!inThrottle) {
          func.apply(null, args)
          inThrottle = true
          setTimeout(() => inThrottle = false, limit)
        }
      }
    },
    
    // Lazy loading des composants
    lazyLoad: (importFunc) => {
      return React.lazy(importFunc)
    }
  }), [])

  // Gestion des raccourcis clavier desktop
  const keyboardShortcuts = useMemo(() => ({
    // Raccourcis globaux
    global: {
      'Ctrl+/': 'Aide',
      'Ctrl+K': 'Recherche',
      'Ctrl+N': 'Nouvelle conversation',
      'Escape': 'Fermer modals'
    },
    
    // Raccourcis chat
    chat: {
      'Enter': 'Envoyer message',
      'Shift+Enter': 'Nouvelle ligne',
      'Ctrl+Enter': 'Envoyer message',
      'Ctrl+Backspace': 'Supprimer conversation'
    }
  }), [])

  // Gestion des événements de performance
  const performanceEvents = useMemo(() => ({
    // Mesure des performances
    measurePerformance: (name, fn) => {
      const start = performance.now()
      const result = fn()
      const end = performance.now()
      console.log(`${name} took ${end - start} milliseconds`)
      return result
    },
    
    // Optimisation des re-renders
    memoize: (fn, deps) => {
      return useMemo(fn, deps)
    },
    
    // Callback optimisé
    optimizedCallback: (fn, deps) => {
      return useCallback(fn, deps)
    }
  }), [])

  return {
    // États
    isDesktop,
    isLargeDesktop,
    isUltraWide,
    prefersReducedMotion,
    
    // Breakpoints
    breakpoints,
    
    // Optimisations
    performanceOptimizations,
    layoutOptimizations,
    desktopInteractions,
    memoryOptimizations,
    keyboardShortcuts,
    performanceEvents,
    
    // Utilitaires
    getAnimationClasses,
    
    // Classes CSS optimisées
    cssClasses: {
      desktop: isDesktop ? 'desktop-optimized' : '',
      largeDesktop: isLargeDesktop ? 'large-desktop-optimized' : '',
      ultraWide: isUltraWide ? 'ultra-wide-optimized' : '',
      reducedMotion: prefersReducedMotion ? 'motion-reduce' : ''
    }
  }
}

export default useDesktopOptimizations

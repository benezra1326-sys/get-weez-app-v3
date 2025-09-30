import { useState, useEffect, useCallback } from 'react'

/**
 * Hook personnalisé pour détecter si l'utilisateur est sur mobile
 * Utilise les media queries et la taille de l'écran
 */
export const useMobileDetection = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  // Fonction pour vérifier si on est sur mobile
  const checkIsMobile = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  }, [breakpoint])

  // Handler pour le redimensionnement
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return

    const newScreenSize = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    
    setScreenSize(newScreenSize)
    setIsMobile(newScreenSize.width < breakpoint)
  }, [breakpoint])

  // Effect pour l'initialisation et l'écoute des événements
  useEffect(() => {
    // Initialisation
    handleResize()

    // Écoute des changements de taille
    window.addEventListener('resize', handleResize)
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  // Détection plus avancée basée sur l'user agent
  const isMobileUserAgent = useCallback(() => {
    if (typeof navigator === 'undefined') return false
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }, [])

  // Détection du support du touch
  const isTouchDevice = useCallback(() => {
    if (typeof window === 'undefined') return false
    
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0
  }, [])

  // Fonction utilitaire pour obtenir la classe CSS appropriée
  const getResponsiveClass = useCallback((mobileClass, desktopClass) => {
    return isMobile ? mobileClass : desktopClass
  }, [isMobile])

  // Fonction utilitaire pour l'affichage conditionnel
  const showOnMobile = useCallback((content) => {
    return isMobile ? content : null
  }, [isMobile])

  const showOnDesktop = useCallback((content) => {
    return !isMobile ? content : null
  }, [isMobile])

  // Détection de l'orientation (portrait/landscape)
  const [orientation, setOrientation] = useState('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      if (typeof window === 'undefined') return
      
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
    }
  }, [])

  return {
    isMobile,
    isDesktop: !isMobile,
    screenSize,
    orientation,
    isMobileUserAgent: isMobileUserAgent(),
    isTouchDevice: isTouchDevice(),
    
    // Fonctions utilitaires
    getResponsiveClass,
    showOnMobile,
    showOnDesktop,
    
    // Breakpoints utiles
    isSmall: screenSize.width < 640,
    isMedium: screenSize.width >= 640 && screenSize.width < 768,
    isLarge: screenSize.width >= 768 && screenSize.width < 1024,
    isXLarge: screenSize.width >= 1024,
    isXXLarge: screenSize.width >= 1280
  }
}

export default useMobileDetection
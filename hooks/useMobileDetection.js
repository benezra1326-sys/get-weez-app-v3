import { useState, useEffect } from 'react'

/**
 * Hook pour détecter si l'appareil est mobile
 * Utilise les dimensions de l'écran et les media queries
 */
export function useMobileDetection(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [screenWidth, setScreenWidth] = useState(null)
  const [screenHeight, setScreenHeight] = useState(null)

  useEffect(() => {
    // Fonction pour vérifier les dimensions
    const checkDevice = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        const height = window.innerHeight
        
        setScreenWidth(width)
        setScreenHeight(height)
        setIsMobile(width < breakpoint)
        setIsTablet(width >= 768 && width < breakpoint)
      }
    }

    // Vérifier au chargement
    checkDevice()

    // Écouter les changements de taille d'écran
    const handleResize = () => {
      checkDevice()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [breakpoint])

  // Détection du type d'appareil via User Agent (optionnel)
  const getUserAgentInfo = () => {
    if (typeof navigator === 'undefined') return {}
    
    const ua = navigator.userAgent
    return {
      isIOS: /iPad|iPhone|iPod/.test(ua),
      isAndroid: /Android/.test(ua),
      isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
      isChrome: /Chrome/.test(ua),
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }
  }

  const deviceInfo = getUserAgentInfo()

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenWidth,
    screenHeight,
    orientation: screenWidth && screenHeight ? (screenWidth > screenHeight ? 'landscape' : 'portrait') : null,
    ...deviceInfo
  }
}

export default useMobileDetection
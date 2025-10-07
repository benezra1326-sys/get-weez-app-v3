import { useState, useEffect, useCallback, memo } from 'react'

/**
 * Hook pour gérer la responsivité mobile avancée
 */
export const useMobileResponsive = () => {
  const [breakpoint, setBreakpoint] = useState('desktop')
  const [orientation, setOrientation] = useState('portrait')
  const [deviceType, setDeviceType] = useState('desktop')
  const [isLandscape, setIsLandscape] = useState(false)
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })

  const checkBreakpoint = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    
    setViewportSize({ width, height })
    setIsLandscape(width > height)

    // Breakpoints mobiles optimisés
    if (width < 360) {
      setBreakpoint('xs')
      setDeviceType('mobile-small')
    } else if (width < 480) {
      setBreakpoint('sm')
      setDeviceType('mobile')
    } else if (width < 768) {
      setBreakpoint('md')
      setDeviceType('mobile-large')
    } else if (width < 1024) {
      setBreakpoint('lg')
      setDeviceType('tablet')
    } else if (width < 1280) {
      setBreakpoint('xl')
      setDeviceType('desktop')
    } else {
      setBreakpoint('2xl')
      setDeviceType('desktop-large')
    }

    // Détection de l'orientation
    setOrientation(width > height ? 'landscape' : 'portrait')
  }, [])

  useEffect(() => {
    checkBreakpoint()
    
    const debouncedCheck = () => {
      clearTimeout(window.resizeTimeout)
      window.resizeTimeout = setTimeout(checkBreakpoint, 100)
    }

    window.addEventListener('resize', debouncedCheck)
    window.addEventListener('orientationchange', debouncedCheck)
    
    return () => {
      window.removeEventListener('resize', debouncedCheck)
      window.removeEventListener('orientationchange', debouncedCheck)
      clearTimeout(window.resizeTimeout)
    }
  }, [checkBreakpoint])

  return {
    breakpoint,
    orientation,
    deviceType,
    isLandscape,
    viewportSize,
    isMobile: ['xs', 'sm', 'md'].includes(breakpoint),
    isTablet: breakpoint === 'lg',
    isDesktop: ['xl', '2xl'].includes(breakpoint)
  }
}

/**
 * Hook pour gérer les contraintes de performance mobile
 */
export const useMobilePerformance = () => {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState('fast')
  const [batteryLevel, setBatteryLevel] = useState(1)
  const [isCharging, setIsCharging] = useState(false)

  useEffect(() => {
    // Détection d'appareil bas de gamme
    const checkDevicePerformance = () => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const cores = navigator.hardwareConcurrency || 1
      const memory = navigator.deviceMemory || 4
      
      const isLowEnd = !gl || cores <= 2 || memory <= 2
      setIsLowEndDevice(isLowEnd)
    }

    // Détection de la vitesse de connexion
    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection
        const effectiveType = connection.effectiveType
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setConnectionSpeed('slow')
        } else if (effectiveType === '3g') {
          setConnectionSpeed('medium')
        } else {
          setConnectionSpeed('fast')
        }
      }
    }

    // Détection du niveau de batterie
    const checkBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery()
          setBatteryLevel(battery.level)
          setIsCharging(battery.charging)
          
          battery.addEventListener('levelchange', () => setBatteryLevel(battery.level))
          battery.addEventListener('chargingchange', () => setIsCharging(battery.charging))
        } catch (error) {
          console.log('Battery API not supported')
        }
      }
    }

    checkDevicePerformance()
    checkConnectionSpeed()
    checkBattery()
  }, [])

  return {
    isLowEndDevice,
    connectionSpeed,
    batteryLevel,
    isCharging,
    shouldReduceAnimations: isLowEndDevice || connectionSpeed === 'slow' || batteryLevel < 0.2
  }
}

/**
 * Composant wrapper pour la responsivité mobile
 */
export const MobileResponsiveWrapper = memo(({ 
  children, 
  className = "",
  enableOptimizations = true 
}) => {
  const { breakpoint, deviceType, isLandscape } = useMobileResponsive()
  const { shouldReduceAnimations } = useMobilePerformance()

  return (
    <>
      <style jsx>{`
        .mobile-responsive-wrapper {
          width: 100%;
          min-height: 100vh;
          position: relative;
        }
        
        .mobile-responsive-wrapper[data-device="mobile-small"] {
          font-size: 14px;
        }
        
        .mobile-responsive-wrapper[data-device="mobile"] {
          font-size: 16px;
        }
        
        .mobile-responsive-wrapper[data-device="mobile-large"] {
          font-size: 16px;
        }
        
        .mobile-responsive-wrapper[data-landscape="true"] {
          /* Optimisations pour le mode paysage */
        }
        
        .mobile-responsive-wrapper[data-reduce-animations="true"] * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        /* Optimisations pour les petits écrans */
        @media (max-width: 360px) {
          .mobile-responsive-wrapper {
            padding: 8px;
          }
          
          .mobile-responsive-wrapper * {
            font-size: 14px !important;
          }
        }
        
        /* Optimisations pour les écrans moyens */
        @media (min-width: 361px) and (max-width: 480px) {
          .mobile-responsive-wrapper {
            padding: 12px;
          }
        }
        
        /* Optimisations pour les grands écrans mobiles */
        @media (min-width: 481px) and (max-width: 768px) {
          .mobile-responsive-wrapper {
            padding: 16px;
          }
        }
      `}</style>
      
      <div 
        className={`mobile-responsive-wrapper ${className}`}
        data-breakpoint={breakpoint}
        data-device={deviceType}
        data-landscape={isLandscape}
        data-reduce-animations={shouldReduceAnimations}
        style={{
          ...(enableOptimizations && {
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          })
        }}
      >
        {children}
      </div>
    </>
  )
})

MobileResponsiveWrapper.displayName = 'MobileResponsiveWrapper'

/**
 * Composant pour gérer les contraintes d'espace mobile
 */
export const MobileSpaceManager = memo(({ 
  children,
  maxHeight = '100vh',
  enableScroll = true,
  className = ""
}) => {
  const { isMobile, isLandscape } = useMobileResponsive()
  const [availableHeight, setAvailableHeight] = useState(0)

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      setAvailableHeight(window.innerHeight)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    window.addEventListener('orientationchange', updateHeight)
    
    return () => {
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('orientationchange', updateHeight)
    }
  }, [])

  const getMaxHeight = () => {
    if (isMobile) {
      return isLandscape ? '100vh' : 'calc(var(--vh, 1vh) * 100)'
    }
    return maxHeight
  }

  return (
    <>
      <style jsx>{`
        .mobile-space-manager {
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .mobile-space-manager[data-mobile="true"] {
          height: 100vh;
          height: calc(var(--vh, 1vh) * 100);
        }
        
        .mobile-space-manager[data-mobile="true"][data-landscape="true"] {
          height: 100vh;
        }
        
        .mobile-space-content {
          height: 100%;
          overflow-y: ${enableScroll ? 'auto' : 'hidden'};
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        
        .mobile-space-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .mobile-space-content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .mobile-space-content::-webkit-scrollbar-thumb {
          background: rgba(192, 192, 192, 0.3);
          border-radius: 2px;
        }
      `}</style>
      
      <div 
        className={`mobile-space-manager ${className}`}
        data-mobile={isMobile}
        data-landscape={isLandscape}
        style={{ maxHeight: getMaxHeight() }}
      >
        <div className="mobile-space-content">
          {children}
        </div>
      </div>
    </>
  )
})

MobileSpaceManager.displayName = 'MobileSpaceManager'

/**
 * Hook pour gérer les contraintes de contenu mobile
 */
export const useMobileContentConstraints = () => {
  const { breakpoint, deviceType, viewportSize } = useMobileResponsive()
  const { isLowEndDevice, connectionSpeed } = useMobilePerformance()

  const getOptimalImageSize = useCallback(() => {
    if (breakpoint === 'xs') return { width: 300, height: 200 }
    if (breakpoint === 'sm') return { width: 400, height: 250 }
    if (breakpoint === 'md') return { width: 500, height: 300 }
    return { width: 600, height: 400 }
  }, [breakpoint])

  const getOptimalGridColumns = useCallback(() => {
    if (breakpoint === 'xs') return 1
    if (breakpoint === 'sm') return 2
    if (breakpoint === 'md') return 2
    if (breakpoint === 'lg') return 3
    return 4
  }, [breakpoint])

  const shouldLazyLoad = useCallback(() => {
    return isLowEndDevice || connectionSpeed === 'slow'
  }, [isLowEndDevice, connectionSpeed])

  const getOptimalFontSize = useCallback((baseSize = 16) => {
    const multipliers = {
      'xs': 0.875,
      'sm': 1,
      'md': 1,
      'lg': 1.125,
      'xl': 1.25,
      '2xl': 1.375
    }
    
    return Math.round(baseSize * (multipliers[breakpoint] || 1))
  }, [breakpoint])

  return {
    getOptimalImageSize,
    getOptimalGridColumns,
    shouldLazyLoad,
    getOptimalFontSize,
    maxContentWidth: viewportSize.width,
    isCompactMode: breakpoint === 'xs' || breakpoint === 'sm'
  }
}

export default {
  useMobileResponsive,
  useMobilePerformance,
  MobileResponsiveWrapper,
  MobileSpaceManager,
  useMobileContentConstraints
}

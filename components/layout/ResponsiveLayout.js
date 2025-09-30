import { useState, useEffect, memo, useCallback } from 'react'

const ResponsiveLayout = memo(({ children, className = '' }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // Optimisation: utiliser useCallback pour éviter les re-renders
  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth
    const newIsMobile = width < 768
    const newIsTablet = width >= 768 && width < 1024
    
    // Éviter les re-renders inutiles
    setIsMobile(prev => prev !== newIsMobile ? newIsMobile : prev)
    setIsTablet(prev => prev !== newIsTablet ? newIsTablet : prev)
  }, [])

  useEffect(() => {
    // Vérification initiale
    checkScreenSize()
    
    // Debounce pour éviter trop d'appels
    let timeoutId
    const debouncedCheckScreenSize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkScreenSize, 100)
    }

    window.addEventListener('resize', debouncedCheckScreenSize)
    
    return () => {
      window.removeEventListener('resize', debouncedCheckScreenSize)
      clearTimeout(timeoutId)
    }
  }, [checkScreenSize])

  return (
    <div 
      className={`responsive-layout ${className}`}
      data-mobile={isMobile}
      data-tablet={isTablet}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </div>
  )
})

ResponsiveLayout.displayName = 'ResponsiveLayout'

export default ResponsiveLayout

// Hook pour utiliser les breakpoints dans les composants
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState('desktop')

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < 640) setBreakpoint('mobile')
      else if (width < 768) setBreakpoint('sm')
      else if (width < 1024) setBreakpoint('tablet')
      else if (width < 1280) setBreakpoint('desktop')
      else setBreakpoint('xl')
    }

    checkBreakpoint()
    window.addEventListener('resize', checkBreakpoint)
    
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [])

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'xl',
    isSmall: breakpoint === 'mobile' || breakpoint === 'sm'
  }
}

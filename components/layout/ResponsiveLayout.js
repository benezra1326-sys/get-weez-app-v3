import { useState, useEffect } from 'react'

export default function ResponsiveLayout({ children, className = '' }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
}

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

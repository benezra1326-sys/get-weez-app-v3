import { useResponsive } from './layout/ResponsiveLayout'

export default function ResponsiveTest() {
  const { breakpoint, isMobile, isTablet, isDesktop, isSmall } = useResponsive()

  return (
    <div className="fixed bottom-4 right-4 z-50 p-3 rounded-lg glass-strong">
      <div className="text-xs space-y-1">
        <div className="text-primary font-semibold">Breakpoint: {breakpoint}</div>
        <div className="text-secondary">
          Mobile: {isMobile ? '✓' : '✗'} | 
          Tablet: {isTablet ? '✓' : '✗'} | 
          Desktop: {isDesktop ? '✓' : '✗'}
        </div>
        <div className="text-secondary">
          Small: {isSmall ? '✓' : '✗'}
        </div>
      </div>
    </div>
  )
}

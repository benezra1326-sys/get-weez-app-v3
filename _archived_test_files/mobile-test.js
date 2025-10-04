import { useState, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import MobileDemo from '../components/mobile/MobileDemo'
import { 
  useMobileResponsive, 
  useMobilePerformance,
  MobileResponsiveWrapper,
  MobilePerformanceOptimizer
} from '../components/mobile'

export default function MobileTest() {
  const { isMobile, deviceType, breakpoint } = useMobileResponsive()
  const { isLowEndDevice, connectionSpeed } = useMobilePerformance()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des optimisations mobiles...</p>
        </div>
      </div>
    )
  }

  return (
    <MobilePerformanceOptimizer enableOptimizations={true}>
      <MobileResponsiveWrapper className="min-h-screen bg-gray-50">
        <div className="mobile-container">
          {/* Header de test */}
          <div className="mobile-header bg-white shadow-sm">
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Test Mobile</h1>
                <p className="text-sm text-gray-600">
                  {deviceType} • {breakpoint} • {isMobile ? 'Mobile' : 'Desktop'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isLowEndDevice ? 'bg-red-500' : 'bg-green-500'
                }`} title={isLowEndDevice ? 'Appareil bas de gamme' : 'Appareil performant'}></div>
                <div className={`w-3 h-3 rounded-full ${
                  connectionSpeed === 'slow' ? 'bg-red-500' : 
                  connectionSpeed === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} title={`Connexion: ${connectionSpeed}`}></div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 overflow-y-auto">
            <MobileDemo />
          </div>

          {/* Footer de test */}
          <div className="mobile-header bg-gray-100 border-t">
            <div className="text-center text-sm text-gray-600">
              <p>Optimisations mobiles Get Weez • {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </MobileResponsiveWrapper>
    </MobilePerformanceOptimizer>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

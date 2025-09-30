import { useState, useEffect } from 'react'
import { 
  useMobileResponsive, 
  useMobilePerformance, 
  useMobileContentConstraints,
  MobileResponsiveWrapper,
  MobileSpaceManager,
  MobileButtonAnimation,
  MobileModalAnimation,
  MobileListAnimation,
  MobilePageTransition
} from './index'

/**
 * Composant de démonstration des optimisations mobiles
 */
export const MobileDemo = () => {
  const { breakpoint, deviceType, isMobile, isLandscape } = useMobileResponsive()
  const { isLowEndDevice, connectionSpeed, batteryLevel, shouldReduceAnimations } = useMobilePerformance()
  const { getOptimalImageSize, getOptimalGridColumns, shouldLazyLoad, getOptimalFontSize } = useMobileContentConstraints()
  
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  
  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'performance', label: 'Performance' },
    { id: 'gestures', label: 'Gestes' },
    { id: 'animations', label: 'Animations' }
  ]

  const demoItems = [
    { id: 1, title: 'Restaurant Le Jardin', description: 'Cuisine française raffinée' },
    { id: 2, title: 'Hôtel Marbella Club', description: 'Luxe et élégance sur la côte' },
    { id: 3, title: 'Spa Serenity', description: 'Détente et bien-être' },
    { id: 4, title: 'Bar Sunset', description: 'Cocktails avec vue sur mer' },
    { id: 5, title: 'Club de Golf', description: 'Parcours 18 trous' }
  ]

  return (
    <MobileResponsiveWrapper className="mobile-demo-container">
      <MobileSpaceManager maxHeight="100vh" enableScroll={true}>
        <div className="mobile-container mobile-safe-area">
          {/* Header mobile */}
          <div className="mobile-header">
            <h1 className="text-lg font-bold">Mobile Demo</h1>
            <MobileButtonAnimation
              onClick={() => setShowModal(true)}
              variant="primary"
              size="sm"
            >
              Ouvrir Modal
            </MobileButtonAnimation>
          </div>

          {/* Navigation par onglets */}
          <div className="p-4">
            <div className="flex space-x-2 mb-4">
              {tabs.map(tab => (
                <MobileButtonAnimation
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {tab.label}
                </MobileButtonAnimation>
              ))}
            </div>

            {/* Contenu des onglets */}
            <MobilePageTransition isVisible={true} direction="fade">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="mobile-list">
                    <div className="mobile-list-item">
                      <h3 className="font-semibold">Breakpoint</h3>
                      <p className="text-sm text-gray-600">{breakpoint}</p>
                    </div>
                    <div className="mobile-list-item">
                      <h3 className="font-semibold">Type d'appareil</h3>
                      <p className="text-sm text-gray-600">{deviceType}</p>
                    </div>
                    <div className="mobile-list-item">
                      <h3 className="font-semibold">Orientation</h3>
                      <p className="text-sm text-gray-600">{isLandscape ? 'Paysage' : 'Portrait'}</p>
                    </div>
                    <div className="mobile-list-item">
                      <h3 className="font-semibold">Mobile</h3>
                      <p className="text-sm text-gray-600">{isMobile ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <div className="mobile-list">
                    <div className="mobile-list-item">
                      <h3 className="font-semibold">Appareil bas de gamme</h3>
                      <p className="text-sm text-gray-600">{isLowEndDevice ? 'Oui' : 'Non'}</p>
                    </div>
                    <div className="mobile-list-item">
                      <h3 className="font-semibold">Vitesse de connexion</h3>
                      <p className="text-sm text-gray-600">{connectionSpeed}</p>
                    </div>
                    <div className="mobile-list-item">
                      <h3 className="font-semibold">Niveau de batterie</h3>
                      <p className="text-sm text-gray-600">{Math.round(batteryLevel * 100)}%</p>
                    </div>
                    <div className="mobile-list-item">
                      <h3 className="font-semibold">Réduire les animations</h3>
                      <p className="text-sm text-gray-600">{shouldReduceAnimations ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gestures' && (
                <div className="space-y-4">
                  <div className="mobile-gesture-area p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold mb-2">Zone de gestes</h3>
                    <p className="text-sm text-gray-600">
                      Touchez et glissez dans cette zone pour tester les gestes tactiles
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <MobileButtonAnimation variant="secondary" size="sm">
                      Tap
                    </MobileButtonAnimation>
                    <MobileButtonAnimation variant="secondary" size="sm">
                      Long Press
                    </MobileButtonAnimation>
                    <MobileButtonAnimation variant="secondary" size="sm">
                      Swipe Left
                    </MobileButtonAnimation>
                    <MobileButtonAnimation variant="secondary" size="sm">
                      Swipe Right
                    </MobileButtonAnimation>
                  </div>
                </div>
              )}

              {activeTab === 'animations' && (
                <div className="space-y-4">
                  <MobileListAnimation staggerDelay={100}>
                    {demoItems.map((item, index) => (
                      <div key={item.id} className="mobile-list-item mobile-animate-slide-up">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </MobileListAnimation>
                </div>
              )}
            </MobilePageTransition>

            {/* Boutons d'action */}
            <div className="mt-6 space-y-2">
              <MobileButtonAnimation
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => console.log('Action principale')}
              >
                Action Principale
              </MobileButtonAnimation>
              
              <div className="grid grid-cols-2 gap-2">
                <MobileButtonAnimation variant="secondary" size="md">
                  Secondaire
                </MobileButtonAnimation>
                <MobileButtonAnimation variant="ghost" size="md">
                  Fantôme
                </MobileButtonAnimation>
              </div>
            </div>
          </div>
        </div>
      </MobileSpaceManager>

      {/* Modal de démonstration */}
      <MobileModalAnimation isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Modal Mobile</h2>
          <p className="text-gray-600 mb-6">
            Ceci est une démonstration d'une modal optimisée pour mobile avec des animations fluides.
          </p>
          
          <div className="space-y-2">
            <MobileButtonAnimation
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setShowModal(false)}
            >
              Fermer
            </MobileButtonAnimation>
          </div>
        </div>
      </MobileModalAnimation>
    </MobileResponsiveWrapper>
  )
}

export default MobileDemo

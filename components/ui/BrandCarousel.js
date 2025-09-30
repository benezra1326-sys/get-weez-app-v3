import React, { memo, useMemo } from 'react'
import styles from '../../styles/ChatInterface.module.css'
import useChatTheme from '../../hooks/useChatTheme'

/**
 * Composant BrandCarousel optimisé
 * Affiche un carrousel des marques partenaires avec animation
 */
const BrandCarousel = memo(({ 
  className = '',
  ...props 
}) => {
  const { isDarkMode, themeClasses } = useChatTheme()

  // Données des marques mémorisées
  const brandData = useMemo(() => ({
    firstRow: [
      { name: 'Marriott', icon: '🏨' },
      { name: 'Nobu', icon: '🍽️' },
      { name: 'Nikki Beach', icon: '🏖️' },
      { name: 'HeliMarbella', icon: '🚁' },
      { name: 'Yacht Charter', icon: '🛥️' },
      { name: 'Valderrama Golf', icon: '🏆' },
      { name: 'Six Senses Spa', icon: '💆' },
      { name: 'Dom Pérignon', icon: '🍾' },
      { name: 'Rolls-Royce', icon: '🚗' },
      { name: 'NetJets', icon: '✈️' }
    ],
    secondRow: [
      { name: 'Four Seasons', icon: '🏨' },
      { name: 'Cipriani', icon: '🍽️' },
      { name: 'Puente Romano', icon: '🏖️' },
      { name: 'Pacha Marbella', icon: '🎵' },
      { name: 'Cartier', icon: '💎' },
      { name: 'Real Club Valderrama', icon: '🏆' },
      { name: 'Aman Spa', icon: '💆' },
      { name: 'Moët & Chandon', icon: '🍾' },
      { name: 'Bentley', icon: '🚗' },
      { name: 'VistaJet', icon: '✈️' }
    ]
  }), [])

  // Rendu d'une rangée de marques
  const renderBrandRow = memo(({ brands, animationClass, reverse = false }) => (
    <div className="relative overflow-hidden">
      <div className={`flex ${animationClass}`}>
        <div className="flex space-x-8 lg:space-x-12 items-center">
          {brands.map((brand, index) => (
            <div 
              key={`${brand.name}-${index}`}
              className={styles.brandItem}
            >
              <div className="text-white font-bold text-lg lg:text-xl">
                {brand.icon} {brand.name}
              </div>
            </div>
          ))}
          {/* Duplication pour l'animation continue */}
          {brands.map((brand, index) => (
            <div 
              key={`${brand.name}-duplicate-${index}`}
              className={styles.brandItem}
            >
              <div className="text-white font-bold text-lg lg:text-xl">
                {brand.icon} {brand.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))

  return (
    <div className={`${styles.brandCarousel} ${themeClasses.main} ${className}`} {...props}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className={`text-2xl lg:text-4xl font-bold mb-4 ${themeClasses.text.primary}`}>
            Ils nous font confiance
          </h2>
          <p className={`text-lg ${themeClasses.text.secondary}`}>
            Plus de 500+ partenaires premium nous font confiance
          </p>
        </div>
        
        {/* Premier carrousel - animation gauche à droite */}
        <renderBrandRow 
          brands={brandData.firstRow}
          animationClass={styles.animateScroll}
        />
        
        {/* Deuxième carrousel - animation droite à gauche */}
        <div className="mt-6 lg:mt-8">
          <renderBrandRow 
            brands={brandData.secondRow}
            animationClass={styles.animateScrollReverse}
            reverse
          />
        </div>
      </div>
    </div>
  )
})

BrandCarousel.displayName = 'BrandCarousel'

export default BrandCarousel

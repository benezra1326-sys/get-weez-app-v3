import React, { memo, useCallback } from 'react'
import { MessageCircle } from 'lucide-react'
import styles from '../../styles/ChatInterface.module.css'
import useMobileDetection from '../../hooks/useMobileDetection'

/**
 * Composant WelcomeCard optimisé
 * Affiche le message d'accueil dans l'état vide du chat
 */
const WelcomeCard = memo(({ 
  establishmentName,
  onFocus,
  className = '',
  ...props 
}) => {
  const { isMobile } = useMobileDetection()

  const handleCardClick = useCallback(() => {
    onFocus?.()
  }, [onFocus])

  return (
    <div className={`${styles.emptyState} ${className}`} {...props}>
      {/* Version mobile - design compact */}
      {isMobile && (
        <div 
          className={`${styles.welcomeCard} ${styles.mobileOnly}`}
          onClick={handleCardClick}
        >
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-white/20 backdrop-blur-sm mx-auto shadow-xl">
              <MessageCircle size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">
              Votre IA Concierge
            </h3>
            <p className="text-purple-100 text-sm px-2 leading-relaxed">
              Demandez-moi n'importe quoi sur Marbella !
            </p>
            
            {/* Animation dots */}
            <div className="mt-3 flex items-center justify-center space-x-1">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
              <div 
                className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" 
                style={{animationDelay: '0.2s'}}
              />
              <div 
                className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" 
                style={{animationDelay: '0.4s'}}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Version desktop - design premium */}
      <div className={`${styles.welcomeCard} ${styles.desktopOnly}`}>
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative">
          <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm mx-auto shadow-2xl">
            <MessageCircle size={48} className="text-white" />
          </div>
          <h3 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-4 text-white">
            Bienvenue sur Get Weez
          </h3>
          <p className="text-purple-100 text-sm lg:text-lg px-2 lg:px-4 leading-relaxed">
            Votre concierge IA personnel pour Marbella
          </p>
          
          {/* Animation dots */}
          <div className="mt-4 lg:mt-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
            <div 
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse" 
              style={{animationDelay: '0.2s'}}
            />
            <div 
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse" 
              style={{animationDelay: '0.4s'}}
            />
          </div>
        </div>
      </div>
      
      {/* Notification de réservation si applicable */}
      {establishmentName && (
        <div className={`bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 mb-4 mx-2 ${styles.mobileOnly}`}>
          <div className="flex items-center space-x-2">
            <span className="text-white text-lg">🍽️</span>
            <div>
              <p className="text-white font-medium text-sm">Demande de réservation</p>
              <p className="text-green-100 text-xs">Pour {establishmentName}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <p className="text-xs lg:text-base text-gray-400 px-4 lg:px-6 mt-4">
        <span className={styles.mobileOnly}>Tapez votre message ci-dessous</span>
        <span className={styles.desktopOnly}>Commencez à taper votre message ci-dessous pour commencer une conversation</span>
      </p>
    </div>
  )
})

WelcomeCard.displayName = 'WelcomeCard'

export default WelcomeCard
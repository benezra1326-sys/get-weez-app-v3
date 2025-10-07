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
      {/* Version mobile - design compact et centré */}
      {isMobile && (
        <div 
          className={`${styles.welcomeCard} ${styles.mobileOnly}`}
          onClick={handleCardClick}
          style={{
            background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(192, 192, 192, 0.6), 0 0 80px rgba(192, 192, 192, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Sparkles et paillettes en fond */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  background: 'linear-gradient(135deg, #fde047, #f59e0b)',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `sparkle-float ${2 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)'
                }}
              />
            ))}
          </div>

          {/* Effet de brillance animé */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
              animation: 'shimmer 3s ease-in-out infinite'
            }}
          />

          {/* Overlay léger pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Content centré */}
          <div className="relative w-full text-center px-6 py-4 flex flex-col items-center">
            {/* Icône principale centrée avec effet glow */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
              }}
            >
              <MessageCircle size={32} className="text-white" style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' }} />
            </div>
            
            {/* Titre avec style logo */}
            <h3 
              className="text-xl font-black mb-4 text-white tracking-tight"
              style={{ 
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                fontFamily: '"Proxima Soft Black", Montserrat, sans-serif'
              }}
            >
              Bienvenue sur Gliitz
            </h3>
            
            <p 
              className="text-white text-base px-2 leading-relaxed mb-5 font-medium" 
              style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)' }}
            >
              Votre concierge IA personnel pour Marbella
            </p>
            
            {/* Call-to-action pulsant */}
            <div 
              className="mt-5 px-6 py-3 rounded-full mx-auto inline-flex items-center gap-2 animate-pulse"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.2)',
                animationDuration: '2s'
              }}
            >
              <span className="text-2xl animate-bounce" style={{ animationDuration: '1s' }}>👆</span>
              <p className="text-white text-sm font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                Touchez pour commencer
              </p>
            </div>
            
            {/* Indicateur animé */}
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div 
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ 
                  background: 'linear-gradient(135deg, #fde047, #f59e0b)',
                  boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)'
                }}
              />
              <div 
                className="w-2.5 h-2.5 rounded-full animate-pulse" 
                style={{
                  background: 'linear-gradient(135deg, #fde047, #f59e0b)',
                  boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)',
                  animationDelay: '0.3s'
                }}
              />
              <div 
                className="w-2.5 h-2.5 rounded-full animate-pulse" 
                style={{
                  background: 'linear-gradient(135deg, #fde047, #f59e0b)',
                  boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)',
                  animationDelay: '0.6s'
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Version desktop - design premium */}
      <div 
        className={`${styles.welcomeCard} ${styles.desktopOnly}`}
        style={{
          background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0) !important'
        }}
      >
        {/* Overlay pour effet */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative">
          <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm mx-auto shadow-2xl">
            <MessageCircle size={48} className="text-white" />
          </div>
          <h3 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-4 text-white">
            Bienvenue sur Gliitz
          </h3>
          <p className="text-gray-100 text-sm lg:text-lg px-2 lg:px-4 leading-relaxed">
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
      
      {/* Instructions - Retirées pour mobile, gardées pour desktop */}
      <p className="text-xs lg:text-base text-gray-400 px-4 lg:px-6 mt-4">
        <span className={styles.desktopOnly}>Commencez à taper votre message ci-dessous pour commencer une conversation</span>
      </p>
    </div>
  )
})

WelcomeCard.displayName = 'WelcomeCard'

export default WelcomeCard

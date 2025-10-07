import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

/**
 * Bouton flottant discret pour accéder au chat depuis n'importe quelle page
 * Apparaît dès qu'on sort de l'espace chat, même sur l'accueil après scroll
 */
const ChatFloatingButton = ({ onOpenChat }) => {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Détecter si on est en mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Gérer le scroll pour afficher le bouton après avoir scrollé
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // Afficher après 300px de scroll
      if (scrollPosition > 300) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    // Ajouter l'écouteur de scroll
    window.addEventListener('scroll', handleScroll)
    
    // Vérifier la position initiale
    handleScroll()

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // Afficher TOUJOURS sur toutes les pages, même sur l'accueil (avec ou sans scroll)
    const shouldShow = true
    setIsVisible(shouldShow)
    
    // Animation d'entrée après 1 seconde
    if (shouldShow && !hasAnimated) {
      setTimeout(() => {
        setHasAnimated(true)
      }, 1000)
    }
  }, [router.pathname, hasScrolled, hasAnimated])

  const handleClick = () => {
    // Si on est sur mobile et sur la page d'accueil, ouvrir directement le chat
    if (isMobile && router.pathname === '/') {
      // Appeler la fonction pour ouvrir le chat mobile
      if (onOpenChat) {
        onOpenChat()
      } else {
        // Fallback : émettre un événement personnalisé
        window.dispatchEvent(new CustomEvent('openMobileChat'))
      }
    } else if (router.pathname === '/') {
      // Sur desktop, scroller vers le chat
      const chatElement = document.querySelector('main')
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Sinon rediriger vers l'accueil
      router.push('/')
    }
  }

  const handleMouseEnter = () => {
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    setIsExpanded(false)
  }

  if (!isVisible) return null

  return (
    <>
      <style jsx>{`
        @keyframes float-in {
          0% {
            transform: translateY(100px) scale(0);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes gentle-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes sparkle-rotate {
          0% {
            transform: rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0.6;
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.8;
          }
        }

        .chat-floating-button {
          animation: float-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .chat-floating-button.animated {
          animation: gentle-bounce 3s ease-in-out infinite;
        }

        .sparkle-icon {
          animation: sparkle-rotate 4s linear infinite;
        }

        .pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }

        /* Z-index très élevé UNIQUEMENT sur mobile */
        @media (max-width: 1023px) {
          .chat-floating-button {
            z-index: 999999 !important;
          }
        }
      `}</style>

      <div
        className={`chat-floating-button ${hasAnimated ? 'animated' : ''}`}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999999,
          pointerEvents: 'auto',
          willChange: 'transform',
          transform: 'translateZ(0)',
          isolation: 'isolate'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Anneaux de pulsation */}
        <div 
          className="absolute inset-0 rounded-full pulse-ring"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3))',
            filter: 'blur(8px)',
            transform: 'scale(1.2)'
          }}
        />

        {/* Sparkles flottants */}
        {isExpanded && (
          <>
            <div className="absolute -top-4 -left-4 sparkle-icon">
              <Sparkles size={16} className="text-yellow-400" />
            </div>
            <div className="absolute -top-2 -right-4 sparkle-icon" style={{ animationDelay: '1s' }}>
              <Sparkles size={14} className="text-purple-400" />
            </div>
            <div className="absolute -bottom-4 -right-2 sparkle-icon" style={{ animationDelay: '2s' }}>
              <Sparkles size={12} className="text-blue-400" />
            </div>
          </>
        )}

        {/* Bouton principal */}
        <button
          onClick={handleClick}
          className="relative group transition-all duration-300"
          style={{
            width: isExpanded ? '180px' : '56px',
            height: '56px',
            borderRadius: isExpanded ? '28px' : '50%',
            background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: isExpanded
              ? '0 12px 48px rgba(168, 85, 247, 0.6), 0 0 0 0 rgba(168, 85, 247, 0.4)'
              : '0 8px 32px rgba(168, 85, 247, 0.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            padding: isExpanded ? '0 16px' : '0',
            overflow: 'hidden'
          }}
        >
          {/* Effet de brillance au hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
              animation: 'shimmer 2s ease-in-out infinite'
            }}
          />

          {/* Icône */}
          <div className="relative z-10 flex items-center">
            <MessageCircle 
              size={24} 
              className="text-white transition-transform duration-300 group-hover:scale-110"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
              }}
            />
            
            {/* Texte quand expanded */}
            {isExpanded && (
              <span 
                className="ml-3 text-white font-bold text-sm whitespace-nowrap"
                style={{
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                {router.pathname === '/' ? 'Ouvrir le chat' : 'Accéder au chat'}
              </span>
            )}
          </div>

          {/* Badge de notification (optionnel) */}
          {!isExpanded && (
            <div 
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
              }}
            >
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}
        </button>

        {/* Tooltip discret */}
        {!isExpanded && (
          <div 
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              whiteSpace: 'nowrap'
            }}
          >
            <div 
              className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{
                background: isDarkMode 
                  ? 'rgba(31, 41, 55, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                color: isDarkMode ? '#fff' : '#1f2937',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              Besoin d'aide ? Chattez avec moi ! 💬
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ChatFloatingButton


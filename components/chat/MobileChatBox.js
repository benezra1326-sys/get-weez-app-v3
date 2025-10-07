import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Send, MapPin, Loader2, History } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import MessageBubble from './MessageBubble'

/**
 * Chat box mobile qui s'ouvre/ferme avec bouton fermer dans le header
 * Inclut bouton de géolocalisation fonctionnel
 */
export default function MobileChatBox({ 
  messages = [], 
  isLoading, 
  onSendMessage,
  onClose,
  onShowHistory,
  isOpen = false 
}) {
  const { isDarkMode } = useTheme()
  const [input, setInput] = useState('')
  const [location, setLocation] = useState(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Debug: afficher les messages reçus
  useEffect(() => {
    console.log('📨 MobileChatBox - Messages reçus:', messages.length, messages)
  }, [messages])

  // Détection iOS et application de styles spécifiques
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      document.body.classList.add('ios-device')
    }
    
    return () => {
      document.body.classList.remove('ios-device')
    }
  }, [])

  // Gérer l'ouverture/fermeture du chat - Cacher le header et footer du site
  useEffect(() => {
    if (isOpen) {
      // Ajouter une classe au body pour cacher le header/footer
      document.body.classList.add('mobile-chat-open')
      
      // Pour iPhone : bloquer le scroll du body COMPLÈTEMENT
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (isIOS) {
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        document.body.style.height = '100%'
        document.body.style.top = '0'
        document.body.style.left = '0'
        document.body.style.touchAction = 'none'
        
        // Empêcher le zoom et les gestes sur iPhone
        document.documentElement.classList.add('mobile-chat-open')
        document.documentElement.style.overflow = 'hidden'
        document.documentElement.style.position = 'fixed'
        document.documentElement.style.height = '100%'
        document.documentElement.style.width = '100%'
        document.documentElement.style.touchAction = 'none'
      }
    } else {
      // Retirer la classe et débloquer le scroll
      document.body.classList.remove('mobile-chat-open')
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.touchAction = ''
      
      // Restaurer le documentElement
      document.documentElement.classList.remove('mobile-chat-open')
      document.documentElement.style.overflow = ''
      document.documentElement.style.position = ''
      document.documentElement.style.height = ''
      document.documentElement.style.width = ''
      document.documentElement.style.touchAction = ''
    }
    
    // Cleanup au démontage
    return () => {
      document.body.classList.remove('mobile-chat-open')
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.touchAction = ''
      
      document.documentElement.classList.remove('mobile-chat-open')
      document.documentElement.style.overflow = ''
      document.documentElement.style.position = ''
      document.documentElement.style.height = ''
      document.documentElement.style.width = ''
      document.documentElement.style.touchAction = ''
    }
  }, [isOpen])

  // Détecter si l'utilisateur a scrollé vers le haut
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 30
      setShowScrollButton(!isAtBottom)
      console.log('📊 Scroll détecté:', { scrollTop, scrollHeight, clientHeight, isAtBottom })
    }
  }

  // Auto-scroll vers le bas UNIQUEMENT quand de NOUVEAUX messages arrivent
  const prevMessagesLengthRef = useRef(messages.length)
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      setShowScrollButton(false)
      console.log('⬇️ Scroll vers le bas effectué')
    }
  }

  useEffect(() => {
    // Scroll seulement si un nouveau message est ajouté OU à l'ouverture initiale
    if (messages.length > 0 && (messages.length > prevMessagesLengthRef.current || prevMessagesLengthRef.current === 0)) {
      setTimeout(() => scrollToBottom(), 100)
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages, isOpen])

  // Géolocalisation
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      setIsGettingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          setInput(prev => `${prev} [Ma position: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`)
          setIsGettingLocation(false)
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error)
          setIsGettingLocation(false)
          alert('Impossible d\'obtenir votre position. Veuillez autoriser l\'accès à la localisation.')
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      alert('La géolocalisation n\'est pas disponible sur votre appareil.')
    }
  }

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  // Rendre via Portal pour éviter d'être masqué par le CSS parent
  return typeof window !== 'undefined' ? createPortal(
    <>
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .chat-box-container {
          animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Styles spécifiques pour éviter les conflits CSS */
        .chat-box-container .chat-input {
          font-size: 16px !important;
          line-height: 1.5 !important;
          border-radius: 16px !important;
          outline: none !important;
          -webkit-appearance: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        .chat-box-container .chat-input:focus {
          outline: none !important;
          border-color: ${isDarkMode ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.4)'} !important;
        }

        /* Styles spécifiques pour iOS - Empêcher le scroll et la bande grise */
        @supports (-webkit-touch-callout: none) {
          .chat-box-container {
            -webkit-overflow-scrolling: touch !important;
            overflow: hidden !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            height: 100dvh !important;
            height: -webkit-fill-available !important;
            display: flex !important;
            flex-direction: column !important;
            touch-action: pan-y !important;
          }
          
          .chat-box-container .chat-header {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 60px !important;
            z-index: 1000 !important;
            background: ${isDarkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)'} !important;
            backdrop-filter: blur(20px) !important;
            border-bottom: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'} !important;
          }
          
          .chat-box-container .messages-container {
            -webkit-overflow-scrolling: touch !important;
            overscroll-behavior: contain !important;
            overscroll-behavior-y: contain !important;
            position: absolute !important;
            top: 60px !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 130px !important;
            height: calc(100vh - 190px) !important;
            height: calc(100dvh - 190px) !important;
            height: calc(-webkit-fill-available - 190px) !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            touch-action: pan-y !important;
          }
          
          /* Empêcher la bande grise sur iPhone - Version corrigée */
          .chat-box-container .input-zone {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            padding-bottom: env(safe-area-inset-bottom, 20px) !important;
            background: ${isDarkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)'} !important;
            backdrop-filter: blur(20px) !important;
            border-top: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'} !important;
            min-height: auto !important;
            z-index: 1000 !important;
            /* Supprimer toute bande grise */
            margin: 0 !important;
            border-bottom: none !important;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1) !important;
          }
        }

        /* Styles supplémentaires pour les appareils iOS détectés */
        body.ios-device .chat-box-container {
          display: block !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          height: 100vh !important;
          overflow: hidden !important;
        }

        body.ios-device .chat-box-container .messages-container {
          position: absolute !important;
          top: 60px !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 130px !important;
          height: calc(100vh - 190px) !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }

        body.ios-device .chat-box-container .input-zone {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          padding-bottom: env(safe-area-inset-bottom, 20px) !important;
          background: ${isDarkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)'} !important;
          backdrop-filter: blur(20px) !important;
          border-top: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'} !important;
          min-height: auto !important;
        }
        
        /* Correction spécifique pour empêcher le soulèvement de l'input */
        @supports (-webkit-touch-callout: none) {
          .chat-box-container .input-zone textarea {
            -webkit-user-select: text !important;
            -webkit-touch-callout: default !important;
            -webkit-appearance: none !important;
            border-radius: 16px !important;
            transform: translateZ(0) !important;
          }
          
          /* Empêcher le zoom automatique sur focus */
          .chat-box-container .input-zone textarea {
            font-size: 16px !important;
          }
          
          /* Empêcher le déplacement de la viewport */
          .chat-box-container {
            position: fixed !important;
            height: 100vh !important;
            height: 100dvh !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Chat Box - Page dédiée plein écran */}
      <div 
        className="chat-box-container"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(10, 10, 15, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          height: '100dvh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 101,
          overflow: 'hidden'
        }}
      >
        {/* Header FIXE en haut */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
            background: isDarkMode 
              ? 'rgba(31, 41, 55, 0.98)'
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0,
            minHeight: '60px',
            maxHeight: '60px'
          }}
        >
          {/* Bouton Historique */}
          {onShowHistory && (
            <button
              onClick={onShowHistory}
              className="p-2 rounded-full transition-all duration-300"
              style={{
                background: isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(243, 244, 246, 0.8)'
              }}
              title="Historique"
            >
              <History size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
            </button>
          )}

          <div className="flex-1 flex flex-col items-center justify-center">
            <h3 
              className="font-black text-xl"
              style={{
                fontFamily: '"Proxima Soft Black", Montserrat, sans-serif',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #C0C0C0 0%, #C0C0C0 50%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              💬 Chat Gliitz
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton géolocalisation */}
            <button
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              className="p-2 rounded-full transition-all duration-300"
              style={{
                background: location 
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : isDarkMode 
                    ? 'rgba(75, 85, 99, 0.6)' 
                    : 'rgba(243, 244, 246, 0.8)',
                boxShadow: location ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
              }}
              title="Partager ma position"
            >
              {isGettingLocation ? (
                <Loader2 size={20} className="text-white animate-spin" />
              ) : (
                <MapPin 
                  size={20} 
                  className={location ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                />
              )}
            </button>

            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: isDarkMode 
                  ? 'rgba(75, 85, 99, 0.6)' 
                  : 'rgba(243, 244, 246, 0.8)'
              }}
            >
              <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
            </button>
          </div>
        </div>

        {/* Messages - Zone scrollable au milieu */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="overflow-y-auto p-4 messages-container"
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            minHeight: 0,
            touchAction: 'pan-y',
            position: 'relative',
            zIndex: 5,
            flex: '1 1 auto',
            paddingBottom: '130px'
          }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.2))'
                  }}
                >
                  <span className="text-3xl">💬</span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Commencez une conversation...
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble key={message.id || index} message={message} />
              ))}
              <div ref={messagesEndRef} style={{ height: '1px' }} />
            </>
          )}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                style={{
                  background: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(243, 244, 246, 0.8)'
                }}
              >
              <Loader2 size={16} className="animate-spin text-purple-500" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Gliitz réfléchit...
              </span>
              </div>
            </div>
          )}
        </div>

        {/* Bouton scroll to bottom */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute right-4 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(99, 102, 241, 0.95))',
              backdropFilter: 'blur(10px)',
              bottom: '130px',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.5)'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </button>
        )}

        {/* Input Zone FIXE en bas */}
        <div 
          className="border-t input-zone"
          style={{
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
            background: isDarkMode 
              ? 'rgba(31, 41, 55, 0.98)'
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
            paddingTop: '20px',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingBottom: 'env(safe-area-inset-bottom, 20px)',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 1000,
            flexShrink: 0,
            minHeight: 'auto',
            margin: 0,
            borderBottom: 'none',
            /* Supprimer toute bande grise sur iPhone */
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  // Laisser le clavier s'afficher naturellement
                  // Pas d'interférence avec le comportement par défaut
                }}
                placeholder="Écrivez votre message..."
                className="w-full px-5 py-4 rounded-2xl resize-none focus:outline-none chat-input"
                style={{
                  background: isDarkMode 
                    ? 'rgba(55, 65, 81, 0.8)' 
                    : 'rgba(243, 244, 246, 0.8)',
                  color: isDarkMode ? '#fff' : '#1f2937',
                  border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'}`,
                  maxHeight: '80px',
                  minHeight: '60px',
                  height: '60px',
                  fontSize: '16px', // Important: 16px pour éviter le zoom sur iOS
                  lineHeight: '1.5',
                  borderRadius: '16px',
                  outline: 'none',
                  WebkitAppearance: 'none',
                  WebkitUserSelect: 'text',
                  WebkitTouchCallout: 'default',
                  transform: 'translateZ(0)'
                }}
                rows={2}
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                width: '60px',
                height: '60px',
                minWidth: '60px',
                minHeight: '60px',
                maxWidth: '60px',
                maxHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : (
                <Send size={24} className="text-white" />
              )}
            </button>
          </div>
          
          {/* Indicateur de position si activée */}
          {location && (
            <div className="mt-2 flex items-center gap-2 text-xs"
              style={{ color: isDarkMode ? '#10b981' : '#059669' }}
            >
              <MapPin size={14} />
              <span>Position partagée</span>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  ) : null
}


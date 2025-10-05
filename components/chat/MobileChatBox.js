import React, { useState, useRef, useEffect } from 'react'
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

  // Détecter si l'utilisateur a scrollé vers le haut
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isAtBottom)
    }
  }

  // Auto-scroll vers le bas UNIQUEMENT quand de NOUVEAUX messages arrivent
  const prevMessagesLengthRef = useRef(messages.length)
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      setShowScrollButton(false)
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

  return (
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
      `}</style>

      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Chat Box - Page dédiée plein écran */}
      <div 
        className="chat-box-container fixed inset-0 z-[101]"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(10, 10, 15, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        {/* Header avec bouton historique, fermer et géolocalisation */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
            background: isDarkMode 
              ? 'rgba(31, 41, 55, 0.8)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
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
              className={`font-black text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              style={{
                fontFamily: '"Proxima Soft Black", Montserrat, sans-serif',
                letterSpacing: '-0.02em'
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

        {/* Messages - Zone scrollable */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4"
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            flex: '1 1 0',
            minHeight: 0
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
            className="absolute bottom-32 right-4 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(99, 102, 241, 0.9))',
              backdropFilter: 'blur(10px)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </button>
        )}

        {/* Input Zone - En bas du conteneur, toujours visible */}
        <div 
          className="p-4 border-t"
          style={{
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
            background: isDarkMode 
              ? 'rgba(31, 41, 55, 0.98)'
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            flexShrink: 0,
            width: '100%',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  // Ne rien faire, laisser le comportement natif
                }}
                placeholder="Écrivez votre message..."
                className="w-full px-4 py-3 rounded-2xl resize-none focus:outline-none chat-input"
                style={{
                  background: isDarkMode 
                    ? 'rgba(55, 65, 81, 0.8)' 
                    : 'rgba(243, 244, 246, 0.8)',
                  color: isDarkMode ? '#fff' : '#1f2937',
                  border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'}`,
                  maxHeight: '60px',
                  minHeight: '48px'
                }}
                rows={1}
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
              }}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                <Send size={20} className="text-white" />
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
    </>
  )
}


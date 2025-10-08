import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Mic, Send, Loader, Sparkles, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContextSimple'
import V3Sidebar from '../components/layout/V3Sidebar'
import DynamicSuggestions from '../components/chat/DynamicSuggestions'
import CitySelector from '../components/location/CitySelector'
import ThemeTransition from '../components/ui/ThemeTransition'
import { elevenLabs } from '../lib/elevenlabs'

const Home = ({ user, setUser }) => {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const recognitionRef = useRef(null)
  const [conversations] = useState([
    { id: 1, title: 'Réservation tables d\'exception', date: 'Aujourd\'hui', preview: 'Je cherche un restaurant...' },
    { id: 2, title: 'Organisation événement VIP', date: 'Hier', preview: 'Événements privés exclusifs...' },
    { id: 3, title: 'Services de conciergerie', date: 'Il y a 2 jours', preview: 'Services premium...' }
  ])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const handleNewChat = () => {
    setMessages([])
    setInput('')
    setCurrentConversationId(null)
  }

  // Save conversation after first message
  useEffect(() => {
    if (messages.length > 0 && !currentConversationId) {
      // Create conversation title from first user message
      const firstUserMessage = messages.find(m => m.role === 'user')
      if (firstUserMessage) {
        const title = firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
        setCurrentConversationId(Date.now())
        // TODO: Save to Supabase
        console.log('Conversation created:', title)
      }
    }
  }, [messages, currentConversationId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Check for message in URL
  useEffect(() => {
    const { msg } = router.query
    if (msg && typeof msg === 'string') {
      setInput(msg)
      // Clean URL
      router.replace('/', undefined, { shallow: true })
    }
  }, [router.query])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('API Error')
      }

      const data = await response.json()
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.message || "Je suis Gliitz, votre assistant IA de luxe. Comment puis-je sublimer votre expérience à Marbella aujourd'hui ?",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Play response with ElevenLabs if available
      if (data.message) {
        elevenLabs.playAudio(data.message).catch(err => console.log('Audio playback not available:', err))
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Je suis Gliitz, votre concierge de luxe. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
    } else {
      // Start recording
      setIsRecording(true)
      recognitionRef.current = elevenLabs.startSpeechRecognition(
        (transcript) => {
          setInput(transcript)
          setIsRecording(false)
        },
        () => {
          setIsRecording(false)
        }
      )
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen flex" style={{
      background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
    }}>
      {/* Transition de thème */}
      <ThemeTransition />
      
      {/* Sidebar Component */}
      <V3Sidebar conversations={conversations} onNewChat={handleNewChat} />

      {/* Close/Reset Chat Button */}
      {messages.length > 0 && (
        <button
          onClick={() => setShowDeleteModal(true)}
          className="fixed top-4 right-4 z-50 p-3 rounded-xl transition-all group"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(192,192,192,0.3)',
            boxShadow: '0 4px 15px rgba(192,192,192,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(192,192,192,0.2)'
          }}
          title="Fermer la conversation"
        >
          <X size={24} className="text-gray-700 group-hover:text-white transition-colors" />
        </button>
      )}

      {/* Modal de suppression élégant */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ 
            background: 'rgba(0, 0, 0, 0.6)', 
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="glass-live-strong max-w-md w-full p-8 rounded-3xl"
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icône */}
            <div 
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3))',
                border: '2px solid rgba(239, 68, 68, 0.5)'
              }}
            >
              <X size={32} style={{ color: '#EF4444' }} />
            </div>

            {/* Titre */}
            <h2 
              className="text-2xl font-bold mb-3 text-center"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
              }}
            >
              Supprimer la conversation ?
            </h2>

            {/* Description */}
            <p 
              className="text-center mb-8"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                fontSize: '15px'
              }}
            >
              Cette action est irréversible. Tous les messages de cette conversation seront définitivement supprimés.
            </p>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl font-medium transition-all"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(167,199,197,0.3)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }}
              >
                Annuler
              </button>
              
              <button
                onClick={() => {
                  setMessages([])
                  setInput('')
                  setShowDeleteModal(false)
                }}
                className="flex-1 py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  color: '#FFFFFF',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #DC2626, #B91C1C)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)'
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden" style={{
        background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
      }}>
        {/* Welcome Message (shown when no messages) */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-4 md:p-6">
            <div className="text-center max-w-3xl w-full">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 sparkle-effect sparkle-mirror halo-pulsing"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)'
                    : 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)',
                  boxShadow: isDarkMode 
                    ? '0 10px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.1)'
                    : '0 10px 35px rgba(0, 0, 0, 0.3), 0 4px 15px rgba(0, 0, 0, 0.2)',
                  animation: 'sparkle-float 4s ease-in-out infinite, halo-pulse 5s ease-in-out infinite',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Sparkles 
                  size={36} 
                  style={{ 
                    color: '#FFFFFF',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))'
                  }} 
                />
              </div>

              <div className="relative w-full flex justify-center mb-3">
                {/* Bande animée en arrière-plan */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500 flex justify-center"
                  style={{
                    zIndex: -1
                  }}
                >
                  <div
                    style={{
                      background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(244, 229, 161, 0.15))'
                        : 'linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.08))',
                      transform: 'scaleX(1.05)',
                      filter: 'blur(10px)',
                      opacity: 0.8,
                      width: 'fit-content',
                      height: '100%',
                      borderRadius: '16px',
                      padding: '0 2rem'
                    }}
                  />
                </div>
                
                <h1 
                  className="text-3xl md:text-4xl font-bold px-6 py-2 relative text-center"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #A7C7C5 0%, #9DB4C0 100%)'
                      : 'linear-gradient(135deg, #5A8B89 0%, #7A9B99 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2'
                  }}
                >
                  Bonjour, je suis Gliitz
                </h1>
              </div>

              <p 
                className="text-base md:text-lg mb-6 leading-relaxed"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#555555',
                  fontWeight: 300,
                  letterSpacing: '0.01em'
                }}
              >
                Dites-moi ce qui vous ferait plaisir...<br />
                <span style={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#888888', 
                  fontSize: '0.9em',
                  fontStyle: 'italic'
                }}>
                  Une envie ? Il vous suffit de me la dire
                </span>
              </p>

              {/* Sélecteur de ville */}
              <div className="mb-6 flex justify-center">
                <CitySelector 
                  onCitySelect={(city) => console.log('Ville sélectionnée:', city)}
                />
                    </div>

              {/* Suggestions dynamiques avec rotation */}
              <div className="mb-6">
                <DynamicSuggestions 
                  onSuggestionClick={(text) => {
                    setInput(text)
                    // Envoyer le message automatiquement
                    setTimeout(() => {
                      const userMessage = {
                        id: Date.now(),
                        role: 'user',
                        content: text,
                        timestamp: new Date()
                      }
                      setMessages([userMessage])
                      setInput('')
                      setIsLoading(true)

                      fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          messages: [{ role: 'user', content: text }]
                        })
                      })
                      .then(res => res.json())
                      .then(data => {
                        const assistantMessage = {
                          id: Date.now() + 1,
                          role: 'assistant',
                          content: data.message || "Je suis Gliitz, votre assistant IA de luxe. Comment puis-je sublimer votre expérience à Marbella aujourd'hui ?",
                          timestamp: new Date()
                        }
                        setMessages(prev => [...prev, assistantMessage])
                        if (data.message) {
                          elevenLabs.playAudio(data.message).catch(err => console.log('Audio playback not available:', err))
                        }
                      })
                      .catch(error => {
                        console.error('Error:', error)
                        const errorMessage = {
                          id: Date.now() + 1,
                          role: 'assistant',
                          content: "Je suis Gliitz, votre concierge de luxe. Comment puis-je vous aider aujourd'hui ?",
                          timestamp: new Date()
                        }
                        setMessages(prev => [...prev, errorMessage])
                      })
                      .finally(() => setIsLoading(false))
                    }, 100)
                  }}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Messages List */}
        {messages.length > 0 && (
          <div className="flex-1 px-4 py-8 md:px-8 lg:px-12" style={{ overflowY: 'auto' }}>
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] px-6 py-4 rounded-2xl ${
                      message.role === 'user' 
                        ? 'rounded-br-sm chat-bubble-user' 
                        : 'rounded-bl-sm chat-bubble-assistant'
                    }`}
                  style={
                    message.role === 'user'
                      ? {
                          background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.8)',
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                          border: `1px solid rgba(255, 255, 255, 0.25)`,
                          backdropFilter: 'blur(16px) saturate(180%)'
                        }
                      : {
                          background: isDarkMode 
                            ? 'rgba(167, 199, 197, 0.08)'
                            : 'rgba(167, 199, 197, 0.12)',
                          backdropFilter: 'blur(16px) saturate(180%)',
                          border: '1px solid rgba(167, 199, 197, 0.3)',
                          color: isDarkMode ? '#FFFFFF' : '#2c2c2c',
                          boxShadow: '0 4px 30px rgba(167, 199, 197, 0.2)'
                        }
                  }
                  >
                    <p 
                      className="whitespace-pre-wrap leading-relaxed"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {message.content}
                    </p>
                    <p className="text-xs mt-2 opacity-50">
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  </div>
                ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="typing-indicator"
                    style={{
                      background: isDarkMode 
                        ? 'rgba(167, 199, 197, 0.08)'
                        : 'rgba(167, 199, 197, 0.12)',
                      backdropFilter: 'blur(16px) saturate(180%)',
                      border: '1px solid rgba(167, 199, 197, 0.3)',
                      color: isDarkMode ? '#FFFFFF' : '#2c2c2c',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <span style={{ fontFamily: 'Poppins, sans-serif', marginLeft: '8px' }}>Gliitz réfléchit...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Bar - Fixed at bottom */}
        <div 
          className="p-4 md:p-6 border-t"
          style={{ 
            background: isDarkMode ? '#000000' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(192, 192, 192, 0.2)'}`
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="flex items-end gap-3 p-2 rounded-2xl"
        style={{ 
                background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(192, 192, 192, 0.3)'}`,
                boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(192, 192, 192, 0.2)'
              }}
            >
              {/* Voice Button */}
              <button
                onClick={toggleVoiceRecording}
                className={`p-3 rounded-xl transition-all ${isRecording ? 'animate-pulse' : ''}`}
                style={{
                  color: isRecording 
                    ? '#ef4444' 
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666'),
                  background: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isRecording) {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isRecording) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
                disabled={isLoading}
                title={isRecording ? 'Arrêter l\'enregistrement' : 'Commande vocale'}
              >
                <Mic size={22} />
              </button>

              {/* Text Input */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Demandez-moi n'importe quoi..."
                className="flex-1 bg-transparent outline-none resize-none px-2 py-3 max-h-32"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
                rows={1}
                disabled={isLoading}
              />

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition-all ${
                  input.trim() && !isLoading
                    ? 'text-white'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                style={
                  input.trim() && !isLoading
                    ? {
                        background: isDarkMode 
                          ? 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)'
                          : 'linear-gradient(135deg, #0B0B0C 0%, #1a1a1a 100%)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                      }
                    : {
                        background: 'rgba(128, 128, 128, 0.2)'
                      }
                }
              >
                {isLoading ? <Loader className="animate-spin" size={22} /> : <Send size={22} />}
              </button>
          </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

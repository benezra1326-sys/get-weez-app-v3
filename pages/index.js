import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Mic, Send, Loader, Sparkles, X, Radio } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContextSimple'
import V3Sidebar from '../components/layout/V3Sidebar'
import ContextualSuggestions from '../components/chat/ContextualSuggestions'
import ReactiveMessage from '../components/chat/ReactiveMessage'
import VoiceToVoiceMode from '../components/chat/VoiceToVoiceMode'
import SimpleDictation from '../components/chat/SimpleDictation'
import CitySelector from '../components/location/CitySelector'
import ThemeTransition from '../components/ui/ThemeTransition'
import { elevenLabs } from '../lib/elevenlabs'
import { feedbackSystem } from '../lib/feedbackSystem'
import { preferencesManager } from '../lib/userPreferences'
import { initializeLanguage, getTextDirection } from '../lib/autoLanguageDetection'
import { useConversations } from '../hooks/useConversations'

const Home = ({ user, setUser }) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { isDarkMode } = useTheme()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showVoiceToVoice, setShowVoiceToVoice] = useState(false)
  const [playingMessageId, setPlayingMessageId] = useState(null)
  const recognitionRef = useRef(null)
  
  // Utiliser le hook useConversations
  const {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    addMessage
  } = useConversations()
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Initialiser la langue automatiquement au chargement
  useEffect(() => {
    const detectedLang = initializeLanguage()
    console.log('🌍 Langue de l\'application:', detectedLang)
    
    // Appliquer la direction du texte (RTL pour arabe, hébreu, etc.)
    const direction = getTextDirection(detectedLang)
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction
      document.documentElement.lang = detectedLang
    }
  }, [])

  const handleNewChat = () => {
    // Si on est déjà sur une conversation vide, on ne fait rien mais on focus l'input
    if (currentConversationId && messages.length === 0) {
      console.log('Déjà sur une conversation vide')
      setInput('') // Juste vider l'input si l'utilisateur avait commencé à taper
      // Focus sur l'input pour montrer que c'est prêt
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return
    }
    
    // Sinon, créer une nouvelle conversation
    const newConversationId = createConversation()
    setInput('')
    console.log('Nouvelle conversation créée:', newConversationId)
    
    // Focus sur l'input
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleVoiceTranscription = (transcript) => {
    // Créer une nouvelle conversation si nécessaire
    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = createConversation()
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: transcript,
      timestamp: new Date()
    }

    // Ajouter le message utilisateur
    addMessage(userMessage, conversationId)
    setIsLoading(true)

    // Envoyer à l'API
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: transcript }],
        userId: user?.id
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
      addMessage(assistantMessage, conversationId)
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
      addMessage(errorMessage, conversationId)
    })
    .finally(() => setIsLoading(false))
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

    // Feedback audio/visuel
    feedbackSystem.send()

    // S'assurer qu'on a une conversation active
    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = createConversation()
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    // Ajouter le message utilisateur via le hook
    addMessage(userMessage, conversationId)
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
          })),
          userId: user?.id // Passer l'ID utilisateur pour les préférences
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

      // Feedback audio pour la réception
      feedbackSystem.receive()

      // Ajouter le message assistant via le hook
      addMessage(assistantMessage, conversationId)
      
      // Play response with ElevenLabs if auto-voice is enabled
      const autoVoice = preferencesManager.get('chat.autoVoice')
      if (autoVoice && data.message) {
        setPlayingMessageId(assistantMessage.id)
        elevenLabs.playAudio(data.message)
          .then(() => setPlayingMessageId(null))
          .catch(err => {
            console.log('Audio playback not available:', err)
            setPlayingMessageId(null)
          })
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
      <V3Sidebar 
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
      />

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
                  handleNewChat()
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
              <div className="flex justify-center mb-4">
                <Sparkles 
                  size={48} 
                  style={{ 
                    color: isDarkMode ? '#C0C0C0' : '#A7C7C5',
                    animation: 'sparkle-pulse 2s ease-in-out infinite'
                    }}
                  />
                </div>
                
                <h1 
                  className="welcome-title text-3xl md:text-4xl font-bold mb-3"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#A7C7C5' : '#5A8B89',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2',
                    textAlign: 'center',
                    margin: '0',
                    padding: '0',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  Bonjour, je suis Gliitz
                </h1>

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

              {/* Suggestions contextuelles avec rotation */}
              <div className="mb-6">
                <ContextualSuggestions 
                  onSuggestionClick={(text) => {
                    // Créer une nouvelle conversation si nécessaire
                    let conversationId = currentConversationId
                    if (!conversationId) {
                      conversationId = createConversation()
                    }

                      const userMessage = {
                        id: Date.now(),
                        role: 'user',
                        content: text,
                        timestamp: new Date()
                      }

                    // Ajouter le message utilisateur
                    addMessage(userMessage, conversationId)
                      setIsLoading(true)

                    // Envoyer à l'API
                      fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                        messages: [{ role: 'user', content: text }],
                        userId: user?.id
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
                      addMessage(assistantMessage, conversationId)
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
                      addMessage(errorMessage, conversationId)
                      })
                      .finally(() => setIsLoading(false))
                  }}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Messages Area (shown when there are messages) */}
        {messages.length > 0 && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {messages.map((message) => (
                <ReactiveMessage
                  key={message.id}
                  message={message}
                  isUser={message.role === 'user'}
                  isPlaying={playingMessageId === message.id}
                  onPlayVoice={message.role === 'assistant' ? async () => {
                    if (playingMessageId === message.id) {
                      elevenLabs.stop()
                      setPlayingMessageId(null)
                    } else {
                      setPlayingMessageId(message.id)
                      try {
                        await elevenLabs.playAudio(message.content)
                        setPlayingMessageId(null)
                      } catch (error) {
                        console.error('Error playing audio:', error)
                        setPlayingMessageId(null)
                      }
                    }
                  } : undefined}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[80%] p-4 rounded-2xl rounded-bl-md"
                    style={{
                      background: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.6)',
                      border: isDarkMode
                        ? '1px solid rgba(255, 255, 255, 0.15)'
                        : '1px solid rgba(192, 192, 192, 0.3)',
                      backdropFilter: 'blur(10px)',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin" size={16} />
                      <span>Gliitz réfléchit...</span>
                    </div>
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
            background: isDarkMode ? '#0B0B0C' : '#FFFFFF',
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
              {/* Dictation Button - Simple dictée pour remplir le champ */}
              <SimpleDictation
                onTranscript={(text) => {
                  // Ajouter le texte dicté au champ input
                  setInput(prev => prev ? `${prev} ${text}` : text)
                  feedbackSystem.receive()
                }}
                isDarkMode={isDarkMode}
                disabled={isLoading}
              />

              {/* Voice-to-Voice Button - Conversation vocale complète avec icône onde */}
              <button
                onClick={() => {
                  feedbackSystem.micOn()
                  setShowVoiceToVoice(true)
                }}
                className="p-3 rounded-xl transition-all relative"
                style={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                }}
                disabled={isLoading}
                title="Mode vocal continu (conversation)"
              >
                <Radio size={22} className="animate-pulse" />
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
          
          {/* Tagline sous le chat */}
          <div 
            className="mt-4 text-center"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.85rem',
              color: isDarkMode ? 'rgba(192, 192, 192, 0.6)' : 'rgba(11, 11, 12, 0.5)',
              fontWeight: '300',
              letterSpacing: '0.02em'
            }}
          >
            {t('brand.footer_tagline', { defaultValue: 'Gliitz, votre concierge intelligent pour des instants parfaits' })} <Sparkles size={14} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} />
          </div>
          </div>
        </div>
      </main>

      {/* Voice to Voice Mode */}
      <VoiceToVoiceMode
        isOpen={showVoiceToVoice}
        onClose={() => {
          feedbackSystem.micOff()
          setShowVoiceToVoice(false)
        }}
        onMessage={({ user: userText, assistant: assistantText }) => {
          // Créer une conversation si nécessaire
          let conversationId = currentConversationId
          if (!conversationId) {
            conversationId = createConversation()
          }

          // Ajouter les messages
          const userMessage = {
            id: Date.now(),
            role: 'user',
            content: userText,
            timestamp: new Date()
          }

          const assistantMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: assistantText,
            timestamp: new Date()
          }

          addMessage(userMessage, conversationId)
          addMessage(assistantMessage, conversationId)
        }}
      />
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

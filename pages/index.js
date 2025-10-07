import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Mic, Send, Loader, Sparkles, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContextSimple'
import V3Sidebar from '../components/layout/V3Sidebar'
import { elevenLabs } from '../lib/elevenlabs'

const Home = ({ user, setUser }) => {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState(null)
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
      {/* Sidebar Component */}
      <V3Sidebar conversations={conversations} onNewChat={handleNewChat} />

      {/* Close/Reset Chat Button */}
      {messages.length > 0 && (
        <button
          onClick={() => {
            if (window.confirm('Voulez-vous réinitialiser la conversation ?')) {
              setMessages([])
              setInput('')
            }
          }}
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

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden" style={{
        background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
      }}>
        {/* Welcome Message (shown when no messages) */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-4 md:p-6">
            <div className="text-center max-w-3xl w-full">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #D4AF37 0%, #F4E5A1 100%)'
                    : 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
                  boxShadow: isDarkMode 
                    ? '0 10px 35px rgba(212, 175, 55, 0.4)'
                    : '0 10px 35px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Sparkles size={36} style={{ color: '#FFFFFF' }} />
              </div>

              <h1 
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #D4AF37 0%, #F4E5A1 100%)'
                    : 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4">
                {[
                  { text: 'Tables d\'exception à Marbella', icon: '🍽️' },
                  { text: 'Événements privés exclusifs', icon: '🎭' },
                  { text: 'Services de conciergerie VIP', icon: '💎' },
                  { text: 'Expériences sur-mesure', icon: '✨' }
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion.text)}
                    className="group relative p-4 rounded-2xl text-left transition-all duration-300"
                    style={{
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#FAFAFA',
                      border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid #E8E8E8',
                      boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF'
                      e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#E0E0E0'
                      e.currentTarget.style.boxShadow = isDarkMode ? '0 8px 25px rgba(255, 255, 255, 0.1)' : '0 8px 25px rgba(0, 0, 0, 0.12)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#FAFAFA'
                      e.currentTarget.style.borderColor = isDarkMode ? 'rgba(212, 175, 55, 0.2)' : '#E8E8E8'
                      e.currentTarget.style.boxShadow = isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{suggestion.icon}</span>
                      <span style={{ 
                        color: isDarkMode ? '#FFFFFF' : '#2c2c2c', 
                        fontWeight: 400,
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        letterSpacing: '0.01em',
                        lineHeight: '1.4'
                      }}>
                        {suggestion.text}
                      </span>
                    </div>
                  </button>
                ))}
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
                      message.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                  style={
                    message.role === 'user'
                      ? {
                          background: isDarkMode ? 'rgba(212, 175, 55, 0.15)' : 'rgba(26, 26, 26, 0.05)',
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                          boxShadow: isDarkMode ? '0 2px 10px rgba(212, 175, 55, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.08)',
                          border: `1px solid ${isDarkMode ? 'rgba(212, 175, 55, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
                        }
                      : {
                          background: isDarkMode 
                            ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(40, 40, 40, 0.8))'
                            : 'linear-gradient(135deg, rgba(250, 250, 250, 0.95), rgba(245, 245, 245, 0.95))',
                          backdropFilter: 'blur(15px)',
                          border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
                          color: isDarkMode ? '#FFFFFF' : '#2c2c2c',
                          boxShadow: isDarkMode ? '0 4px 20px rgba(212, 175, 55, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.06)'
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
                    className="px-6 py-4 rounded-2xl rounded-bl-sm flex items-center gap-3"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(40, 40, 40, 0.8))'
                        : 'linear-gradient(135deg, rgba(250, 250, 250, 0.95), rgba(245, 245, 245, 0.95))',
                      backdropFilter: 'blur(15px)',
                      border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
                      color: isDarkMode ? '#FFFFFF' : '#2c2c2c'
                    }}
                  >
                    <Loader className="animate-spin" size={20} style={{ color: '#D4AF37' }} />
                    <span style={{ fontFamily: 'Poppins, sans-serif' }}>Gliitz réfléchit...</span>
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

            <p className="text-center text-xs mt-3" style={{ 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Gliitz peut faire des erreurs. Vérifiez les informations importantes.
            </p>
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

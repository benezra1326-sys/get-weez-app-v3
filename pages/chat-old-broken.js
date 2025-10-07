import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import { useTheme } from '../contexts/ThemeContextSimple'
import { Send, Loader2, MessageCircle, Plus, Trash2, ChevronLeft, X } from 'lucide-react'

export default function Chat({ user, setUser }) {
  const router = useRouter()
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Nouvelle conversation', messages: [] }
  ])
  const [currentConvId, setCurrentConvId] = useState(1)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef(null)
  const { isDarkMode } = useTheme()

  const currentConv = conversations.find(c => c.id === currentConvId) || conversations[0]

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input, timestamp: new Date() }
    
    setConversations(prev => prev.map(conv => 
      conv.id === currentConvId 
        ? { ...conv, messages: [...conv.messages, userMessage] }
        : conv
    ))
    
    setInput('')
    setIsLoading(true)

    // Simuler réponse IA
    setTimeout(() => {
      const aiMessage = { 
        role: 'assistant', 
        content: `Je peux vous aider avec "${userMessage.content}". En tant que conciergerie de luxe Gliitz, je suis à votre service !`,
        timestamp: new Date() 
      }
      
      setConversations(prev => prev.map(conv => 
        conv.id === currentConvId 
          ? { ...conv, messages: [...conv.messages, aiMessage] }
          : conv
      ))
      setIsLoading(false)
    }, 1500)
  }

  const createNewConversation = () => {
    const newId = Math.max(...conversations.map(c => c.id)) + 1
    setConversations(prev => [...prev, { id: newId, title: 'Nouvelle conversation', messages: [] }])
    setCurrentConvId(newId)
  }

  const deleteConversation = (id) => {
    if (conversations.length === 1) return
    setConversations(prev => prev.filter(c => c.id !== id))
    if (currentConvId === id) {
      setCurrentConvId(conversations[0].id)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConv?.messages])

  return (
    <div 
      className="flex flex-col h-screen"
      style={{
        background: isDarkMode ? '#0B0B0C' : '#F8F8F8',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      {/* Header spécifique Chat avec bouton fermer */}
      <div 
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: isDarkMode ? 'rgba(26,26,28,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          borderColor: isDarkMode ? 'rgba(192,192,192,0.1)' : 'rgba(192,192,192,0.2)',
          height: '72px'
        }}
      >
        <h1 
          className="text-2xl font-bold"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          💬 Chat Gliitz
        </h1>
        
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(192,192,192,0.3)'
            e.currentTarget.style.transform = 'rotate(90deg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.transform = 'rotate(0deg)'
          }}
          title="Fermer le chat"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 72px)' }}>
        {/* SIDEBAR - Historique conversations (style ChatGPT) */}
        <div 
          className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
          style={{
            background: isDarkMode ? 'rgba(26,26,28,0.95)' : 'rgba(255,255,255,0.95)',
            borderRight: `1px solid ${isDarkMode ? 'rgba(192,192,192,0.1)' : 'rgba(192,192,192,0.2)'}`,
            backdropFilter: 'blur(12px)'
          }}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Bouton nouvelle conversation */}
            <button
              onClick={createNewConversation}
              className="btn-gliitz-primary w-full mb-4 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Nouveau chat
            </button>

            {/* Liste conversations */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setCurrentConvId(conv.id)}
                  className="group relative p-3 rounded-xl cursor-pointer transition-all duration-300"
                  style={{
                    background: conv.id === currentConvId 
                      ? 'rgba(192,192,192,0.2)' 
                      : 'transparent',
                    border: `1px solid ${conv.id === currentConvId ? 'rgba(192,192,192,0.3)' : 'transparent'}`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 truncate">
                      <p 
                        className="text-sm font-medium truncate"
                        style={{ 
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {conv.title}
                      </p>
                      <p 
                        className="text-xs truncate"
                        style={{ color: '#C0C0C0' }}
                      >
                        {conv.messages.length} messages
                      </p>
                    </div>
                    {conversations.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conv.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        style={{ color: '#C0C0C0' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ZONE CHAT PRINCIPALE */}
        <div className="flex-1 flex flex-col">
          {/* Toggle sidebar mobile */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-3"
            style={{ color: '#C0C0C0' }}
          >
            {showSidebar ? <ChevronLeft size={24} /> : <MessageCircle size={24} />}
          </button>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              background: isDarkMode ? '#0B0B0C' : '#F8F8F8'
            }}
          >
            {currentConv.messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-2xl">
                  <div 
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                      boxShadow: '0 0 20px rgba(192,192,192,0.4)'
                    }}
                  >
                    <MessageCircle size={40} style={{ color: '#0B0B0C' }} />
                  </div>
                  <h2 
                    className="text-3xl font-bold mb-4"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    Bonjour ! Je suis Gliitz
                  </h2>
                  <p 
                    className="text-lg"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    Votre assistant personnel de conciergerie de luxe.
                    <br />
                    Comment puis-je vous aider aujourd'hui ?
                  </p>
                </div>
              </div>
            ) : (
              <>
                {currentConv.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[75%] p-4 rounded-2xl"
                      style={msg.role === 'user' ? {
                        background: 'linear-gradient(135deg, #EFEFEF, #C8C8C8)',
                        color: '#0B0B0C',
                        borderRadius: '18px 18px 4px 18px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        fontFamily: 'Poppins, sans-serif'
                      } : {
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '18px 18px 18px 4px',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div 
                      className="p-4 rounded-2xl flex items-center gap-2"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(12px)',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                      }}
                    >
                      <Loader2 size={16} className="animate-spin" style={{ color: '#C0C0C0' }} />
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontStyle: 'italic', color: '#C0C0C0' }}>
                        Gliitz réfléchit...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input zone - PLEINE LARGEUR MOBILE */}
          <div 
            className="p-4 md:p-6"
            style={{
              background: isDarkMode ? 'rgba(26,26,28,0.95)' : 'rgba(255,255,255,0.95)',
              borderTop: `1px solid ${isDarkMode ? 'rgba(192,192,192,0.1)' : 'rgba(192,192,192,0.2)'}`,
              backdropFilter: 'blur(12px)',
              width: '100%'
            }}
          >
            <div className="w-full flex gap-2 md:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 input-gliitz"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(192,192,192,0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontSize: '14px',
                  width: '100%'
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="btn-gliitz-primary px-4 md:px-6 flex-shrink-0"
                style={{
                  opacity: !input.trim() || isLoading ? 0.5 : 1,
                  minWidth: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '../contexts/ThemeContextSimple'
import { Send, Loader2, MessageCircle, Plus, Trash2, ChevronLeft, X, Menu } from 'lucide-react'

export default function Chat({ user, setUser }) {
  const router = useRouter()
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Nouvelle conversation', messages: [] }
  ])
  const [currentConvId, setCurrentConvId] = useState(1)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false) // FALSE par défaut sur mobile
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
    setShowSidebar(false)
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
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{
        background: isDarkMode ? '#0B0B0C' : '#F8F8F8',
        fontFamily: 'Poppins, sans-serif',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Header Chat Gliitz + Bouton Fermer */}
      <div 
        className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0"
        style={{
          background: isDarkMode ? 'rgba(26,26,28,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          borderColor: isDarkMode ? 'rgba(192,192,192,0.1)' : 'rgba(192,192,192,0.2)',
          height: '64px',
          zIndex: 50
        }}
      >
        <div className="flex items-center gap-3">
          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: 'rgba(192,192,192,0.15)',
              border: '1px solid rgba(192,192,192,0.2)'
            }}
          >
            <Menu size={20} style={{ color: isDarkMode ? '#C0C0C0' : '#0B0B0C' }} />
          </button>
          
          <h1 
            className="text-xl font-bold"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            💬 Chat Gliitz
          </h1>
        </div>
        
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: isDarkMode ? '#C0C0C0' : '#0B0B0C'
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR OVERLAY MOBILE */}
        {showSidebar && (
          <>
            {/* Overlay sombre */}
            <div 
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowSidebar(false)}
              style={{ top: '64px' }}
            />
            
            {/* Sidebar */}
            <div 
              className="fixed left-0 z-50 w-72 overflow-y-auto"
              style={{
                background: isDarkMode ? 'rgba(26,26,28,0.98)' : 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(20px)',
                borderRight: `1px solid ${isDarkMode ? 'rgba(192,192,192,0.1)' : 'rgba(192,192,192,0.2)'}`,
                top: '64px',
                bottom: 0,
                height: 'calc(100vh - 64px)'
              }}
            >
              <div className="p-4">
                <button
                  onClick={createNewConversation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                    color: '#0B0B0C',
                    fontWeight: 600
                  }}
                >
                  <Plus size={20} />
                  Nouveau chat
                </button>
                
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setCurrentConvId(conv.id)
                        setShowSidebar(false)
                      }}
                      className="group p-3 rounded-xl cursor-pointer flex items-center justify-between"
                      style={{
                        background: conv.id === currentConvId ? 'rgba(192,192,192,0.2)' : 'transparent'
                      }}
                    >
                      <div className="flex-1">
                        <div 
                          className="font-medium text-sm"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}
                        >
                          {conv.title}
                        </div>
                        <div className="text-xs" style={{ color: '#A0A0A0' }}>
                          {conv.messages.length} messages
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conv.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2"
                      >
                        <Trash2 size={16} style={{ color: '#FF4444' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ZONE CHAT - PLEIN ÉCRAN */}
        <div className="flex flex-col flex-1 w-full">
          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4"
            style={{
              background: isDarkMode ? '#0B0B0C' : '#F8F8F8'
            }}
          >
            {currentConv.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
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
                <p style={{ color: isDarkMode ? '#C0C0C0' : '#666666' }}>
                  Votre assistant personnel de conciergerie de luxe.
                  Comment puis-je vous aider aujourd'hui ?
                </p>
              </div>
            ) : (
              <>
                {currentConv.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[85%] px-4 py-3 rounded-2xl"
                      style={{
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                          : 'rgba(255,255,255,0.1)',
                        color: msg.role === 'user' ? '#0B0B0C' : isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        border: msg.role === 'assistant' ? '1px solid rgba(192,192,192,0.2)' : 'none'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <Loader2 size={20} className="animate-spin" style={{ color: '#C0C0C0' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input - PLEINE LARGEUR */}
          <div 
            className="p-4 border-t"
            style={{
              background: isDarkMode ? 'rgba(26,26,28,0.95)' : 'rgba(255,255,255,0.95)',
              borderColor: isDarkMode ? 'rgba(192,192,192,0.1)' : 'rgba(192,192,192,0.2)'}
            }
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(192,192,192,0.2)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="btn-gliitz-primary"
                style={{
                  opacity: !input.trim() || isLoading ? 0.5 : 1,
                  minWidth: '52px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


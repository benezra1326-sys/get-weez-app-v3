import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Mic, Send, Loader, Sparkles, Plus, Menu, X, Search, Moon, Sun, Building, Calendar, Briefcase, Users, FileText, Mail, Clock } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContextSimple'

const Home = ({ user, setUser }) => {
  const router = useRouter()
  const { isDarkMode, toggleTheme } = useTheme()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [conversations] = useState([
    { id: 1, title: 'Restaurants à Marbella', date: 'Aujourd\'hui' },
    { id: 2, title: 'Événements ce weekend', date: 'Hier' },
    { id: 3, title: 'Services VIP', date: 'Il y a 2 jours' }
  ])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
      // Simulated response for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Je suis Gliitz, votre assistant IA de luxe. Comment puis-je sublimer votre expérience à Marbella aujourd'hui ?",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
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
      background: isDarkMode 
        ? 'linear-gradient(180deg, #0B0B0C 0%, #1a1a1a 100%)'
        : 'linear-gradient(180deg, rgba(240,240,240,0.7) 0%, rgba(255,255,255,0.9) 100%)'
    }}>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl text-white hover:bg-white/10 transition-all"
        style={{
          background: 'rgba(11, 11, 12, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 15px rgba(192,192,192,0.3)'
        }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

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

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          width: '280px',
          background: isDarkMode ? '#0B0B0C' : '#FFFFFF',
          borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header avec Logo et Toggle Theme */}
          <div className="p-5 border-b" style={{ 
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
          }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold" style={{
                fontFamily: 'Playfair Display, serif',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
              }}>
                Gliitz
              </h1>
              
              {/* Toggle Theme Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
                title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
              />
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </div>

            {/* Nouveau Chat Button */}
            <button
              onClick={() => {
                setMessages([])
                setInput('')
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
                color: '#FFFFFF',
                boxShadow: '0 2px 10px rgba(192, 192, 192, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(192, 192, 192, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(192, 192, 192, 0.3)'
              }}
            >
              <Plus size={20} />
              <span>Nouveau chat</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 border-b" style={{ 
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
          }}>
            {[
              { label: 'Établissements', icon: Building, route: '/establishments' },
              { label: 'Services', icon: Briefcase, route: '/services' },
              { label: 'Événements', icon: Calendar, route: '/events' },
              { label: 'Partenaires', icon: Users, route: '/partenaires' },
              { label: 'Presse', icon: FileText, route: '/presse' },
              { label: 'Newsletter', icon: Mail, route: '/newsletter' }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  onClick={() => {
                    router.push(item.route)
                    setSidebarOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all mb-1"
                  style={{
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                    e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                  }}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Conversation History */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="flex items-center gap-2 px-4 mb-3" style={{ 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' 
            }}>
              <Clock size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">Historique</span>
            </div>
            
            {conversations.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm" style={{ 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' 
              }}>
                Aucune conversation
              </p>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      // Load conversation
                      setSidebarOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all"
                    style={{
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <p className="text-sm font-medium truncate mb-1">{conv.title}</p>
                    <p className="text-xs" style={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' 
                    }}>
                      {conv.date}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for sidebar on desktop */}
      <div className="hidden md:block" style={{ width: '280px' }} />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Welcome Message (shown when no messages) */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)',
                  boxShadow: '0 8px 30px rgba(192,192,192,0.5)'
                }}
              >
                <Sparkles size={36} className="text-white" />
              </div>

              <h1 
                className="text-5xl font-bold mb-4"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  background: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Bonjour, je suis Gliitz
              </h1>
              
              <p 
                className="text-xl mb-8"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 11, 12, 0.7)'
                }}
              >
                Votre assistant IA personnel pour découvrir le luxe à Marbella
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {[
                  'Trouver les meilleurs restaurants',
                  'Découvrir des événements exclusifs',
                  'Réserver des services premium',
                  'Obtenir des recommandations personnalisées'
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="p-4 rounded-2xl text-left transition-all hover:scale-105"
                    style={{
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(192, 192, 192, 0.3)'}`,
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    <span style={{ 
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C', 
                      fontWeight: 500,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages List */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-12">
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
                          background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.85)',
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                          boxShadow: isDarkMode ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.15)',
                          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(192, 192, 192, 0.2)'}`
                        }
                      : {
                          background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.1))',
                          backdropFilter: 'blur(15px)',
                          border: '1px solid rgba(192, 192, 192, 0.3)',
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                          boxShadow: '0 4px 20px rgba(192, 192, 192, 0.2)'
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
                      background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.1))',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(192, 192, 192, 0.3)',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    <Loader className="animate-spin" size={20} style={{ color: '#C0C0C0' }} />
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
            background: isDarkMode ? 'rgba(11, 11, 12, 0.8)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(192, 192, 192, 0.2)'}`
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="flex items-end gap-3 p-2 rounded-2xl"
              style={{
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(192, 192, 192, 0.3)'}`,
                boxShadow: '0 4px 20px rgba(192, 192, 192, 0.2)'
              }}
            >
              {/* Voice Button */}
              <button
                className="p-3 rounded-xl transition-all"
                style={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
                disabled={isLoading}
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
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={
                  input.trim() && !isLoading
                    ? {
                        background: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)',
                        boxShadow: '0 4px 15px rgba(192, 192, 192, 0.4)'
                      }
                    : {}
                }
              >
                {isLoading ? <Loader className="animate-spin" size={22} /> : <Send size={22} />}
              </button>
          </div>

            <p className="text-center text-xs mt-3 opacity-50" style={{ 
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
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

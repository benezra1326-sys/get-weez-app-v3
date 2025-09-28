import { useState, useEffect } from 'react'
import { MessageCircle, Loader2, Menu, X, Plus } from 'lucide-react'
import { useTranslation } from 'next-i18next'
import SidebarChat from './SidebarChat'
import MobileChatOverlay from './MobileChatOverlay'
import SuggestiveMessages from './SuggestiveMessages'
import VoiceDictationButton from './VoiceDictationButton'
import { useConversations } from '../../hooks/useConversations'
import { ChatLoadingSpinner } from '../ui/LoadingSpinner'
import { useToast } from '../ui/Toast'

export default function ChatInterface({ user }) {
  const { t } = useTranslation('common')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [textareaRef, setTextareaRef] = useState(null)
  const [showSuggestiveMessages, setShowSuggestiveMessages] = useState(true)
  const [messagesEndRef, setMessagesEndRef] = useState(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const { showToast } = useToast()
  
  const {
    conversations,
    currentConversationId,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    addMessage,
    getCurrentMessages
  } = useConversations()

  const messages = getCurrentMessages()

  // Initialiser la conversation seulement au premier chargement
  useEffect(() => {
    console.log('🔍 ChatInterface - Vérification des conversations...')
    console.log('🔍 Conversations:', conversations.length, 'Current ID:', currentConversationId)
    
    // Si des conversations existent mais aucune n'est sélectionnée, sélectionner la première
    if (conversations.length > 0 && !currentConversationId) {
      console.log('✅ ChatInterface - Sélection de la première conversation existante')
      selectConversation(conversations[0].id)
    }
    // Si une conversation est déjà sélectionnée, ne rien faire
    else if (currentConversationId && conversations.some(conv => conv.id === currentConversationId)) {
      console.log('✅ ChatInterface - Conversation déjà active, pas d\'action nécessaire')
    }
    
    // Marquer comme chargé après un délai pour éviter le scroll initial
    setTimeout(() => {
      setIsInitialLoad(false)
    }, 1000)
  }, [conversations.length, currentConversationId, selectConversation])

  // Auto-scroll vers le bas des messages
  useEffect(() => {
    if (messagesEndRef && messages && messages.length > 0 && !isInitialLoad) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, messagesEndRef, isInitialLoad])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const messageText = input.trim()
    setInput('')
    
    // Créer une conversation si nécessaire (premier message)
    let conversationId = currentConversationId
    if (!conversationId) {
      console.log('🚀 Création d\'une nouvelle conversation pour le premier message')
      conversationId = createConversation()
    }

    // Ajouter le message utilisateur
    addMessage(conversationId, messageText, 'user')
    
    // Scroll vers le bas après l'ajout du message utilisateur
    setTimeout(() => {
      if (messagesEndRef && !isInitialLoad) {
        messagesEndRef.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationId: conversationId,
          userName: user?.name || 'Utilisateur',
          isMember: user?.isMember || false
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message')
      }

      const data = await response.json()

      // Ajouter la réponse de l'IA
      addMessage(conversationId, data.response, 'ai')
      
      // Scroll vers le bas après la réponse de l'IA
      setTimeout(() => {
        if (messagesEndRef && !isInitialLoad) {
          messagesEndRef.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)

    } catch (error) {
      console.error('Erreur:', error)
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      console.log('🔍 KeyPress Entrée détectée')
      if (input.trim() && !isLoading) {
        console.log('🚀 Envoi du message via KeyPress')
        handleSend()
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      console.log('🔍 Entrée pressée - Input:', input.trim(), 'Loading:', isLoading)
      if (input.trim() && !isLoading) {
        console.log('🚀 Envoi du message via Entrée')
        handleSend()
      }
    }
  }

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript)
    setShowSuggestiveMessages(false)
  }

  const handleInterimTranscript = (transcript) => {
    if (transcript) {
      setShowSuggestiveMessages(false)
    }
  }

  // Gestion des suggestions
  useEffect(() => {
    if (messages && messages.length === 0 && !input.trim()) {
      const timer = setTimeout(() => {
        setShowSuggestiveMessages(true)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShowSuggestiveMessages(false)
    }
  }, [messages, input])

  // Masquer les suggestions quand l'utilisateur tape
  useEffect(() => {
    if (input.trim()) {
      setShowSuggestiveMessages(false)
    } else if (messages && messages.length === 0) {
      const timer = setTimeout(() => {
        setShowSuggestiveMessages(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [input, messages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="text-white font-bold text-xl">Get Weez</span>
        </div>
              
              <nav className="hidden md:flex space-x-6">
                <a href="/establishments" className="text-gray-300 hover:text-white transition-colors">Établissements</a>
                <a href="/events" className="text-gray-300 hover:text-white transition-colors">Événements</a>
                <a href="/account" className="text-gray-300 hover:text-white transition-colors">Compte</a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                <span className="text-sm">Français</span>
              </button>
              <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Connexion
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Inscription
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chat Section - Centre */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Votre assistant personnel avec IA
                </h1>
                <p className="text-gray-300 text-lg">
                  Demandez une expérience à Marbella, et laissez-moi tout organiser pour vous
                </p>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {messages && messages.length > 0 ? (
                  <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                          className={`max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg px-3 md:px-4 py-2 md:py-3 rounded-2xl ${
                      msg.sender === 'user'
                              ? 'rounded-br-md bg-purple-600 text-white'
                              : 'rounded-bl-md border bg-gray-800 text-white'
                    }`}
                    style={{
                      backgroundColor: msg.sender === 'user' 
                              ? '#8B5CF6' 
                              : '#1F2937',
                            color: msg.sender === 'user' ? '#FFFFFF' : '#FFFFFF',
                            borderColor: msg.sender === 'user' ? 'transparent' : '#374151'
                          }}
                        >
                          <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
                    
                    {/* Référence pour le scroll automatique */}
                    <div ref={setMessagesEndRef} />
                    
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div 
                          className="max-w-[85%] sm:max-w-lg px-3 md:px-4 py-2 md:py-3 rounded-2xl rounded-bl-md border bg-gray-800 border-gray-600"
                    style={{ 
                            backgroundColor: '#1F2937',
                            color: '#FFFFFF',
                            borderColor: '#374151'
                    }}
                  >
                    <div className="flex items-center">
                            <Loader2 size={14} className="animate-spin mr-2 md:mr-3 text-purple-500" />
                            <span className="text-xs md:text-sm text-white">Get Weez vous prépare une réponse...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-2xl mx-auto">
              <div 
                      className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 bg-purple-600 shadow-lg"
                      style={{ background: '#8B5CF6' }}
              >
                      <MessageCircle size={24} className="text-white md:hidden" />
                      <MessageCircle size={32} className="text-white hidden md:block" />
              </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">
                      Bienvenue sur Get Weez
              </h3>
                    <p className="text-sm md:text-lg text-gray-400 px-2">
                      Commencez à taper votre message ci-dessous pour commencer une conversation
              </p>
            </div>
          )}
        </div>

              {/* Input Area */}
          <div className="relative">
                <input
                  type="text"
                value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrivez votre message..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleSend}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                  </svg>
                </button>
              </div>

              {/* CTA Button - NOUVELLE CONVERSATION */}
              <div className="text-center mt-6">
                <div className="text-gray-400 text-sm mb-3">
                  Commencez une conversation avec Get Weez
                </div>
                <button 
                  onClick={createConversation}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nouvelle Conversation
                  <span className="ml-2">→</span>
              </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar Right */}
          <div className="space-y-6">
            {/* Événements à venir */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Événements à venir</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">🏖️</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Beach Party</p>
                      <p className="text-gray-400 text-sm">21 juin - 16h</p>
                    </div>
                  </div>
                  <button className="text-purple-400 text-sm hover:text-purple-300">
                    En savoir plus
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">🎷</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Soirée Jazz</p>
                      <p className="text-gray-400 text-sm">26 juin - 22h</p>
                    </div>
                  </div>
                  <button className="text-purple-400 text-sm hover:text-purple-300">
                    En savoir plus
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">🍽️</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Dîner Gastronomique</p>
                      <p className="text-gray-400 text-sm">25 juin - 20h</p>
                    </div>
                  </div>
                  <button className="text-purple-400 text-sm hover:text-purple-300">
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>

            {/* Établissements recommandés */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Établissements recommandés</h2>
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                    Sponsorisé
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">Le Club Marin</h3>
                      <p className="text-gray-400 text-sm">28 juin</p>
                    </div>
                    <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                      Réserver
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">La Table de Pierre</h3>
                      <p className="text-gray-400 text-sm">10 juin</p>
                    </div>
                    <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                      Réserver
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">Vista Bar</h3>
                      <p className="text-gray-400 text-sm">25 juin</p>
                    </div>
                    <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar des conversations - Cachée mais disponible */}
      {isSidebarOpen && (
        <div className="fixed left-0 top-0 h-full w-80 bg-gray-900 z-50 lg:hidden">
          <SidebarChat
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={selectConversation}
            onNewConversation={createConversation}
            onDeleteConversation={deleteConversation}
            onRenameConversation={renameConversation}
          />
        </div>
      )}
    </div>
  )
}
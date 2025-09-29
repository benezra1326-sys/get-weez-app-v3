import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useTranslation } from 'next-i18next'
import { MessageCircle, Sparkles, Trash2, Loader2, X, Sun, Moon, Mic, MicOff } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import { useToast } from '../ui/Toast'
import ChatLoadingSpinner from '../ui/LoadingSpinner'
import ConfirmModal from '../ui/ConfirmModal'
import MobileChatInterface from './MobileChatInterface'
import { useTheme } from '../../hooks/useTheme'

const ChatInterface = ({ user, initialMessage, establishmentName }) => {
  console.log('🔄 ChatInterface component loaded')
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const { isDarkMode } = useTheme()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState(null)
  const [sidebarFilter, setSidebarFilter] = useState('all') // 'all', 'events', 'establishments'
  const [showMobileHistory, setShowMobileHistory] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef(null)

  // Effet pour pré-remplir le message de réservation
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage)
      // Focus sur la zone de saisie
      if (textareaRef.current) {
        textareaRef.current.focus()
        // Scroll vers le bas pour voir la zone de saisie
        textareaRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [initialMessage])
  
  const {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation
  } = useConversations()

  console.log('📊 ChatInterface state:', {
    conversationsCount: conversations?.length || 0,
    currentConversationId,
    messagesCount: messages?.length || 0,
    messages: messages,
    messagesType: typeof messages,
    messagesArray: Array.isArray(messages),
    input,
    isLoading,
    hasCreateConversation: typeof createConversation === 'function',
    hasAddMessage: typeof addMessage === 'function'
  })

  const handleSend = useCallback(async () => {
    console.log('🚀🚀🚀 handleSend appelé', { 
      input: input.trim(), 
      isLoading, 
      currentConversationId,
      hasInput: !!input.trim()
    })
    
    if (!input.trim() || isLoading) {
      console.log('❌ handleSend: Conditions non remplies', { input: input.trim(), isLoading })
      return
    }

    const userMessage = input.trim()
    console.log('📝 Message utilisateur:', userMessage)
    setInput('')
    
    // Créer une conversation si nécessaire
    let conversationId = currentConversationId
    if (!conversationId) {
      console.log('🔧 Création d\'une nouvelle conversation...')
      conversationId = createConversation()
      console.log('🔧 Nouveau conversationId:', conversationId)
    }

    // Ajouter le message utilisateur
    console.log('💬 Ajout du message utilisateur, conversationId:', conversationId)
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }, conversationId)
    
    setIsLoading(true)

    try {
      // Obtenir l'historique des messages de la conversation actuelle
      const currentMessages = conversations.find(conv => conv.id === conversationId)?.messages || []
      
      // Appeler l'API de chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userName: 'Utilisateur',
          isMember: false,
          conversationHistory: currentMessages
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Réponse reçue:', data)
      
      addMessage({
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage = 'Désolé, une erreur est survenue. Veuillez réessayer.'
      addMessage({
        id: (Date.now() + 2).toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, currentConversationId, createConversation, addMessage, showToast, conversations])

  const handleKeyDown = useCallback((e) => {
    console.log('⌨️⌨️⌨️ Touche pressée:', e.key, { input: input.trim(), isLoading, inputLength: input.length })
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      console.log('✅✅✅ Entrée pressée, conditions:', { 
        hasInput: !!input.trim(), 
        notLoading: !isLoading,
        inputValue: input,
        inputTrimmed: input.trim()
      })
      if (input.trim() && !isLoading) {
        console.log('🚀🚀🚀 Appel de handleSend depuis handleKeyDown')
        handleSend()
      } else {
        console.log('❌❌❌ Conditions non remplies pour handleSend')
      }
    }
  }, [input, isLoading, handleSend])

  // Gestion de la suppression de conversation
  const handleDeleteClick = (conversationId) => {
    setConversationToDelete(conversationId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete)
      setConversationToDelete(null)
      setShowDeleteConfirm(false)
      showToast('Conversation supprimée avec succès', 'success')
    }
  }

  const handleDeleteCancel = () => {
    setConversationToDelete(null)
    setShowDeleteConfirm(false)
  }

  // Fonction de dictée
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'fr-FR'
      
      recognition.onstart = () => {
        setIsListening(true)
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
        showToast('Erreur de reconnaissance vocale', 'error')
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    } else {
      showToast('Reconnaissance vocale non supportée', 'error')
    }
  }

  const handleCloseConversation = () => {
    if (currentConversationId) {
      selectConversation(null)
      showToast('Conversation fermée', 'info')
    }
  }

  // État pour détecter si on est sur mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Interface mobile - toujours présente mais cachée sur desktop */}
      <div className="lg:hidden">
        <MobileChatInterface user={user} initialMessage={initialMessage} establishmentName={establishmentName} />
      </div>

      {/* Interface desktop - cachée sur mobile */}
      <div className="hidden lg:block">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(90deg, #FACC15 0%, #FDE047 50%, #FACC15 100%);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes scroll-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll-reverse {
          animation: scroll-reverse 30s linear infinite;
        }
      `}</style>
      <div className="w-full min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: isDarkMode ? '#0D0D0D' : '#FFFFFF', width: '100vw', maxWidth: 'none' }}>
      {/* Main Content */}
      <main className="flex w-full flex-col lg:flex-row lg:h-screen min-h-[calc(100vh-8rem)] lg:min-h-screen" style={{ width: '100vw', maxWidth: 'none' }}>
        
        {/* Sidebar gauche - Conversations */}
        <div className="hidden lg:block w-72 border-r overflow-y-auto h-full flex-shrink-0" style={{ backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF', borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
          {/* Version mobile subtile - petit bouton flottant */}
          <div className="lg:hidden fixed top-20 left-4 z-40">
            <button 
              onClick={() => setShowMobileHistory(!showMobileHistory)}
              className={`backdrop-blur-md rounded-full p-2 shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800/90 border border-gray-600 hover:bg-gray-700/90' : 'bg-white/90 border border-gray-300 hover:bg-gray-100/90'}`}
            >
              <MessageCircle size={20} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
            </button>
          </div>
          
          {/* Overlay mobile pour l'historique */}
          {showMobileHistory && (
            <div className={`lg:hidden fixed inset-0 backdrop-blur-sm z-50 ${isDarkMode ? 'bg-black/50' : 'bg-gray-900/20'}`} onClick={() => setShowMobileHistory(false)}>
              <div className={`absolute top-16 left-4 right-4 backdrop-blur-md border rounded-2xl p-4 max-h-[70vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-300'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Conversations</h3>
                  <button 
                    onClick={() => setShowMobileHistory(false)}
                    className={`p-1 rounded-lg transition-all duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                  >
                    ✕
                  </button>
                </div>
                
                {/* Bouton nouvelle conversation mobile */}
                <div 
                  onClick={() => {
                    createConversation()
                    setShowMobileHistory(false)
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 mb-2 cursor-pointer hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Sparkles size={18} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Nouvelle Conversation</span>
                  </div>
                </div>
                
                {/* Bouton fermer conversation mobile */}
                {currentConversationId && (
                  <div 
                    onClick={() => {
                      handleCloseConversation()
                      setShowMobileHistory(false)
                    }}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg p-3 mb-4 cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <X size={18} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Fermer Conversation</span>
                    </div>
                  </div>
                )}
                
                {/* Liste des conversations mobile */}
                <div className="space-y-2">
                  {conversations && conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <div 
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all border ${
                          conversation.id === currentConversationId 
                            ? 'bg-blue-600/30 border-blue-500/50' 
                            : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
                        }`}
                      >
                        <div 
                          onClick={() => {
                            selectConversation(conversation.id)
                            setShowMobileHistory(false)
                          }}
                          className="flex-1"
                        >
                          <div className={`text-sm font-medium truncate mb-1 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            {conversation.name}
                          </div>
                          <div className="text-gray-400 text-xs mb-2">
                            {conversation.messages?.length || 0} messages
                          </div>
                          <div className="text-gray-500 text-xs truncate">
                            {conversation.messages && conversation.messages.length > 0 
                              ? conversation.messages[conversation.messages.length - 1]?.content?.substring(0, 60) + '...'
                              : 'Conversation vide'
                            }
                          </div>
                        </div>
                        
                        {/* Bouton supprimer pour chaque conversation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Supprimer "${conversation.name}" ?`)) {
                              deleteConversation(conversation.id)
                              showToast('Conversation supprimée', 'success')
                            }
                          }}
                          className="mt-2 p-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle size={32} className="text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Aucune conversation</p>
                      <p className="text-gray-500 text-xs mt-1">Créez votre première conversation</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="p-3 lg:p-6 flex-1 overflow-y-auto pb-1 lg:pb-8 min-h-0">
            <h2 className={`text-base lg:text-xl font-bold mb-2 lg:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Conversations</h2>
            <div className="space-y-1 lg:space-y-4">
              {/* Bouton Nouvelle Conversation - Design Mobile Amélioré */}
              <div 
                onClick={createConversation}
                className="relative overflow-hidden rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
              >
                {/* Bannière de fond avec gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Badge Premium */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  ✨ NOUVEAU
                </div>
                
                <div className="relative p-3 lg:p-4">
                  <div className="flex items-center space-x-3 mb-2 lg:mb-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Sparkles size={20} className="text-white lg:hidden" />
                      <Sparkles size={24} className="text-white hidden lg:block" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base lg:text-lg">Nouvelle Conversation</h3>
                      <p className="text-purple-100 text-sm lg:text-base">Commencez un nouveau chat</p>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm mb-3 lg:mb-4 leading-relaxed hidden lg:block">Démarrez une nouvelle conversation avec Get Weez</p>
                  <div className="flex items-center justify-between">
                    <div className="text-purple-100 text-sm font-medium">💬 Chat IA</div>
                    <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                      Créer
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des conversations */}
              {conversations && conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`bg-gradient-to-r ${conversation.id === currentConversationId 
                      ? 'from-blue-500/30 to-purple-600/30 border-blue-500/50' 
                      : 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
                    } border rounded-xl p-1 lg:p-4 hover:border-blue-400/50 transition-all duration-300 group relative`}
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => selectConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-1 lg:space-x-3 mb-1 lg:mb-2">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${
                          conversation.id === currentConversationId 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                          <MessageCircle size={16} className="text-white lg:hidden" />
                          <MessageCircle size={20} className="text-white hidden lg:block" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${conversation.id === currentConversationId ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                            {conversation.name}
                          </h3>
                          <p className={`text-sm ${conversation.id === currentConversationId ? (isDarkMode ? 'text-blue-300' : 'text-blue-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                            {conversation.messages?.length || 0} messages
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {conversation.messages && conversation.messages.length > 0 
                          ? conversation.messages[conversation.messages.length - 1]?.content?.substring(0, 50) + '...'
                          : 'Conversation vide'
                        }
                      </p>
                    </div>
                    
                    {/* Bouton de suppression */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(conversation.id)
                      }}
                      className="absolute top-3 right-3 p-1 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Supprimer la conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="hidden lg:block text-center py-8">
                  <MessageCircle size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-base">Aucune conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Section - Largeur ajustée */}
        <div className="flex-1 flex flex-col min-w-0 px-2 pt-1 pb-1 lg:p-6 h-[calc(100vh-32rem)] lg:h-full w-full" style={{ width: '100%', maxWidth: 'none', flex: '1 1 0%' }}>
          <div className="rounded-2xl border p-2 lg:p-6 lg:h-full flex flex-col" style={{ backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF', borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
            
            {/* Barre d'outils mobile */}
            <div className="lg:hidden flex items-center justify-between mb-3 p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#2D2D2D' : '#F3F4F6' }}>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowMobileHistory(!showMobileHistory)}
                  className="p-2 rounded-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: '#374151',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4B5563'
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#374151'
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <MessageCircle size={16} className="text-white" />
                </button>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {conversations?.length || 0} conversations
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Bouton thème */}
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: '#6B7280',
                    boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4B5563'
                    e.target.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6B7280'
                    e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)'
                  }}
                  title={isDarkMode ? "Mode clair" : "Mode sombre"}
                >
                  {isDarkMode ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
                </button>
                
                <button 
                  onClick={createConversation}
                  className="p-2 rounded-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: '#3B82F6',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2563EB'
                    e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3B82F6'
                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  title="Nouvelle conversation"
                >
                  <Sparkles size={16} className="text-white" />
                </button>
                {currentConversationId && (
                  <button 
                    onClick={handleCloseConversation}
                    className="p-2 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: '#6B7280',
                      boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4B5563'
                      e.target.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#6B7280'
                      e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)'
                    }}
                    title="Fermer la conversation"
                  >
                    <X size={16} className="text-white" />
                  </button>
                )}
                {messages && messages.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm('Voulez-vous effacer cette conversation ?')) {
                        if (currentConversationId) {
                          deleteConversation(currentConversationId)
                          showToast('Conversation effacée', 'success')
                        }
                      }
                    }}
                    className="p-2 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: '#DC2626',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#B91C1C'
                      e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#DC2626'
                      e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* En-tête de la conversation */}
            {currentConversationId && messages && messages.length > 0 && (
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {conversations.find(conv => conv.id === currentConversationId)?.name || 'Conversation'}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {messages.length} message{messages.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseConversation}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all duration-300"
                  title="Fermer la conversation"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Zone des messages */}
            <div className="flex-1 lg:overflow-y-auto mb-2 lg:mb-6 lg:min-h-0 chat-messages-container scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2 lg:p-0">
              {messages && messages.length > 0 ? (
                <div className="space-y-2 lg:space-y-4">
                  {messages.map((msg) => {
                    console.log('🔍 Affichage message:', msg)
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                        style={{
                          animation: 'fadeInUp 0.3s ease-out'
                        }}
                      >
                        <div
                          className={`max-w-[85%] lg:max-w-[70%] px-4 py-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'rounded-br-md'
                              : 'rounded-bl-md border'
                          }`}
                          style={{
                            backgroundColor: msg.role === 'user' 
                              ? '#14B8A6' 
                              : '#2D2D2D',
                            color: '#FFFFFF',
                            borderColor: msg.role === 'user' ? 'transparent' : '#374151',
                            boxShadow: msg.role === 'user' 
                              ? '0 4px 12px rgba(20, 184, 166, 0.3)' 
                              : '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <div className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content || 'Message vide'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-4 lg:py-8">
                  {/* Version mobile - design plus engageant */}
                  <div 
                    className="lg:hidden relative overflow-hidden rounded-2xl border border-purple-500/30 p-4 mb-4 w-full max-w-sm cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{ borderColor: '#3B82F6' }}
                    onClick={() => {
                      if (textareaRef.current) {
                        textareaRef.current.focus()
                        textareaRef.current.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-white/20 backdrop-blur-sm mx-auto shadow-xl">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-white">
                        Votre IA Concierge
                      </h3>
                      <p className="text-purple-100 text-sm px-2 leading-relaxed">
                        Demandez-moi n'importe quoi sur Marbella !
                      </p>
                      <div className="mt-3 flex items-center justify-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Version desktop */}
                  <div className="hidden lg:block relative overflow-hidden rounded-3xl border border-purple-500/30 p-6 lg:p-8 mb-4 lg:mb-6 w-full max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm mx-auto shadow-2xl">
                        <MessageCircle size={48} className="text-white" />
                      </div>
                      <h3 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-4 text-white">
                        Bienvenue sur Get Weez
                      </h3>
                      <p className="text-purple-100 text-sm lg:text-lg px-2 lg:px-4 leading-relaxed">
                        Votre concierge IA personnel pour Marbella
                      </p>
                      <div className="mt-4 lg:mt-6 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification de réservation si applicable */}
                  {establishmentName && (
                    <div className="lg:hidden bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 mb-4 mx-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-lg">🍽️</span>
                        <div>
                          <p className="text-white font-medium text-sm">Demande de réservation</p>
                          <p className="text-green-100 text-xs">Pour {establishmentName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs lg:text-base text-gray-400 px-4 lg:px-6">
                    <span className="lg:hidden">Tapez votre message ci-dessous</span>
                    <span className="hidden lg:inline">Commencez à taper votre message ci-dessous pour commencer une conversation</span>
                  </p>
                </div>
              )}
                  
              {isLoading && (
                <div className="flex justify-start">
                  <div 
                    className="max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-md border bg-gray-800 border-gray-600"
                    style={{ 
                      backgroundColor: '#1F2937',
                      color: '#FFFFFF',
                      borderColor: '#374151'
                    }}
                  >
                    <ChatLoadingSpinner />
                  </div>
                </div>
              )}
            </div>

              {/* Suggestions rapides - Version mobile améliorée */}
              <div className="lg:hidden mb-4">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  💡 Suggestions Premium
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Événements */}
                  <div className={`rounded-xl p-3 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-400/30' : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300/50'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">🏖️</span>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Beach Party</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}>21 juin</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInput('Réserver pour la Beach Party')}
                      className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                      Réserver
                    </button>
                  </div>
                  
                  <div className={`rounded-xl p-3 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400/30' : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300/50'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">🎷</span>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Soirée Jazz</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>26 juin</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInput('Réserver pour la soirée jazz')}
                      className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                    >
                      Réserver
                    </button>
                  </div>
                  
                  {/* Restaurants */}
                  <div className={`rounded-xl p-3 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-400/30' : 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300/50'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">🍣</span>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>Nobu Marbella</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-amber-100' : 'text-amber-700'}`}>Japonais Premium</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInput('Réserver une table chez Nobu')}
                      className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
                    >
                      Réserver
                    </button>
                  </div>
                  
                  <div className={`rounded-xl p-3 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-teal-500 to-cyan-500 border-teal-400/30' : 'bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-300/50'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">🏖️</span>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-teal-900'}`}>La Terraza</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-teal-100' : 'text-teal-700'}`}>Méditerranéen</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInput('Réserver une table à La Terraza')}
                      className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
                
                {/* Services rapides */}
                <div className="flex flex-wrap gap-2">
                  {['🚗 Transport VIP', '🛥️ Yacht privé', '🚁 Hélicoptère', '💆 Spa à domicile'].map((service, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(service)}
                      className="px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center"
                      style={{
                        backgroundColor: '#2D2D2D',
                        color: '#FFFFFF',
                        border: '1px solid #374151',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#374151'
                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#2D2D2D'
                        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {service}
                    </button>
                  ))}
                </div>
            </div>

              {/* Zone de saisie */}
              <div className="flex-shrink-0 space-y-2 lg:space-y-3">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto'
                        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={messages.length === 0 ? "Demandez-moi n'importe quoi sur Marbella..." : t('chat.placeholder')}
                    className="w-full px-4 py-4 lg:px-4 lg:py-6 pr-12 lg:pr-24 border rounded-xl resize-none text-sm lg:text-lg transition-all duration-300 focus:outline-none"
                    style={{ 
                      backgroundColor: isDarkMode ? '#2D2D2D' : '#F9FAFB', 
                      borderColor: isDarkMode ? '#374151' : '#D1D5DB', 
                      color: isDarkMode ? '#FFFFFF' : '#1F2937',
                      minHeight: '48px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      fontSize: '16px' // Empêche le zoom sur iOS
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#374151'
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                    rows={1}
                    disabled={isLoading}
                  />
                
                {/* Bouton de dictée */}
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className="absolute right-12 lg:right-16 top-1/2 transform -translate-y-1/2 p-2 lg:p-3 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: isListening ? '#EF4444' : '#6B7280',
                    boxShadow: isListening ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 2px 8px rgba(107, 114, 128, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isListening) {
                      e.target.style.backgroundColor = '#4B5563'
                      e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isListening) {
                      e.target.style.backgroundColor = '#6B7280'
                      e.target.style.boxShadow = '0 2px 8px rgba(107, 114, 128, 0.3)'
                    }
                  }}
                  title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
                >
                  {isListening ? (
                    <MicOff size={14} className="lg:hidden" />
                  ) : (
                    <Mic size={14} className="lg:hidden" />
                  )}
                  {isListening ? (
                    <MicOff size={16} className="hidden lg:block" />
                  ) : (
                    <Mic size={16} className="hidden lg:block" />
                  )}
                </button>
                
                {/* Bouton d'envoi */}
                <button
                  onClick={() => {
                    console.log('🖱️ Bouton d\'envoi cliqué', { input: input.trim(), isLoading })
                    handleSend()
                  }}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 p-2 lg:p-4 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: !input.trim() || isLoading ? '#374151' : '#3B82F6',
                    boxShadow: !input.trim() || isLoading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.backgroundColor = '#2563EB'
                      e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.backgroundColor = '#3B82F6'
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin lg:hidden" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:hidden">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                    </svg>
                  )}
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin hidden lg:block" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              </div>
                
              {/* Texte d'information */}
              <div className="flex items-center justify-between text-xs lg:text-xs text-gray-400">
                <span className="hidden sm:inline">Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne</span>
                <span className="sm:hidden">Entrée pour envoyer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar droite - Propositions avec filtres - UNIQUEMENT sur desktop */}
        <div className="hidden lg:block w-80 border-t lg:border-t-0 lg:border-l overflow-y-auto h-[32rem] lg:h-full flex-shrink-0" style={{ backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF', borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB', width: '20rem', maxWidth: '20rem' }}>
          <div className="p-2 lg:p-6 pb-2 lg:pb-12">
            <h2 className={`text-sm lg:text-3xl font-bold mb-2 lg:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💡 Suggestions Premium</h2>
            
            {/* Filtres améliorés avec plus d'options */}
            <div className="mb-4 lg:mb-8">
              {/* Version desktop - Filtres étendus */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setSidebarFilter('all')}
                    className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex items-center justify-center"
                    style={{
                      backgroundColor: sidebarFilter === 'all' ? '#3B82F6' : (isDarkMode ? '#374151' : '#F3F4F6'),
                      color: sidebarFilter === 'all' ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#374151'),
                      boxShadow: sidebarFilter === 'all' ? '0 4px 12px rgba(59, 130, 246, 0.4)' : (isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)')
                    }}
                  >
                    🌟 Tout
                  </button>
                  <button
                    onClick={() => setSidebarFilter('events')}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex items-center justify-center ${
                      sidebarFilter === 'events' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    🎉 Événements
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSidebarFilter('establishments')}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex items-center justify-center ${
                      sidebarFilter === 'establishments' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    🍽️ Restaurants
                  </button>
                  <button
                    onClick={() => setSidebarFilter('services')}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex items-center justify-center ${
                      sidebarFilter === 'services' 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    ⭐ Services
                  </button>
                  <button
                    onClick={() => setSidebarFilter('luxury')}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex items-center justify-center ${
                      sidebarFilter === 'luxury' 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    💎 Luxe
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {/* Événements */}
              {(sidebarFilter === 'all' || sidebarFilter === 'events') && (
                <>
                  <div className="lg:block hidden">
                    <h3 className="text-white font-semibold text-sm mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Événements du jour
                    </h3>
                  </div>
                </>
              )}
              {(sidebarFilter === 'all' || sidebarFilter === 'events') && (
                <>
                  {/* Version mobile compacte */}
                  <div className="lg:hidden grid grid-cols-2 gap-2 mb-3">
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-400/30' : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🏖️</span>
                        <div>
                          <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Beach Party</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}>21 juin</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-blue-800'}`}>Soirée exclusive</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400/30' : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🎷</span>
                        <div>
                          <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Soirée Jazz</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>26 juin</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-purple-800'}`}>Concert jazz</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400/30' : 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🍽️</span>
                        <div>
                          <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-green-900'}`}>Dîner Gastronomique</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-green-100' : 'text-green-700'}`}>28 juin</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-green-800'}`}>Menu Michelin</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-400/30' : 'bg-gradient-to-br from-orange-100 to-red-100 border-orange-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🎉</span>
                        <div>
                          <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-orange-900'}`}>Pool Party</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-orange-100' : 'text-orange-700'}`}>30 juin</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-orange-800'}`}>Pool VIP</div>
                    </div>
                  </div>
                  
                  {/* Version desktop */}
                  <div className={`hidden lg:block relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl ${isDarkMode ? 'border-blue-500/30 hover:border-blue-400/50' : 'border-blue-300/50 hover:border-blue-400/70'}`}>
                    {/* Bannière de fond avec gradient */}
                    <div className={`absolute inset-0 opacity-90 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500' : 'bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100'}`}></div>
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black/50 via-transparent to-transparent' : 'bg-gradient-to-t from-white/20 via-transparent to-transparent'}`}></div>
                    
                    {/* Badge Événement */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      🎉 ÉVÉNEMENT
                    </div>
                    
                    <div className="relative p-4 lg:p-6">
                      <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-2xl lg:text-3xl">🏖️</span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Beach Party</h3>
                          <p className={`text-sm lg:text-base ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}>21 juin - 16h</p>
                        </div>
                      </div>
                      <p className={`text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed hidden lg:block ${isDarkMode ? 'text-white/90' : 'text-blue-800'}`}>Soirée exclusive sur la plage avec DJ international</p>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}>🌊 Plage • 🎵 DJ</div>
                        <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                          En savoir plus
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl ${isDarkMode ? 'border-purple-500/30 hover:border-purple-400/50' : 'border-purple-300/50 hover:border-purple-400/70'}`}>
                    {/* Bannière de fond avec gradient */}
                    <div className={`absolute inset-0 opacity-90 ${isDarkMode ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100'}`}></div>
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black/50 via-transparent to-transparent' : 'bg-gradient-to-t from-white/20 via-transparent to-transparent'}`}></div>
                    
                    {/* Badge Événement */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      🎵 MUSIQUE
                    </div>
                    
                    <div className="relative p-4 lg:p-6">
                      <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-2xl lg:text-3xl">🎷</span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Soirée Jazz</h3>
                          <p className={`text-sm lg:text-base ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>26 juin - 22h</p>
                        </div>
                      </div>
                      <p className={`text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed hidden lg:block ${isDarkMode ? 'text-white/90' : 'text-purple-800'}`}>Concert de jazz avec vue imprenable sur la mer</p>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>🎷 Jazz • 🌊 Vue mer</div>
                        <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
                          En savoir plus
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl ${isDarkMode ? 'border-green-500/30 hover:border-green-400/50' : 'border-green-300/50 hover:border-green-400/70'}`}>
                    {/* Bannière de fond avec gradient */}
                    <div className={`absolute inset-0 opacity-90 ${isDarkMode ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500' : 'bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100'}`}></div>
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black/50 via-transparent to-transparent' : 'bg-gradient-to-t from-white/20 via-transparent to-transparent'}`}></div>
                    
                    {/* Badge Sponsorisé */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      ⭐ SPONSORISÉ
                    </div>
                    
                    <div className="relative p-4 lg:p-6">
                      <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-2xl lg:text-3xl">🍽️</span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-green-900'}`}>Dîner Gastronomique</h3>
                          <p className={`text-sm lg:text-base ${isDarkMode ? 'text-green-100' : 'text-green-700'}`}>28 juin - 20h</p>
                        </div>
                      </div>
                      <p className={`text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed hidden lg:block ${isDarkMode ? 'text-white/90' : 'text-green-800'}`}>Menu dégustation avec chef étoilé Michelin</p>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-green-100' : 'text-green-700'}`}>🍽️ Michelin • ⭐ Étoilé</div>
                        <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Établissements */}
              {(sidebarFilter === 'all' || sidebarFilter === 'establishments') && (
                <>
                  <div className="lg:block hidden">
                    <h3 className="text-white font-semibold text-sm mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Nos partenaires premium
                    </h3>
                  </div>
                </>
              )}
              {(sidebarFilter === 'all' || sidebarFilter === 'establishments') && (
                <>
                  {/* Version mobile compacte */}
                  <div className="lg:hidden grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-2 border border-amber-400/30">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white text-lg">🍣</span>
                        <div>
                          <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>Nobu Marbella</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-amber-100' : 'text-amber-700'}`}>Japonais Premium</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-amber-800'}`}>⭐ 4.9/5</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-teal-500 to-cyan-500 border-teal-400/30' : 'bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🏖️</span>
                        <div>
                          <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-teal-900'}`}>La Terraza</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-teal-100' : 'text-teal-700'}`}>Méditerranéen</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-teal-800'}`}>Vue panoramique</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-400/30' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🏨</span>
                        <div>
                          <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-emerald-900'}`}>El Lago</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-emerald-100' : 'text-emerald-700'}`}>Créatif</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-emerald-800'}`}>Vue sur lac</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-rose-500 to-pink-500 border-rose-400/30' : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🍾</span>
                        <div>
                          <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-rose-900'}`}>Club VIP</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-rose-100' : 'text-rose-700'}`}>Nightclub</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-rose-800'}`}>DJ internationaux</div>
                    </div>
                  </div>
                  
                  {/* Version desktop */}
                  <div className="hidden lg:block relative overflow-hidden rounded-xl border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl">
                    {/* Image de fond avec gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Badge Sponsorisé */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      ⭐ SPONSORISÉ
                    </div>
                    
                    <div className="relative p-3 lg:p-4">
                      <div className="flex items-center space-x-3 mb-2 lg:mb-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-lg lg:text-xl">🍣</span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-base lg:text-lg ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>Nobu Marbella</h3>
                          <p className={`text-xs lg:text-sm ${isDarkMode ? 'text-amber-100' : 'text-amber-700'}`}>Restaurant Japonais Premium</p>
                        </div>
                      </div>
                      <p className={`text-xs lg:text-sm mb-3 lg:mb-4 leading-relaxed hidden lg:block ${isDarkMode ? 'text-white/90' : 'text-amber-800'}`}>Cuisine japonaise de luxe avec vue panoramique sur la mer Méditerranée</p>
                      <div className="flex items-center justify-between">
                        <div className={`text-xs lg:text-sm font-medium ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>⭐ 4.9/5 • €€€€</div>
                        <button className={`px-3 lg:px-4 py-1 lg:py-2 rounded-lg font-semibold text-xs lg:text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}>
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`border rounded-xl p-2 lg:p-4 transition-all duration-300 cursor-pointer group ${isDarkMode ? 'bg-gradient-to-r from-teal-500/20 to-cyan-600/20 border-teal-500/30 hover:border-teal-400/50' : 'bg-gradient-to-r from-teal-100/50 to-cyan-100/50 border-teal-300/50 hover:border-teal-400/70'}`}>
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-sm lg:text-lg">🏖️</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-teal-900'}`}>La Terraza del Mar</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-teal-300' : 'text-teal-700'}`}>Restaurant Méditerranéen</p>
                      </div>
                    </div>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-teal-700'}`}>Ambiance méditerranéenne avec vue panoramique</p>
                    <button className={`w-full py-2 px-4 rounded-lg transition-all duration-300 font-medium flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}>
                      Réserver
                    </button>
                  </div>

                  <div className={`border rounded-xl p-2 lg:p-4 transition-all duration-300 cursor-pointer group ${isDarkMode ? 'bg-gradient-to-r from-emerald-500/20 to-green-600/20 border-emerald-500/30 hover:border-emerald-400/50' : 'bg-gradient-to-r from-emerald-100/50 to-green-100/50 border-emerald-300/50 hover:border-emerald-400/70'}`}>
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🏨</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm lg:text-base">El Lago</h3>
                        <p className="text-emerald-300 text-sm">Restaurant Créatif</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Cuisine créative avec vue sur le lac</p>
                    <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium flex items-center justify-center">
                      Réserver
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-rose-500/20 to-pink-600/20 border border-rose-500/30 rounded-xl p-2 lg:p-4 hover:border-rose-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🍾</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Club VIP</h3>
                        <p className="text-rose-300 text-sm">Nightclub Exclusif</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Ambiance festive avec DJ internationaux</p>
                    <button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium">
                      Accès VIP
                    </button>
                  </div>
                </>
              )}

              {/* Services */}
              {(sidebarFilter === 'all' || sidebarFilter === 'services') && (
                <>
                  <div className="lg:block hidden">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                      ⭐ Services Exclusifs
                    </h3>
                  </div>
                </>
              )}
              {(sidebarFilter === 'all' || sidebarFilter === 'services') && (
                <>
                  <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl">
                    {/* Bannière de fond avec gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Badge Service */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      🚗 SERVICE
                    </div>
                    
                    <div className="relative p-4 lg:p-6">
                      <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-2xl lg:text-3xl">🚗</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg lg:text-xl">Transport Privé</h3>
                          <p className="text-indigo-100 text-sm lg:text-base">Chauffeur VIP</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed hidden lg:block">Service de transport de luxe avec chauffeur professionnel</p>
                      <div className="flex items-center justify-between">
                        <div className="text-indigo-100 text-sm font-medium">🚗 VIP • 👨‍✈️ Chauffeur</div>
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl">
                    {/* Bannière de fond avec gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Badge Sponsorisé */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      ⭐ SPONSORISÉ
                    </div>
                    
                    <div className="relative p-4 lg:p-6">
                      <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-2xl lg:text-3xl">🧳</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg lg:text-xl">Concierge 24/7</h3>
                          <p className="text-emerald-100 text-sm lg:text-base">Service Premium</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed hidden lg:block">Assistance personnalisée disponible 24h/24</p>
                      <div className="flex items-center justify-between">
                        <div className="text-emerald-100 text-sm font-medium">🧳 24/7 • ⭐ Premium</div>
                        <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-2 lg:p-4 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">✈️</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm lg:text-base">Transfert Aéroport</h3>
                        <p className="text-cyan-300 text-xs lg:text-sm">Service VIP</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs lg:text-sm mb-2 lg:mb-3 hidden lg:block">Transfert confortable depuis l'aéroport</p>
                    <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-1 lg:py-2 px-2 lg:px-4 rounded-lg transition-all duration-300 font-medium text-xs lg:text-sm">
                      Réserver
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-pink-500/20 to-rose-600/20 border border-pink-500/30 rounded-xl p-2 lg:p-4 hover:border-pink-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">💆</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold text-sm lg:text-base ${isDarkMode ? 'text-white' : 'text-pink-900'}`}>Spa à Domicile</h3>
                        <p className={`text-xs lg:text-sm ${isDarkMode ? 'text-pink-300' : 'text-pink-700'}`}>Relaxation Privée</p>
                      </div>
                    </div>
                    <p className={`text-xs lg:text-sm mb-2 lg:mb-3 hidden lg:block ${isDarkMode ? 'text-gray-300' : 'text-pink-700'}`}>Soins de luxe dans le confort de votre villa</p>
                    <button className={`w-full py-1 lg:py-2 px-2 lg:px-4 rounded-lg transition-all duration-300 font-medium text-xs lg:text-sm ${isDarkMode ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}>
                      Réserver
                    </button>
                  </div>
                </>
              )}

              {/* Section Luxe */}
              {(sidebarFilter === 'all' || sidebarFilter === 'luxury') && (
                <>
                  <div className="lg:block hidden">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                      <span className="w-3 h-3 bg-amber-500 rounded-full mr-3"></span>
                      💎 Expériences de Luxe
                    </h3>
                  </div>
                </>
              )}
              {(sidebarFilter === 'all' || sidebarFilter === 'luxury') && (
                <>
                  <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      💎 LUXE
                    </div>
                    
                    <div className="relative p-4 lg:p-6">
                      <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-2xl lg:text-3xl">🚁</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg lg:text-xl">Hélicoptère Privé</h3>
                          <p className="text-amber-100 text-sm lg:text-base">Tour panoramique</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed hidden lg:block">Vue aérienne exclusive de la Costa del Sol</p>
                      <div className="flex items-center justify-between">
                        <div className="text-amber-100 text-sm font-medium">🚁 VIP • 🌊 Vue mer</div>
                        <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 hover:border-rose-400/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      💎 EXCLUSIF
                    </div>
                    
                    <div className="relative p-4 lg:p-6">
                      <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-2xl lg:text-3xl">🛥️</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg lg:text-xl">Yacht Privé</h3>
                          <p className="text-rose-100 text-sm lg:text-base">Croisière VIP</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed hidden lg:block">Yacht de luxe avec équipage professionnel</p>
                      <div className="flex items-center justify-between">
                        <div className="text-rose-100 text-sm font-medium">🛥️ Yacht • 🍾 Champagne</div>
                        <button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-2 lg:p-4 hover:border-amber-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🏆</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm lg:text-base">Golf Privé</h3>
                        <p className="text-amber-300 text-xs lg:text-sm">Terrain VIP</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs lg:text-sm mb-2 lg:mb-3 hidden lg:block">Accès exclusif aux meilleurs parcours de golf</p>
                    <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-1 lg:py-2 px-2 lg:px-4 rounded-lg transition-all duration-300 font-medium text-xs lg:text-sm">
                      Réserver
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8"></div>
          </div>
        </div>
      </main>
      </div> {/* Fin interface desktop */}
      
      {/* Carrousel des marques qui font confiance */}
      <div className="w-full py-8 lg:py-12" style={{ backgroundColor: isDarkMode ? '#0D0D0D' : '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className={`text-2xl lg:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ils nous font confiance
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Plus de 500+ partenaires premium nous font confiance
            </p>
          </div>
          
          {/* Carrousel des marques */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* Première ligne de marques */}
              <div className="flex space-x-8 lg:space-x-12 items-center">
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🏨 Marriott</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🍽️ Nobu</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🏖️ Nikki Beach</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🚁 HeliMarbella</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🛥️ Yacht Charter</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🏆 Valderrama Golf</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">💆 Six Senses Spa</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🍾 Dom Pérignon</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🚗 Rolls-Royce</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">✈️ NetJets</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Deuxième ligne de marques */}
          <div className="mt-6 lg:mt-8 relative overflow-hidden">
            <div className="flex animate-scroll-reverse">
              <div className="flex space-x-8 lg:space-x-12 items-center">
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🏨 Four Seasons</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🍽️ Cipriani</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🏖️ Puente Romano</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🎵 Pacha Marbella</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">💎 Cartier</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🏆 Real Club Valderrama</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">💆 Aman Spa</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🍾 Moët & Chandon</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">🚗 Bentley</div>
                </div>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="text-white font-bold text-lg lg:text-xl">✈️ VistaJet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Container pour les notifications toast */}
      <ToastContainer />
      
      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la conversation"
        message="Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
    </>
  )
}

export default memo(ChatInterface)
import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useTranslation } from 'next-i18next'
import { MessageCircle, Sparkles, Trash2, Loader2 } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import { useToast } from '../ui/Toast'
import ChatLoadingSpinner from '../ui/LoadingSpinner'
import ConfirmModal from '../ui/ConfirmModal'

const ChatInterface = () => {
  console.log('🔄 ChatInterface component loaded')
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState(null)
  const [sidebarFilter, setSidebarFilter] = useState('all') // 'all', 'events', 'establishments'
  const textareaRef = useRef(null)
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Barre vide en haut */}
      <div className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-700"></div>

      {/* Main Content */}
      <main className="flex w-full overflow-hidden flex-col lg:flex-row" style={{ height: 'calc(100vh - 64px)' }}>
        
        {/* Sidebar gauche */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-gray-900/80 backdrop-blur-md border-r border-gray-700 flex flex-col h-64 lg:h-auto">
          <div className="p-6 flex-1 overflow-y-auto pb-8">
            <h2 className="text-xl font-bold text-white mb-6">Conversations</h2>
            <div className="space-y-4">
              {/* Bouton Nouvelle Conversation */}
              <div className="bg-gradient-to-r from-purple-500/20 to-indigo-600/20 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Nouvelle Conversation</h3>
                    <p className="text-purple-300 text-sm">Commencez un nouveau chat</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">Démarrez une nouvelle conversation avec Get Weez</p>
                <button
                  onClick={createConversation}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium"
                >
                  Créer
                </button>
              </div>

              {/* Liste des conversations */}
              {conversations && conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`bg-gradient-to-r ${conversation.id === currentConversationId 
                      ? 'from-blue-500/30 to-purple-600/30 border-blue-500/50' 
                      : 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
                    } border rounded-xl p-4 hover:border-blue-400/50 transition-all duration-300 group relative`}
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => selectConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${
                          conversation.id === currentConversationId 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                          <MessageCircle size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${conversation.id === currentConversationId ? 'text-white' : 'text-gray-300'}`}>
                            {conversation.name}
                          </h3>
                          <p className={`text-sm ${conversation.id === currentConversationId ? 'text-blue-300' : 'text-gray-400'}`}>
                            {conversation.messages?.length || 0} messages
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">
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
                <div className="text-center py-8">
                  <MessageCircle size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Aucune conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Section - Milieu */}
        <div className="flex-1 flex flex-col min-w-0 h-full lg:h-auto p-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 h-full flex flex-col">

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto mb-6 min-h-0">
              {messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    console.log('🔍 Affichage message:', msg)
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'rounded-br-md bg-purple-600 text-white'
                              : 'rounded-bl-md border bg-gray-800 text-white'
                          }`}
                          style={{
                            backgroundColor: msg.role === 'user' 
                              ? '#8B5CF6' 
                              : '#1F2937',
                            color: '#FFFFFF',
                            borderColor: msg.role === 'user' ? 'transparent' : '#374151'
                          }}
                        >
                          <div className="text-base leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content || 'Message vide'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-purple-600 shadow-lg"
                    style={{ background: '#8B5CF6' }}
                  >
                    <MessageCircle size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">
                    Bienvenue sur Get Weez
                  </h3>
                  <p className="text-lg text-gray-400">
                    Commencez à taper votre message ci-dessous pour commencer une conversation
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

            {/* Zone de saisie */}
            <div className="flex-shrink-0 space-y-3">
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
                  placeholder={t('chat.placeholder')}
                  className="w-full px-4 py-3 pr-24 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none text-base"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)', 
                    borderColor: 'var(--color-border)', 
                    color: 'var(--color-text-primary)',
                    minHeight: '48px'
                  }}
                  rows={1}
                  disabled={isLoading}
                />
                
                {/* Bouton d'envoi */}
                <button
                  onClick={() => {
                    console.log('🖱️ Bouton d\'envoi cliqué', { input: input.trim(), isLoading })
                    handleSend()
                  }}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              </div>
                
              {/* Texte d'information */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar droite - Propositions avec filtres */}
        <div className="w-full lg:w-80 flex-shrink-0 h-full bg-gray-900/80 backdrop-blur-md border-l border-gray-700 overflow-y-auto">
          <div className="p-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Suggestions</h2>
            
            {/* Filtres */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setSidebarFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sidebarFilter === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => setSidebarFilter('events')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sidebarFilter === 'events' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Événements
              </button>
              <button
                onClick={() => setSidebarFilter('establishments')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sidebarFilter === 'establishments' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Établissements
              </button>
            </div>

            <div className="space-y-4">
              {/* Événements */}
              {(sidebarFilter === 'all' || sidebarFilter === 'events') && (
                <>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🏖️</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Beach Party</h3>
                        <p className="text-blue-300 text-sm">21 juin - 16h</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Soirée exclusive sur la plage avec DJ international</p>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium">
                      En savoir plus
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🎷</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Soirée Jazz</h3>
                        <p className="text-purple-300 text-sm">26 juin - 22h</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Concert de jazz avec vue imprenable sur la mer</p>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium">
                      En savoir plus
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/20 to-teal-600/20 border border-green-500/30 rounded-xl p-4 hover:border-green-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🍽️</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Dîner Gastronomique</h3>
                        <p className="text-green-300 text-sm">28 juin - 20h</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Menu dégustation avec chef étoilé Michelin</p>
                    <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium">
                      Réserver
                    </button>
                  </div>
                </>
              )}

              {/* Établissements */}
              {(sidebarFilter === 'all' || sidebarFilter === 'establishments') && (
                <>
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-4 hover:border-amber-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🍣</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Nobu Marbella</h3>
                        <p className="text-amber-300 text-sm">Restaurant Japonais</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Cuisine japonaise de luxe avec vue sur la mer</p>
                    <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium">
                      Réserver
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-teal-500/20 to-cyan-600/20 border border-teal-500/30 rounded-xl p-4 hover:border-teal-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🏖️</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">La Terraza del Mar</h3>
                        <p className="text-teal-300 text-sm">Restaurant Méditerranéen</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Ambiance méditerranéenne avec vue panoramique</p>
                    <button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium">
                      Réserver
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/20 to-green-600/20 border border-emerald-500/30 rounded-xl p-4 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white text-lg">🏨</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">El Lago</h3>
                        <p className="text-emerald-300 text-sm">Restaurant Créatif</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Cuisine créative avec vue sur le lac</p>
                    <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium">
                      Réserver
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-rose-500/20 to-pink-600/20 border border-rose-500/30 rounded-xl p-4 hover:border-rose-400/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
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
            </div>
            
            <div className="h-8"></div>
          </div>
        </div>
      </main>
      
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
  )
}

export default memo(ChatInterface)
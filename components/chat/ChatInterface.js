import { useState, useEffect } from 'react'
import { MessageCircle, Loader2, Menu, X } from 'lucide-react'
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
  }, []) // Seulement au montage du composant

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, messagesEndRef])

  // Fonction pour auto-resize du textarea
  const handleInputChange = (e) => {
    setInput(e.target.value)
    
    // Masquer les suggestions quand l'utilisateur tape
    if (e.target.value.trim()) {
      setShowSuggestiveMessages(false)
    } else {
      setShowSuggestiveMessages(true)
    }
    
    // Auto-resize
    if (textareaRef) {
      textareaRef.style.height = 'auto'
      textareaRef.style.height = Math.min(textareaRef.scrollHeight, 200) + 'px'
    }
  }

  // Fonction pour gérer le clic sur un message suggestif
  const handleSuggestiveMessageClick = (message) => {
    setInput(message)
    setShowSuggestiveMessages(false) // Masquer les messages suggestifs quand l'utilisateur tape
  }

  // Fonctions pour gérer la dictée vocale
  const handleVoiceTranscript = (text) => {
    setInput(prevInput => prevInput + (prevInput ? ' ' : '') + text)
    setShowSuggestiveMessages(false)
  }

  const handleInterimTranscript = (text) => {
    // Optionnel : afficher la transcription en temps réel
    console.log('Transcription intermédiaire:', text)
  }

  // Fonction pour envoyer un message
  const handleSend = async () => {
    console.log('🔍 handleSend appelé')
    console.log('📝 Input:', input)
    console.log('⏳ Loading:', isLoading)
    console.log('💬 Conversation ID:', currentConversationId)
    
    if (!input.trim()) {
      console.log('❌ Input vide')
      return
    }
    
    if (isLoading) {
      console.log('❌ Déjà en cours de chargement')
      return
    }
    
    if (!currentConversationId) {
      console.log('❌ Pas de conversation active, création d\'une nouvelle conversation')
      try {
        const newConversationId = createConversation('Nouvelle conversation')
        console.log('✅ Nouvelle conversation créée:', newConversationId)
        // Attendre un peu pour que la conversation soit créée
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error('❌ Erreur création conversation:', error)
        return
      }
    }

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    }

    addMessage(userMessage)
    setInput('')
    setShowSuggestiveMessages(false) // Masquer les messages suggestifs après envoi
    
    // Reset textarea height
    if (textareaRef) {
      textareaRef.style.height = '60px'
    }
    
    // Scroll vers le bas après l'ajout du message utilisateur
    setTimeout(() => {
      if (messagesEndRef) {
        messagesEndRef.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
    
    setIsLoading(true)

    try {
      // Récupérer l'historique complet incluant le nouveau message
      const currentMessages = [...messages, userMessage]
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userName: user?.first_name || user?.name || "utilisateur",
          isMember: user?.is_member || false,
          conversationHistory: currentMessages.slice(-10), // Envoyer les 10 derniers messages pour le contexte
        }),
      })

      const data = await response.json()

      const aiMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'ai',
      }

      addMessage(aiMessage)
      
      // Scroll vers le bas après la réponse de l'IA
      setTimeout(() => {
        if (messagesEndRef) {
          messagesEndRef.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Désolé, une erreur s\'est produite avec Get Weez. Veuillez réessayer.',
        sender: 'ai',
      }
      addMessage(errorMessage)
      showToast('Erreur de connexion. Veuillez réessayer.', 'error')
    } finally {
      setIsLoading(false)
      // Réafficher les messages suggestifs après 3 secondes
      setTimeout(() => {
        setShowSuggestiveMessages(true)
      }, 3000)
    }
  }

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-black"
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        height: '100vh',
        width: '100vw'
      }}
    >
      {/* Sidebar des conversations - Desktop */}
      {isSidebarOpen && (
        <div className="hidden lg:block w-80 flex-shrink-0">
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

      {/* Overlay mobile pour la sidebar */}
      <MobileChatOverlay
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={createConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
      />

      {/* Zone principale du chat */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden w-full">
        {/* Header du chat */}
        <div 
          className="flex items-center justify-between p-3 md:p-4 border-b flex-shrink-0 bg-gray-900"
          style={{ 
            borderColor: 'var(--color-border)', 
            backgroundColor: 'var(--color-bg-secondary)',
            minHeight: '3.5rem'
          }}
        >
          <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors lg:hidden flex-shrink-0"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h2 className="text-lg md:text-xl font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {conversations.find(c => c.id === currentConversationId)?.name || 'Nouvelle Conversation'}
            </h2>
          </div>
        </div>

        {/* Zone d'affichage des messages */}
        <div 
          className="flex-1 overflow-y-auto p-3 md:p-6 scroll-smooth bg-black"
          style={{ 
            backgroundColor: 'var(--color-bg-primary)',
            minHeight: 0,
            scrollBehavior: 'smooth'
          }}
        >
          {messages && messages.length > 0 ? (
            <div className="max-w-2xl mx-auto space-y-3 md:space-y-4 px-2 md:px-4">
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

        {/* Messages suggestifs */}
        {showSuggestiveMessages && messages.length === 0 && !input.trim() && (
          <SuggestiveMessages
            category="general"
            show={showSuggestiveMessages}
            onMessageClick={handleSuggestiveMessageClick}
          />
        )}

        {/* Zone de saisie */}
        <div 
          className="p-3 md:p-6 border-t flex-shrink-0 bg-gray-900 border-gray-700"
          style={{ 
            borderColor: '#374151', 
            backgroundColor: '#111827'
          }}
        >
          <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div 
              className="relative rounded-2xl border transition-all duration-300 hover:border-purple-500/50 focus-within:border-purple-500 bg-gray-800 border-gray-600"
              style={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <textarea
                ref={setTextareaRef}
                placeholder="Écrivez ce dont vous avez besoin..."
                value={input}
                onChange={handleInputChange}
                className="w-full resize-none pr-12 md:pr-14 py-3 md:py-4 pl-3 md:pl-4 text-white placeholder-gray-400 text-sm md:text-base"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  minHeight: '44px'
                }}
                onKeyDown={(e) => {
                  console.log('🔍 Touche pressée:', e.key, 'Shift:', e.shiftKey)
                  if (e.key === 'Enter' && !e.shiftKey) {
                    console.log('✅ Entrée pressée, tentative d\'envoi')
                    e.preventDefault()
                    e.stopPropagation()
                    if (input.trim() && !isLoading) {
                      console.log('🚀 Envoi du message')
                      handleSend()
                    } else {
                      console.log('❌ Conditions non remplies pour l\'envoi')
                    }
                  }
                }}
                rows={1}
                disabled={isLoading}
              />

              {/* Bouton de dictée vocale */}
              <div className="absolute right-10 md:right-12 top-1/2 transform -translate-y-1/2">
                <VoiceDictationButton
                  onTranscript={handleVoiceTranscript}
                  onInterimTranscript={handleInterimTranscript}
                  disabled={isLoading}
                  size={14}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: input.trim() && !isLoading ? '#8B5CF6' : '#6B7280',
                  color: 'white'
                }}
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin md:hidden" />
                ) : (
                  <svg width="14" height="14" className="md:hidden" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                  </svg>
                )}
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin hidden md:block" />
                ) : (
                  <svg width="16" height="16" className="hidden md:block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          


          {/* Info text */}
          <div className="mt-2 md:mt-4 text-center px-2">
            <p className="text-xs text-gray-400">
              <span className="hidden sm:inline">Appuyez sur </span>
              <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs text-gray-300">Entrée</kbd> 
              <span className="hidden sm:inline"> pour envoyer</span>
              <span className="sm:hidden"> envoyer</span>
              <span className="hidden md:inline">, </span>
              <span className="hidden md:inline">
                <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs mx-1 text-gray-300">Maj+Entrée</kbd> pour une nouvelle ligne,
              </span>
              <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs mx-1 text-gray-300">🎤</kbd> 
              <span className="hidden sm:inline">pour dicter</span>
              <span className="sm:hidden">dicter</span>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

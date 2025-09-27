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
    
    // Si aucune conversation n'existe, en créer une
    if (conversations.length === 0) {
      console.log('✅ ChatInterface - Création d\'une nouvelle conversation')
      createConversation('Nouvelle conversation')
    }
    // Si des conversations existent mais aucune n'est sélectionnée, sélectionner la première
    else if (conversations.length > 0 && !currentConversationId) {
      console.log('✅ ChatInterface - Sélection de la première conversation existante')
      selectConversation(conversations[0].id)
    }
    // Si une conversation est déjà sélectionnée, ne rien faire
    else if (currentConversationId && conversations.some(conv => conv.id === currentConversationId)) {
      console.log('✅ ChatInterface - Conversation déjà active, pas d\'action nécessaire')
    }
  }, []) // Seulement au montage du composant

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

  // Fonction pour gérer la dictée vocale
  const handleVoiceTranscript = (text) => {
    setInput(prevInput => prevInput + text)
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
      className="flex h-full w-full"
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        height: '100%',
        width: '100%'
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
      <div className="flex-1 flex flex-col h-full">
        {/* Header du chat */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ 
            borderColor: 'var(--color-border)', 
            backgroundColor: 'var(--color-bg-secondary)',
            minHeight: '4rem'
          }}
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors lg:hidden"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {conversations.find(c => c.id === currentConversationId)?.name || 'Nouvelle Conversation'}
            </h2>
          </div>
        </div>

        {/* Zone d'affichage des messages */}
        <div 
          className="flex-1 overflow-y-auto p-6"
          style={{ 
            backgroundColor: 'var(--color-bg-primary)',
            minHeight: 0
          }}
        >
          {messages.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'rounded-br-md'
                        : 'rounded-bl-md border'
                    }`}
                    style={{
                      backgroundColor: msg.sender === 'user' 
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)' 
                        : 'var(--color-bg-secondary)',
                      color: msg.sender === 'user' ? 'white' : 'var(--color-text-primary)',
                      borderColor: msg.sender === 'user' ? 'transparent' : 'var(--color-border)'
                    }}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div 
                    className="max-w-2xl px-4 py-3 rounded-2xl rounded-bl-md border"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    <div className="flex items-center">
                      <Loader2 size={16} className="animate-spin mr-3" style={{ color: 'var(--color-primary)' }} />
                      <span className="text-sm">Get Weez vous prépare une réponse...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-glow animate-float"
                style={{ background: 'var(--color-primary)' }}
              >
                <MessageCircle size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                {conversations.length === 0 ? 'Bienvenue sur Get Weez' : 'Sélectionnez une conversation'}
              </h3>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                {conversations.length === 0 
                  ? 'Commencez par créer une nouvelle conversation' 
                  : 'Choisissez une conversation dans la sidebar pour commencer'
                }
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
          className="p-6 border-t"
          style={{ 
            borderColor: 'var(--color-border)', 
            backgroundColor: 'var(--color-bg-secondary)'
          }}
        >
          <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div 
              className="relative rounded-2xl border transition-all duration-300 hover:border-primary/50 focus-within:border-primary focus-within:shadow-glow"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <textarea
                ref={setTextareaRef}
                placeholder="Écrivez ce dont vous avez besoin..."
                value={input}
                onChange={handleInputChange}
                className="w-full resize-none pr-14 py-4 pl-4"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  lineHeight: '1.5'
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
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <VoiceDictationButton
                  onTranscript={handleVoiceTranscript}
                  onInterimTranscript={handleInterimTranscript}
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: input.trim() && !isLoading ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  color: 'white'
                }}
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
          </div>
          

          {/* Bouton de test pour débogage */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                console.log('🧪 Test bouton - État actuel:')
                console.log('📝 Input:', input)
                console.log('⏳ Loading:', isLoading)
                console.log('💬 Conversation ID:', currentConversationId)
                console.log('📚 Messages:', messages.length)
                console.log('📚 Conversations:', conversations.length)
                if (input.trim() && !isLoading) {
                  handleSend()
                } else {
                  console.log('❌ Conditions non remplies pour l\'envoi')
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            >
              🧪 Test Envoi
            </button>
            <button
              onClick={() => {
                console.log('🔧 Test Entrée simulé')
                const event = new KeyboardEvent('keydown', {
                  key: 'Enter',
                  shiftKey: false
                })
                document.querySelector('textarea').dispatchEvent(event)
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              🔧 Test Entrée
            </button>
          </div>

          {/* Info text */}
          <div className="mt-4 text-center">
            <p className="text-caption" style={{ color: 'var(--color-text-muted)' }}>
              Appuyez sur <kbd className="px-1.5 py-0.5 bg-surface rounded text-xs">Entrée</kbd> pour envoyer, 
              <kbd className="px-1.5 py-0.5 bg-surface rounded text-xs mx-1">Maj+Entrée</kbd> pour une nouvelle ligne,
              <kbd className="px-1.5 py-0.5 bg-surface rounded text-xs mx-1">🎤</kbd> pour dicter
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

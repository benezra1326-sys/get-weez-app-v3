import { useState, useEffect } from 'react'
import { MessageCircle, Loader2, Menu, X } from 'lucide-react'
import { useTranslation } from 'next-i18next'
import SidebarChat from './SidebarChat'
import MobileChatOverlay from './MobileChatOverlay'
import { useConversations } from '../../hooks/useConversations'
import { ChatLoadingSpinner } from '../ui/LoadingSpinner'
import { useToast } from '../ui/Toast'

export default function ChatInterface({ user }) {
  const { t } = useTranslation('common')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [textareaRef, setTextareaRef] = useState(null)
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

  // Créer une nouvelle conversation si nécessaire
  useEffect(() => {
    console.log('🔍 ChatInterface - Vérification des conversations...')
    console.log('🔍 Conversations:', conversations.length, 'Current ID:', currentConversationId)
    
    // Si aucune conversation n'existe, en créer une
    if (conversations.length === 0 && !currentConversationId) {
      console.log('✅ ChatInterface - Création d\'une nouvelle conversation')
      createConversation()
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
  }, [conversations.length, currentConversationId]) // Retirer les dépendances qui causent des re-renders

  // Fonction pour auto-resize du textarea
  const handleInputChange = (e) => {
    setInput(e.target.value)
    
    // Auto-resize
    if (textareaRef) {
      textareaRef.style.height = 'auto'
      textareaRef.style.height = Math.min(textareaRef.scrollHeight, 200) + 'px'
    }
  }

  // Fonction pour envoyer un message
  const handleSend = async () => {
    if (!input.trim() || isLoading || !currentConversationId) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    }

    addMessage(userMessage)
    setInput('')
    
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
    }
  }

  return (
    <div className="flex h-full min-w-0" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Sidebar des conversations - Desktop */}
      {isSidebarOpen && (
        <div className="hidden lg:block flex-shrink-0">
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header avec bouton toggle sidebar - Responsive */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors lg:hidden"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <h2 className="text-heading-3 truncate px-2" style={{ color: 'var(--color-text-primary)' }}>
            {conversations.find(c => c.id === currentConversationId)?.name || 'Chat'}
          </h2>
          <div className="w-8 lg:w-10" /> {/* Spacer responsive */}
        </div>

        {/* Zone d'affichage des messages - Responsive */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
        {messages.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-3xl px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700'
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'user' ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)' : 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  <div className="text-body-small sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div 
                  className="max-w-xs sm:max-w-md lg:max-w-3xl px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-bl-md border border-gray-700"
                  style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  <div className="flex items-center">
                    <Loader2 size={14} className="animate-spin mr-2 sm:mr-3" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-body-small sm:text-sm">Get Weez vous prépare une réponse...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-glow animate-float"
              style={{ background: 'var(--color-primary)' }}
            >
              <MessageCircle size={24} className="sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-heading-2 mb-2 sm:mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Commencez une conversation
            </h3>
            <p className="text-body-large" style={{ color: 'var(--color-text-secondary)' }}>
              Demandez une expérience exclusive à Marbella
            </p>
          </div>
        )}
        </div>

        {/* Zone de saisie - Style ChatGPT Luxueux */}
        <div className="p-4 sm:p-6 lg:p-8 border-t" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
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
                placeholder={t('chat.placeholder') || "Écrivez ce dont vous avez besoin..."}
                value={input}
                onChange={handleInputChange}
                className="w-full resize-none text-body pr-14 py-4 pl-4"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  minHeight: '60px',
                  maxHeight: '200px',
                  height: '60px',
                  fontFamily: 'var(--font-family-primary)'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`absolute bottom-3 right-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isLoading || !input.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'animate-hover-lift hover:scale-105'
                }`}
                style={{
                  backgroundColor: isLoading || !input.trim() 
                    ? 'var(--color-text-muted)' 
                    : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-primary-darker) 100%)',
                  color: 'var(--color-text-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: isLoading || !input.trim() ? 'none' : 'var(--shadow-glow)'
                }}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Info text */}
          <div className="mt-4 text-center">
            <p className="text-caption" style={{ color: 'var(--color-text-muted)' }}>
              Appuyez sur <kbd className="px-1.5 py-0.5 bg-surface rounded text-xs">Entrée</kbd> pour envoyer, 
              <kbd className="px-1.5 py-0.5 bg-surface rounded text-xs mx-1">Maj+Entrée</kbd> pour une nouvelle ligne
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

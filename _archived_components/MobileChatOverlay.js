import { useState, useEffect } from 'react'
import { X, MessageSquare, Plus } from 'lucide-react'
import SidebarChat from './SidebarChat'

export default function MobileChatOverlay({ 
  isOpen, 
  onClose, 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation, 
  onRenameConversation 
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar mobile */}
      <div 
        className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-bg-secondary border-r border-border transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          backgroundColor: 'var(--color-bg-secondary)', 
          borderRight: '1px solid var(--color-border)' 
        }}
      >
        {/* Header mobile */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-heading-3" style={{ color: 'var(--color-text-primary)' }}>
            Conversations
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu de la sidebar */}
        <div className="h-full flex flex-col">
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => {
                onNewConversation()
                onClose()
              }}
              className="w-full btn-premium flex items-center justify-center animate-hover-lift text-body-small"
            >
              <Plus size={16} className="mr-2" />
              Nouvelle conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                    currentConversationId === conversation.id
                      ? 'ring-2'
                      : 'hover:bg-gray-800/50'
                  }`}
                  style={{
                    backgroundColor: currentConversationId === conversation.id 
                      ? 'var(--color-surface-hover)' 
                      : 'transparent',
                    ringColor: currentConversationId === conversation.id 
                      ? 'var(--color-primary)' 
                      : 'transparent'
                  }}
                  onClick={() => {
                    onSelectConversation(conversation.id)
                    onClose()
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <MessageSquare 
                      size={16} 
                      className="mt-1 flex-shrink-0" 
                      style={{ color: 'var(--color-text-muted)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-body-small font-medium truncate"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {conversation.name}
                      </h3>
                      <p 
                        className="text-caption mt-1 truncate"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {conversation.lastMessage || 'Nouvelle conversation'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {conversations.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare 
                  size={32} 
                  className="mx-auto mb-3" 
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <p 
                  className="text-body-small"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Aucune conversation
                </p>
                <p 
                  className="text-caption mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Commencez une nouvelle conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

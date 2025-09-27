import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Trash2, Edit3, Check, X } from 'lucide-react'

export default function SidebarChat({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation, 
  onRenameConversation 
}) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleRename = (id, currentName) => {
    setEditingId(id)
    setEditName(currentName)
  }

  const handleSaveRename = () => {
    if (editName.trim()) {
      onRenameConversation(editingId, editName.trim())
    }
    setEditingId(null)
    setEditName('')
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveRename()
    } else if (e.key === 'Escape') {
      handleCancelRename()
    }
  }

  return (
    <div className="w-64 sm:w-72 lg:w-80 h-full flex flex-col min-w-0" style={{ backgroundColor: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)' }}>
      {/* Header */}
      <div className="p-3 sm:p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={onNewConversation}
          className="w-full btn-premium flex items-center justify-center animate-hover-lift text-body-small sm:text-body"
        >
          <Plus size={16} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Nouvelle conversation</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="space-y-1 sm:space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group relative rounded-xl p-2 sm:p-3 cursor-pointer transition-all duration-200 ${
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
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MessageSquare 
                  size={14} 
                  className="mt-1 flex-shrink-0" 
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <div className="flex-1 min-w-0">
                  {editingId === conversation.id ? (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-2 py-1 text-body-small rounded"
                        style={{ 
                          backgroundColor: 'var(--color-bg-primary)',
                          color: 'var(--color-text-primary)',
                          border: '1px solid var(--color-border)'
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveRename}
                        className="p-1 hover:bg-gray-700 rounded"
                        style={{ color: 'var(--color-success)' }}
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="p-1 hover:bg-gray-700 rounded"
                        style={{ color: 'var(--color-error)' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div>
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
                      <p 
                        className="text-caption mt-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {conversation.updatedAt}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions (visible au hover) */}
              {editingId !== conversation.id && (
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRename(conversation.id, conversation.name)
                      }}
                      className="p-1 hover:bg-gray-700 rounded"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <Edit3 size={10} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteConversation(conversation.id)
                      }}
                      className="p-1 hover:bg-gray-700 rounded"
                      style={{ color: 'var(--color-error)' }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <MessageSquare 
              size={24} 
              className="mx-auto mb-2 sm:mb-3" 
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
  )
}

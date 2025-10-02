import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Trash2, Edit3, Check, X, Sparkles, Zap, Star, Bot, User } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

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
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = true
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
  } catch (error) {
    console.warn('ThemeProvider not available, using dark mode as default')
  }

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
    <div 
      className="w-64 sm:w-72 lg:w-80 h-full flex flex-col min-w-0 backdrop-blur-md border-r"
      style={{
        background: isDarkMode 
          ? 'rgba(17, 24, 39, 0.8)' 
          : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{
          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'
        }}
      >
        <button
          onClick={onNewConversation}
          className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-102 hover:shadow-md hover:shadow-purple-500/20 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-1.5">
            <div className="p-0.5 bg-white/20 rounded group-hover:bg-white/25 transition-colors duration-300">
              <Plus size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold truncate">Nouveau chat</span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
              <Sparkles size={12} className="text-yellow-300" />
            </div>
          </div>
        </button>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {conversations.slice(0, 8).map((conversation, index) => {
            const isActive = currentConversationId === conversation.id
            const iconConfigs = [
              { gradient: 'from-blue-500 to-cyan-500', icon: Bot },
              { gradient: 'from-purple-500 to-pink-500', icon: MessageSquare }, 
              { gradient: 'from-green-500 to-emerald-500', icon: Zap },
              { gradient: 'from-orange-500 to-red-500', icon: Star },
              { gradient: 'from-indigo-500 to-blue-500', icon: User },
              { gradient: 'from-pink-500 to-rose-500', icon: Sparkles },
              { gradient: 'from-teal-500 to-green-500', icon: Bot },
              { gradient: 'from-violet-500 to-purple-500', icon: MessageSquare }
            ]
            const config = iconConfigs[index % iconConfigs.length]
            const IconComponent = config.icon
            
            return (
              <div
                key={conversation.id}
                className={`group relative rounded-xl p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 border`}
                style={{
                  background: isActive
                    ? isDarkMode 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)'
                    : 'transparent',
                  borderColor: isActive
                    ? isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'
                    : 'transparent',
                  boxShadow: isActive
                    ? isDarkMode 
                      ? '0 4px 20px rgba(139, 92, 246, 0.1)'
                      : '0 2px 10px rgba(139, 92, 246, 0.1)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isDarkMode 
                      ? 'rgba(55, 65, 81, 0.5)' 
                      : 'rgba(243, 244, 246, 0.8)'
                    e.currentTarget.style.borderColor = isDarkMode 
                      ? 'rgba(75, 85, 99, 0.3)' 
                      : 'rgba(209, 213, 219, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }
                }}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient} shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent 
                      size={14} 
                      className="text-white"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === conversation.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveRename}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 hover:scale-110"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 hover:scale-110"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h3 
                          className="text-sm font-semibold truncate mb-1"
                          style={{
                            color: isActive 
                              ? isDarkMode ? '#FFFFFF' : '#1F2937'
                              : isDarkMode ? '#E5E7EB' : '#374151'
                          }}
                        >
                          {conversation.name}
                        </h3>
                        <p 
                          className="text-xs truncate mb-1"
                          style={{
                            color: isDarkMode ? '#9CA3AF' : '#6B7280'
                          }}
                        >
                          {conversation.lastMessage || 'Nouvelle conversation'}
                        </p>
                        <p 
                          className="text-xs"
                          style={{
                            color: isDarkMode ? '#6B7280' : '#9CA3AF'
                          }}
                        >
                          {conversation.updatedAt}
                        </p>
                      </div>
                    )}
                </div>
              </div>

                {/* Actions élégantes (visible au hover) */}
                {editingId !== conversation.id && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-3 group-hover:translate-x-0">
                    <div 
                      className="flex space-x-1.5 backdrop-blur-xl rounded-xl p-1.5 border shadow-xl"
                      style={{
                        background: isDarkMode 
                          ? 'rgba(17, 24, 39, 0.95)' 
                          : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isDarkMode 
                          ? 'rgba(75, 85, 99, 0.5)' 
                          : 'rgba(229, 231, 235, 0.8)'
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRename(conversation.id, conversation.name)
                        }}
                        className="group/btn p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40 text-blue-300 hover:text-white rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 border border-blue-500/20 hover:border-blue-400/40"
                        title="Renommer la conversation"
                      >
                        <Edit3 size={11} className="transition-transform duration-300 group-hover/btn:rotate-12" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteConversation(conversation.id)
                        }}
                        className="group/btn p-2 bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/40 hover:to-rose-500/40 text-red-300 hover:text-white rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 border border-red-500/20 hover:border-red-400/40"
                        title="Supprimer la conversation"
                      >
                        <Trash2 size={11} className="transition-transform duration-300 group-hover/btn:scale-110" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-8">
            <div className="p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-2xl mb-4">
              <MessageSquare 
                size={32} 
                className="mx-auto text-gray-400 mb-3" 
              />
              <p className="text-gray-300 font-medium mb-2">
                Aucune conversation
              </p>
              <p className="text-gray-500 text-sm">
                Commencez une nouvelle conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Trash2, Edit3, Check, X, Sparkles, Zap, Star, Bot, User } from 'lucide-react'

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
    <div className="w-64 sm:w-72 lg:w-80 h-full flex flex-col min-w-0 bg-gray-900/80 backdrop-blur-md border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewConversation}
          className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-2">
            <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
              <Plus size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold">Nouvelle conversation</span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles size={14} className="text-yellow-300" />
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
                className={`group relative rounded-xl p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                    : 'hover:bg-gray-800/50 border border-transparent hover:border-gray-600/30'
                }`}
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
                        <h3 className={`text-sm font-semibold truncate mb-1 ${isActive ? 'text-white' : 'text-gray-200'}`}>
                          {conversation.name}
                        </h3>
                        <p className="text-xs text-gray-400 truncate mb-1">
                          {conversation.lastMessage || 'Nouvelle conversation'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conversation.updatedAt}
                        </p>
                      </div>
                    )}
                </div>
              </div>

                {/* Actions (visible au hover) */}
                {editingId !== conversation.id && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRename(conversation.id, conversation.name)
                        }}
                        className="p-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteConversation(conversation.id)
                        }}
                        className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                      >
                        <Trash2 size={12} />
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

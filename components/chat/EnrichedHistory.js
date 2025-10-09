import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, Trash2, Edit2, Check, X, Sparkles } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function EnrichedHistory({ 
  conversations = [], 
  currentId,
  onSelect,
  onDelete,
  onRename
}) {
  const { isDarkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredConversations, setFilteredConversations] = useState(conversations)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    // Filtrer les conversations par recherche
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = conversations.filter(conv => 
        conv.name?.toLowerCase().includes(query) ||
        conv.lastMessage?.toLowerCase().includes(query) ||
        conv.messages?.some(m => m.content.toLowerCase().includes(query))
      )
      setFilteredConversations(filtered)
    }
  }, [searchQuery, conversations])

  const handleStartEdit = (conv) => {
    setEditingId(conv.id)
    setEditingName(conv.name)
  }

  const handleSaveEdit = (id) => {
    if (editingName.trim() && onRename) {
      onRename(id, editingName.trim())
    }
    setEditingId(null)
    setEditingName('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'À l\'instant'
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)}min`
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div 
        className="mb-4 p-2 rounded-lg flex items-center gap-2"
        style={{
          background: isDarkMode 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.6)',
          border: `1px solid ${isDarkMode 
            ? 'rgba(192, 192, 192, 0.15)' 
            : 'rgba(192, 192, 192, 0.25)'}`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Search size={16} style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{
            fontFamily: 'Poppins, sans-serif',
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.85rem',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  fontStyle: 'italic'
                }}
              >
                {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
              </p>
            </motion.div>
          ) : (
            filteredConversations.map((conv, index) => {
              const isActive = conv.id === currentId
              const isEditing = editingId === conv.id
              
              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="p-3 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: isActive
                        ? (isDarkMode ? 'rgba(192, 192, 192, 0.15)' : 'rgba(167, 199, 197, 0.2)')
                        : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'),
                      border: `1px solid ${isActive
                        ? (isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(167, 199, 197, 0.4)')
                        : (isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(192, 192, 192, 0.2)')}`,
                      backdropFilter: 'blur(10px)'
                    }}
                    onClick={() => !isEditing && onSelect && onSelect(conv.id)}
                  >
                    {/* Sparkle indicator for active */}
                    {isActive && (
                      <Sparkles 
                        size={12} 
                        className="absolute top-2 right-2"
                        style={{ color: isDarkMode ? '#C0C0C0' : '#A7C7C5' }}
                      />
                    )}

                    {/* Conversation Name */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 bg-transparent outline-none px-2 py-1 rounded"
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '0.9rem',
                            color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                            border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.4)'}`
                          }}
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(conv.id)}
                        />
                        <button
                          onClick={() => handleSaveEdit(conv.id)}
                          className="p-1 rounded hover:bg-opacity-20 hover:bg-green-500"
                        >
                          <Check size={14} style={{ color: '#10B981' }} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 rounded hover:bg-opacity-20 hover:bg-red-500"
                        >
                          <X size={14} style={{ color: '#EF4444' }} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                            lineHeight: '1.3',
                            flex: 1
                          }}
                        >
                          {conv.name}
                        </h4>
                      </div>
                    )}

                    {/* Last Message Preview */}
                    {conv.lastMessage && !isEditing && (
                      <p
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.75rem',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                          lineHeight: '1.3',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginBottom: '8px'
                        }}
                      >
                        {conv.lastMessage}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-1"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.7rem',
                          color: isDarkMode ? 'rgba(192, 192, 192, 0.7)' : 'rgba(0, 0, 0, 0.5)'
                        }}
                      >
                        <Clock size={10} />
                        <span>{formatDate(conv.updatedAt || conv.createdAt)}</span>
                      </div>

                      {/* Message Count */}
                      {conv.messages && conv.messages.length > 0 && (
                        <div
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            background: isDarkMode 
                              ? 'rgba(192, 192, 192, 0.2)' 
                              : 'rgba(167, 199, 197, 0.3)',
                            color: isDarkMode ? '#C0C0C0' : '#5A8B89',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '0.65rem',
                            fontWeight: '600'
                          }}
                        >
                          {conv.messages.length}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons (visible on hover) */}
                    {!isEditing && (
                      <div 
                        className="absolute top-2 right-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleStartEdit(conv)}
                          className="p-1.5 rounded-lg"
                          style={{
                            background: isDarkMode 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)',
                            border: `1px solid ${isDarkMode 
                              ? 'rgba(192, 192, 192, 0.2)' 
                              : 'rgba(192, 192, 192, 0.3)'}`
                          }}
                        >
                          <Edit2 size={12} style={{ color: isDarkMode ? '#C0C0C0' : '#5A8B89' }} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete && onDelete(conv.id)}
                          className="p-1.5 rounded-lg"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          <Trash2 size={12} style={{ color: '#EF4444' }} />
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


import React, { memo, useCallback } from 'react'
import { MessageCircle, Sparkles, Trash2, X } from 'lucide-react'
import { useOptimizedStyles, useConditionalClasses } from '../../hooks/useOptimizedStyles'
import styles from '../../styles/chat-optimized.module.css'

/**
 * Sidebar des conversations - Composant optimisé
 * Extrait des lignes 305-519 du ChatInterface original
 */
const ConversationSidebar = memo(({
  conversations = [],
  currentConversationId,
  onCreateConversation,
  onSelectConversation,
  onDeleteConversation,
  showMobileHistory,
  onCloseMobileHistory
}) => {
  const { getButtonStyle, getCardStyle, baseStyles } = useOptimizedStyles()

  // Handlers optimisés avec useCallback
  const handleCreateConversation = useCallback(() => {
    onCreateConversation()
    onCloseMobileHistory?.()
  }, [onCreateConversation, onCloseMobileHistory])

  const handleSelectConversation = useCallback((conversationId) => {
    onSelectConversation(conversationId)
    onCloseMobileHistory?.()
  }, [onSelectConversation, onCloseMobileHistory])

  const handleDeleteConversation = useCallback((conversationId, conversationName) => {
    if (confirm(`Supprimer "${conversationName}" ?`)) {
      onDeleteConversation(conversationId)
    }
  }, [onDeleteConversation])

  // Classes conditionnelles optimisées
  const sidebarClasses = useConditionalClasses(
    'hidden lg:block w-72 border-r overflow-y-auto h-full flex-shrink-0',
    styles.sidebarLeft,
    styles.scrollbarCustom
  )

  const mobileOverlayClasses = useConditionalClasses(
    'lg:hidden fixed inset-0 backdrop-blur-sm z-50',
    showMobileHistory ? 'block' : 'hidden'
  )

  return (
    <>
      {/* Version desktop */}
      <div className={sidebarClasses}>
        <div className="p-6 flex-1 overflow-y-auto pb-8 min-h-0">
          <h2 className="text-xl font-bold mb-6 text-white">Conversations</h2>
          
          <div className="space-y-4">
            {/* Bouton Nouvelle Conversation Optimisé */}
            <NewConversationCard onClick={handleCreateConversation} />

            {/* Liste des conversations */}
            <ConversationsList
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelect={handleSelectConversation}
              onDelete={handleDeleteConversation}
            />
          </div>
        </div>
      </div>

      {/* Version mobile avec overlay */}
      {showMobileHistory && (
        <MobileConversationOverlay
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteConversation}
          onClose={onCloseMobileHistory}
          onCreateConversation={handleCreateConversation}
        />
      )}
    </>
  )
})

/**
 * Carte "Nouvelle Conversation" optimisée
 */
const NewConversationCard = memo(({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`${styles.cardBase} relative overflow-hidden cursor-pointer group p-4`}
      style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
      }}
    >
      {/* Badge Premium */}
      <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
        ✨ NOUVEAU
      </div>
      
      <div className="relative">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Nouvelle Conversation</h3>
            <p className="text-purple-100 text-base">Commencez un nouveau chat</p>
          </div>
        </div>
        <p className="text-white/90 text-sm mb-4 leading-relaxed">
          Démarrez une nouvelle conversation avec Get Weez
        </p>
        <div className="flex items-center justify-between">
          <div className="text-purple-100 text-sm font-medium">💬 Chat IA</div>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300">
            Créer
          </button>
        </div>
      </div>
    </div>
  )
})

/**
 * Liste des conversations optimisée
 */
const ConversationsList = memo(({
  conversations,
  currentConversationId,
  onSelect,
  onDelete
}) => {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle size={48} className="text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-base">Aucune conversation</p>
      </div>
    )
  }

  return (
    <>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === currentConversationId}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </>
  )
})

/**
 * Item de conversation individuel optimisé
 */
const ConversationItem = memo(({
  conversation,
  isActive,
  onSelect,
  onDelete
}) => {
  const handleSelect = useCallback(() => {
    onSelect(conversation.id)
  }, [onSelect, conversation.id])

  const handleDelete = useCallback((e) => {
    e.stopPropagation()
    onDelete(conversation.id, conversation.name)
  }, [onDelete, conversation.id, conversation.name])

  const cardClasses = useConditionalClasses(
    styles.cardBase,
    'p-4 group relative',
    isActive
      ? 'border-blue-500 bg-blue-600/20'
      : 'border-gray-500/30 hover:border-blue-400/50'
  )

  return (
    <div className={cardClasses}>
      <div className="cursor-pointer" onClick={handleSelect}>
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${
            isActive 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            <MessageCircle size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
              {conversation.name}
            </h3>
            <p className={`text-sm ${isActive ? 'text-blue-300' : 'text-gray-400'}`}>
              {conversation.messages?.length || 0} messages
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-300 truncate">
          {conversation.messages && conversation.messages.length > 0 
            ? conversation.messages[conversation.messages.length - 1]?.content?.substring(0, 50) + '...'
            : 'Conversation vide'
          }
        </p>
      </div>
      
      {/* Bouton de suppression */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Supprimer la conversation"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
})

/**
 * Overlay mobile pour les conversations
 */
const MobileConversationOverlay = memo(({
  conversations,
  currentConversationId,
  onSelect,
  onDelete,
  onClose,
  onCreateConversation
}) => {
  return (
    <div className="lg:hidden fixed inset-0 backdrop-blur-sm z-50 bg-black/50" onClick={onClose}>
      <div 
        className="absolute top-16 left-4 right-4 backdrop-blur-md border rounded-2xl p-4 max-h-[70vh] overflow-y-auto bg-gray-900/95 border-gray-700" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-white">Conversations</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg transition-all duration-300 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Bouton nouvelle conversation mobile */}
        <button 
          onClick={onCreateConversation}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 mb-4 hover:from-purple-700 hover:to-indigo-700 transition-all"
        >
          <div className="flex items-center space-x-3">
            <Sparkles size={18} className="text-white" />
            <span className="font-medium text-white">Nouvelle Conversation</span>
          </div>
        </button>
        
        {/* Liste des conversations mobile */}
        <div className="space-y-2">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <MobileConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle size={32} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucune conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

/**
 * Item mobile pour les conversations
 */
const MobileConversationItem = memo(({
  conversation,
  isActive,
  onSelect,
  onDelete
}) => {
  const handleSelect = useCallback(() => {
    onSelect(conversation.id)
  }, [onSelect, conversation.id])

  const handleDelete = useCallback((e) => {
    e.stopPropagation()
    if (confirm(`Supprimer "${conversation.name}" ?`)) {
      onDelete(conversation.id)
    }
  }, [onDelete, conversation.id, conversation.name])

  return (
    <div className={`p-3 rounded-lg cursor-pointer transition-all border ${
      isActive 
        ? 'bg-blue-600/30 border-blue-500/50' 
        : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
    }`}>
      <div onClick={handleSelect} className="flex-1">
        <div className="text-sm font-medium truncate mb-1 text-white">
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
      
      <button
        onClick={handleDelete}
        className="mt-2 p-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
})

ConversationSidebar.displayName = 'ConversationSidebar'
NewConversationCard.displayName = 'NewConversationCard'
ConversationsList.displayName = 'ConversationsList'
ConversationItem.displayName = 'ConversationItem'
MobileConversationOverlay.displayName = 'MobileConversationOverlay'
MobileConversationItem.displayName = 'MobileConversationItem'

export default ConversationSidebar
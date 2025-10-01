import React, { useState, useEffect } from 'react'
import { MessageCircle, Trash2, Calendar, Clock, ArrowRight } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import { useTheme } from '../../contexts/ThemeContextSimple'
import Link from 'next/link'

const ChatHistory = ({ user }) => {
  const { isDarkMode } = useTheme()
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { conversations: hookConversations, deleteConversation } = useConversations()

  useEffect(() => {
    if (hookConversations) {
      setConversations(hookConversations)
      setIsLoading(false)
    }
  }, [hookConversations])

  const formatDate = (date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffTime = Math.abs(now - messageDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Aujourd\'hui'
    if (diffDays === 2) return 'Hier'
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`
    
    return messageDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    })
  }

  const getLastMessagePreview = (messages) => {
    if (!messages || messages.length === 0) return 'Conversation vide'
    
    const lastMessage = messages[messages.length - 1]
    return lastMessage.content.substring(0, 60) + (lastMessage.content.length > 60 ? '...' : '')
  }

  const handleDeleteConversation = (conversationId, conversationName) => {
    if (confirm(`Supprimer la conversation "${conversationName}" ?`)) {
      deleteConversation(conversationId)
    }
  }

  if (isLoading) {
    return (
      <div className={`rounded-2xl p-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50' 
          : 'bg-white border border-gray-200/50 shadow-xl'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <MessageCircle size={24} className="mr-3 text-purple-500" />
          Historique des Conversations
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 h-full flex flex-col ${
      isDarkMode 
        ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50' 
        : 'bg-white border border-gray-200/50 shadow-xl'
    }`}>
      <div className="mb-6 text-center">
        <h2 className={`text-2xl font-bold inline-flex items-center justify-center mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <MessageCircle size={24} className="mr-3 text-purple-500" />
          Historique des Conversations
        </h2>
        
        {/* Bouton nouvelle conversation - Version améliorée et centrée */}
        <div className="flex justify-center">
          <Link 
            href="/"
            className={`inline-flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
            }`}
          >
            <MessageCircle size={18} className="mr-2" />
            <span>💬 Nouvelle Conversation</span>
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>

      {conversations && conversations.length > 0 ? (
        <div className="space-y-4 flex-1 overflow-y-auto">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages && conversation.messages.length > 0 
              ? conversation.messages[conversation.messages.length - 1]
              : null

            return (
              <div
                key={conversation.id}
                className={`rounded-xl p-4 border transition-all duration-300 group ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 hover:border-gray-500/50' 
                    : 'bg-gray-50 border-gray-200/50 hover:border-gray-300/50 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {conversation.name}
                        </h3>
                        <div className={`flex items-center space-x-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span>{conversation.messages?.length || 0} messages</span>
                          {lastMessage && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span>{formatDate(lastMessage.timestamp)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {getLastMessagePreview(conversation.messages)}
                    </p>
                    
                    <div className="flex items-center justify-between gap-3">
                      {/* Bouton continuer - Version améliorée */}
                      <Link
                        href="/"
                        className={`inline-flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex-1 justify-center ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30' 
                            : 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30'
                        }`}
                      >
                        <span className="text-sm font-semibold">▶️ Continuer</span>
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                      
                      {/* Bouton supprimer - Version améliorée */}
                      <button
                        onClick={() => handleDeleteConversation(conversation.id, conversation.name)}
                        className={`p-2.5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110 ${
                          isDarkMode
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 shadow-md shadow-red-500/10 hover:shadow-red-500/20'
                            : 'bg-red-500/15 hover:bg-red-500/25 text-red-500 hover:text-red-600 shadow-md shadow-red-500/10 hover:shadow-red-500/20'
                        }`}
                        title="Supprimer la conversation"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 flex-1 flex flex-col justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Aucune conversation</h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Commencez votre première conversation avec Get Weez
          </p>
          <div className="flex justify-center">
            <Link
              href="/"
              className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
              }`}
            >
              <MessageCircle size={18} className="mr-2" />
              <span>🚀 Démarrer une Conversation</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      )}

      {conversations && conversations.length > 0 && (
        <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            💡 Astuce : Cliquez sur "Continuer la conversation" pour reprendre un chat précédent
          </p>
        </div>
      )}
    </div>
  )
}

export default ChatHistory

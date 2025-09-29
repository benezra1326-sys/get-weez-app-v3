import React, { useState, useEffect } from 'react'
import { MessageCircle, Trash2, Calendar, Clock, ArrowRight } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import Link from 'next/link'

const ChatHistory = ({ user }) => {
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
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
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
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <MessageCircle size={24} className="mr-3 text-purple-500" />
          Historique des Conversations
        </h2>
        <Link 
          href="/"
          className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
        >
          <span>Nouvelle conversation</span>
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      {conversations && conversations.length > 0 ? (
        <div className="space-y-4">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages && conversation.messages.length > 0 
              ? conversation.messages[conversation.messages.length - 1]
              : null

            return (
              <div
                key={conversation.id}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
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
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {getLastMessagePreview(conversation.messages)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link
                        href="/"
                        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      >
                        <span>Continuer la conversation</span>
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                      
                      <button
                        onClick={() => handleDeleteConversation(conversation.id, conversation.name)}
                        className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Supprimer la conversation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Aucune conversation</h3>
          <p className="text-gray-400 text-sm mb-6">
            Commencez votre première conversation avec Get Weez
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300"
          >
            <MessageCircle size={16} className="mr-2" />
            Nouvelle conversation
          </Link>
        </div>
      )}

      {conversations && conversations.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <p className="text-gray-400 text-xs text-center">
            💡 Astuce : Cliquez sur "Continuer la conversation" pour reprendre un chat précédent
          </p>
        </div>
      )}
    </div>
  )
}

export default ChatHistory

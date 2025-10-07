import React, { useState } from 'react'
import { X } from 'lucide-react'

const ChatInterfaceNew = ({ user, initialMessage, establishmentName }) => {
  console.log('🟢🟢🟢 NOUVEAU COMPOSANT CHARGÉ - VERSION FINALE 🟢🟢🟢')
  
  
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [showWelcome, setShowWelcome] = useState(true)

  const handleCreateConversation = () => {
    console.log('🆕 Création manuelle de conversation')
    const newId = Date.now().toString()
    const newConv = {
      id: newId,
      name: 'Nouvelle conversation',
      messages: [{ id: 'welcome', content: 'Bonjour ! Comment puis-je vous aider ?', role: 'assistant' }]
    }
    setConversations([newConv])
    setCurrentConversationId(newId)
    setMessages(newConv.messages)
    setShowWelcome(false)
  }

  const handleCloseConversation = () => {
    console.log('🔄 Fermeture conversation:', currentConversationId)
    setCurrentConversationId(null)
    setMessages([])
    setShowWelcome(true)
    // AUCUNE RECRÉATION AUTOMATIQUE !
  }

  const handleDeleteConversation = (id) => {
    console.log('🗑️ Suppression conversation:', id)
    setConversations(prev => prev.filter(conv => conv.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(null)
      setMessages([])
      setShowWelcome(true)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar simple */}
      <div className="w-80 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">🟢 NOUVEAU CHAT (Sans cache)</h2>
        
        <button 
          onClick={handleCreateConversation}
          className="w-full mb-4 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
        >
          + Nouvelle conversation
        </button>

        <div className="space-y-2">
          {conversations.map(conv => (
            <div key={conv.id} className="bg-white p-3 rounded flex justify-between items-center">
              <span 
                onClick={() => {
                  setCurrentConversationId(conv.id)
                  setMessages(conv.messages)
                  setShowWelcome(false)
                }}
                className="cursor-pointer flex-1 truncate"
              >
                {conv.name}
              </span>
              <button 
                onClick={() => handleDeleteConversation(conv.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        {showWelcome ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">🌟 Bienvenue sur Gliitz !</h1>
              <p className="text-xl mb-8">Votre assistant IA pour Marbella</p>
              <button 
                onClick={handleCreateConversation}
                className="bg-gray-500 text-white px-8 py-4 rounded-xl text-lg hover:bg-gray-600"
              >
                Commencer une conversation
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Conversation</h2>
              <button 
                onClick={handleCloseConversation}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Fermer
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg max-w-xs ${
                    msg.role === 'user' 
                      ? 'bg-gray-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Tapez votre message..."
                  className="flex-1 p-3 border rounded-l"
                />
                <button className="bg-gray-500 text-white px-6 py-3 rounded-r hover:bg-gray-600">
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInterfaceNew

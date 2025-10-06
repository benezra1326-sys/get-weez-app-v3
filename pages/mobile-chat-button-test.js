import { useState, useEffect } from 'react'
import { MessageCircle, Send } from 'lucide-react'

const MobileChatButtonTest = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')

  const handleSend = async (message) => {
    console.log('Message envoyé:', message)
    setMessages(prev => [...prev, { id: Date.now(), content: message, role: 'user' }])
    setIsLoading(true)
    
    // Simuler une réponse
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        content: 'Message reçu: ' + message, 
        role: 'assistant' 
      }])
      setIsLoading(false)
    }, 1000)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        handleSend(input.trim())
        setInput('')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de test */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center text-purple-600">
          🧪 TEST BOUTON CHAT MOBILE - POSITION FIXE
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Vérifiez que le bouton est en bas à droite et reste fixe
        </p>
      </div>

      {/* Contenu de test avec beaucoup de contenu pour tester le scroll */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-2">Instructions de test :</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Le bouton de chat doit être visible en bas à droite</li>
            <li>Il doit rester fixe même en scrollant</li>
            <li>Il doit avoir un z-index élevé (au-dessus de tout)</li>
            <li>Il doit être cliquable et fonctionnel</li>
          </ol>
        </div>

        {/* Messages de test */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-bold mb-2">Messages de test :</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`p-2 rounded ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white ml-8' 
                    : 'bg-gray-200 text-gray-800 mr-8'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-200 text-gray-800 mr-8 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span>Envoi en cours...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone de saisie de test */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-bold mb-2">Zone de saisie de test :</h3>
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Tapez un message de test..."
              className="flex-1 p-3 border rounded-lg resize-none"
              rows={2}
            />
            <button
              onClick={() => {
                if (input.trim()) {
                  handleSend(input.trim())
                  setInput('')
                }
              }}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Contenu pour forcer le scroll */}
        <div className="space-y-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-bold">Section de test {i + 1}</h4>
              <p className="text-gray-600">
                Ce contenu est là pour forcer le scroll et tester que le bouton de chat 
                reste bien fixe en bas à droite de l'écran. 
                Le bouton doit rester visible même quand vous scrollez vers le bas.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de saisie mobile fixe - SIMULATION */}
      <div 
        className="mobile-chat-input-container"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999999,
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
          backdropFilter: 'blur(30px) saturate(200%)',
          borderTop: '2px solid rgba(209, 213, 219, 0.5)',
          boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          minHeight: '80px'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="w-full px-4 py-3 rounded-2xl resize-none focus:outline-none"
              style={{
                background: 'rgba(243, 244, 246, 0.8)',
                color: '#1f2937',
                border: '1px solid rgba(209, 213, 219, 0.5)',
                maxHeight: '80px',
                minHeight: '60px',
                height: '60px',
                fontSize: '16px',
                lineHeight: '1.5'
              }}
              rows={2}
            />
          </div>
          
          <button
            onClick={() => {
              if (input.trim()) {
                handleSend(input.trim())
                setInput('')
              }
            }}
            disabled={!input.trim() || isLoading}
            className="rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <Send size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Instructions de debug */}
      <div className="fixed top-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-sm max-w-xs z-50">
        <p className="font-bold text-yellow-800">🔍 Debug Info:</p>
        <p>• Bouton chat: bas droite</p>
        <p>• Zone saisie: bas fixe</p>
        <p>• Z-index: 999999+</p>
        <p>• Position: fixed</p>
      </div>
    </div>
  )
}

export default MobileChatButtonTest
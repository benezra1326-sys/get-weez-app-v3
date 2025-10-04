import { useState } from 'react'
import SimpleChatInput from '../components/mobile/SimpleChatInput'

const ForceButtonTest = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Test Bouton FORCÉ à Droite</h1>
        
        {/* Zone de saisie avec bouton FORCÉ à droite */}
        <div style={{ marginBottom: '20px' }}>
          <SimpleChatInput 
            onSend={handleSend}
            isLoading={isLoading}
            placeholder="Tapez votre message..."
            isDarkMode={false}
          />
        </div>

        {/* Messages */}
        <div style={{ marginBottom: '20px' }}>
          <h3 className="font-bold mb-2">Messages:</h3>
          <div className="space-y-2">
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
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-yellow-100 rounded-lg text-sm">
          <p><strong>Instructions:</strong></p>
          <p>1. Le bouton d'envoi DOIT être à droite</p>
          <p>2. Tapez un message et cliquez sur le bouton</p>
          <p>3. Le bouton doit être visible et cliquable</p>
          <p>4. Le bouton doit rester à droite même avec du texte long</p>
        </div>

        {/* Test avec différents contenus */}
        <div className="mt-4">
          <h3 className="font-bold mb-2">Test rapide:</h3>
          <div className="space-y-2">
            <button 
              onClick={() => {
                const input = document.querySelector('textarea')
                if (input) input.value = 'Message court'
              }}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm"
            >
              Message court
            </button>
            <button 
              onClick={() => {
                const input = document.querySelector('textarea')
                if (input) input.value = 'Message très long qui devrait s\'étendre sur plusieurs lignes et tester le comportement du flexbox avec beaucoup de texte'
              }}
              className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm"
            >
              Message long
            </button>
            <button 
              onClick={() => {
                const input = document.querySelector('textarea')
                if (input) input.value = ''
              }}
              className="w-full px-3 py-2 bg-gray-500 text-white rounded text-sm"
            >
              Vider
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForceButtonTest

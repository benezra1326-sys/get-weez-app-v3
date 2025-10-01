import { useState } from 'react'
import DebugButtonInput from '../components/mobile/DebugButtonInput'

const DebugButtonTest = () => {
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
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          🔍 DEBUG BOUTON - BORDURES VISIBLES
        </h1>
        
        {/* Instructions de debug */}
        <div className="p-3 bg-red-100 rounded-lg text-sm border-2 border-red-300 mb-4">
          <p><strong>🔍 DEBUG VISUEL:</strong></p>
          <p>• BORDURE ROUGE = Conteneur</p>
          <p>• BORDURE BLEUE = Textarea</p>
          <p>• BORDURE VERTE = Bouton</p>
          <p>• Le bouton DOIT être à droite avec bordure verte</p>
        </div>
        
        {/* Zone de saisie avec debug */}
        <div style={{ marginBottom: '20px' }}>
          <DebugButtonInput 
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

        {/* Test avec différents contenus */}
        <div className="mt-4">
          <h3 className="font-bold mb-2">Tests rapides:</h3>
          <div className="space-y-2">
            <button 
              onClick={() => {
                const input = document.querySelector('textarea')
                if (input) input.value = 'Test court'
              }}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm"
            >
              Test court
            </button>
            <button 
              onClick={() => {
                const input = document.querySelector('textarea')
                if (input) input.value = 'Test très long qui devrait s\'étendre sur plusieurs lignes et tester le comportement avec beaucoup de texte pour voir si le bouton reste à droite même avec beaucoup de contenu'
              }}
              className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm"
            >
              Test long
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

        {/* Debug technique */}
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-sm">
          <p><strong>🔧 Debug Technique:</strong></p>
          <p>• Conteneur: position: relative, border: 3px solid red</p>
          <p>• Textarea: width: 100%, padding-right: 60px, border: 2px solid blue</p>
          <p>• Bouton: position: absolute, right: 8px, border: 3px solid green</p>
          <p>• zIndex: 9999 pour être au-dessus</p>
        </div>
      </div>
    </div>
  )
}

export default DebugButtonTest

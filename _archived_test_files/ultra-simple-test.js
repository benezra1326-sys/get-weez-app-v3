import { useState } from 'react'
import UltraSimpleInput from '../components/mobile/UltraSimpleInput'

const UltraSimpleTest = () => {
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
        <h1 className="text-2xl font-bold mb-4 text-center text-green-600">
          TEST ULTRA SIMPLE - BOUTON À DROITE
        </h1>
        
        {/* Zone de saisie ultra simple */}
        <div style={{ marginBottom: '20px' }}>
          <UltraSimpleInput 
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
        <div className="p-3 bg-green-100 rounded-lg text-sm border-2 border-green-300">
          <p><strong>✅ SOLUTION ULTRA SIMPLE:</strong></p>
          <p>1. Conteneur: position: relative</p>
          <p>2. Textarea: width: 100%, padding-right: 60px</p>
          <p>3. Bouton: position: absolute, right: 12px</p>
          <p>4. Le bouton DOIT être visible à droite</p>
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

        {/* Debug visuel */}
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-sm">
          <p><strong>🔍 Debug:</strong></p>
          <p>• Conteneur: position: relative, width: 100%</p>
          <p>• Textarea: width: 100%, padding-right: 60px</p>
          <p>• Bouton: position: absolute, right: 12px, top: 50%</p>
          <p>• zIndex: 999 pour être au-dessus</p>
        </div>
      </div>
    </div>
  )
}

export default UltraSimpleTest

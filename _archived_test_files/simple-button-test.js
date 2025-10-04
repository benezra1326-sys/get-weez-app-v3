import { useState } from 'react'
import { Send } from 'lucide-react'

const SimpleButtonTest = () => {
  const [input, setInput] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Test Bouton Simple</h1>
        
        {/* Zone de saisie avec flexbox */}
        <div 
          className="flex items-end gap-2 p-3 rounded-2xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
            borderColor: 'rgba(209, 213, 219, 0.5)',
            backdropFilter: 'blur(15px)',
            minHeight: '60px',
            border: '2px solid red', // Debug: bordure rouge
          }}
        >
          {/* Textarea avec flex-1 */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 border-none outline-none bg-transparent resize-none"
            style={{ 
              fontSize: '16px',
              lineHeight: '1.5',
              color: '#1F2937',
              minHeight: '40px',
              maxHeight: '120px',
              borderRadius: '12px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid blue', // Debug: bordure bleue
            }}
            rows={1}
          />
          
          {/* Bouton avec flex-shrink-0 */}
          <button
            onClick={() => console.log('Bouton cliqué!')}
            className="flex-shrink-0"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              border: 'none',
              background: input.trim()
                ? 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
                : 'rgba(156, 163, 175, 0.5)',
              color: 'white',
              opacity: input.trim() ? 1 : 0.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              border: '2px solid green', // Debug: bordure verte
            }}
          >
            <Send size={18} />
          </button>
        </div>

        {/* Informations de debug */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>• Conteneur: bordure rouge (flex)</p>
          <p>• Textarea: bordure bleue (flex-1)</p>
          <p>• Bouton: bordure verte (flex-shrink-0)</p>
          <p>• Le bouton devrait être visible à droite</p>
        </div>

        {/* Test avec différents contenus */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">Test avec différents contenus:</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setInput('Message court')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Message court
            </button>
            <button 
              onClick={() => setInput('Message très long qui devrait s\'étendre sur plusieurs lignes et tester le comportement du flexbox')}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              Message long
            </button>
            <button 
              onClick={() => setInput('')}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
            >
              Vider
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleButtonTest

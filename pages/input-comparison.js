import { useState } from 'react'
import ButtonDebug from '../components/mobile/ButtonDebug'
import FlexboxChatInput from '../components/mobile/FlexboxChatInput'

const InputComparisonPage = () => {
  const [testMode, setTestMode] = useState('debug') // 'debug' ou 'flexbox'

  const handleSend = (message) => {
    console.log('Message envoyé:', message)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Comparaison Input</h1>
          <p className="text-gray-600 mb-4">
            Testez les deux approches pour le bouton d'envoi
          </p>
          
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setTestMode('debug')}
              className={`px-4 py-2 rounded-lg ${
                testMode === 'debug' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Debug Position Absolute
            </button>
            <button
              onClick={() => setTestMode('flexbox')}
              className={`px-4 py-2 rounded-lg ${
                testMode === 'flexbox' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Solution Flexbox
            </button>
          </div>
        </div>

        {testMode === 'debug' ? (
          <ButtonDebug />
        ) : (
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4">Solution Flexbox</h3>
            <FlexboxChatInput 
              onSend={handleSend}
              isLoading={false}
              placeholder="Testez avec flexbox..."
            />
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
              <p><strong>Avantages Flexbox:</strong></p>
              <p>• Pas de position absolute</p>
              <p>• Bouton naturellement à droite</p>
              <p>• Pas de conflits de z-index</p>
              <p>• Plus simple et fiable</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputComparisonPage

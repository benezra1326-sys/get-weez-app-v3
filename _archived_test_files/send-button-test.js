import { useState } from 'react'
import SendButtonTest from '../components/mobile/SendButtonTest'
import MobileChatOptimized from '../components/chat/MobileChatOptimized'

const SendButtonTestPage = () => {
  const [testMode, setTestMode] = useState('isolated') // 'isolated' ou 'chat'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Test Bouton d'Envoi</h1>
          <p className="text-gray-600 mb-4">
            Vérifiez que le bouton d'envoi est à droite
          </p>
          
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setTestMode('isolated')}
              className={`px-4 py-2 rounded-lg ${
                testMode === 'isolated' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Test Isolé
            </button>
            <button
              onClick={() => setTestMode('chat')}
              className={`px-4 py-2 rounded-lg ${
                testMode === 'chat' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Chat Complet
            </button>
          </div>
        </div>

        {testMode === 'isolated' ? (
          <SendButtonTest />
        ) : (
          <MobileChatOptimized 
            user={{ is_member: true }}
            initialMessage=""
            establishmentName=""
          />
        )}
      </div>

      {/* Styles CSS pour forcer le bouton à droite */}
      <style jsx global>{`
        /* FORCER le bouton d'envoi à droite - Styles très agressifs */
        .mobile-send-button {
          position: absolute !important;
          right: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          z-index: 1000 !important;
          width: 44px !important;
          height: 44px !important;
          border-radius: 12px !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%) !important;
          color: white !important;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
        }

        /* Assurer que le conteneur est relatif */
        .relative {
          position: relative !important;
        }
      `}</style>
    </div>
  )
}

export default SendButtonTestPage

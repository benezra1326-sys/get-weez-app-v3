import { useState } from 'react'
import MobileKeyboardTest from '../components/mobile/MobileKeyboardTest'
import MobileChatOptimized from '../components/chat/MobileChatOptimized'

const MobileKeyboardTestPage = () => {
  const [testMode, setTestMode] = useState('test') // 'test' ou 'chat'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTestMode('test')}
            className={`px-4 py-2 rounded-lg ${
              testMode === 'test' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Test Clavier
          </button>
          <button
            onClick={() => setTestMode('chat')}
            className={`px-4 py-2 rounded-lg ${
              testMode === 'chat' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Chat Mobile
          </button>
        </div>

        {testMode === 'test' ? (
          <MobileKeyboardTest />
        ) : (
          <MobileChatOptimized 
            user={{ is_member: true }}
            initialMessage=""
            establishmentName=""
          />
        )}
      </div>
    </div>
  )
}

export default MobileKeyboardTestPage

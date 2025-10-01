import { useState } from 'react'
import MobileChatOptimized from '../components/chat/MobileChatOptimized'

const MobileChatTestPage = () => {
  const [testMode, setTestMode] = useState('chat')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Test Chat Mobile</h1>
          <p className="text-gray-600 mb-4">
            Vérifiez que la boîte de saisie reste TOUJOURS en bas
          </p>
        </div>

        <MobileChatOptimized 
          user={{ is_member: true }}
          initialMessage=""
          establishmentName=""
        />
      </div>
    </div>
  )
}

export default MobileChatTestPage

import { useState } from 'react'
import MobileChatOptimized from '../components/chat/MobileChatOptimized'

const TestMobileChat = () => {
  const [user, setUser] = useState({ is_member: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center p-4">Test Mobile Chat</h1>
        <MobileChatOptimized user={user} />
      </div>
    </div>
  )
}

export default TestMobileChat

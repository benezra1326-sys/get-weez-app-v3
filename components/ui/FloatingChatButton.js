import React from 'react'
import { useRouter } from 'next/router'
import { MessageCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const FloatingChatButton = () => {
  const router = useRouter()
  const { isDarkMode } = useTheme()

  // Ne pas afficher sur la page chat
  if (router.pathname === '/chat') {
    return null
  }

  const handleClick = () => {
    router.push('/chat')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
        boxShadow: '0 8px 32px rgba(192, 192, 192, 0.4), 0 0 20px rgba(192, 192, 192, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        animation: 'float 3s ease-in-out infinite'
      }}
      aria-label="Ouvrir le chat Gliitz"
    >
      <MessageCircle 
        size={28} 
        style={{ 
          color: '#0B0B0C',
          strokeWidth: 2
        }} 
      />
      
      {/* Badge notification */}
      <div 
        className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      >
        <span style={{ fontSize: '10px' }}>✨</span>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        button:hover {
          box-shadow: 0 12px 40px rgba(192, 192, 192, 0.6), 0 0 30px rgba(192, 192, 192, 0.4) !important;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .7;
          }
        }
      `}</style>
    </button>
  )
}

export default FloatingChatButton

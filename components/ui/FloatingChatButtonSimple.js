import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MessageCircle } from 'lucide-react'

const FloatingChatButtonSimple = () => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ne pas afficher sur /chat
  if (!mounted || router.pathname === '/chat') {
    return null
  }

  const handleClick = () => {
    router.push('/chat')
  }

  return (
    <>
      <button
        onClick={handleClick}
        id="gliitz-chat-float-btn"
        aria-label="Ouvrir le chat Gliitz"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(192, 192, 192, 0.5), 0 0 20px rgba(192, 192, 192, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2147483647,
          transition: 'all 0.3s ease',
          animation: 'floatAnimation 3s ease-in-out infinite',
          pointerEvents: 'auto',
          visibility: 'visible',
          opacity: 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(192, 192, 192, 0.6), 0 0 30px rgba(192, 192, 192, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(192, 192, 192, 0.5), 0 0 20px rgba(192, 192, 192, 0.3)'
        }}
      >
        <MessageCircle 
          size={28} 
          style={{ color: '#0B0B0C', strokeWidth: 2 }} 
        />
        
        {/* Badge */}
        <div 
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          ✨
        </div>
      </button>

      <style jsx>{`
        @keyframes floatAnimation {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  )
}

export default FloatingChatButtonSimple


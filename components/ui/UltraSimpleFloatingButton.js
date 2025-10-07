import React from 'react'

// Version ULTRA SIMPLE sans aucun hook ni dépendance
export default function UltraSimpleFloatingButton() {
  console.log('🔵 UltraSimpleFloatingButton RENDU !')
  
  return (
    <div
      onClick={() => {
        console.log('🖱️ Bouton cliqué !')
        if (typeof window !== 'undefined') {
          window.location.href = '/chat'
        }
      }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 2147483647,
        boxShadow: '0 8px 32px rgba(192, 192, 192, 0.6)',
        border: '2px solid white',
        fontSize: '32px',
        color: '#0B0B0C',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto',
        visibility: 'visible',
        opacity: 1
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      💬
    </div>
  )
}


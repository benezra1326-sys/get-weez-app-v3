import React from 'react'

/**
 * Bouton chat ULTRA SIMPLE - Force le rendu
 */
export default function UltraSimpleButton() {
  console.log('🔍 UltraSimpleButton - RENDU FORCÉ')
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 2147483647,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(168, 85, 247, 0.6)',
        border: 'none'
      }}
      onClick={() => {
        console.log('🖱️ Bouton cliqué !')
        alert('Bouton chat cliqué !')
      }}
    >
      💬
    </div>
  )
}


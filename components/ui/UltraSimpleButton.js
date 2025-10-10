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
        background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(192, 192, 192, 0.6)',
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









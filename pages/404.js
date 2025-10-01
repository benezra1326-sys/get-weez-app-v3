import React from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '6rem', marginBottom: '1rem', color: '#8B5CF6' }}>
        404
      </h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ffffff' }}>
        Page non trouvée
      </h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#9CA3AF' }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <button
        onClick={() => router.push('/')}
        style={{
          backgroundColor: '#8B5CF6',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#7C3AED'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#8B5CF6'}
      >
        Retour à l'accueil
      </button>
    </div>
  )
}

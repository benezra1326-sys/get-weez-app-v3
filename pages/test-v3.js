import { useState } from 'react'

export default function TestV3() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, rgba(240,240,240,0.7) 0%, rgba(255,255,255,0.9) 100%)'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontFamily: 'Playfair Display, serif',
          background: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          Gliitz V3 Test
        </h1>
        
        <p style={{
          fontSize: '20px',
          fontFamily: 'Poppins, sans-serif',
          color: '#0B0B0C',
          marginBottom: '30px'
        }}>
          Count: {count}
        </p>
        
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            fontFamily: 'Poppins, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(192, 192, 192, 0.4)'
          }}
        >
          Increment
        </button>
      </div>
    </div>
  )
}


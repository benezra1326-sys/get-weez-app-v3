import React from 'react'

const GliitzLogo = ({ size = 'text-2xl', compact = false, forHeader = false }) => {
  if (forHeader) {
    return (
      <div 
        className="px-4 py-2 rounded-xl"
        style={{
          background: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}
      >
        <div 
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0B0B0C',
            letterSpacing: '-0.02em'
          }}
        >
          Gliitz
        </div>
      </div>
    )
  }

  return (
    <div className={`${size} relative inline-block`} style={{ background: 'transparent' }}>
      <div 
        className="relative flex items-center"
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: compact ? '2rem' : '2.5rem',
          fontWeight: '700',
          color: '#0B0B0C',
          letterSpacing: '-0.02em',
          textShadow: 'none'
        }}
      >
        Gliitz
      </div>
    </div>
  )
}

export default GliitzLogo

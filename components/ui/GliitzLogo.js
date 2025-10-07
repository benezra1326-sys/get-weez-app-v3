import React from 'react'

const GliitzLogo = ({ size = 'text-2xl', compact = false }) => {
  return (
    <div className={`${size} relative inline-block`} style={{ background: 'transparent' }}>
      <div 
        className="relative flex items-center"
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: compact ? '2rem' : '2.5rem',
          fontWeight: '600',
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

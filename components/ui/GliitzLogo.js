import React from 'react'

const GliitzLogo = ({ size = 'text-2xl', compact = false, forHeader = false }) => {
  // Bouton blanc arrondi avec effet glass
  return (
    <div 
      className="px-6 py-3 rounded-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div 
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: compact ? '1.2rem' : '1.8rem',
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

export default GliitzLogo

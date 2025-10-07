import React from 'react'

const GliitzLogo = ({ size = 'text-2xl', compact = false, forHeader = false }) => {
  // Pas de fond - juste le texte
  return (
    <div 
      style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: compact ? '1.2rem' : '1.8rem',
        fontWeight: '700',
        color: '#0B0B0C',
        letterSpacing: '-0.02em',
        padding: '0'
      }}
    >
      Gliitz
    </div>
  )
}

export default GliitzLogo

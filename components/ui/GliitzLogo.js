import React from 'react'

const GliitzLogo = ({ size = 'text-2xl', compact = false, forHeader = false }) => {
  // Utiliser le même style partout - fond blanc avec Playfair Display
  return (
    <div 
      className={compact ? "px-3 py-1.5 rounded-xl" : "px-4 py-2 rounded-xl"}
      style={{
        background: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}
    >
      <div 
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: compact ? '1.2rem' : '1.5rem',
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

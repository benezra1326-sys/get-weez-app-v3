import React from 'react'

const GliitzLogo = ({ size = 'text-2xl', compact = false, forHeader = false, isDarkMode = false }) => {
  // Bouton avec fond adaptatif selon le mode
  return (
    <div 
      className="px-6 py-3 rounded-2xl transition-all duration-300"
      style={{
        background: isDarkMode ? '#0B0B0C' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(255, 255, 255, 0.4)'}`,
        boxShadow: isDarkMode 
          ? '0 4px 20px rgba(192, 192, 192, 0.15)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div 
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: compact ? '1.2rem' : '1.8rem',
          fontWeight: '700',
          color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
          letterSpacing: '-0.02em'
        }}
      >
        Gliitz
      </div>
    </div>
  )
}

export default GliitzLogo

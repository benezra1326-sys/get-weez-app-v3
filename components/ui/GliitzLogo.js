import React from 'react'

const GliitzLogo = ({ size = 'text-2xl', compact = false }) => {
  return (
    <div className={`${size} relative inline-block`} style={{ background: 'transparent' }}>
      <div 
        className="relative flex items-center logo-text"
        style={{
          fontFamily: '"Proxima Soft Black", "Montserrat", "Proxima Nova", "Source Sans Pro", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: compact ? '2rem' : '2.5rem',
          fontWeight: '900',
          color: '#ffffff',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}
      >
        Gliitz
      </div>
    </div>
  )
}

export default GliitzLogo

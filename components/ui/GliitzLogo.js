import React, { memo } from 'react'
import { useTranslation } from 'next-i18next'
import { useTheme } from '../../contexts/ThemeContextSimple'

const GliitzLogo = memo(({ size = 'text-2xl', compact = false, forHeader = false, showTagline = false }) => {
  const { t } = useTranslation('common')
  
  // CORRECTION BUG: Utiliser useTheme directement au lieu d'une prop
  let isDarkMode = false
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
  } catch (error) {
    console.warn('ThemeProvider not available, using default theme')
  }
  
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
      <div>
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
        {showTagline && (
          <div 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.65rem',
              fontWeight: '400',
              color: isDarkMode ? 'rgba(192, 192, 192, 0.7)' : 'rgba(11, 11, 12, 0.6)',
              marginTop: '0.1rem',
              letterSpacing: '0.05em',
              textAlign: 'center'
            }}
          >
            {t('brand.tagline')}
          </div>
        )}
      </div>
    </div>
  )
})

GliitzLogo.displayName = 'GliitzLogo'

export default GliitzLogo

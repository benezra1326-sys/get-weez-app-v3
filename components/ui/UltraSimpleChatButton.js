import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle } from 'lucide-react'

/**
 * Bouton chat ULTRA SIMPLE - Pas de conflits, position fixe garantie
 */
export default function UltraSimpleChatButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsVisible(true)
  }, [])

  if (!isMounted) return null

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    backgroundColor: '#8b5cf6',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
    zIndex: 9999999,
    transition: 'all 0.3s ease',
    color: 'white',
    fontSize: '24px'
  }

  const handleClick = () => {
    // Émettre un événement pour ouvrir le chat
    window.dispatchEvent(new CustomEvent('openMobileChat'))
  }

  return createPortal(
    <button
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)'
        e.target.style.backgroundColor = '#7c3aed'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)'
        e.target.style.backgroundColor = '#8b5cf6'
      }}
    >
      <MessageCircle size={24} />
    </button>,
    document.body
  )
}
import React, { useState, useRef } from 'react'
import { Send } from 'lucide-react'

const DebugButtonInput = ({ onSend, isLoading, placeholder, isDarkMode = false }) => {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%',
      border: '3px solid red', // BORDURE ROUGE pour le conteneur
      borderRadius: '8px',
      padding: '4px'
    }}>
      {/* Textarea avec padding à droite */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          const textarea = e.target
          textarea.style.height = 'auto'
          const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 120)
          textarea.style.height = `${newHeight}px`
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Tapez votre message..."}
        style={{ 
          width: '100%',
          fontSize: '16px',
          lineHeight: '1.5',
          color: isDarkMode ? '#FFFFFF' : '#1F2937',
          minHeight: '40px',
          maxHeight: '120px',
          borderRadius: '12px',
          padding: '12px 60px 12px 16px', // Padding à droite pour le bouton
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
          border: '2px solid blue', // BORDURE BLEUE pour le textarea
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
        rows={1}
        disabled={isLoading}
      />
      
      {/* Bouton avec bordures de debug */}
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        style={{
          position: 'absolute',
          right: '8px', // Plus proche du bord
          top: '50%',
          transform: 'translateY(-50%)',
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          border: '3px solid green', // BORDURE VERTE pour le bouton
          background: input.trim() && !isLoading
            ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
            : isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(156, 163, 175, 0.5)',
          color: 'white',
          opacity: input.trim() && !isLoading ? 1 : 0.5,
          cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
          boxShadow: input.trim() && !isLoading 
            ? '0 4px 12px rgba(192, 192, 192, 0.4)' 
            : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 9999, // Z-index très élevé
        }}
      >
        {isLoading ? (
          <div style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : (
          <Send size={18} />
        )}
      </button>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default DebugButtonInput

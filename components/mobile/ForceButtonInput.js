import React, { useState, useRef } from 'react'
import { Send } from 'lucide-react'

const ForceButtonInput = ({ onSend, isLoading, placeholder, isDarkMode = false }) => {
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
    <div 
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '60px',
        padding: '12px',
        borderRadius: '16px',
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
        border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)'}`,
        backdropFilter: 'blur(15px)',
        boxSizing: 'border-box',
        boxShadow: input.trim() 
          ? '0 0 0 2px rgba(192, 192, 192, 0.3), 0 4px 12px rgba(192, 192, 192, 0.15)'
          : 'none',
      }}
    >
      {/* Textarea avec padding à droite pour le bouton */}
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
          padding: '10px 60px 10px 12px', // Padding à droite pour le bouton
          background: isDarkMode 
            ? 'rgba(55, 65, 81, 0.6)' 
            : 'rgba(255, 255, 255, 0.8)',
          border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.2)'}`,
          backdropFilter: 'blur(10px)',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
        rows={1}
        disabled={isLoading}
      />
      
      {/* Bouton ABSOLUMENT positionné à droite */}
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          border: 'none',
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
          zIndex: 10,
        }}
      >
        {isLoading ? (
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : (
          <Send size={18} />
        )}
      </button>

      {/* Animation CSS pour le spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default ForceButtonInput

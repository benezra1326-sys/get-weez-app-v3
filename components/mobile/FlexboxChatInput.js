import React, { useState, useRef } from 'react'
import { Send } from 'lucide-react'

const FlexboxChatInput = ({ onSend, isLoading, placeholder }) => {
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
      className="flex items-end gap-2 p-3 rounded-2xl border"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
        borderColor: 'rgba(209, 213, 219, 0.5)',
        backdropFilter: 'blur(15px)',
        minHeight: '60px',
        border: '2px solid red', // Debug: bordure rouge
      }}
    >
      {/* Zone de saisie avec flex-1 */}
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
        className="flex-1 border-none outline-none bg-transparent resize-none"
        style={{ 
          fontSize: '16px',
          lineHeight: '1.5',
          color: '#1F2937',
          minHeight: '40px',
          maxHeight: '120px',
          borderRadius: '12px',
          padding: '10px 12px',
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          border: '2px solid blue', // Debug: bordure bleue
        }}
        rows={1}
        disabled={isLoading}
      />
      
      {/* Bouton d'envoi avec flex-shrink-0 */}
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="flex-shrink-0"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          border: 'none',
          background: input.trim() && !isLoading
            ? 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
            : 'rgba(156, 163, 175, 0.5)',
          color: 'white',
          opacity: input.trim() && !isLoading ? 1 : 0.5,
          cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
          boxShadow: input.trim() && !isLoading 
            ? '0 4px 12px rgba(139, 92, 246, 0.4)' 
            : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          border: '2px solid green', // Debug: bordure verte
        }}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <Send size={18} />
        )}
      </button>
    </div>
  )
}

export default FlexboxChatInput

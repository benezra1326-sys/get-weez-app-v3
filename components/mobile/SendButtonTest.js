import React, { useState } from 'react'
import { Send } from 'lucide-react'

const SendButtonTest = () => {
  const [input, setInput] = useState('')

  return (
    <div className="p-4 max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">Test Bouton d'Envoi</h3>
      
      {/* Zone de saisie de test */}
      <div 
        className="relative rounded-2xl border"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
          borderColor: 'rgba(209, 213, 219, 0.5)',
          backdropFilter: 'blur(15px)',
          minHeight: '60px',
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez quelque chose pour tester le bouton..."
          className="w-full border-none outline-none bg-transparent resize-none"
          style={{ 
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#1F2937',
            minHeight: '48px',
            maxHeight: '120px',
            borderRadius: '16px',
            padding: '14px 60px 14px 16px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            backdropFilter: 'blur(10px)',
            width: '100%',
          }}
          rows={1}
        />
        
        {/* Bouton d'envoi avec styles agressifs */}
        <button
          className="mobile-send-button"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            border: 'none',
            background: input.trim()
              ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
              : 'rgba(156, 163, 175, 0.5)',
            color: 'white',
            opacity: input.trim() ? 1 : 0.5,
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            boxShadow: input.trim() 
              ? '0 4px 12px rgba(139, 92, 246, 0.4)' 
              : 'none',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <Send size={18} />
        </button>
      </div>

      {/* Informations de debug */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
        <p><strong>Position du bouton :</strong> right: 8px, top: 50%</p>
        <p><strong>Taille :</strong> 44px x 44px</p>
        <p><strong>Z-index :</strong> 100</p>
        <p><strong>Padding textarea :</strong> 60px à droite</p>
      </div>
    </div>
  )
}

export default SendButtonTest

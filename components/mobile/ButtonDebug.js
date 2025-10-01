import React, { useState } from 'react'
import { Send } from 'lucide-react'

const ButtonDebug = () => {
  const [input, setInput] = useState('')

  return (
    <div className="p-4 max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">Debug Bouton d'Envoi</h3>
      
      {/* Zone de saisie avec styles de debug */}
      <div 
        className="relative rounded-2xl border"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
          borderColor: 'rgba(209, 213, 219, 0.5)',
          backdropFilter: 'blur(15px)',
          minHeight: '60px',
          position: 'relative', // IMPORTANT: position relative
          border: '2px solid red', // Debug: bordure rouge pour voir le conteneur
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez pour tester..."
          style={{ 
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#1F2937',
            minHeight: '48px',
            maxHeight: '120px',
            borderRadius: '16px',
            padding: '14px 60px 14px 16px', // Padding à droite pour le bouton
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            border: '2px solid blue', // Debug: bordure bleue pour voir le textarea
          }}
          rows={1}
        />
        
        {/* Bouton d'envoi avec styles de debug */}
        <button
          onClick={() => console.log('Bouton cliqué!')}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            border: '3px solid green', // Debug: bordure verte pour voir le bouton
            background: input.trim()
              ? 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
              : 'rgba(156, 163, 175, 0.5)',
            color: 'white',
            opacity: input.trim() ? 1 : 0.5,
            cursor: 'pointer',
            zIndex: 1000,
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
        <p><strong>Debug Info:</strong></p>
        <p>• Conteneur: bordure rouge</p>
        <p>• Textarea: bordure bleue</p>
        <p>• Bouton: bordure verte</p>
        <p>• Position bouton: right: 8px, top: 50%</p>
        <p>• Z-index: 1000</p>
        <p>• Padding textarea: 60px à droite</p>
      </div>

      {/* Test avec flexbox */}
      <div className="mt-6">
        <h4 className="font-bold mb-2">Test avec Flexbox:</h4>
        <div 
          className="flex items-center rounded-2xl border p-2"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
            border: '2px solid orange', // Debug: bordure orange
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Test avec flexbox..."
            className="flex-1 border-none outline-none bg-transparent resize-none"
            style={{ 
              fontSize: '16px',
              lineHeight: '1.5',
              color: '#1F2937',
              minHeight: '40px',
              maxHeight: '120px',
              padding: '8px 12px',
              background: 'transparent',
            }}
            rows={1}
          />
          
          <button
            onClick={() => console.log('Bouton flexbox cliqué!')}
            className="ml-2 flex-shrink-0"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: 'none',
              background: input.trim()
                ? 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
                : 'rgba(156, 163, 175, 0.5)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid purple', // Debug: bordure violette
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ButtonDebug

import { useState } from 'react'
import { Send, Lock } from 'lucide-react'

export default function ChatInput({ onSendMessage, disabled, loading }) {
  const [inputMessage, setInputMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputMessage.trim() && !disabled && !loading) {
      onSendMessage(inputMessage)
      setInputMessage('')
    }
  }

  return (
    <div className="p-4 border-t border-gray-700 bg-gray-800">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={disabled ? "Devenez membre pour accéder au chat IA" : "Demandez une expérience à Marbella..."}
          disabled={disabled}
          className="flex-1 bg-gray-700 text-white rounded-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        />
        <button
          type="submit"
          disabled={disabled || loading || !inputMessage.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-4 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Send size={24} />
          )}
        </button>
      </form>
      <div className="text-xs text-gray-500 mt-3 text-center">
        {disabled ? 
          "Ce service est réservé aux membres Get Weez. Abonnez-vous (39,99€/mois ou 199€/an) ou payez 50€ pour un accès ponctuel." 
          : "Get Weez gère vos réservations automatiquement à Marbella"
        }
      </div>
    </div>
  )
}
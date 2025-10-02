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
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Mobile: bouton intégré dans l'input */}
        <div className="flex-1 relative lg:hidden">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={disabled ? "Devenez membre pour accéder au chat IA" : "Demandez une expérience à Marbella..."}
            disabled={disabled}
            className="w-full bg-gray-700 text-white rounded-full py-4 px-6 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          />
          <button
            type="submit"
            disabled={disabled || loading || !inputMessage.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* Desktop: bouton séparé à droite */}
        <div className="hidden lg:flex lg:flex-1 lg:gap-3">
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6 py-4 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={20} />
                <span>Envoyer</span>
              </>
            )}
          </button>
        </div>
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
import { MapPin } from 'lucide-react'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  // Détecte si c'est le message de bienvenue - Amélioration de la détection
  const isWelcome = message.id?.startsWith('welcome-') || 
                    message.content?.includes('Bienvenue sur Gliitz') ||
                    message.content?.includes('Bienvenue dans l\'univers Gliitz') ||
                    message.content?.includes('Bonjour ! Je suis votre assistant Gliitz') ||
                    message.content?.includes('Salut ! Votre concierge Gliitz est là') ||
                    message.content?.includes('concierge IA') ||
                    message.content?.includes('concierge personnel') ||
                    (message.role === 'assistant' && message.content?.includes('Gliitz'))
  
  return (
    <div className={`mb-6 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl w-fit px-5 py-4 rounded-3xl ${
          isUser || isWelcome
            ? 'text-white rounded-br-none'
            : 'bg-gray-800 text-gray-200 rounded-bl-none'
        }`}
        style={
          isUser || isWelcome
            ? {
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 40%, #3b82f6 100%)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
              }
            : undefined
        }
      >
        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        <div className={`text-xs mt-3 opacity-80 ${
          isUser || isWelcome ? 'text-purple-100' : 'text-gray-400'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
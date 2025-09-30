import React, { memo } from 'react'
import { MessageCircle, Sparkles, MapPin, Calendar, Utensils, Coffee } from 'lucide-react'
import useChatTheme from '../../hooks/useChatTheme'
import useMobileDetection from '../../hooks/useMobileDetection'

/**
 * Composant WelcomeCard - Affichage d'accueil du chat
 * Montre des suggestions et des informations contextuelles
 */
const WelcomeCard = memo(({ establishmentName, onFocus, suggestions = [] }) => {
  const { themeClasses } = useChatTheme()
  const { isMobile } = useMobileDetection()

  // Suggestions par défaut
  const defaultSuggestions = [
    {
      icon: <MapPin size={16} />,
      text: "Que faire à Marbella aujourd'hui ?",
      category: "activités"
    },
    {
      icon: <Utensils size={16} />,
      text: "Recommande-moi un restaurant",
      category: "restaurants"
    },
    {
      icon: <Calendar size={16} />,
      text: "Quels sont les événements cette semaine ?",
      category: "événements"
    },
    {
      icon: <Coffee size={16} />,
      text: "Où prendre un bon café ?",
      category: "cafés"
    }
  ]

  const suggestionsToShow = suggestions.length > 0 ? suggestions : defaultSuggestions

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      
      {/* Icon principal */}
      <div className="mb-6">
        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg ${themeClasses.shadow}`}>
          <MessageCircle size={32} className="text-white" />
        </div>
      </div>

      {/* Titre principal */}
      <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${themeClasses.text.primary}`}>
        {establishmentName ? (
          <>Bienvenue chez <span className="text-gradient">{establishmentName}</span></>
        ) : (
          <>Bienvenue sur <span className="text-gradient">Marbella Assistant</span></>
        )}
      </h2>

      {/* Description */}
      <p className={`text-lg mb-8 max-w-2xl ${themeClasses.text.secondary}`}>
        {establishmentName ? (
          `Je suis votre assistant personnel pour ${establishmentName}. Posez-moi toutes vos questions !`
        ) : (
          "Je suis votre guide personnel pour découvrir Marbella. Posez-moi toutes vos questions sur les restaurants, événements, et activités !"
        )}
      </p>

      {/* Suggestions */}
      <div className="w-full max-w-4xl">
        <div className={`flex items-center justify-center mb-6 ${themeClasses.text.muted}`}>
          <Sparkles size={16} className="mr-2" />
          <span className="text-sm font-medium">Suggestions pour commencer</span>
        </div>

        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {suggestionsToShow.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                if (onFocus) {
                  onFocus()
                }
                // Optionnellement, déclencher une suggestion automatique
                // onSuggestionClick?.(suggestion.text)
              }}
              className={`
                group p-4 rounded-xl border transition-all duration-200
                ${themeClasses.surface}
                hover:${themeClasses.surfaceElevated}
                hover:border-blue-400
                hover:shadow-lg
                text-left
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all`}>
                  {suggestion.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${themeClasses.text.primary} group-hover:text-blue-400 transition-colors`}>
                    {suggestion.text}
                  </p>
                  {suggestion.category && (
                    <p className={`text-sm ${themeClasses.text.tertiary}`}>
                      {suggestion.category}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className={`mt-8 p-4 rounded-lg ${themeClasses.surface} border ${themeClasses.text.secondary}`}>
        <p className="text-sm">
          💡 <strong>Astuce :</strong> Vous pouvez me poser des questions sur n'importe quel sujet lié à Marbella - restaurants, hôtels, plages, shopping, vie nocturne, et bien plus !
        </p>
      </div>

      {/* Keyboard shortcut hint */}
      {!isMobile && (
        <div className={`mt-4 text-xs ${themeClasses.text.muted}`}>
          Appuyez sur <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Tab</kbd> pour commencer à taper
        </div>
      )}

    </div>
  )
})

WelcomeCard.displayName = 'WelcomeCard'

export default WelcomeCard
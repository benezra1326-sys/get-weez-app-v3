import { useState, useEffect } from 'react'

const SUGGESTIONS = {
  lifestyle: [
    "Trouver un rooftop chic à Marbella 🍸",
    "Découvrir les meilleures plages privées 🏖️",
    "Réserver une table dans un restaurant étoilé 🍽️"
  ],
  evenements: [
    "Découvrir les événements privés de ce soir 🎧",
    "Voir les soirées VIP cette semaine 🎉",
    "Trouver un concert exclusif 🎵"
  ],
  hebergement: [
    "Trouver une villa de luxe avec vue mer 🏡",
    "Réserver une suite dans un hôtel 5 étoiles 🏨",
    "Louer un penthouse pour le week-end 🌟"
  ],
  mobilite: [
    "Réserver un yacht pour ce week-end 🛥️",
    "Louer une voiture de luxe avec chauffeur 🚘",
    "Organiser un transfert en hélicoptère 🚁"
  ],
  experiences: [
    "Organiser un dîner romantique en bord de mer 🍷",
    "Réserver une journée spa de luxe 💆‍♀️",
    "Planifier une dégustation de vins privée 🍾"
  ],
  services: [
    "Réserver un massage à domicile 💆‍♀️",
    "Trouver un chef privé pour ce soir 👨‍🍳",
    "Organiser un shooting photo professionnel 📸"
  ],
  ia_assistance: [
    "Planifier mon séjour parfait à Marbella ✨",
    "Créer un itinéraire personnalisé 🗺️",
    "Obtenir des recommandations VIP 💎"
  ],
  mood: [
    "Surprends-moi avec une expérience unique 🎭",
    "Trouve-moi quelque chose d'extraordinaire 🌠",
    "Organise-moi une soirée inoubliable 🌙"
  ]
}

export default function DynamicSuggestions({ onSuggestionClick, isDarkMode }) {
  const [visibleSuggestions, setVisibleSuggestions] = useState([])
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    // Sélectionner 3 suggestions aléatoires de différentes catégories
    const selectRandomSuggestions = () => {
      const categories = Object.keys(SUGGESTIONS)
      const selected = []
      
      // Mélanger les catégories
      const shuffledCategories = [...categories].sort(() => Math.random() - 0.5)
      
      // Prendre 3 suggestions de catégories différentes
      for (let i = 0; i < 3 && i < shuffledCategories.length; i++) {
        const category = shuffledCategories[i]
        const suggestions = SUGGESTIONS[category]
        const randomIndex = Math.floor(Math.random() * suggestions.length)
        selected.push(suggestions[randomIndex])
      }
      
      setVisibleSuggestions(selected)
      setAnimationKey(prev => prev + 1)
    }

    // Sélectionner les premières suggestions
    selectRandomSuggestions()

    // Rotation toutes les 6 secondes
    const interval = setInterval(selectRandomSuggestions, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-2xl mx-auto px-4">
      {visibleSuggestions.map((suggestion, index) => (
        <div
          key={`${animationKey}-${index}`}
          className="w-full animate-fade-slide-up"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          <button
            onClick={() => onSuggestionClick(suggestion.replace(/[🍸🏖️🍽️🎧🎉🎵🏡🏨🌟🛥️🚘🚁🍷💆‍♀️🍾👨‍🍳📸✨🗺️💎🎭🌠🌙]/g, '').trim())}
            className="w-full p-4 rounded-xl text-left transition-all duration-300 group"
            style={{
              background: isDarkMode 
                ? 'rgba(167,199,197,0.08)' 
                : 'rgba(167,199,197,0.12)',
              border: '1px solid rgba(167,199,197,0.3)',
              backdropFilter: 'blur(8px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(167,199,197,0.15)' 
                : 'rgba(167,199,197,0.2)'
              e.currentTarget.style.borderColor = 'rgba(167,199,197,0.5)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(167,199,197,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(167,199,197,0.08)' 
                : 'rgba(167,199,197,0.12)'
              e.currentTarget.style.borderColor = 'rgba(167,199,197,0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span 
              className="text-sm md:text-base"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? '#A7C7C5' : '#5A8B89',
                fontWeight: 500
              }}
            >
              {suggestion}
            </span>
          </button>
        </div>
      ))}
    </div>
  )
}


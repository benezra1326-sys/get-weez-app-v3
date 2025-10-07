import React, { useState } from 'react'
import { Grid3x3, LayoutGrid, RectangleVertical } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

// Mapping d'IDs Unsplash pour les suggestions
const getImageId = (id) => {
  const imageIds = {
    1: '1414235077-531286732f1a', // Restaurant
    2: '1566073771259-6a8506099945', // Hôtel
    3: '1540962351504-03099e0a754b', // Transport/Jet
    4: '1492684223066-81342ee5ff30', // Événements
    5: '1544367567-0f2fcb009e0b', // Spa/Wellness
    6: '1441986300917-64674bd600d8'  // Shopping
  }
  return imageIds[id] || '1414235077-531286732f1a'
}

/**
 * Grille de suggestions avec choix d'affichage 1/2/3 colonnes
 */
export default function SuggestionsGrid({ suggestions, onSuggestionClick }) {
  const { isDarkMode } = useTheme()
  const [columns, setColumns] = useState(2) // Par défaut 2 colonnes (pas de 3 colonnes sur mobile)

  const getGridCols = () => {
    switch(columns) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-2'
      case 3: return 'grid-cols-3'
      default: return 'grid-cols-2'
    }
  }

  return (
    <div className="w-full">
      {/* Sélecteur de colonnes - Uniquement 1 ou 2 colonnes */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setColumns(1)}
          className={`p-2 rounded-lg transition-all duration-300 ${columns === 1 ? 'scale-110' : ''}`}
          style={{
            background: columns === 1 
              ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
              : isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            boxShadow: columns === 1 ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none'
          }}
          title="1 colonne"
        >
          <RectangleVertical size={16} className={columns === 1 ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
        </button>

        <button
          onClick={() => setColumns(2)}
          className={`p-2 rounded-lg transition-all duration-300 ${columns === 2 ? 'scale-110' : ''}`}
          style={{
            background: columns === 2 
              ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
              : isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            boxShadow: columns === 2 ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none'
          }}
          title="2 colonnes"
        >
          <LayoutGrid size={16} className={columns === 2 ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
        </button>
      </div>

      {/* Grille de suggestions - Style bannière comme desktop */}
      <div className={`grid ${getGridCols()} gap-4 px-4`}>
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon
          return (
            <button
              key={suggestion.id}
              onClick={() => onSuggestionClick(suggestion.suggestion)}
              className="uniform-banner group relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                height: columns === 1 ? '180px' : '160px',
                cursor: 'pointer'
              }}
            >
              {/* Image de fond (utiliser des images Unsplash) */}
              <img 
                src={suggestion.imageUrl || `https://images.unsplash.com/photo-${getImageId(suggestion.id)}?w=600&h=400&fit=crop&q=80`}
                alt={suggestion.title}
                className="banner-image"
              />
              
              {/* Overlay */}
              <div className="banner-overlay" style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%)'
              }} />
              
              {/* Contenu */}
              <div className="banner-content">
                {/* Header avec icône */}
                <div className="banner-header">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${suggestion.color})`,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <span className="text-xl">{suggestion.image}</span>
                  </div>
                </div>
                
                {/* Titre et description */}
                <div>
                  <h3 className="banner-title" style={{ 
                    fontSize: columns === 1 ? '18px' : '16px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                  }}>
                    {suggestion.title}
                  </h3>
                  {columns <= 2 && (
                    <p className="banner-description" style={{
                      fontSize: '13px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                    }}>
                      {suggestion.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}


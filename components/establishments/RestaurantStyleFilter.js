import { useState } from 'react'
import { restaurantStyles } from '../../data/marbella-data'

export default function RestaurantStyleFilter({ onStyleChange, selectedStyle }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleStyleSelect = (styleKey) => {
    onStyleChange(styleKey)
    setIsOpen(false)
  }

  return (
    <>
      <style jsx>{`
        .style-button {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .style-button:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
          transform: translateY(-2px);
        }
        
        .style-option {
          transition: all 0.2s ease;
        }
        
        .style-option:hover {
          transform: translateX(5px);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
        }
        
        .style-option.selected {
          background: linear-gradient(135deg, #8B5CF6, #3B82F6);
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
      `}</style>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="style-button flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300"
        >
        <div className="flex items-center">
          <span className="text-lg mr-3">
            {selectedStyle ? restaurantStyles[selectedStyle].icon : '🍽️'}
          </span>
          <span className="font-medium text-white">
            {selectedStyle ? restaurantStyles[selectedStyle].name : 'Tous les styles'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          <div className="p-3">
            <button
              onClick={() => handleStyleSelect(null)}
              className={`style-option w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                !selectedStyle ? 'selected' : 'text-white'
              }`}
            >
              <span className="text-lg mr-3">🍽️</span>
              Tous les styles
            </button>
            
            {Object.entries(restaurantStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => handleStyleSelect(key)}
                className={`style-option w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedStyle === key ? 'selected' : 'text-white'
                }`}
              >
                <span className="text-lg mr-3">{style.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{style.name}</div>
                  <div className="text-xs text-white/70">
                    {style.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  )
}

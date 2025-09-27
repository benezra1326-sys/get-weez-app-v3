import { useState } from 'react'
import { restaurantStyles } from '../../data/marbella-data'

export default function RestaurantStyleFilter({ onStyleChange, selectedStyle }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleStyleSelect = (styleKey) => {
    onStyleChange(styleKey)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-all duration-200"
      >
        <div className="flex items-center">
          <span className="text-lg mr-3">
            {selectedStyle ? restaurantStyles[selectedStyle].icon : '🍽️'}
          </span>
          <span className="font-medium text-text-primary">
            {selectedStyle ? restaurantStyles[selectedStyle].name : 'Tous les styles'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={() => handleStyleSelect(null)}
              className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                !selectedStyle
                  ? 'bg-primary text-white'
                  : 'text-text-primary hover:bg-surface-hover'
              }`}
            >
              <span className="text-lg mr-3">🍽️</span>
              Tous les styles
            </button>
            
            {Object.entries(restaurantStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => handleStyleSelect(key)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  selectedStyle === key
                    ? 'bg-primary text-white'
                    : 'text-text-primary hover:bg-surface-hover'
                }`}
              >
                <span className="text-lg mr-3">{style.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{style.name}</div>
                  <div className="text-xs text-text-secondary">
                    {style.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

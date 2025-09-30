import { useState } from 'react'
import { restaurantStyles } from '../../data/marbella-data'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function RestaurantStyleFilter({ onStyleChange, selectedStyle }) {
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode } = useTheme()

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
          color: ${isDarkMode ? '#F9FAFB' : '#1F2937'};
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
          <span className="font-medium" style={{ color: isDarkMode ? '#F9FAFB' : '#1F2937' }}>
            {selectedStyle ? restaurantStyles[selectedStyle].name : 'Tous les styles'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{ color: isDarkMode ? '#D1D5DB' : '#374151' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 backdrop-blur-md border rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
          style={{
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'
          }}
        >
          <div className="p-3">
            <button
              onClick={() => handleStyleSelect(null)}
              className={`style-option w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                !selectedStyle ? 'selected' : ''
              }`}
              style={{ color: isDarkMode ? '#F9FAFB' : '#1F2937' }}
            >
              <span className="text-lg mr-3">🍽️</span>
              Tous les styles
            </button>
            
            {Object.entries(restaurantStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => handleStyleSelect(key)}
                className={`style-option w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedStyle === key ? 'selected' : ''
                }`}
                style={{ color: isDarkMode ? '#F9FAFB' : '#1F2937' }}
              >
                <span className="text-lg mr-3">{style.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{style.name}</div>
                  <div className="text-xs" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
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

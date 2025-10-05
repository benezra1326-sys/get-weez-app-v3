import { useState } from 'react'
import { restaurantStyles } from '../../data/marbella-data'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function RestaurantStyleFilter({ onStyleChange, selectedStyle }) {
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode } = useTheme()

  // Utiliser le vrai mode du thème
  const forceDarkMode = isDarkMode

  const handleStyleSelect = (styleKey) => {
    onStyleChange(styleKey)
    setIsOpen(false)
  }

  return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300"
        style={{
          background: forceDarkMode 
            ? 'rgba(31, 41, 55, 0.95) !important'
            : 'rgba(255, 255, 255, 0.95) !important',
          border: '1px solid',
          borderColor: forceDarkMode ? 'rgba(75, 85, 99, 0.8) !important' : 'rgba(139, 92, 246, 0.5)',
          color: forceDarkMode ? '#FFFFFF !important' : '#1F2937',
          backdropFilter: 'blur(20px)',
          boxShadow: forceDarkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(139, 92, 246, 0.15)',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = isDarkMode 
            ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.9), rgba(55, 65, 81, 1))'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))'
          e.target.style.borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.5)'
          e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.2)'
          e.target.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = isDarkMode 
            ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.9))'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
          e.target.style.borderColor = isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(139, 92, 246, 0.3)'
          e.target.style.boxShadow = 'none'
          e.target.style.transform = 'translateY(0)'
        }}
        >
        <div className="flex items-center w-full">
          <span className="text-lg mr-3 flex-shrink-0">
            {selectedStyle ? restaurantStyles[selectedStyle].icon : '🍽️'}
          </span>
          <span className="font-medium flex-1 text-left">
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
          className="absolute top-full left-0 right-0 mt-2 backdrop-blur-md border rounded-xl shadow-2xl max-h-80 overflow-y-auto"
          style={{
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.5)' : 'rgba(209, 213, 219, 0.8)',
            zIndex: 99999,
            position: 'absolute',
            boxShadow: isDarkMode 
              ? '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(168, 85, 247, 0.3)'
              : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(30px) saturate(150%)'
          }}
        >
          <div className="p-3">
            <button
              onClick={() => handleStyleSelect(null)}
              className="w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200"
              style={{
                background: !selectedStyle 
                  ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                  : isDarkMode 
                    ? 'transparent'
                    : 'transparent',
                color: !selectedStyle 
                  ? 'white'
                  : isDarkMode ? '#F3F4F6' : '#1F2937',
                boxShadow: !selectedStyle ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!selectedStyle) return
                e.target.style.transform = 'translateX(5px)'
                e.target.style.background = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
              }}
              onMouseLeave={(e) => {
                if (!selectedStyle) return
                e.target.style.transform = 'translateX(0)'
                e.target.style.background = 'transparent'
              }}
            >
              <span className="text-lg mr-3">🍽️</span>
              Tous les styles
            </button>
            
            {Object.entries(restaurantStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => handleStyleSelect(key)}
                className="w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200"
                style={{
                  background: selectedStyle === key 
                    ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                    : 'transparent',
                  color: selectedStyle === key 
                    ? 'white'
                    : isDarkMode ? '#F3F4F6' : '#1F2937',
                  boxShadow: selectedStyle === key ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (selectedStyle === key) return
                  e.target.style.transform = 'translateX(5px)'
                  e.target.style.background = isDarkMode 
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
                }}
                onMouseLeave={(e) => {
                  if (selectedStyle === key) return
                  e.target.style.transform = 'translateX(0)'
                  e.target.style.background = 'transparent'
                }}
              >
                <span className="text-lg mr-3">{style.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{style.name}</div>
                  <div className="text-xs" style={{ 
                    color: selectedStyle === key 
                      ? 'rgba(255, 255, 255, 0.8)'
                      : isDarkMode ? '#9CA3AF' : '#6B7280' 
                  }}>
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

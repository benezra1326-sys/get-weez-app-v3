import { useState } from 'react'
import { serviceCategories } from '../../data/services-data'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function ServiceCategoryFilter({ onCategoryChange, selectedCategory }) {
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode } = useTheme()

  const handleCategorySelect = (categoryKey) => {
    onCategoryChange(categoryKey)
    setIsOpen(false)
  }

  return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300"
        style={{
          background: isDarkMode 
            ? 'rgba(31, 41, 55, 0.95) !important'
            : 'rgba(255, 255, 255, 0.95) !important',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.8) !important' : 'rgba(139, 92, 246, 0.5)',
          color: isDarkMode ? '#FFFFFF !important' : '#1F2937',
          backdropFilter: 'blur(20px)',
          boxShadow: isDarkMode 
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
              {selectedCategory ? serviceCategories[selectedCategory].icon : '⭐'}
            </span>
            <span className="font-medium flex-1 text-left">
              {selectedCategory ? serviceCategories[selectedCategory].name : 'Toutes les catégories'}
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
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.8)' : 'rgba(209, 213, 219, 0.8)',
            zIndex: 99999,
            position: 'fixed',
            boxShadow: isDarkMode 
              ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(30px) saturate(150%)'
          }}
        >
            <div className="p-3">
              <button
                onClick={() => handleCategorySelect(null)}
              className="w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200"
              style={{
                background: !selectedCategory 
                  ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                  : 'transparent',
                color: !selectedCategory 
                  ? 'white'
                  : isDarkMode ? '#F3F4F6' : '#1F2937',
                boxShadow: !selectedCategory ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!selectedCategory) return
                e.target.style.transform = 'translateX(5px)'
                e.target.style.background = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
              }}
              onMouseLeave={(e) => {
                if (!selectedCategory) return
                e.target.style.transform = 'translateX(0)'
                e.target.style.background = 'transparent'
              }}
              >
                <span className="text-lg mr-3">⭐</span>
                Toutes les catégories
              </button>
              
              {Object.entries(serviceCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => handleCategorySelect(key)}
                className="w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200"
                style={{
                  background: selectedCategory === key 
                    ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                    : 'transparent',
                  color: selectedCategory === key 
                    ? 'white'
                    : isDarkMode ? '#F3F4F6' : '#1F2937',
                  boxShadow: selectedCategory === key ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory === key) return
                  e.target.style.transform = 'translateX(5px)'
                  e.target.style.background = isDarkMode 
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory === key) return
                  e.target.style.transform = 'translateX(0)'
                  e.target.style.background = 'transparent'
                }}
                >
                  <span className="text-lg mr-3">{category.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{category.name}</div>
                  <div className="text-xs" style={{ 
                    color: selectedCategory === key 
                      ? 'rgba(255, 255, 255, 0.8)'
                      : isDarkMode ? '#9CA3AF' : '#6B7280' 
                  }}>
                      {category.count} services
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

import React from 'react'
import { MapPin, DollarSign, Star, Sparkles } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const FiltersBar = ({ onFilterChange }) => {
  const { isDarkMode } = useTheme()

  const filters = [
    { name: 'Géolocalisation', icon: MapPin, value: 'location' },
    { name: 'Prix', icon: DollarSign, value: 'price' },
    { name: 'Note', icon: Star, value: 'rating' }
  ]

  return (
    <div className="w-full mb-8">
      <div 
        className="p-6 rounded-2xl flex flex-wrap gap-4 justify-center items-center"
        style={{
          background: isDarkMode 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(255, 255, 255, 0.6)',
          border: isDarkMode 
            ? '1px solid rgba(212, 175, 55, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(14px)',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        {filters.map((filter, idx) => {
          const Icon = filter.icon
          return (
            <button
              key={idx}
              className="px-4 py-2 text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{
                background: isDarkMode 
                  ? 'rgba(212, 175, 55, 0.1)' 
                  : 'rgba(0, 0, 0, 0.03)',
                border: isDarkMode 
                  ? '1px solid rgba(212, 175, 55, 0.3)' 
                  : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500
              }}
              onClick={() => onFilterChange && onFilterChange(filter.name)}
            >
              <Icon size={16} />
              <span>{filter.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FiltersBar


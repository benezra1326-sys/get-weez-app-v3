import React, { useState } from 'react'
import { MapPin, DollarSign, Star, ChevronDown } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const FiltersBar = ({ onFilterChange, currentSort = 'rating' }) => {
  const { isDarkMode } = useTheme()
  const [activeSort, setActiveSort] = useState(currentSort)
  const [showPriceOptions, setShowPriceOptions] = useState(false)
  const [showLocationOptions, setShowLocationOptions] = useState(false)

  const sortOptions = [
    { name: 'Meilleures notes', icon: Star, value: 'rating' },
    { name: 'Prix croissant', icon: DollarSign, value: 'price-asc' },
    { name: 'Prix décroissant', icon: DollarSign, value: 'price-desc' }
  ]

  const handleSortChange = (sortValue) => {
    setActiveSort(sortValue)
    if (onFilterChange) onFilterChange({ type: 'sort', value: sortValue })
  }

  return (
    <div className="w-full mb-8">
      <div 
        className="p-6 rounded-2xl"
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
        <p 
          className="text-sm mb-4"
          style={{
            fontFamily: 'Poppins, sans-serif',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#666666'
          }}
        >
          Trier par :
        </p>
        
        <div className="flex flex-wrap gap-3">
          {sortOptions.map((option, idx) => {
            const Icon = option.icon
            const isActive = activeSort === option.value
            return (
              <button
                key={idx}
                onClick={() => handleSortChange(option.value)}
                className="px-4 py-2.5 text-sm flex items-center gap-2 transition-all duration-300"
                style={{
                  background: isActive
                    ? (isDarkMode ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 0, 0, 0.08)')
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                  border: isActive
                    ? (isDarkMode ? '2px solid rgba(212, 175, 55, 0.4)' : '2px solid rgba(0, 0, 0, 0.2)')
                    : (isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)'),
                  borderRadius: '12px',
                  color: isActive
                    ? (isDarkMode ? '#D4AF37' : '#0B0B0C')
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'),
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: isActive ? 600 : 500
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                  }
                }}
              >
                <Icon size={16} />
                <span>{option.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FiltersBar


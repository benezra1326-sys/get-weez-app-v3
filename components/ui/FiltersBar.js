import React, { useState, useEffect } from 'react'
import { MapPin, DollarSign, Star, ChevronDown, Filter, Sparkles } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { getUserPreferences } from '../../lib/smartSorting'

const FiltersBar = ({ onFilterChange, currentSort = 'rating', user }) => {
  const { isDarkMode } = useTheme()
  const [activeSort, setActiveSort] = useState(currentSort)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [userPreferences, setUserPreferences] = useState(null)

  useEffect(() => {
    if (user?.id) {
      const preferences = getUserPreferences(user.id)
      setUserPreferences(preferences)
    }
  }, [user])

  const sortOptions = [
    { name: 'Tri intelligent', icon: Sparkles, value: 'smart', short: 'Smart', premium: true },
    { name: 'Meilleures notes', icon: Star, value: 'rating', short: 'Notes' },
    { name: 'Plus de reviews', icon: Star, value: 'reviews', short: 'Reviews' },
    { name: 'Prix croissant', icon: DollarSign, value: 'price-asc', short: 'Prix ↑' },
    { name: 'Prix décroissant', icon: DollarSign, value: 'price-desc', short: 'Prix ↓' },
    { name: 'À proximité', icon: MapPin, value: 'location', short: 'Proche' }
  ]

  const handleSortChange = (sortValue) => {
    setActiveSort(sortValue)
    setShowDropdown(false)
    if (onFilterChange) {
      const filterData = { type: 'sort', value: sortValue }
      
      // Si c'est le tri intelligent et qu'on a des préférences, les inclure
      if (sortValue === 'smart' && userPreferences) {
        filterData.userPreferences = userPreferences
        filterData.sortType = 'smart'
      }
      
      onFilterChange(filterData)
    }
  }

  const currentOption = sortOptions.find(opt => opt.value === activeSort)

  if (isMobile) {
    return (
      <div className="w-full mb-4">
        <div 
          className="p-3 rounded-lg"
          style={{
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.03)' 
              : 'rgba(255, 255, 255, 0.6)',
            border: isDarkMode 
              ? '1px solid rgba(192, 192, 192, 0.2)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(14px)',
            boxShadow: isDarkMode 
              ? '0 2px 12px rgba(0, 0, 0, 0.3)' 
              : '0 2px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Mobile: Dropdown compact */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-300"
              style={{
                background: isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: isDarkMode ? '1px solid rgba(192, 192, 192, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500
              }}
            >
              <div className="flex items-center gap-2">
                <Filter size={14} />
                <span className="text-xs">Trier: {currentOption?.short}</span>
                {currentOption?.premium && (
                  <Sparkles size={10} style={{ color: '#C0C0C0' }} />
                )}
              </div>
              <ChevronDown 
                size={14} 
                style={{ 
                  transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} 
              />
            </button>

            {showDropdown && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg z-50"
                style={{
                  background: isDarkMode ? 'rgba(11, 11, 12, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  border: isDarkMode ? '1px solid rgba(192, 192, 192, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                {sortOptions.map((option, idx) => {
                  const Icon = option.icon
                  const isActive = activeSort === option.value
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSortChange(option.value)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-left"
                      style={{
                        background: isActive
                          ? (isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(0, 0, 0, 0.08)')
                          : 'transparent',
                        color: isActive
                          ? (isDarkMode ? '#C0C0C0' : '#0B0B0C')
                          : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'),
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: isActive ? 600 : 500
                      }}
                    >
                      <Icon size={16} />
                      <span className="text-sm">{option.name}</span>
                      {option.premium && (
                        <Sparkles size={12} style={{ color: '#C0C0C0' }} />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop: Layout horizontal compact
  return (
    <div className="w-full">
      <div 
        className="p-3 rounded-xl"
        style={{
          background: isDarkMode 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(255, 255, 255, 0.6)',
          border: isDarkMode 
            ? '1px solid rgba(192, 192, 192, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(14px)',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex items-center justify-between">
          <span 
            className="text-sm font-medium"
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#666666'
            }}
          >
            Trier par :
          </span>
          
          <div className="flex gap-1.5">
            {sortOptions.map((option, idx) => {
              const Icon = option.icon
              const isActive = activeSort === option.value
              return (
                <button
                  key={idx}
                  onClick={() => handleSortChange(option.value)}
                  className="px-2.5 py-1.5 text-xs flex items-center gap-1 transition-all duration-300"
                  style={{
                    background: isActive
                      ? (isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(0, 0, 0, 0.08)')
                      : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                    border: isActive
                      ? (isDarkMode ? '1px solid rgba(192, 192, 192, 0.4)' : '1px solid rgba(0, 0, 0, 0.2)')
                      : (isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)'),
                    borderRadius: '6px',
                    color: isActive
                      ? (isDarkMode ? '#C0C0C0' : '#0B0B0C')
                      : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'),
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: isActive ? 600 : 500,
                    whiteSpace: 'nowrap'
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
                  <Icon size={12} />
                  <span>{option.short}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FiltersBar


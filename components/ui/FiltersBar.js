import React from 'react'
import { MapPin, DollarSign, Star, Sparkles } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const FiltersBar = ({ onFilterChange }) => {
  const { isDarkMode } = useTheme()

  const filters = [
    { name: 'Géolocalisation', icon: MapPin },
    { name: 'Prix', icon: DollarSign },
    { name: 'Note', icon: Star },
    { name: 'Recommandés par Gliitz', icon: Sparkles }
  ]

  return (
    <div className="w-full mb-8">
      <div 
        className="glass-refined p-6 rounded-2xl flex flex-wrap gap-4 justify-center items-center"
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
        }}
      >
        {filters.map((filter, idx) => {
          const Icon = filter.icon
          return (
            <button
              key={idx}
              className="btn-gliitz-secondary px-4 py-2 text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
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


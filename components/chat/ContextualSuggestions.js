import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock, MapPin, TrendingUp } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { preferencesManager } from '../../lib/userPreferences'

export default function ContextualSuggestions({ onSuggestionClick, isDarkMode }) {
  const [suggestions, setSuggestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleSuggestions, setVisibleSuggestions] = useState([])

  useEffect(() => {
    // Générer les suggestions contextuelles
    const contextualSuggestions = preferencesManager.generateContextualSuggestions()
    setSuggestions(contextualSuggestions)
    
    // Afficher les 3 premières
    setVisibleSuggestions(contextualSuggestions.slice(0, 3))
  }, [])

  useEffect(() => {
    if (suggestions.length === 0) return

    // Rotation automatique toutes les 10 secondes
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 3) % suggestions.length
        const next3 = [
          suggestions[nextIndex],
          suggestions[(nextIndex + 1) % suggestions.length],
          suggestions[(nextIndex + 2) % suggestions.length]
        ]
        setVisibleSuggestions(next3)
        return nextIndex
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [suggestions])

  const getContextIcon = () => {
    const hour = new Date().getHours()
    if (hour >= 7 && hour < 12) return <Clock size={16} />
    if (hour >= 19) return <Sparkles size={16} />
    return <TrendingUp size={16} />
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 relative" style={{ zIndex: 0 }}>
      <div 
        className="flex items-center gap-2 mb-3"
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.85rem',
          color: isDarkMode ? 'rgba(192, 192, 192, 0.8)' : 'rgba(0, 0, 0, 0.6)',
          fontWeight: '500'
        }}
      >
        {getContextIcon()}
        <span>Suggestions personnalisées</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <AnimatePresence mode="wait">
          {visibleSuggestions.map((suggestion, index) => (
            <motion.button
              key={`${suggestion}-${currentIndex}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick && onSuggestionClick(suggestion.replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗]/g, '').trim())}
              className="relative p-4 rounded-xl text-left overflow-hidden group"
              style={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${isDarkMode 
                  ? 'rgba(192, 192, 192, 0.2)' 
                  : 'rgba(192, 192, 192, 0.3)'}`,
                backdropFilter: 'blur(10px)',
                boxShadow: isDarkMode 
                  ? '0 4px 15px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 15px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}
            >
              {/* Halo effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${
                    isDarkMode 
                      ? 'rgba(192, 192, 192, 0.15)' 
                      : 'rgba(167, 199, 197, 0.2)'
                  }, transparent)`,
                  pointerEvents: 'none'
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Sparkle in corner */}
              <Sparkles 
                size={14} 
                className="absolute top-2 right-2 opacity-60"
                style={{ 
                  color: isDarkMode ? '#C0C0C0' : '#A7C7C5'
                }}
              />

              {/* Text */}
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.9rem',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontWeight: '500',
                  lineHeight: '1.4',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {suggestion}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-2 mt-4">
        {suggestions.length > 0 && Array.from({ length: Math.ceil(suggestions.length / 3) }).map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{
              background: currentIndex === index * 3
                ? (isDarkMode ? '#C0C0C0' : '#A7C7C5')
                : (isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(167, 199, 197, 0.3)')
            }}
            animate={{
              scale: currentIndex === index * 3 ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}


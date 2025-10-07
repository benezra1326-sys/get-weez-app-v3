import React, { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

/**
 * Composant de filtres mobiles optimisé avec sélection tactile
 */
export default function MobileFilters({ 
  categories = {}, 
  selectedCategory, 
  onCategoryChange,
  styles = {},
  selectedStyle,
  onStyleChange,
  onClearFilters,
  showFilters = true
}) {
  const { isDarkMode } = useTheme()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [activeFilterTab, setActiveFilterTab] = useState('category') // 'category' ou 'style'

  const hasActiveFilters = selectedCategory || selectedStyle

  const handleCategorySelect = (categoryKey) => {
    onCategoryChange(categoryKey)
    // Fermer les filtres après sélection sur mobile
    setTimeout(() => setIsFiltersOpen(false), 300)
  }

  const handleStyleSelect = (styleKey) => {
    onStyleChange(styleKey)
    // Fermer les filtres après sélection sur mobile
    setTimeout(() => setIsFiltersOpen(false), 300)
  }

  const clearAllFilters = () => {
    onCategoryChange(null)
    onStyleChange(null)
    onClearFilters && onClearFilters()
    setIsFiltersOpen(false)
  }

  if (!showFilters) return null

  return (
    <>
      {/* Bouton d'ouverture des filtres */}
      <div className="flex items-center justify-between mb-4 px-4">
        <button
          onClick={() => setIsFiltersOpen(true)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
            hasActiveFilters ? 'scale-105' : ''
          }`}
          style={{
            background: hasActiveFilters
              ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
              : isDarkMode 
                ? 'rgba(31, 41, 55, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
            color: hasActiveFilters 
              ? 'white' 
              : (isDarkMode ? '#F3F4F6' : '#1F2937'),
            border: '1px solid',
            borderColor: hasActiveFilters 
              ? 'rgba(255, 255, 255, 0.3)' 
              : (isDarkMode ? 'rgba(75, 85, 99, 0.8)' : 'rgba(192, 192, 192, 0.5)'),
            backdropFilter: 'blur(20px)',
            boxShadow: hasActiveFilters 
              ? '0 4px 20px rgba(192, 192, 192, 0.4)'
              : (isDarkMode 
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(192, 192, 192, 0.15)')
          }}
        >
          <Filter size={18} />
          <span className="font-medium">
            {hasActiveFilters ? 'Filtres actifs' : 'Filtres'}
          </span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <X size={16} className="inline mr-1" />
            Effacer
          </button>
        )}
      </div>

      {/* Overlay des filtres */}
      {isFiltersOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end"
          onClick={() => setIsFiltersOpen(false)}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)'
            }}
          />
          
          {/* Panel des filtres */}
          <div 
            className="relative w-full max-h-[80vh] rounded-t-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDarkMode 
                ? 'rgba(17, 24, 39, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(30px) saturate(150%)',
              border: '1px solid',
              borderColor: isDarkMode 
                ? 'rgba(75, 85, 99, 0.3)' 
                : 'rgba(209, 213, 219, 0.8)',
              boxShadow: isDarkMode 
                ? '0 -25px 50px rgba(0, 0, 0, 0.7)'
                : '0 -25px 50px rgba(0, 0, 0, 0.15)'
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{
                borderBottomColor: isDarkMode 
                  ? 'rgba(75, 85, 99, 0.3)' 
                  : 'rgba(209, 213, 219, 0.8)'
              }}
            >
              <h3 className="text-lg font-bold" style={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}>
                Filtres
              </h3>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  background: isDarkMode 
                    ? 'rgba(75, 85, 99, 0.5)' 
                    : 'rgba(243, 244, 246, 0.8)',
                  color: isDarkMode ? '#D1D5DB' : '#6B7280'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Onglets de filtres */}
            <div className="flex border-b" style={{ borderBottomColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.8)' }}>
              <button
                onClick={() => setActiveFilterTab('category')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-300 ${
                  activeFilterTab === 'category' ? 'scale-105' : ''
                }`}
                style={{
                  background: activeFilterTab === 'category'
                    ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                    : 'transparent',
                  color: activeFilterTab === 'category'
                    ? 'white'
                    : (isDarkMode ? '#D1D5DB' : '#6B7280'),
                  borderBottom: activeFilterTab === 'category' 
                    ? '2px solid #C0C0C0' 
                    : 'none'
                }}
              >
                Catégories
              </button>
              <button
                onClick={() => setActiveFilterTab('style')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-300 ${
                  activeFilterTab === 'style' ? 'scale-105' : ''
                }`}
                style={{
                  background: activeFilterTab === 'style'
                    ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                    : 'transparent',
                  color: activeFilterTab === 'style'
                    ? 'white'
                    : (isDarkMode ? '#D1D5DB' : '#6B7280'),
                  borderBottom: activeFilterTab === 'style' 
                    ? '2px solid #C0C0C0' 
                    : 'none'
                }}
              >
                Styles
              </button>
            </div>

            {/* Contenu des filtres */}
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Filtres par catégorie */}
              {activeFilterTab === 'category' && (
                <div className="p-4">
                  {/* Toutes les catégories */}
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full flex items-center px-4 py-4 rounded-xl mb-3 transition-all duration-300 ${
                      !selectedCategory ? 'scale-105' : ''
                    }`}
                    style={{
                      background: !selectedCategory 
                        ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                        : (isDarkMode 
                          ? 'rgba(31, 41, 55, 0.8)' 
                          : 'rgba(243, 244, 246, 0.8)'),
                      color: !selectedCategory 
                        ? 'white'
                        : (isDarkMode ? '#F3F4F6' : '#1F2937'),
                      border: '1px solid',
                      borderColor: !selectedCategory 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : (isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'),
                      boxShadow: !selectedCategory ? '0 4px 15px rgba(192, 192, 192, 0.3)' : 'none'
                    }}
                  >
                    <span className="text-xl mr-3">📂</span>
                    <div className="text-left flex-1">
                      <div className="font-medium">Toutes les catégories</div>
                    </div>
                  </button>

                  {/* Catégories */}
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleCategorySelect(key)}
                      className={`w-full flex items-center px-4 py-4 rounded-xl mb-3 transition-all duration-300 ${
                        selectedCategory === key ? 'scale-105' : ''
                      }`}
                      style={{
                        background: selectedCategory === key 
                          ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                          : (isDarkMode 
                            ? 'rgba(31, 41, 55, 0.8)' 
                            : 'rgba(243, 244, 246, 0.8)'),
                        color: selectedCategory === key 
                          ? 'white'
                          : (isDarkMode ? '#F3F4F6' : '#1F2937'),
                        border: '1px solid',
                        borderColor: selectedCategory === key 
                          ? 'rgba(255, 255, 255, 0.3)' 
                          : (isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'),
                        boxShadow: selectedCategory === key ? '0 4px 15px rgba(192, 192, 192, 0.3)' : 'none'
                      }}
                    >
                      <span className="text-xl mr-3">{category.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm" style={{ 
                          color: selectedCategory === key 
                            ? 'rgba(255, 255, 255, 0.8)'
                            : (isDarkMode ? '#9CA3AF' : '#6B7280') 
                        }}>
                          {category.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Filtres par style */}
              {activeFilterTab === 'style' && Object.keys(styles).length > 0 && (
                <div className="p-4">
                  {/* Tous les styles */}
                  <button
                    onClick={() => handleStyleSelect(null)}
                    className={`w-full flex items-center px-4 py-4 rounded-xl mb-3 transition-all duration-300 ${
                      !selectedStyle ? 'scale-105' : ''
                    }`}
                    style={{
                      background: !selectedStyle 
                        ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                        : (isDarkMode 
                          ? 'rgba(31, 41, 55, 0.8)' 
                          : 'rgba(243, 244, 246, 0.8)'),
                      color: !selectedStyle 
                        ? 'white'
                        : (isDarkMode ? '#F3F4F6' : '#1F2937'),
                      border: '1px solid',
                      borderColor: !selectedStyle 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : (isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'),
                      boxShadow: !selectedStyle ? '0 4px 15px rgba(192, 192, 192, 0.3)' : 'none'
                    }}
                  >
                    <span className="text-xl mr-3">🎨</span>
                    <div className="text-left flex-1">
                      <div className="font-medium">Tous les styles</div>
                    </div>
                  </button>

                  {/* Styles */}
                  {Object.entries(styles).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => handleStyleSelect(key)}
                      className={`w-full flex items-center px-4 py-4 rounded-xl mb-3 transition-all duration-300 ${
                        selectedStyle === key ? 'scale-105' : ''
                      }`}
                      style={{
                        background: selectedStyle === key 
                          ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                          : (isDarkMode 
                            ? 'rgba(31, 41, 55, 0.8)' 
                            : 'rgba(243, 244, 246, 0.8)'),
                        color: selectedStyle === key 
                          ? 'white'
                          : (isDarkMode ? '#F3F4F6' : '#1F2937'),
                        border: '1px solid',
                        borderColor: selectedStyle === key 
                          ? 'rgba(255, 255, 255, 0.3)' 
                          : (isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'),
                        boxShadow: selectedStyle === key ? '0 4px 15px rgba(192, 192, 192, 0.3)' : 'none'
                      }}
                    >
                      <span className="text-xl mr-3">{style.icon || '🏷️'}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium">{style.name}</div>
                        <div className="text-sm" style={{ 
                          color: selectedStyle === key 
                            ? 'rgba(255, 255, 255, 0.8)'
                            : (isDarkMode ? '#9CA3AF' : '#6B7280') 
                        }}>
                          {style.description || `${style.restaurants?.length || 0} établissements`}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Message si aucun style disponible */}
              {activeFilterTab === 'style' && Object.keys(styles).length === 0 && (
                <div className="p-4 text-center">
                  <div style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                    Aucun style de filtre disponible
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

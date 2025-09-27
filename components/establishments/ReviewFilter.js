import { useState } from 'react'
import { Star, Filter, TrendingUp, Clock, ThumbsUp } from 'lucide-react'
import { generateStars } from '../../lib/reviews'

export default function ReviewFilter({ onRatingChange, onSortChange, selectedRating, sortBy }) {
  const [isOpen, setIsOpen] = useState(false)

  const ratingOptions = [
    { value: 0, label: 'Toutes les notes', icon: '⭐', count: 'Toutes' },
    { value: 5, label: '5 étoiles', icon: '⭐⭐⭐⭐⭐', count: 'Excellent' },
    { value: 4, label: '4+ étoiles', icon: '⭐⭐⭐⭐', count: 'Très bien' },
    { value: 3, label: '3+ étoiles', icon: '⭐⭐⭐', count: 'Bien' },
    { value: 2, label: '2+ étoiles', icon: '⭐⭐', count: 'Moyen' },
    { value: 1, label: '1+ étoiles', icon: '⭐', count: 'Faible' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Plus récentes', icon: Clock },
    { value: 'highest', label: 'Mieux notées', icon: TrendingUp },
    { value: 'lowest', label: 'Moins bien notées', icon: TrendingUp },
    { value: 'most_helpful', label: 'Plus utiles', icon: ThumbsUp }
  ]

  const handleRatingSelect = (rating) => {
    onRatingChange(rating)
    setIsOpen(false)
  }

  const handleSortSelect = (sort) => {
    onSortChange(sort)
  }

  return (
    <div className="space-y-4">
      {/* Filtre par note */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Star size={20} className="text-accent" />
            </div>
            <div>
              <span className="font-medium text-text-primary">
                {selectedRating === 0 ? 'Toutes les notes' : `${selectedRating}+ étoiles`}
              </span>
              <p className="text-sm text-text-secondary">
                Filtrer par note moyenne
              </p>
            </div>
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
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50">
            <div className="p-2">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRatingSelect(option.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    selectedRating === option.value
                      ? 'bg-primary text-white'
                      : 'text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-xs text-text-secondary">{option.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tri des reviews */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">Trier par</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {sortOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sortBy === option.value
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <Icon size={14} />
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Statistiques des reviews */}
      <div className="p-4 bg-surface rounded-lg border border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Star size={16} className="text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">Filtres appliqués</h4>
            <p className="text-sm text-text-secondary">
              {selectedRating === 0 ? 'Toutes les notes affichées' : `Notes ${selectedRating}+ étoiles`}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Note minimale:</span>
            <span className="text-text-primary font-medium">
              {selectedRating === 0 ? 'Aucune' : `${selectedRating} étoiles`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Tri:</span>
            <span className="text-text-primary font-medium">
              {sortOptions.find(opt => opt.value === sortBy)?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

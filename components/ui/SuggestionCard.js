import React, { memo, useCallback } from 'react'
import styles from '../../styles/ChatInterface.module.css'

/**
 * Composant SuggestionCard réutilisable et optimisé
 * Affiche une carte de suggestion avec gradient, icône, et action
 */
const SuggestionCard = memo(({ 
  title,
  subtitle,
  description,
  icon,
  badge,
  gradient = 'blue',
  size = 'medium',
  onClick,
  actionText = 'En savoir plus',
  className = '',
  ...props 
}) => {
  // Styles de gradient basés sur le type
  const gradientStyles = {
    blue: 'from-blue-500 via-indigo-500 to-purple-500',
    purple: 'from-purple-500 via-pink-500 to-rose-500',
    green: 'from-green-500 via-emerald-500 to-teal-500',
    amber: 'from-amber-500 via-orange-500 to-red-500',
    rose: 'from-rose-500 via-pink-500 to-purple-500',
    teal: 'from-teal-500 via-cyan-500 to-blue-500',
    indigo: 'from-indigo-500 via-purple-500 to-pink-500'
  }

  // Tailles des composants
  const sizeClasses = {
    small: {
      card: 'p-3',
      icon: 'w-8 h-8 text-lg',
      title: 'text-sm font-bold',
      subtitle: 'text-xs',
      description: 'text-xs',
      button: 'px-3 py-1 text-xs'
    },
    medium: {
      card: 'p-4 lg:p-6',
      icon: 'w-12 h-12 lg:w-16 lg:h-16 text-2xl lg:text-3xl',
      title: 'text-lg lg:text-xl font-bold',
      subtitle: 'text-sm lg:text-base',
      description: 'text-sm lg:text-base',
      button: 'px-4 py-2 text-sm'
    },
    large: {
      card: 'p-6 lg:p-8',
      icon: 'w-16 h-16 lg:w-20 lg:h-20 text-3xl lg:text-4xl',
      title: 'text-xl lg:text-2xl font-bold',
      subtitle: 'text-base lg:text-lg',
      description: 'text-base lg:text-lg',
      button: 'px-6 py-3 text-base'
    }
  }

  const currentSize = sizeClasses[size] || sizeClasses.medium

  const handleClick = useCallback(() => {
    onClick?.()
  }, [onClick])

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation()
    onClick?.()
  }, [onClick])

  return (
    <div 
      className={`${styles.suggestionCard} ${className} group cursor-pointer`}
      onClick={handleClick}
      {...props}
    >
      {/* Gradient overlay */}
      <div className={`${styles.gradientOverlay} bg-gradient-to-br ${gradientStyles[gradient]} opacity-90`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          {badge}
        </div>
      )}
      
      {/* Contenu */}
      <div className={`${styles.cardContent} ${currentSize.card}`}>
        <div className="flex items-center space-x-3 mb-3 lg:mb-4">
          {/* Icône */}
          <div className={`${currentSize.icon} bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-white">{icon}</span>
          </div>
          
          {/* Titre et sous-titre */}
          <div>
            <h3 className={`${currentSize.title} text-white`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`${currentSize.subtitle} text-white/80`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Description (cachée sur mobile si size = small) */}
        {description && (
          <p className={`${currentSize.description} mb-4 lg:mb-6 leading-relaxed text-white/90 ${size === 'small' ? 'hidden lg:block' : ''}`}>
            {description}
          </p>
        )}
        
        {/* Action */}
        <div className="flex items-center justify-between">
          <div className={`${currentSize.subtitle} text-white/80 font-medium`}>
            {/* Optionnel: métadonnées */}
          </div>
          <button 
            onClick={handleButtonClick}
            className={`${currentSize.button} bg-gradient-to-r from-white/20 to-white/30 hover:from-white/30 hover:to-white/40 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  )
})

SuggestionCard.displayName = 'SuggestionCard'

export default SuggestionCard
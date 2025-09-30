import React, { memo, useCallback, useMemo } from 'react'
import styles from '../../styles/ChatInterface.module.css'
import { useTheme } from '../../contexts/ThemeContextSimple'
import SuggestionCard from '../ui/SuggestionCard'
import FilterButton from '../ui/FilterButton'

/**
 * Composant SuggestionsSidebar optimisé
 * Affiche les suggestions filtrées avec différentes catégories
 */
const SuggestionsSidebar = memo(({ 
  sidebarFilter,
  onFilterChange,
  onSuggestionClick,
  className = ''
}) => {
  const { isDarkMode } = useTheme()

  // Classes de thème simplifiées
  const themeClasses = {
    main: isDarkMode ? 'dark' : 'light',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900'
    }
  }

  // Données des suggestions mémorisées
  const suggestionsData = useMemo(() => ({
    events: [
      {
        id: 'beach-party',
        title: 'Beach Party',
        subtitle: '21 juin - 16h',
        description: 'Soirée exclusive sur la plage avec DJ international',
        icon: '🏖️',
        badge: '🎉 ÉVÉNEMENT',
        gradient: 'blue',
        category: 'events',
        action: 'Réserver pour la Beach Party'
      },
      {
        id: 'jazz-evening',
        title: 'Soirée Jazz',
        subtitle: '26 juin - 22h',
        description: 'Concert de jazz avec vue imprenable sur la mer',
        icon: '🎷',
        badge: '🎵 MUSIQUE',
        gradient: 'purple',
        category: 'events',
        action: 'Réserver pour la soirée jazz'
      },
      {
        id: 'gourmet-dinner',
        title: 'Dîner Gastronomique',
        subtitle: '28 juin - 20h',
        description: 'Menu dégustation avec chef étoilé Michelin',
        icon: '🍽️',
        badge: '⭐ SPONSORISÉ',
        gradient: 'green',
        category: 'events',
        action: 'Réserver le dîner gastronomique'
      }
    ],
    establishments: [
      {
        id: 'nobu-marbella',
        title: 'Nobu Marbella',
        subtitle: 'Restaurant Japonais Premium',
        description: 'Cuisine japonaise de luxe avec vue panoramique sur la mer Méditerranée',
        icon: '🍣',
        badge: '⭐ SPONSORISÉ',
        gradient: 'amber',
        category: 'establishments',
        metadata: '⭐ 4.9/5 • €€€€',
        action: 'Réserver une table chez Nobu'
      },
      {
        id: 'la-terraza',
        title: 'La Terraza del Mar',
        subtitle: 'Restaurant Méditerranéen',
        description: 'Ambiance méditerranéenne avec vue panoramique',
        icon: '🏖️',
        badge: null,
        gradient: 'teal',
        category: 'establishments',
        action: 'Réserver une table à La Terraza'
      },
      {
        id: 'el-lago',
        title: 'El Lago',
        subtitle: 'Restaurant Créatif',
        description: 'Cuisine créative avec vue sur le lac',
        icon: '🏨',
        badge: null,
        gradient: 'green',
        category: 'establishments',
        action: 'Réserver une table à El Lago'
      },
      {
        id: 'club-vip',
        title: 'Club VIP',
        subtitle: 'Nightclub Exclusif',
        description: 'Ambiance festive avec DJ internationaux',
        icon: '🍾',
        badge: null,
        gradient: 'rose',
        category: 'establishments',
        action: 'Réserver un accès VIP'
      }
    ],
    services: [
      {
        id: 'private-transport',
        title: 'Transport Privé',
        subtitle: 'Chauffeur VIP',
        description: 'Service de transport de luxe avec chauffeur professionnel',
        icon: '🚗',
        badge: '🚗 SERVICE',
        gradient: 'indigo',
        category: 'services',
        metadata: '🚗 VIP • 👨‍✈️ Chauffeur',
        action: 'Réserver un transport privé'
      },
      {
        id: 'concierge-24-7',
        title: 'Concierge 24/7',
        subtitle: 'Service Premium',
        description: 'Assistance personnalisée disponible 24h/24',
        icon: '🧳',
        badge: '⭐ SPONSORISÉ',
        gradient: 'teal',
        category: 'services',
        metadata: '🧳 24/7 • ⭐ Premium',
        action: 'Contacter le concierge'
      },
      {
        id: 'airport-transfer',
        title: 'Transfert Aéroport',
        subtitle: 'Service VIP',
        description: 'Transfert confortable depuis l\'aéroport',
        icon: '✈️',
        badge: null,
        gradient: 'blue',
        category: 'services',
        action: 'Réserver un transfert aéroport'
      },
      {
        id: 'home-spa',
        title: 'Spa à Domicile',
        subtitle: 'Relaxation Privée',
        description: 'Soins de luxe dans le confort de votre villa',
        icon: '💆',
        badge: null,
        gradient: 'rose',
        category: 'services',
        action: 'Réserver un spa à domicile'
      }
    ],
    luxury: [
      {
        id: 'private-helicopter',
        title: 'Hélicoptère Privé',
        subtitle: 'Tour panoramique',
        description: 'Vue aérienne exclusive de la Costa del Sol',
        icon: '🚁',
        badge: '💎 LUXE',
        gradient: 'amber',
        category: 'luxury',
        metadata: '🚁 VIP • 🌊 Vue mer',
        action: 'Réserver un hélicoptère'
      },
      {
        id: 'private-yacht',
        title: 'Yacht Privé',
        subtitle: 'Croisière VIP',
        description: 'Yacht de luxe avec équipage professionnel',
        icon: '🛥️',
        badge: '💎 EXCLUSIF',
        gradient: 'rose',
        category: 'luxury',
        metadata: '🛥️ Yacht • 🍾 Champagne',
        action: 'Réserver un yacht privé'
      },
      {
        id: 'private-golf',
        title: 'Golf Privé',
        subtitle: 'Terrain VIP',
        description: 'Accès exclusif aux meilleurs parcours de golf',
        icon: '🏆',
        badge: null,
        gradient: 'amber',
        category: 'luxury',
        action: 'Réserver un parcours de golf'
      }
    ]
  }), [])

  // Suggestions filtrées mémorisées
  const filteredSuggestions = useMemo(() => {
    if (sidebarFilter === 'all') {
      return [
        ...suggestionsData.events.slice(0, 2),
        ...suggestionsData.establishments.slice(0, 2),
        ...suggestionsData.services.slice(0, 2),
        ...suggestionsData.luxury.slice(0, 1)
      ]
    }
    return suggestionsData[sidebarFilter] || []
  }, [sidebarFilter, suggestionsData])

  // Handlers optimisés
  const handleFilterChange = useCallback((filter) => {
    onFilterChange?.(filter)
  }, [onFilterChange])

  const handleSuggestionClick = useCallback((suggestion) => {
    onSuggestionClick?.(suggestion.action || `En savoir plus sur ${suggestion.title}`)
  }, [onSuggestionClick])

  // Rendu des filtres
  const renderFilters = useCallback(() => (
    <div className="mb-4 lg:mb-8">
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <FilterButton
            isActive={sidebarFilter === 'all'}
            onClick={() => handleFilterChange('all')}
            variant="default"
          >
            🌟 Tout
          </FilterButton>
          <FilterButton
            isActive={sidebarFilter === 'events'}
            onClick={() => handleFilterChange('events')}
            variant="purple"
          >
            🎉 Événements
          </FilterButton>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FilterButton
            isActive={sidebarFilter === 'establishments'}
            onClick={() => handleFilterChange('establishments')}
            variant="green"
          >
            🍽️ Restaurants
          </FilterButton>
          <FilterButton
            isActive={sidebarFilter === 'services'}
            onClick={() => handleFilterChange('services')}
            variant="default"
          >
            ⭐ Services
          </FilterButton>
          <FilterButton
            isActive={sidebarFilter === 'luxury'}
            onClick={() => handleFilterChange('luxury')}
            variant="amber"
          >
            💎 Luxe
          </FilterButton>
        </div>
      </div>
    </div>
  ), [sidebarFilter, handleFilterChange])

  // Rendu des suggestions
  const renderSuggestions = useCallback(() => (
    <div className="space-y-4 lg:space-y-6">
      {filteredSuggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          title={suggestion.title}
          subtitle={suggestion.subtitle}
          description={suggestion.description}
          icon={suggestion.icon}
          badge={suggestion.badge}
          gradient={suggestion.gradient}
          size="medium"
          actionText="Réserver"
          onClick={() => handleSuggestionClick(suggestion)}
        />
      ))}
    </div>
  ), [filteredSuggestions, handleSuggestionClick])

  // Rendu des titres de section
  const getSectionTitle = useCallback(() => {
    const titles = {
      all: '💡 Suggestions Premium',
      events: '🎉 Événements du jour',
      establishments: '🍽️ Nos partenaires premium',
      services: '⭐ Services Exclusifs',
      luxury: '💎 Expériences de Luxe'
    }
    return titles[sidebarFilter] || titles.all
  }, [sidebarFilter])

  return (
    <div className={`${styles.suggestionsSidebar} ${styles.desktopOnly} ${themeClasses.main} ${className}`}>
      <div className="p-2 lg:p-6 pb-2 lg:pb-12">
        <h2 className={`text-sm lg:text-3xl font-bold mb-2 lg:mb-6 ${themeClasses.text.primary}`}>
          {getSectionTitle()}
        </h2>
        
        {renderFilters()}
        {renderSuggestions()}
        
        <div className="h-8" />
      </div>
    </div>
  )
})

SuggestionsSidebar.displayName = 'SuggestionsSidebar'

export default SuggestionsSidebar

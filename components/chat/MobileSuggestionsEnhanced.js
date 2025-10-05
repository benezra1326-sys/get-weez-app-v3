import React, { useState } from 'react'
import { Grid3x3, LayoutGrid, RectangleVertical, MapPin, Calendar, Utensils } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useRouter } from 'next/router'
import { luxuryEstablishments, luxuryServices, luxuryEvents } from '../../data/marbella-data'

/**
 * Suggestions améliorées pour mobile avec vrais établissements, services et événements
 * Affichage en bannières comme sur desktop
 */
export default function MobileSuggestionsEnhanced({ 
  establishments = [], 
  services = [], 
  events = [],
  onSuggestionClick 
}) {
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const [columns, setColumns] = useState(2)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'establishments', 'services', 'events', 'luxe'

  const getGridCols = () => {
    // Responsive grid comme sur desktop
    if (columns === 1) return 'grid-cols-1'
    if (columns === 2) return 'grid-cols-2'
    return 'grid-cols-2' // Par défaut 2 colonnes
  }

  // Sélectionner les données à afficher selon l'onglet actif
  const getData = () => {
    switch(activeTab) {
      case 'all': 
        // Mélanger tous les types - même logique que desktop
        const all = [
          ...establishments.slice(0, 3).map(e => ({...e, type: 'establishment'})),
          ...services.slice(0, 2).map(s => ({...s, type: 'service'})),
          ...events.slice(0, 2).map(ev => ({...ev, type: 'event'}))
        ]
        return all.slice(0, 8) // Plus d'éléments comme sur desktop
      case 'establishments': return establishments.slice(0, 8).map(e => ({...e, type: 'establishment'}))
      case 'services': return services.slice(0, 8).map(s => ({...s, type: 'service'}))
      case 'events': return events.slice(0, 8).map(ev => ({...ev, type: 'event'}))
      case 'luxe':
        // Utiliser les données de luxe dédiées + filtrer les existantes
        const luxeItems = [
          ...luxuryEstablishments.map(e => ({...e, type: 'establishment'})),
          ...luxuryServices.map(s => ({...s, type: 'service'})),
          ...luxuryEvents.map(ev => ({...ev, type: 'event'})),
          // Ajouter aussi les éléments luxe des données principales
          ...establishments.filter(e => 
            e.tags?.includes('luxe') || 
            e.price_level >= 4 || 
            e.name?.toLowerCase().includes('luxury') ||
            e.name?.toLowerCase().includes('premium') ||
            e.name?.toLowerCase().includes('vip')
          ).slice(0, 2).map(e => ({...e, type: 'establishment'})),
          ...services.filter(s => 
            s.tags?.includes('luxe') || 
            s.price_level >= 4 ||
            s.name?.toLowerCase().includes('luxury') ||
            s.name?.toLowerCase().includes('premium') ||
            s.name?.toLowerCase().includes('vip')
          ).slice(0, 2).map(s => ({...s, type: 'service'}))
        ]
        return luxeItems.slice(0, 8)
      default: return establishments.slice(0, 8).map(e => ({...e, type: 'establishment'}))
    }
  }

  const handleCardClick = (item) => {
    // Naviguer vers la page de détails selon le type
    const path = item.type === 'establishment'
      ? `/establishment/${item.id}`
      : item.type === 'service'
        ? `/service/${item.id}`
        : `/event/${item.id}`
    
    router.push(path)
  }

  const data = getData()

  return (
    <div className="w-full pb-6" style={{ maxWidth: '100vw', overflow: 'hidden' }}>
      {/* Tabs pour choisir la catégorie - 2 lignes */}
      <div className="grid grid-cols-3 gap-2 mb-4 px-4" style={{ 
        gridTemplateColumns: 'repeat(3, 1fr)'
      }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
            activeTab === 'all' ? 'scale-105' : ''
          }`}
          style={{
            background: activeTab === 'all'
              ? 'linear-gradient(135deg, #a855f7, #6366f1)'
              : isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            color: activeTab === 'all' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'all' ? '0 4px 12px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)' : 'none',
            border: activeTab === 'all' ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'
          }}
        >
          ✨ Tous
        </button>

        <button
          onClick={() => router.push('/establishments')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95`}
          style={{
            background: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            color: isDarkMode ? '#d1d5db' : '#4b5563',
          }}
        >
          🏨 Établis.
        </button>

        <button
          onClick={() => router.push('/services')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95`}
          style={{
            background: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            color: isDarkMode ? '#d1d5db' : '#4b5563',
          }}
        >
          🛍️ Services
        </button>

        <button
          onClick={() => router.push('/events')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95`}
          style={{
            background: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            color: isDarkMode ? '#d1d5db' : '#4b5563',
          }}
        >
          🎉 Événem.
        </button>

        <button
          onClick={() => setActiveTab('luxe')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
            activeTab === 'luxe' ? 'scale-105' : ''
          }`}
          style={{
            background: activeTab === 'luxe'
              ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
              : isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            color: activeTab === 'luxe' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'luxe' ? '0 4px 12px rgba(251, 191, 36, 0.5), 0 0 20px rgba(245, 158, 11, 0.3)' : 'none',
            border: activeTab === 'luxe' ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
            gridColumn: 'span 2'
          }}
        >
          👑 Luxe
        </button>
      </div>

      {/* Sélecteur de colonnes - Uniquement 1 ou 2 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setColumns(1)}
          className={`p-2 rounded-lg transition-all duration-300 ${columns === 1 ? 'scale-110' : ''}`}
          style={{
            background: columns === 1 
              ? 'linear-gradient(135deg, #a855f7, #6366f1)'
              : isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            boxShadow: columns === 1 ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none'
          }}
          title="1 colonne"
        >
          <RectangleVertical size={16} className={columns === 1 ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
        </button>

        <button
          onClick={() => setColumns(2)}
          className={`p-2 rounded-lg transition-all duration-300 ${columns === 2 ? 'scale-110' : ''}`}
          style={{
            background: columns === 2 
              ? 'linear-gradient(135deg, #a855f7, #6366f1)'
              : isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)',
            boxShadow: columns === 2 ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none'
          }}
          title="2 colonnes"
        >
          <LayoutGrid size={16} className={columns === 2 ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
        </button>
      </div>

      {/* Grille de bannières */}
      <div className={`grid ${getGridCols()} gap-4 px-4`}>
        {data.map((item) => (
          <button
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="uniform-banner group relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              height: columns === 1 ? '200px' : '180px',
              cursor: 'pointer'
            }}
          >
            {/* Image de fond */}
            <img 
              src={item.image_url || `https://images.unsplash.com/photo-1414235077-531286732f1a?w=600&h=400&fit=crop&q=80`}
              alt={item.name}
              className="banner-image"
            />
            
            {/* Overlay */}
            <div className="banner-overlay" />
            
            {/* Contenu */}
            <div className="banner-content">
              {/* Header avec badge sponsor si applicable */}
              <div className="banner-header">
                <div></div>
                {item.sponsored && (
                  <div className="banner-badge">
                    ⭐ SPONSORISÉ
                  </div>
                )}
              </div>
              
              {/* Titre et description avec avis et prix */}
              <div className="flex-1">
                <h3 className="banner-title" style={{ 
                  fontSize: columns === 1 ? '17px' : '15px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  marginBottom: '4px'
                }}>
                  {item.name}
                </h3>
                
                {/* Avis et prix */}
                <div className="flex items-center gap-2 mb-2">
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-white text-xs font-semibold">{item.rating}</span>
                    </div>
                  )}
                  {item.price_level && (
                    <div className="flex items-center">
                      <span className="text-green-400 text-xs font-bold">
                        {'€'.repeat(item.price_level)}
                      </span>
                      {item.price_level < 3 && (
                        <span className="text-gray-400 text-xs">
                          {'€'.repeat(3 - item.price_level)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {columns === 1 && (
                  <p className="banner-description" style={{
                    fontSize: '12px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                    lineHeight: '1.3'
                  }}>
                    {item.description?.substring(0, 50)}...
                  </p>
                )}
              </div>
              
              {/* Footer avec informations et bouton réserver centré */}
              <div className="banner-footer">
                <div className="flex flex-col items-center justify-center w-full gap-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-white/90">
                    {item.zone && (
                      <div className="flex items-center gap-1">
                        <MapPin size={11} />
                        <span>{item.zone}</span>
                      </div>
                    )}
                    {item.date && (
                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        <span>{new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    )}
                    {item.category && (
                      <div className="flex items-center gap-1">
                        <Utensils size={11} />
                        <span className="truncate max-w-[80px]">{item.category}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Bouton Réserver centré */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(item)
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    📅 Réserver
                  </button>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}


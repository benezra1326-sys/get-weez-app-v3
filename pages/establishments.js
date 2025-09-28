import { useState, useEffect } from 'react'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import EstablishmentList from '../components/establishments/EstablishmentList'
import RestaurantStyleFilter from '../components/establishments/RestaurantStyleFilter'
import { EstablishmentSearchBar } from '../components/ui/SearchBar'
import { useToast } from '../components/ui/Toast'
import { supabase } from '../lib/supabase'
import { establishments as staticEstablishments, restaurantStyles, establishmentStats } from '../data/marbella-data'

export default function Establishments({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [establishments, setEstablishments] = useState([])
  const [filteredEstablishments, setFilteredEstablishments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadEstablishments()
  }, [])

  const loadEstablishments = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .order('sponsored', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des établissements:', error)
        showToast('Erreur lors du chargement des établissements', 'error')
        // Fallback avec des données statiques enrichies
        setEstablishments(staticEstablishments)
        setFilteredEstablishments(staticEstablishments)
        setIsLoading(false)
        return
      }

      setEstablishments(data || [])
      setFilteredEstablishments(data || [])
    } catch (error) {
      console.error('Erreur:', error)
      // Fallback avec des données statiques
      setEstablishments(staticEstablishments)
      setFilteredEstablishments(staticEstablishments)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de recherche et filtrage
  const handleSearch = (query) => {
    setSearchQuery(query)
    filterEstablishments(query, selectedStyle)
  }

  const handleStyleChange = (styleKey) => {
    setSelectedStyle(styleKey)
    filterEstablishments(searchQuery, styleKey)
  }

  const filterEstablishments = (query, style) => {
    let filtered = establishments

    // Filtrage par style
    if (style && restaurantStyles[style]) {
      const styleRestaurantIds = restaurantStyles[style].restaurants
      filtered = filtered.filter(establishment =>
        styleRestaurantIds.includes(establishment.id)
      )
    }

    // Filtrage par recherche
    if (query && query.trim()) {
      filtered = filtered.filter(establishment =>
      establishment.name.toLowerCase().includes(query.toLowerCase()) ||
      establishment.description.toLowerCase().includes(query.toLowerCase()) ||
        establishment.address?.toLowerCase().includes(query.toLowerCase()) ||
        establishment.category?.toLowerCase().includes(query.toLowerCase()) ||
        establishment.specialties?.some(specialty =>
          specialty.toLowerCase().includes(query.toLowerCase())
        )
      )
    }

    setFilteredEstablishments(filtered)
  }

  const handleReserve = (establishment) => {
    console.log('Reserve clicked for:', establishment)
    showToast(`Réservation pour ${establishment.name}`, 'success')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          width: '100vw',
          margin: 0,
          padding: 0
        }}
      >
        {/* Header */}
      <Header 
        user={user} 
        setUser={setUser}
        toggleMobileMenu={toggleMobileMenu} 
        isMobileMenuOpen={isMobileMenuOpen} 
      />

        {/* Menu mobile */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        user={user} 
      />
      
        {/* Contenu principal */}
        <main 
          style={{ 
            flex: 1,
            overflowY: 'auto',
            backgroundColor: 'var(--color-bg-primary)',
            width: '100vw',
            height: 'calc(100vh - 8rem)',
            padding: 'var(--spacing-xl)'
          }}
        >
            {/* Header avec recherche */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gradient mb-4">Établissements</h1>
              <p className="text-gray-400 mb-6">Découvrez les meilleurs endroits de Marbella</p>
              
              <EstablishmentSearchBar 
                onSearch={handleSearch}
                className="max-w-2xl"
              />
            </div>

            {/* Filtre par style */}
            <RestaurantStyleFilter
              selectedStyle={selectedStyle}
              onSelectStyle={handleStyleChange}
            />

            <EstablishmentList 
              establishments={filteredEstablishments.length > 0 ? filteredEstablishments : establishments} 
              user={user} 
              onReserve={handleReserve}
              isLoading={isLoading}
            />
          </main>
      </div>
    </div>
  )
}
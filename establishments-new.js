import { useState } from 'react'
import Head from 'next/head'
import { MapPin, Star, Clock, Users, Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react'

export default function EstablishmentsPage() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'
  const [sortBy, setSortBy] = useState('rating') // 'rating', 'distance', 'price'
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const establishments = [
    {
      id: 1,
      name: 'Nobu Marbella',
      type: 'Restaurant',
      category: 'japonais',
      rating: 4.8,
      reviews: 1247,
      price: '€€€€',
      distance: '0.8 km',
      image: '/api/placeholder/400/250',
      description: 'Restaurant japonais premium avec vue sur la mer',
      specialties: ['Sushi', 'Sashimi', 'Wagyu'],
      openingHours: '19:00 - 23:00',
      location: 'Puerto Banús',
      features: ['Terrasse', 'Vue mer', 'Parking', 'WiFi'],
      sponsored: true
    },
    {
      id: 2,
      name: 'La Terraza del Mar',
      type: 'Restaurant',
      category: 'méditerranéen',
      rating: 4.6,
      reviews: 892,
      price: '€€€',
      distance: '1.2 km',
      image: '/api/placeholder/400/250',
      description: 'Cuisine méditerranéenne avec terrasse panoramique',
      specialties: ['Poisson frais', 'Tapas', 'Cocktails'],
      openingHours: '12:00 - 24:00',
      location: 'Playa de la Fontanilla',
      features: ['Terrasse', 'Vue mer', 'Bar', 'Musique live'],
      sponsored: false
    },
    {
      id: 3,
      name: 'Nikki Beach',
      type: 'Beach Club',
      category: 'plage',
      rating: 4.4,
      reviews: 2156,
      price: '€€€€',
      distance: '2.1 km',
      image: '/api/placeholder/400/250',
      description: 'Beach club exclusif avec piscine et ambiance festive',
      specialties: ['Plage privée', 'Piscine', 'DJ', 'Brunch'],
      openingHours: '10:00 - 02:00',
      location: 'Playa de la Fontanilla',
      features: ['Plage privée', 'Piscine', 'DJ', 'Parking', 'WiFi'],
      sponsored: true
    },
    {
      id: 4,
      name: 'Puente Romano Beach',
      type: 'Beach Club',
      category: 'plage',
      rating: 4.7,
      reviews: 1834,
      price: '€€€€',
      distance: '1.5 km',
      image: '/api/placeholder/400/250',
      description: 'Beach club de luxe dans un cadre paradisiaque',
      specialties: ['Transats VIP', 'Restaurant', 'Spa', 'Tennis'],
      openingHours: '09:00 - 20:00',
      location: 'Puerto Banús',
      features: ['Transats VIP', 'Restaurant', 'Spa', 'Tennis', 'Parking'],
      sponsored: false
    },
    {
      id: 5,
      name: 'Trocadero Arena',
      type: 'Beach Club',
      category: 'plage',
      rating: 4.3,
      reviews: 967,
      price: '€€€',
      distance: '3.2 km',
      image: '/api/placeholder/400/250',
      description: 'Plage calme et relaxante avec restaurant de qualité',
      specialties: ['Ambiance calme', 'Restaurant', 'Transats', 'Musique douce'],
      openingHours: '10:00 - 19:00',
      location: 'Playa de la Fontanilla',
      features: ['Ambiance calme', 'Restaurant', 'Transats', 'Parking'],
      sponsored: true
    },
    {
      id: 6,
      name: 'Olivia Valère',
      type: 'Restaurant',
      category: 'méditerranéen',
      rating: 4.5,
      reviews: 743,
      price: '€€€€',
      distance: '1.8 km',
      image: '/api/placeholder/400/250',
      description: 'Restaurant gastronomique avec jardin tropical',
      specialties: ['Cuisine créative', 'Jardin tropical', 'Vins', 'Desserts'],
      openingHours: '20:00 - 23:30',
      location: 'Golden Mile',
      features: ['Jardin tropical', 'Terrasse', 'Cave à vins', 'Parking'],
      sponsored: false
    }
  ]

  const filteredAndSorted = establishments
    .filter(establishment => {
      const matchesFilter = filter === 'all' || establishment.category === filter
      const matchesSearch = establishment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           establishment.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance)
        case 'price':
          const priceOrder = { '€€€€': 4, '€€€': 3, '€€': 2, '€': 1 }
          return priceOrder[a.price] - priceOrder[b.price]
        default:
          return 0
      }
    })

  const getCategoryColor = (category) => {
    const colors = {
      japonais: 'from-red-500 to-orange-600',
      méditerranéen: 'from-blue-500 to-teal-600',
      plage: 'from-cyan-500 to-blue-600',
      italien: 'from-green-500 to-emerald-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ))
  }

  return (
    <>
      <Head>
        <title>Établissements - Get Weez Marbella</title>
        <meta name="description" content="Découvrez les meilleurs établissements à Marbella" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <span className="text-white font-bold text-xl">Get Weez</span>
                </div>
                
                <nav className="hidden md:flex space-x-6">
                  <a href="/" className="text-gray-300 hover:text-white transition-colors">Accueil</a>
                  <a href="/establishments" className="text-purple-400 font-medium">Établissements</a>
                  <a href="/events" className="text-gray-300 hover:text-white transition-colors">Événements</a>
                  <a href="/account" className="text-gray-300 hover:text-white transition-colors">Compte</a>
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                  Connexion
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Inscription
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Établissements à Marbella</h1>
            <p className="text-gray-300 text-lg">Découvrez les meilleures adresses de la Costa del Sol</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un établissement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilter('japonais')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'japonais' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🍣 Japonais
                </button>
                <button
                  onClick={() => setFilter('méditerranéen')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'méditerranéen' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🐟 Méditerranéen
                </button>
                <button
                  onClick={() => setFilter('plage')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'plage' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🏖️ Plage
                </button>
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 space-y-4 sm:space-y-0">
              {/* Sort */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="rating">Note</option>
                  <option value="distance">Distance</option>
                  <option value="price">Prix</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                    viewMode === 'grid' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>Grille</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                    viewMode === 'list' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Liste</span>
                </button>
              </div>
            </div>
          </div>

          {/* Establishments Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map(establishment => (
                <div
                  key={establishment.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-colors group"
                >
                  {/* Establishment Image */}
                  <div className={`h-48 bg-gradient-to-r ${getCategoryColor(establishment.category)} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {establishment.sponsored && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                        Sponsorisé
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-white text-sm font-medium">{establishment.price}</span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-1">{establishment.name}</h3>
                      <p className="text-white/80 text-sm">{establishment.type}</p>
                    </div>
                  </div>

                  {/* Establishment Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(establishment.rating)}
                        <span className="text-white ml-2">{establishment.rating}</span>
                        <span className="text-gray-400 text-sm">({establishment.reviews})</span>
                      </div>
                      <div className="text-gray-400 text-sm">{establishment.distance}</div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{establishment.description}</p>

                    <div className="flex items-center space-x-1 text-gray-400 text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{establishment.location}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-gray-400 text-sm mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{establishment.openingHours}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {establishment.features.slice(0, 3).map(feature => (
                        <span
                          key={feature}
                          className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors group-hover:shadow-lg group-hover:shadow-purple-500/25">
                      Réserver maintenant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredAndSorted.map(establishment => (
                <div
                  key={establishment.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:border-purple-500 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className={`w-full lg:w-64 h-40 bg-gradient-to-r ${getCategoryColor(establishment.category)} rounded-lg relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      {establishment.sponsored && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                          Sponsorisé
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold text-xl mb-1">{establishment.name}</h3>
                          <p className="text-gray-300 mb-2">{establishment.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            {renderStars(establishment.rating)}
                            <span className="text-white ml-2">{establishment.rating}</span>
                          </div>
                          <div className="text-purple-400 font-medium">{establishment.price}</div>
                          <div className="text-gray-400 text-sm">{establishment.distance}</div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-4 lg:mb-0">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{establishment.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{establishment.openingHours}</span>
                          </div>
                        </div>

                        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                          Réserver maintenant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

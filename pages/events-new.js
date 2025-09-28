import { useState } from 'react'
import Head from 'next/head'
import { Calendar, Clock, MapPin, Users, Filter, Grid, List } from 'lucide-react'

export default function EventsPage() {
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' ou 'banner'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filter, setFilter] = useState('all')

  const events = [
    {
      id: 1,
      title: 'Beach Party Exclusive',
      date: '2024-06-21',
      time: '16:00',
      location: 'Nikki Beach Marbella',
      category: 'party',
      image: '/api/placeholder/400/200',
      description: 'Soirée exclusive sur la plage avec DJ international',
      price: '€85',
      capacity: '150 personnes',
      attendees: 89
    },
    {
      id: 2,
      title: 'Soirée Jazz Intime',
      date: '2024-06-26',
      time: '22:00',
      location: 'La Terraza del Mar',
      category: 'music',
      image: '/api/placeholder/400/200',
      description: 'Concert de jazz avec vue imprenable sur la mer',
      price: '€65',
      capacity: '80 personnes',
      attendees: 45
    },
    {
      id: 3,
      title: 'Dîner Gastronomique',
      date: '2024-06-25',
      time: '20:00',
      location: 'Nobu Marbella',
      category: 'dining',
      image: '/api/placeholder/400/200',
      description: 'Menu dégustation avec les meilleurs chefs',
      price: '€120',
      capacity: '60 personnes',
      attendees: 38
    },
    {
      id: 4,
      title: 'Sunset Yoga',
      date: '2024-06-28',
      time: '19:00',
      location: 'Puente Romano Beach',
      category: 'wellness',
      image: '/api/placeholder/400/200',
      description: 'Séance de yoga au coucher du soleil',
      price: '€35',
      capacity: '30 personnes',
      attendees: 22
    }
  ]

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.category === filter
  )

  const getCategoryColor = (category) => {
    const colors = {
      party: 'from-pink-500 to-purple-600',
      music: 'from-blue-500 to-indigo-600',
      dining: 'from-orange-500 to-red-600',
      wellness: 'from-green-500 to-teal-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      party: '🎉',
      music: '🎵',
      dining: '🍽️',
      wellness: '🧘'
    }
    return icons[category] || '📅'
  }

  return (
    <>
      <Head>
        <title>Événements - Get Weez Marbella</title>
        <meta name="description" content="Découvrez les meilleurs événements à Marbella" />
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
                  <a href="/establishments" className="text-gray-300 hover:text-white transition-colors">Établissements</a>
                  <a href="/events" className="text-purple-400 font-medium">Événements</a>
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
            <h1 className="text-4xl font-bold text-white mb-4">Événements à Marbella</h1>
            <p className="text-gray-300 text-lg">Découvrez les expériences exclusives qui vous attendent</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            {/* Filters */}
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
                onClick={() => setFilter('party')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'party' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🎉 Fêtes
              </button>
              <button
                onClick={() => setFilter('music')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'music' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🎵 Musique
              </button>
              <button
                onClick={() => setFilter('dining')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'dining' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🍽️ Gastronomie
              </button>
              <button
                onClick={() => setFilter('wellness')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'wellness' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🧘 Bien-être
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  viewMode === 'calendar' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendrier</span>
              </button>
              <button
                onClick={() => setViewMode('banner')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  viewMode === 'banner' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Bannières</span>
              </button>
            </div>
          </div>

          {/* Events Content */}
          {viewMode === 'calendar' ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Calendrier des événements</h2>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-4 mb-6">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="text-center text-gray-400 font-medium py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {Array.from({ length: 30 }, (_, i) => {
                  const date = new Date(2024, 5, i + 1) // Juin 2024
                  const dayEvents = events.filter(event => event.date === date.toISOString().split('T')[0])
                  
                  return (
                    <div
                      key={i}
                      className={`min-h-[80px] p-2 border border-gray-600 rounded-lg ${
                        dayEvents.length > 0 ? 'bg-purple-900/30 border-purple-500' : 'bg-gray-700/30'
                      }`}
                    >
                      <div className="text-white font-medium mb-1">{i + 1}</div>
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded mb-1 bg-gradient-to-r ${getCategoryColor(event.category)} text-white truncate`}
                        >
                          {getCategoryIcon(event.category)} {event.title}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Banner View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-colors group"
                >
                  {/* Event Image */}
                  <div className={`h-48 bg-gradient-to-r ${getCategoryColor(event.category)} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">{event.price}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-1">{event.title}</h3>
                      <p className="text-white/80 text-sm">{event.description}</p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-gray-300 text-sm mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-gray-300 text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees}/{event.capacity}</span>
                      </div>
                      <div className="text-purple-400 font-medium">
                        {event.price}
                      </div>
                    </div>

                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors group-hover:shadow-lg group-hover:shadow-purple-500/25">
                      Réserver maintenant
                    </button>
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

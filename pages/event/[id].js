import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import HeaderGliitz from '../../components/layout/HeaderGliitz'
import MobileMenu from '../../components/layout/MobileMenu'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { Star, MapPin, Clock, Calendar, Users, ArrowLeft, Euro } from 'lucide-react'

// Données statiques des événements (à importer depuis le fichier de données)
const staticEvents = [
  {
    "id": 1,
    "name": "Sunset Beach Party",
    "description": "DJ set exclusif, cocktails premium et feu au coucher du soleil. Une soirée inoubliable sur la plage d'Ocean Club Marbella.",
    "date": "2024-09-15T20:00:00Z",
    "establishment_id": 4,
    "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80",
    "location": "Ocean Club Marbella, Puerto Banús",
    "price": 85,
    "capacity": 200,
    "type": "party",
    "rating": 4.8,
    "reviews": 142
  },
  // ... autres événements
]

export default function EventDetail({ user, setUser }) {
  const router = useRouter()
  const { id } = router.query
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isDarkMode, isLoaded } = useTheme()

  useEffect(() => {
    if (id) {
      // Chercher l'événement dans les données statiques
      const foundEvent = staticEvents.find(e => e.id === parseInt(id))
      if (foundEvent) {
        setEvent(foundEvent)
      }
      setLoading(false)
    }
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Événement non trouvé</h1>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', minHeight: '100vh' }}>
      {/* Header */}
      <HeaderGliitz 
        user={user} 
        setUser={setUser}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Menu mobile */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        user={user} 
      />

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button 
          onClick={() => router.back()}
          className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>

        {/* Image principale avec overlay */}
        {event.image_url && (
          <div className="relative mb-8 rounded-2xl overflow-hidden">
            <img 
              src={event.image_url} 
              alt={event.name}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Badge type d'événement */}
            <div className="absolute top-4 right-4">
              <span className="px-4 py-2 rounded-full text-sm font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                  boxShadow: '0 4px 20px rgba(192, 192, 192, 0.4)'
                }}
              >
                {event.type}
              </span>
            </div>
          </div>
        )}

        {/* Informations de l'événement */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {event.name}
              </h1>
              
              {/* Rating */}
              {event.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {event.rating}
                    </span>
                  </div>
                  {event.reviews && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ({event.reviews} avis)
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {event.description}
              </p>

              {/* Informations supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Date et heure */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-start space-x-3">
                    <Calendar size={24} className="text-gray-500 mt-1" />
                    <div>
                      <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Date et heure
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Capacité */}
                {event.capacity && (
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-start space-x-3">
                      <Users size={24} className="text-gray-500 mt-1" />
                      <div>
                        <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Capacité
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {event.capacity} personnes max
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar avec informations de réservation */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-2xl sticky top-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
              style={{
                border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.2)'}`,
                boxShadow: '0 8px 32px rgba(192, 192, 192, 0.15)'
              }}
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Informations
              </h3>
              
              {/* Prix */}
              {event.price && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Euro size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Prix par personne
                    </span>
                  </div>
                  <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {event.price}€
                  </span>
                </div>
              )}

              {/* Localisation */}
              {event.location && (
                <div className="flex items-start space-x-3 mb-6">
                  <MapPin size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {event.location}
                  </span>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="space-y-3">
                <button 
                  onClick={() => router.push({
                    pathname: '/',
                    query: { 
                      message: `Je souhaite réserver pour l'événement ${event.name}. Pouvez-vous m'aider ?`
                    }
                  })}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                  style={{
                    boxShadow: '0 4px 20px rgba(192, 192, 192, 0.4)'
                  }}
                >
                  Réserver maintenant
                </button>
                <button 
                  onClick={() => router.push({
                    pathname: '/',
                    query: { 
                      message: `J'aimerais avoir plus d'informations sur ${event.name}`
                    }
                  })}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    isDarkMode 
                      ? 'border border-gray-500 text-gray-400 hover:bg-gray-500/10'
                      : 'border border-gray-600 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Plus d'informations
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


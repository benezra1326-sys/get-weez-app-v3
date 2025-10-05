import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/layout/header'
import MobileMenu from '../../components/layout/MobileMenu'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { establishments as staticEstablishments } from '../../data/marbella-data'
import { Star, MapPin, Clock, Phone, Mail, Globe, ArrowLeft, Utensils, Wifi, Car } from 'lucide-react'

export default function EstablishmentDetail({ user, setUser }) {
  const router = useRouter()
  const { id } = router.query
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [establishment, setEstablishment] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = false
  
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
  } catch (error) {
    console.warn('ThemeProvider not available, using default theme')
  }

  useEffect(() => {
    if (id) {
      // Chercher l'établissement dans les données statiques
      const foundEstablishment = staticEstablishments.find(e => e.id === parseInt(id))
      if (foundEstablishment) {
        setEstablishment(foundEstablishment)
      }
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!establishment) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Établissement non trouvé</h1>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
      <Header 
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

        {/* Image principale */}
        {establishment.image_url && (
          <div className="mb-8">
            <img 
              src={establishment.image_url} 
              alt={establishment.name}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Informations de l'établissement */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {establishment.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  <Star size={20} className="text-yellow-400 fill-current" />
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {establishment.rating}
                  </span>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({establishment.reviews} avis)
                </span>
              </div>

              {/* Type d'établissement */}
              <div className="flex items-center space-x-2 mb-4">
                <Utensils size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {establishment.type}
                </span>
              </div>

              {/* Description */}
              <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {establishment.description}
              </p>

              {/* Spécialités */}
              {establishment.specialties && (
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Spécialités
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {establishment.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode 
                            ? 'bg-gray-800 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {establishment.services && (
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Services
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {establishment.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar avec informations de contact */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Informations
              </h3>
              
              {/* Prix moyen */}
              {establishment.price_range && (
                <div className="mb-4">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {establishment.price_range}
                  </span>
                </div>
              )}

              {/* Localisation */}
              {establishment.address && (
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {establishment.address}
                  </span>
                </div>
              )}

              {/* Horaires */}
              {establishment.hours && (
                <div className="flex items-start space-x-3 mb-4">
                  <Clock size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {establishment.hours}
                  </span>
                </div>
              )}

              {/* Téléphone - Retiré pour confidentialité */}

              {/* Email */}
              {establishment.email && (
                <div className="flex items-start space-x-3 mb-4">
                  <Mail size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <a 
                    href={`mailto:${establishment.email}`}
                    className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    {establishment.email}
                  </a>
                </div>
              )}

              {/* Site web */}
              {establishment.website && (
                <div className="flex items-start space-x-3 mb-6">
                  <Globe size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <a 
                    href={establishment.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    Site web
                  </a>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                  Réserver une table
                </button>
                <button className="w-full border border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300">
                  Contacter
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/layout/header'
import MobileMenu from '../../components/layout/MobileMenu'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { services as staticServices } from '../../data/services-data'
import { Star, MapPin, Clock, Phone, Mail, Globe, ArrowLeft } from 'lucide-react'

export default function ServiceDetail({ user, setUser }) {
  const router = useRouter()
  const { id } = router.query
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [service, setService] = useState(null)
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
      // Chercher le service dans les données statiques
      const foundService = staticServices.find(s => s.id === parseInt(id))
      if (foundService) {
        setService(foundService)
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

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Service non trouvé</h1>
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
        {service.image_url && (
          <div className="mb-8">
            <img 
              src={service.image_url} 
              alt={service.name}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Informations du service */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {service.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  <Star size={20} className="text-yellow-400 fill-current" />
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.rating}
                  </span>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({service.reviews} avis)
                </span>
              </div>

              {/* Description */}
              <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {service.description}
              </p>

              {/* Détails supplémentaires */}
              {service.details && (
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Détails
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {service.details}
                  </p>
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
              
              {/* Prix */}
              {service.price && (
                <div className="mb-4">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.price}
                  </span>
                </div>
              )}

              {/* Localisation */}
              {service.location && (
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {service.location}
                  </span>
                </div>
              )}

              {/* Horaires */}
              {service.hours && (
                <div className="flex items-start space-x-3 mb-4">
                  <Clock size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {service.hours}
                  </span>
                </div>
              )}

              {/* Téléphone - Retiré pour confidentialité */}

              {/* Email */}
              {service.email && (
                <div className="flex items-start space-x-3 mb-4">
                  <Mail size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <a 
                    href={`mailto:${service.email}`}
                    className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    {service.email}
                  </a>
                </div>
              )}

              {/* Site web */}
              {service.website && (
                <div className="flex items-start space-x-3 mb-6">
                  <Globe size={20} className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <a 
                    href={service.website}
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
                  Réserver maintenant
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

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Star, DollarSign, Clock, Calendar, Phone, ExternalLink, Music, Headphones } from 'lucide-react'
import V3Sidebar from '../../../components/layout/V3Sidebar'
import { fetchEstablishments, fetchEvents, fetchServices } from '../../../lib/supabaseData'
import { useTheme } from '../../../contexts/ThemeContextSimple'

// Données statiques d'événements (fallback)
const STATIC_EVENTS = [
  {
    id: 1,
    title: "Sunset Beach Party",
    name: "Sunset Beach Party",
    description: "DJ set exclusif avec vue sur mer, cocktails premium et ambiance lounge",
    date: "2025-12-15T20:00:00Z",
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    location: "Ocean Club Marbella",
    price: 85,
    category: "Beach Club",
    lat: 36.5101,
    lng: -4.8824
  },
  {
    id: 2,
    title: "Mediterranean Wine & Tapas",
    name: "Mediterranean Wine & Tapas",
    description: "Dégustation de vins méditerranéens accompagnée de tapas gastronomiques",
    date: "2025-12-20T19:30:00Z",
    image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
    location: "La Terraza del Mar",
    price: 65,
    category: "Gastronomie",
    lat: 36.5123,
    lng: -4.8890
  },
  {
    id: 3,
    title: "Yacht VIP Night",
    name: "Yacht VIP Night",
    description: "Soirée exclusive sur yacht privé avec DJ et champagne",
    date: "2025-12-22T21:00:00Z",
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    location: "Puerto Banús",
    price: 150,
    category: "VIP",
    lat: 36.4879,
    lng: -4.9522
  },
  {
    id: 4,
    title: "Rooftop DJ Session",
    name: "Rooftop DJ Session",
    description: "Session DJ sur rooftop avec vue panoramique sur Marbella",
    date: "2025-12-25T22:00:00Z",
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    location: "Sky Lounge",
    price: 45,
    category: "Nightlife",
    lat: 36.5145,
    lng: -4.8795
  },
  {
    id: 5,
    title: "Private Chef Experience",
    name: "Private Chef Experience",
    description: "Dîner privé préparé par un chef étoilé Michelin",
    date: "2025-12-28T20:00:00Z",
    image_url: "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=800",
    location: "Villa Privée",
    price: 200,
    category: "Premium",
    lat: 36.5080,
    lng: -4.9100
  },
  {
    id: 6,
    title: "New Year's Eve Gala",
    name: "New Year's Eve Gala",
    description: "Célébrez le Nouvel An avec style dans le club le plus exclusif",
    date: "2025-12-31T21:00:00Z",
    image_url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800",
    location: "Le Club Premium",
    price: 250,
    category: "Spécial",
    lat: 36.5067,
    lng: -4.8950
  }
]

// Données statiques de services (fallback)
const STATIC_SERVICES = [
  {
    id: 1,
    name: 'Transport VIP',
    title: 'Transport VIP',
    category: 'Transport',
    description: 'Voiture avec chauffeur, yacht privé, hélicoptère - Service de transport de luxe 24/7',
    price: 'Sur devis',
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
  },
  {
    id: 2,
    name: 'Conciergerie Premium',
    title: 'Conciergerie Premium',
    category: 'Services',
    description: 'Réservations, organisation d\'événements, assistance 24/7 - Votre concierge personnel',
    price: 'À partir de 200€/jour',
    image_url: 'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=800'
  },
  {
    id: 3,
    name: 'Location Yacht',
    title: 'Location Yacht',
    category: 'Transport',
    description: 'Yachts de luxe avec équipage professionnel pour des journées inoubliables en mer',
    price: 'À partir de 5000€/jour',
    image_url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'
  },
  {
    id: 4,
    name: 'Villas de Luxe',
    title: 'Villas de Luxe',
    category: 'Hébergement',
    description: 'Villas privées avec services premium, piscine, vue mer et personnel dédié',
    price: 'À partir de 1500€/nuit',
    image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
  }
]

export default function ProductPage({ user, setUser }) {
  const router = useRouter()
  const { type, id } = router.query
  const { isDarkMode } = useTheme()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      if (!type || !id) return

      try {
        console.log('🔍 Chargement produit:', { type, id })
        let data = []
        const numericId = parseInt(id)
        
        if (type === 'establishment') {
          data = await fetchEstablishments()
          // Si Supabase échoue, pas de fallback pour establishments
        } else if (type === 'event') {
          // Utiliser les données statiques pour les événements
          data = STATIC_EVENTS
        } else if (type === 'service') {
          // Utiliser les données statiques pour les services
          data = STATIC_SERVICES
        }

        console.log('📊 Données récupérées:', data.length, 'éléments')
        const foundProduct = data.find(item => item.id === numericId || item.id === id)
        console.log('🎯 Produit trouvé:', foundProduct ? 'OUI' : 'NON')
        
        if (!foundProduct) {
          console.log('❌ Produit non trouvé. IDs disponibles:', data.map(item => item.id).slice(0, 10))
        }
        
        setProduct(foundProduct)
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [type, id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  const isEstablishment = product.category || product.rating
  const isEvent = product.date
  const isService = !isEstablishment && !isEvent

  // Détecter si c'est un événement avec DJ
  const isDJEvent = isEvent && (
    product.title?.toLowerCase().includes('dj') || 
    product.description?.toLowerCase().includes('dj') ||
    product.title?.toLowerCase().includes('soirée') ||
    product.title?.toLowerCase().includes('night')
  )

  const handleReserve = () => {
    const productName = product.name || product.title
    const message = isEvent 
      ? `Je souhaite réserver pour l'événement "${productName}"`
      : `Je souhaite réserver ${productName}`
    
    // Rediriger vers le chat avec le message pré-rempli
    router.push(`/?reservation=${encodeURIComponent(message)}`)
  }

  return (
    <div className="min-h-screen" style={{ background: isDarkMode ? '#0B0B0C' : '#FFFFFF' }}>
      {/* Header fixe en haut sans sidebar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 border-b" style={{ 
        background: isDarkMode ? 'rgba(11, 11, 12, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105 z-10"
            style={{
              background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
            }}
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Retour</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm px-3 py-1 rounded-full" style={{
              background: isDarkMode ? 'rgba(167,199,197,0.2)' : 'rgba(167,199,197,0.1)',
              color: isDarkMode ? '#A7C7C5' : '#5A8B89',
              fontFamily: 'Poppins, sans-serif'
            }}>
              {isEstablishment ? 'Établissement' : isEvent ? 'Événement' : 'Service'}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu principal avec padding-top pour le header fixe */}
      <div className="max-w-6xl mx-auto p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(192,192,192,0.3)'}`,
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Image */}
          {product.image_url && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name || product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Contenu */}
          <div className="p-6 md:p-8">
            {/* Titre */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
              fontFamily: 'Playfair Display, serif'
            }}>
              {product.name || product.title}
            </h1>

            {/* Description */}
            {product.description && (
              <p className="text-lg mb-6 leading-relaxed" style={{
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                fontFamily: 'Poppins, sans-serif'
              }}>
                {product.description}
              </p>
            )}

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Établissements */}
              {isEstablishment && (
                <>
                  {product.rating && (
                    <div className="flex items-center gap-3">
                      <Star size={20} className="text-yellow-400" />
                      <span style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
                        {product.rating}/5
                        {product.review_count && ` (${product.review_count} avis)`}
                      </span>
                    </div>
                  )}
                  
                  {product.price_level && (
                    <div className="flex items-center gap-3">
                      <DollarSign size={20} style={{ color: '#A7C7C5' }} />
                      <span style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
                        {'€'.repeat(product.price_level)}
                      </span>
                    </div>
                  )}
                  
                  {product.address && (
                    <div className="flex items-center gap-3">
                      <MapPin size={20} style={{ color: '#A7C7C5' }} />
                      <span style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
                        {product.address}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Événements */}
              {isEvent && (
                <>
                  {product.date && (
                    <div className="flex items-center gap-3">
                      <Calendar size={20} style={{ color: '#A7C7C5' }} />
                      <span style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
                        {new Date(product.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {product.location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={20} style={{ color: '#A7C7C5' }} />
                      <span style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
                        {product.location}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Services */}
              {isService && (
                <>
                  {product.price && (
                    <div className="flex items-center gap-3">
                      <DollarSign size={20} style={{ color: '#A7C7C5' }} />
                      <span style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
                        {product.price}
                      </span>
                    </div>
                  )}
                  
                  {product.category && (
                    <div className="flex items-center gap-3">
                      <Clock size={20} style={{ color: '#A7C7C5' }} />
                      <span style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
                        {product.category}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Boutons Spotify/Apple Music pour événements DJ */}
            {isDJEvent && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Découvrir le DJ
                </h3>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
                    style={{
                      background: '#1DB954',
                      color: '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <Music size={18} />
                    <span>Écouter sur Spotify</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
                    style={{
                      background: '#FA243C',
                      color: '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <Headphones size={18} />
                    <span>Apple Music</span>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Bouton Réserver */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReserve}
              className="w-full py-4 rounded-xl font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, #A7C7C5, #9DB4C0)',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 4px 15px rgba(167, 199, 197, 0.4)'
              }}
            >
              Réserver
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

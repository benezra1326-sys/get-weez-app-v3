import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Star, DollarSign, Clock, Calendar, Phone, ExternalLink, Music, Headphones } from 'lucide-react'
import V3Sidebar from '../../../components/layout/V3Sidebar'
import { fetchEstablishments, fetchEvents, fetchServices } from '../../../lib/supabaseData'
import { useTheme } from '../../../contexts/ThemeContextSimple'

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
        
        if (type === 'establishment') {
          data = await fetchEstablishments()
        } else if (type === 'event') {
          data = await fetchEvents()
        } else if (type === 'service') {
          data = await fetchServices()
        }

        console.log('📊 Données récupérées:', data.length, 'éléments')
        const foundProduct = data.find(item => item.id === parseInt(id))
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
    const message = isEvent 
      ? `Je souhaite réserver pour l'événement "${product.title}"`
      : `Je souhaite réserver ${product.name || product.title}`
    router.push(`/?msg=${encodeURIComponent(message)}`)
  }

  return (
    <div className="min-h-screen" style={{ background: isDarkMode ? '#0B0B0C' : '#FFFFFF' }}>
      <V3Sidebar
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Header */}
      <div className="sticky top-0 z-40 p-4 border-b" style={{ 
        background: isDarkMode ? 'rgba(11, 11, 12, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
            style={{
              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
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

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto p-4 py-8">
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

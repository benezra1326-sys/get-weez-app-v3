import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Star, DollarSign, Clock, Calendar, Phone, ExternalLink, Music, Headphones } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

/**
 * Popup pour afficher une fiche produit/établissement/événement
 * S'affiche au centre de l'écran quand l'utilisateur clique sur une proposition dans le chat
 */
export default function ProductPopupChat({ product, onClose, onReserve }) {
  const { isDarkMode } = useTheme()

  if (!product) return null

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start md:items-center justify-center overflow-y-auto"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          padding: '0'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-2xl my-4 md:my-8 mx-4 md:mx-auto overflow-y-auto"
          style={{
            background: isDarkMode 
              ? 'rgba(11, 11, 12, 0.98)' 
              : 'rgba(255, 255, 255, 0.98)',
            border: `1px solid ${isDarkMode 
              ? 'rgba(192, 192, 192, 0.2)' 
              : 'rgba(192, 192, 192, 0.3)'}`,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            maxHeight: 'calc(100vh - 32px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all"
            style={{
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
              border: `1px solid ${isDarkMode 
                ? 'rgba(192, 192, 192, 0.2)' 
                : 'rgba(192, 192, 192, 0.3)'}`,
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            <X size={20} />
          </button>

          {/* Image Header */}
          {product.image_url && (
            <div 
              className="w-full h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url(${product.image_url})`,
                borderRadius: '1.5rem 1.5rem 0 0'
              }}
            />
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                fontWeight: '700',
                color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                marginBottom: '12px'
              }}
            >
              {product.name}
            </h2>

            {/* Category/Type */}
            {product.category && (
              <div
                className="inline-block px-3 py-1 rounded-full mb-4"
                style={{
                  background: isDarkMode 
                    ? 'rgba(192, 192, 192, 0.15)' 
                    : 'rgba(167, 199, 197, 0.2)',
                  color: isDarkMode ? '#C0C0C0' : '#5A8B89',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                {product.category}
              </div>
            )}

            {/* Rating (Establishments) */}
            {isEstablishment && product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <Star 
                  size={20} 
                  style={{ 
                    color: '#C0C0C0', 
                    fill: '#C0C0C0' 
                  }} 
                />
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: isDarkMode ? '#C0C0C0' : '#0B0B0C'
                  }}
                >
                  {product.rating}/5
                </span>
                {product.reviews && (
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.85rem',
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    ({product.reviews} avis)
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1rem',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}
            >
              {product.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Location */}
              {product.zone && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} style={{ color: '#C0C0C0', marginTop: '2px' }} />
                  <div>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.85rem',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        marginBottom: '2px'
                      }}
                    >
                      Localisation
                    </p>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.95rem',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontWeight: '500'
                      }}
                    >
                      {product.zone}
                    </p>
                  </div>
                </div>
              )}

              {/* Price Level */}
              {product.price_level && (
                <div className="flex items-start gap-3">
                  <DollarSign size={18} style={{ color: '#C0C0C0', marginTop: '2px' }} />
                  <div>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.85rem',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        marginBottom: '2px'
                      }}
                    >
                      Prix
                    </p>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.95rem',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontWeight: '500'
                      }}
                    >
                      {product.price_level}
                    </p>
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {product.opening_hours && (
                <div className="flex items-start gap-3">
                  <Clock size={18} style={{ color: '#C0C0C0', marginTop: '2px' }} />
                  <div>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.85rem',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        marginBottom: '2px'
                      }}
                    >
                      Horaires
                    </p>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.95rem',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontWeight: '500'
                      }}
                    >
                      {product.opening_hours}
                    </p>
                  </div>
                </div>
              )}

              {/* Event Date */}
              {isEvent && product.date && (
                <div className="flex items-start gap-3">
                  <Calendar size={18} style={{ color: '#C0C0C0', marginTop: '2px' }} />
                  <div>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.85rem',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        marginBottom: '2px'
                      }}
                    >
                      Date
                    </p>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.95rem',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontWeight: '500'
                      }}
                    >
                      {new Date(product.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone - MASQUÉ pour confidentialité */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (onReserve) {
                    const message = isEvent 
                      ? `Je souhaite réserver pour l'événement "${product.title}"`
                      : `Je souhaite réserver ${product.name || product.title}`
                    onReserve(message)
                  }
                  onClose()
                }}
                className="flex-1 py-3 rounded-xl font-semibold transition-all"
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}


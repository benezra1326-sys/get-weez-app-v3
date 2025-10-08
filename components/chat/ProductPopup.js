import React, { useState, useEffect } from 'react'
import { X, Star, MapPin, Clock, Users, Phone, Globe, Heart, Share2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const ProductPopup = ({ item, onClose, type = 'establishment' }) => {
  const { isDarkMode } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleReserve = () => {
    // Rediriger vers le chat avec un message de réservation
    const message = `Je souhaite réserver ${item.name}`
    window.open(`/?msg=${encodeURIComponent(message)}`, '_blank')
  }

  const renderEstablishmentContent = () => (
    <div className="space-y-6">
      {/* Header avec image */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden">
        <img
          src={item.image || '/images/placeholder.jpg'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Titre et rating */}
        <div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            {item.name}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  style={{
                    color: i < (item.rating || 0) ? '#FCD34D' : '#D1D5DB',
                    fill: i < (item.rating || 0) ? '#FCD34D' : 'none'
                  }}
                />
              ))}
            </div>
            <span 
              className="text-sm font-medium"
              style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
            >
              {item.rating}/5 ({item.review_count || 0} avis)
            </span>
          </div>
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: '#C0C0C0' }} />
            <span 
              className="text-sm"
              style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
            >
              {item.location || 'Marbella'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: '#C0C0C0' }} />
            <span 
              className="text-sm"
              style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
            >
              {item.opening_hours || 'Ouvert'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}
          >
            Description
          </h3>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            {item.description || 'Un établissement exceptionnel qui offre une expérience unique à Marbella.'}
          </p>
        </div>

        {/* Spécialités */}
        {item.specialties && (
          <div>
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}
            >
              Spécialités
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(0, 0, 0, 0.08)',
                    color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                    border: isDarkMode ? '1px solid rgba(192, 192, 192, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleReserve}
            className="flex-1 py-3 rounded-xl font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(192, 192, 192, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(192, 192, 192, 0.3)'
            }}
          >
            Réserver via Gliitz
          </button>
          <button
            className="p-3 rounded-xl transition-all"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            <Heart size={20} />
          </button>
          <button
            className="p-3 rounded-xl transition-all"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderEventContent = () => (
    <div className="space-y-6">
      {/* Header avec image */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden">
        <img
          src={item.image || '/images/event-placeholder.jpg'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Titre et date */}
        <div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            {item.title}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: '#C0C0C0' }} />
              <span 
                className="text-sm font-medium"
                style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
              >
                {item.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: '#C0C0C0' }} />
              <span 
                className="text-sm"
                style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
              >
                {item.capacity}
              </span>
            </div>
          </div>
        </div>

        {/* Prix */}
        <div className="flex items-center gap-2">
          <span 
            className="text-2xl font-bold"
            style={{ color: '#C0C0C0' }}
          >
            {item.price}
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}
          >
            À propos de cet événement
          </h3>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            {item.description}
          </p>
        </div>

        {/* Inclus */}
        {item.includes && (
          <div>
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}
            >
              Inclus
            </h3>
            <ul className="space-y-1">
              {item.includes.map((include, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#C0C0C0' }}
                  />
                  {include}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleReserve}
            className="flex-1 py-3 rounded-xl font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(192, 192, 192, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(192, 192, 192, 0.3)'
            }}
          >
            Réserver cet événement
          </button>
          <button
            className="p-3 rounded-xl transition-all"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderServiceContent = () => (
    <div className="space-y-6">
      {/* Header avec icône */}
      <div className="relative h-32 rounded-t-2xl flex items-center justify-center"
           style={{
             background: isDarkMode 
               ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.1), rgba(168, 168, 168, 0.05))'
               : 'linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(168, 168, 168, 0.1))'
           }}>
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
            boxShadow: '0 8px 32px rgba(192, 192, 192, 0.3)'
          }}
        >
          <Star size={32} style={{ color: '#FFFFFF' }} />
        </div>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full"
          style={{
            background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)',
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Titre */}
        <div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            {item.name}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
          >
            Service premium Gliitz
          </p>
        </div>

        {/* Description */}
        <div>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            {item.description}
          </p>
        </div>

        {/* Fonctionnalités */}
        {item.features && (
          <div>
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}
            >
              Fonctionnalités
            </h3>
            <ul className="space-y-1">
              {item.features.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#C0C0C0' }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleReserve}
            className="flex-1 py-3 rounded-xl font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(192, 192, 192, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(192, 192, 192, 0.3)'
            }}
          >
            Demander ce service
          </button>
          <button
            className="p-3 rounded-xl transition-all"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        background: 'rgba(0, 0, 0, 0.6)', 
        backdropFilter: 'blur(8px)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: isDarkMode ? '#1a1a1a' : '#FFFFFF',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {type === 'establishment' && renderEstablishmentContent()}
        {type === 'event' && renderEventContent()}
        {type === 'service' && renderServiceContent()}
      </div>
    </div>
  )
}

export default ProductPopup

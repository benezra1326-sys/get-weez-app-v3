import { Star, Heart, MessageCircle, Building, MapPin } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function EstablishmentCard({ establishment, user, onReserve, onSendMessage }) {
  // Vérification de sécurité pour useTheme
  let isDarkMode = false
  
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
  } catch (error) {
    console.warn('ThemeProvider not available, using default theme')
  }
  
  // Fonction pour gérer la réservation
  const handleReserve = onReserve || (() => {
    console.log('Fonction de réservation non fournie pour:', establishment.name)
  })
  
  // Fonction pour envoyer un message au chat
  const handleInfo = () => {
    if (onSendMessage) {
      onSendMessage(`Plus d'informations sur ${establishment.name}`)
      // Scroll vers le chat après l'envoi du message
      setTimeout(() => {
        const chatElement = document.querySelector('.chat-interface, .mobile-chat-container, .chat-area')
        if (chatElement) {
          chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      console.log('Fonction de message non fournie pour:', establishment.name)
    }
  }

  // Fonction pour naviguer vers la page de détails
  const handleCardClick = (e) => {
    // Ne pas naviguer si on clique sur un bouton
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
      window.location.href = `/establishment/${establishment.id}`
    }
  }
  
  return (
    <div 
      className="uniform-banner"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Image de fond */}
      {establishment.image_url && (
            <img 
              src={establishment.image_url} 
              alt={establishment.name} 
              className="banner-image"
              style={{
                display: 'block',
                verticalAlign: 'top',
                lineHeight: 0,
                fontSize: 0
              }}
            />
      )}
      
      {/* Overlay */}
      <div className="banner-overlay"></div>
      
      {/* Contenu */}
      <div className="banner-content">
        {/* Header avec badge */}
        <div className="banner-header">
          <div></div>
          {establishment.sponsored && (
            <div className="banner-badge" style={{ 
              padding: '4px 8px',
              fontSize: '10px',
              borderRadius: '8px',
              minWidth: 'auto',
              width: 'fit-content'
            }}>
              ⭐ VIP
            </div>
          )}
        </div>
        
        {/* Titre et description */}
        <div style={{ marginBottom: '12px' }}>
          <h3 className="banner-title" style={{ 
            fontSize: '18px', 
            fontWeight: '700',
            marginBottom: '6px',
            lineHeight: '1.2'
          }}>{establishment.name}</h3>
          <p className="banner-description" style={{
            fontSize: '13px',
            lineHeight: '1.4',
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{establishment.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', opacity: 0.9 }}>
            <MapPin size={12} />
            <span>{establishment.zone || establishment.location || 'Marbella'}</span>
          </div>
        </div>
        
        {/* Footer avec rating et boutons */}
        <div className="banner-footer">
          <div className="banner-rating">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span>{establishment.rating}</span>
            </div>
          
          <div className="banner-buttons">
                <button 
              className="banner-button secondary"
              onClick={handleInfo}
            >
              Plus d'infos
            </button>
            <button 
              className="banner-button primary"
              onClick={() => handleReserve(establishment)}
            >
              Réserver
            </button>
        </div>
        </div>
      </div>
    </div>
  )
}
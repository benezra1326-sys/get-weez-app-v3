import { Star, Heart, MessageCircle, MapPin } from 'lucide-react'

export default function ServiceCard({ service, user, onReserve, onRequest, onSendMessage }) {
  // Utiliser onRequest si onReserve n'est pas fourni
  const handleReserve = onReserve || onRequest || (() => {
    console.log('Fonction de réservation non fournie pour:', service.name)
  })
  
  // Fonction pour envoyer un message au chat
  const handleInfo = () => {
    if (onSendMessage) {
      onSendMessage(`Plus d'informations sur ${service.name}`)
    } else {
      console.log('Fonction de message non fournie pour:', service.name)
    }
  }
  // Fonction pour naviguer vers la page de détails
  const handleCardClick = (e) => {
    // Ne pas naviguer si on clique sur un bouton
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
      window.location.href = `/service/${service.id}`
    }
  }

  return (
    <div 
      className="uniform-banner"
      onClick={() => window.location.href = `/service/${service.id}`}
      style={{ cursor: 'pointer' }}
    >
      {/* Image de fond */}
      {service.image_url && (
        <img 
          src={service.image_url} 
          alt={service.name}
          className="banner-image"
        />
      )}
      
      {/* Overlay */}
      <div className="banner-overlay"></div>
      
      {/* Contenu */}
      <div className="banner-content">
        {/* Header avec badge */}
        <div className="banner-header">
          <div></div>
          {service.sponsored && (
            <div className="banner-badge">
              ⭐ SPONSORISÉ
            </div>
          )}
        </div>
        
        {/* Titre et description */}
        <div>
          <h3 className="banner-title">{service.name}</h3>
          <p className="banner-description">{service.description}</p>
        </div>
        
        {/* Footer avec rating et boutons */}
        <div className="banner-footer">
          <div className="banner-rating">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span>{service.rating}</span>
          </div>
          
          <div className="banner-buttons">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                const message = `Je souhaite réserver ${service.name}`
                window.location.href = `/?message=${encodeURIComponent(message)}`
              }}
              className="banner-button primary"
            >
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
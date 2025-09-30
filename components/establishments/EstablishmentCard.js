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
    } else {
      console.log('Fonction de message non fournie pour:', establishment.name)
    }
  }
  
  return (
    <div className="uniform-banner">
      {/* Image de fond */}
      {establishment.image_url && (
            <img 
              src={establishment.image_url} 
              alt={establishment.name} 
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
          {establishment.sponsored && (
            <div className="banner-badge">
              ⭐ SPONSORISÉ
            </div>
          )}
        </div>
        
        {/* Titre et description */}
        <div>
          <h3 className="banner-title">{establishment.name}</h3>
          <p className="banner-description">{establishment.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
            <MapPin size={14} />
            <span>{establishment.zone}, Marbella</span>
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
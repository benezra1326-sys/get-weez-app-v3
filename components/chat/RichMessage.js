import { useState } from 'react'
import { useRouter } from 'next/router'
import { ExternalLink, FileText, Image as ImageIcon, MapPin, Calendar, Star } from 'lucide-react'
import ProductPopupChat from './ProductPopupChat'
import { searchEstablishment, searchEvent, searchService } from '../../lib/supabaseData'

export default function RichMessage({ content, isDarkMode, onSendMessage }) {
  const [imageError, setImageError] = useState({})
  const [popupData, setPopupData] = useState(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [showProductPopup, setShowProductPopup] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const router = useRouter()

  // Gérer le clic sur un nom d'établissement/événement/service
  const handleProductClick = async (name) => {
    console.log('🖱️ CLIC SUR:', name)
    
    // NETTOYER le nom - supprimer les astérisques et descriptions
    let cleanName = name
      .replace(/\*\*/g, '') // Supprimer les astérisques
      .replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗]/g, '') // Supprimer emojis
      .trim()
    
    // Si le texte contient ":" prendre seulement ce qui est avant
    if (cleanName.includes(':')) {
      cleanName = cleanName.split(':')[0].trim()
    }
    
    // Si le texte contient "-" prendre seulement ce qui est avant  
    if (cleanName.includes(' - ')) {
      cleanName = cleanName.split(' - ')[0].trim()
    }
    
    // Prendre seulement les 3 premiers mots maximum
    const words = cleanName.split(' ')
    if (words.length > 3) {
      cleanName = words.slice(0, 3).join(' ')
    }
    
    console.log('🧹 NOM NETTOYÉ:', cleanName)
    setIsLoadingProduct(true)
    
    // Rechercher dans les établissements
    console.log('🔍 Recherche dans establishments...')
    let product = await searchEstablishment(cleanName)
    let productType = 'establishment'
    console.log('📊 Résultat establishment:', product ? 'TROUVÉ' : 'NON TROUVÉ')
    
    // Si pas trouvé, chercher dans les événements
    if (!product) {
      console.log('🔍 Recherche dans events...')
      product = await searchEvent(cleanName)
      productType = 'event'
      console.log('📊 Résultat event:', product ? 'TROUVÉ' : 'NON TROUVÉ')
    }
    
    // Si toujours pas trouvé, chercher dans les services
    if (!product) {
      console.log('🔍 Recherche dans services...')
      product = await searchService(cleanName)
      productType = 'service'
      console.log('📊 Résultat service:', product ? 'TROUVÉ' : 'NON TROUVÉ')
    }
    
    setIsLoadingProduct(false)
    
    if (product) {
      // Vérifier que l'ID est valide
      const productId = product.id || product.ID
      if (!productId) {
        console.error('❌ ID produit manquant:', product)
        alert('Erreur: ID produit manquant')
        return
      }
      console.log('✅ PRODUIT TROUVÉ:', { name: product.name || product.title, id: productId, type: productType })
      console.log('🔗 REDIRECTION VERS:', `/product/${productType}/${productId}`)
      
      // Rediriger vers une vraie page produit - Utiliser window.location pour garantir la navigation
      const targetUrl = `/product/${productType}/${productId}`
      console.log('🚀 Navigation vers:', targetUrl)
      
      if (typeof window !== 'undefined') {
        window.location.href = targetUrl
      } else {
        // Fallback avec router si window n'est pas disponible
        router.push(targetUrl)
      }
    } else {
      console.error('❌ PRODUIT NON TROUVÉ:', name)
      // Au lieu d'alerter, déclencher une recherche dans le chat
      if (onProductClick) {
        onProductClick(name)
      }
    }
  }

  // Fonction pour formater le texte avec structure visuelle
  const formatStructuredText = (text) => {
    // Diviser le texte en paragraphes et puces
    const lines = text.split('\n').filter(line => line.trim())
    const elements = []
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Titre de journée (### Jour 1, ### Jour 2, etc.)
      if (trimmedLine.match(/^###\s*(Jour|Day|Día)\s*\d+/i)) {
        elements.push({
          type: 'day-title',
          content: trimmedLine.replace(/^###\s*/, ''),
          key: `day-${index}`
        })
      }
      // Titre principal (commence par "Voici" ou "Découvrez" etc.)
      else if (trimmedLine.match(/^(Voici|Découvrez|Pour continuer|Je te recommande|I recommend|Te recomiendo)/i)) {
        elements.push({
          type: 'title',
          content: trimmedLine,
          key: `title-${index}`
        })
      }
      // Éléments avec puces (• ou -)
      else if (trimmedLine.match(/^[•\-\*]\s+/)) {
        const content = trimmedLine.replace(/^[•\-\*]\s+/, '')
        
        // Vérifier si c'est un titre de journée (Matin, Après-midi, Soir)
        if (content.match(/^\*\*(Matin|Après-midi|Soir|Midi|Après-midi)\*\*/i)) {
          elements.push({
            type: 'time-title',
            content: content,
            key: `time-${index}`
          })
        } else {
          const parts = content.split(/\s*-\s*/)
          
          elements.push({
            type: 'item',
            title: parts[0]?.trim(),
            description: parts[1]?.trim(),
            key: `item-${index}`
          })
        }
      }
      // Question finale
      else if (trimmedLine.match(/^(Souhaitez-vous|Que souhaitez-vous|Quelle est|Would you|¿Qué|¿Te gustaría)/i)) {
        elements.push({
          type: 'question',
          content: trimmedLine,
          key: `question-${index}`
        })
      }
      // Texte normal
      else if (trimmedLine) {
        elements.push({
          type: 'text',
          content: trimmedLine,
          key: `text-${index}`
        })
      }
    })
    
    return elements
  }

  // Fonction pour parser le contenu markdown et le convertir en JSX
  const parseContent = (text) => {
    const elements = []
    let currentText = text
    let key = 0

    // Remplacer les images markdown ![alt](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    currentText = currentText.replace(imageRegex, (match, alt, url) => {
      const imageKey = `img-${key++}`
      elements.push({
        type: 'image',
        key: imageKey,
        alt,
        url
      })
      return `__IMAGE_${imageKey}__`
    })

    // Remplacer les liens markdown [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    currentText = currentText.replace(linkRegex, (match, text, url) => {
      const linkKey = `link-${key++}`
      const isPDF = url.includes('.pdf')
      elements.push({
        type: 'link',
        key: linkKey,
        text,
        url,
        isPDF
      })
      return `__LINK_${linkKey}__`
    })

    // Split le texte et réinsérer les éléments
    const parts = currentText.split(/(__(?:IMAGE|LINK)_[^_]+__)/g)
    
    return parts.map((part, idx) => {
      if (part.startsWith('__IMAGE_')) {
        const imageKey = part.replace(/^__IMAGE_|__$/g, '')
        const image = elements.find(e => e.key === imageKey)
        if (!image || imageError[imageKey]) return null
        
        return (
          <div key={idx} className="my-4 rounded-2xl overflow-hidden">
            <img 
              src={image.url}
              alt={image.alt}
              className="w-full max-h-64 object-cover"
              onError={() => setImageError(prev => ({ ...prev, [imageKey]: true }))}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            />
            {image.alt && (
              <p 
                className="text-xs mt-2 text-center"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  fontStyle: 'italic'
                }}
              >
                {image.alt}
              </p>
            )}
          </div>
        )
      }
      
      if (part.startsWith('__LINK_')) {
        const linkKey = part.replace(/^__LINK_|__$/g, '')
        const link = elements.find(e => e.key === linkKey)
        if (!link) return null
        
        return (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all mx-1"
            style={{
              background: isDarkMode 
                ? 'rgba(167,199,197,0.15)' 
                : 'rgba(167,199,197,0.2)',
              border: '1px solid rgba(167,199,197,0.4)',
              color: '#A7C7C5',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(167,199,197,0.3)'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(167,199,197,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(167,199,197,0.15)' 
                : 'rgba(167,199,197,0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {link.isPDF ? <FileText size={14} /> : <ExternalLink size={14} />}
            <span>{link.text}</span>
          </a>
        )
      }
      
      // Texte normal avec formatage markdown basique - Noms en gras CLIQUABLES
      return (
        <span key={idx}>
          {part.split('**').map((segment, i) => {
            if (i % 2 === 0) {
              return segment
            } else {
              // Les noms en gras sont cliquables
              return (
                <strong 
                  key={i} 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProductClick(segment)
                  }}
                  style={{ 
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#A7C7C5',
                    borderBottom: '2px dotted rgba(167, 199, 197, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    e.currentTarget.style.borderBottomColor = isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    e.currentTarget.style.borderBottomWidth = '2px'
                    e.currentTarget.style.borderBottomStyle = 'solid'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#A7C7C5'
                    e.currentTarget.style.borderBottomColor = 'rgba(167, 199, 197, 0.5)'
                    e.currentTarget.style.borderBottomStyle = 'dotted'
                  }}
                >
                  {segment}
                </strong>
              )
            }
          })}
        </span>
      )
    })
  }

  // Fonction pour gérer les clics sur les liens
  const handleLinkClick = (link) => {
    // Détecter le type de contenu basé sur l'URL
    let type = 'establishment'
    let mockData = {}

    if (link.url.includes('/event/')) {
      type = 'event'
      const eventId = link.url.split('/event/')[1]
      mockData = {
        title: link.text,
        date: '26 juin - 22h',
        price: 'À partir de 80€',
        capacity: '50 personnes',
        description: 'Un événement exclusif avec une ambiance unique.',
        includes: ['Entrée', 'Boissons', 'Snacks', 'Service VIP'],
        image: '/images/event-placeholder.jpg'
      }
    } else if (link.url.includes('/service/')) {
      type = 'service'
      const serviceId = link.url.split('/service/')[1]
      mockData = {
        name: link.text,
        description: 'Service premium Gliitz pour une expérience exceptionnelle.',
        features: ['Service 24/7', 'Réservations prioritaires', 'Conciergerie personnalisée', 'Support VIP']
      }
    } else {
      type = 'establishment'
      const establishmentId = link.url.split('/establishment/')[1]
      mockData = {
        name: link.text,
        rating: 4.8,
        review_count: 156,
        location: 'Marbella',
        description: 'Un établissement exceptionnel qui offre une expérience unique à Marbella.',
        specialties: ['Cuisine gastronomique', 'Ambiance raffinée', 'Service premium'],
        image: '/images/restaurant-placeholder.jpg'
      }
    }

    setPopupData({ type, item: mockData })
  }

  // Fonction pour afficher les détails du produit dans un popup
  const showProductDetails = (title, description) => {
    const productData = {
      name: title,
      description: description || 'Découvrez cette expérience unique à Marbella',
      rating: 4.5,
      price: 'Prix sur demande',
      location: 'Marbella, Espagne',
      image: '/api/placeholder/400/300',
      category: 'experience'
    }
    setSelectedProduct(productData)
    setShowProductPopup(true)
  }

  return (
    <div className="rich-message-content">
      {formatStructuredText(content).map((element) => {
        switch (element.type) {
          case 'day-title':
            return (
              <div key={element.key} className="mb-6 mt-8">
                <div 
                  className="relative overflow-hidden rounded-2xl p-6"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(192, 192, 192, 0.05) 100%)' 
                      : 'linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0.1) 100%)',
                    border: isDarkMode 
                      ? '1px solid rgba(192, 192, 192, 0.3)' 
                      : '1px solid rgba(192, 192, 192, 0.4)',
                    backdropFilter: 'blur(15px)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                      style={{
                        background: isDarkMode 
                          ? 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)' 
                          : 'linear-gradient(135deg, #0B0B0C 0%, #333333 100%)',
                        color: isDarkMode ? '#0B0B0C' : '#FFFFFF',
                        boxShadow: isDarkMode 
                          ? '0 4px 15px rgba(192, 192, 192, 0.3)' 
                          : '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      📅
                    </div>
                    <div>
                      <h2 
                        className="text-xl font-bold"
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                          textShadow: isDarkMode 
                            ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
                            : '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {element.content}
                      </h2>
                      <p 
                        className="text-sm opacity-70 mt-1"
                        style={{
                          color: isDarkMode ? '#C0C0C0' : '#666666'
                        }}
                      >
                        Votre programme personnalisé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          
          case 'title':
            return (
              <div key={element.key} className="mb-4">
                <h3 
                  className="text-lg font-semibold"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {element.content}
                </h3>
              </div>
            )
          
          case 'time-title':
            return (
              <div key={element.key} className="mb-3">
                <div 
                  className="p-3 rounded-lg flex items-center gap-3"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(192, 192, 192, 0.1)' 
                      : 'rgba(192, 192, 192, 0.15)',
                    border: isDarkMode 
                      ? '1px solid rgba(192, 192, 192, 0.2)' 
                      : '1px solid rgba(192, 192, 192, 0.3)'
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                      color: isDarkMode ? '#0B0B0C' : '#FFFFFF'
                    }}
                  >
                    🕐
                  </div>
                  <span 
                    className="font-semibold"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                      fontSize: '15px'
                    }}
                  >
                    {element.content.replace(/\*\*/g, '')}
                  </span>
                </div>
              </div>
            )
          
          case 'item':
            return (
              <div key={element.key} className="mb-3">
                <div 
                  className="p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] hover:shadow-lg group"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(192, 192, 192, 0.08)' 
                      : 'rgba(192, 192, 192, 0.12)',
                    border: isDarkMode 
                      ? '1px solid rgba(192, 192, 192, 0.2)' 
                      : '1px solid rgba(192, 192, 192, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode 
                      ? 'rgba(192, 192, 192, 0.15)' 
                      : 'rgba(192, 192, 192, 0.2)'
                    e.currentTarget.style.border = isDarkMode 
                      ? '1px solid rgba(192, 192, 192, 0.4)' 
                      : '1px solid rgba(192, 192, 192, 0.5)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode 
                      ? 'rgba(192, 192, 192, 0.08)' 
                      : 'rgba(192, 192, 192, 0.12)'
                    e.currentTarget.style.border = isDarkMode 
                      ? '1px solid rgba(192, 192, 192, 0.2)' 
                      : '1px solid rgba(192, 192, 192, 0.3)'
                    e.currentTarget.style.transform = 'translateY(0px)'
                  }}
                  onClick={() => {
                    // Afficher les détails du produit dans un popup au lieu de naviguer
                    showProductDetails(element.title, element.description)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        background: isDarkMode 
                          ? 'rgba(192, 192, 192, 0.15)' 
                          : 'rgba(192, 192, 192, 0.2)',
                        border: isDarkMode 
                          ? '1px solid rgba(192, 192, 192, 0.3)' 
                          : '1px solid rgba(192, 192, 192, 0.4)'
                      }}
                    >
                      <img 
                        src={(() => {
                          if (!element.title) return '/images/placeholders/establishment.jpg'
                          const lowerTitle = element.title.toLowerCase()
                          
                          // Images spécifiques pour les établissements connus
                          if (lowerTitle.includes('buddha beach')) return 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100&h=100&fit=crop'
                          if (lowerTitle.includes('el lago')) return 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=100&h=100&fit=crop'
                          if (lowerTitle.includes('coya')) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop'
                          if (lowerTitle.includes('marbella club')) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop'
                          if (lowerTitle.includes('amare beach')) return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop'
                          if (lowerTitle.includes('olivia valere')) return 'https://images.unsplash.com/photo-1571266028243-eef72e0e8e6c?w=100&h=100&fit=crop'
                          if (lowerTitle.includes('sky lounge')) return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop'
                          if (lowerTitle.includes('pangea')) return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop'
                          
                          // Images par catégorie
                          if (lowerTitle.includes('restaurant') || lowerTitle.includes('dîner') || lowerTitle.includes('déjeuner') || lowerTitle.includes('cuisine')) {
                            return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('spa') || lowerTitle.includes('massage') || lowerTitle.includes('relaxation')) {
                            return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('plage') || lowerTitle.includes('beach') || lowerTitle.includes('mer')) {
                            return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('hotel') || lowerTitle.includes('hôtel') || lowerTitle.includes('hébergement')) {
                            return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('activité') || lowerTitle.includes('excursion') || lowerTitle.includes('tour')) {
                            return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('bar') || lowerTitle.includes('cocktail') || lowerTitle.includes('boisson')) {
                            return 'https://images.unsplash.com/photo-1571266028243-eef72e0e8e6c?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('club') || lowerTitle.includes('nightlife') || lowerTitle.includes('soirée')) {
                            return 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('sport') || lowerTitle.includes('golf') || lowerTitle.includes('tennis')) {
                            return 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('culture') || lowerTitle.includes('musée') || lowerTitle.includes('art')) {
                            return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
                          }
                          if (lowerTitle.includes('transport') || lowerTitle.includes('voiture') || lowerTitle.includes('taxi')) {
                            return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop'
                          }
                          
                          // Image par défaut
                          return 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100&h=100&fit=crop'
                        })()}
                        alt={element.title}
                        className="w-full h-full object-cover rounded-lg"
                        style={{
                          filter: isDarkMode ? 'brightness(0.8) contrast(1.1)' : 'brightness(1) contrast(1)'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 
                        className="font-semibold mb-1"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                          fontSize: '15px'
                        }}
                      >
                        {element.title}
                      </h4>
                      {element.description && (
                        <p 
                          className="text-sm leading-relaxed"
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                          }}
                        >
                          {element.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          
          case 'question':
            return (
              <div key={element.key} className="mt-6 p-4 rounded-xl" style={{
                background: isDarkMode 
                  ? 'rgba(167, 199, 197, 0.1)' 
                  : 'rgba(167, 199, 197, 0.15)',
                border: '1px solid rgba(167, 199, 197, 0.3)'
              }}>
                <p 
                  className="text-center font-medium"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? '#A7C7C5' : '#5A8B89',
                    fontSize: '15px'
                  }}
                >
                  {element.content}
                </p>
              </div>
            )
          
          case 'text':
            return (
              <p 
                key={element.key} 
                className="mb-3 leading-relaxed"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
                }}
              >
                {element.content}
              </p>
            )
          
          default:
            return null
        }
      })}
      
      {/* Popup pour les détails du produit */}
      {showProductPopup && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProductPopup(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDarkMode 
                ? 'rgba(11, 11, 12, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: isDarkMode 
                ? '1px solid rgba(192, 192, 192, 0.2)' 
                : '1px solid rgba(192, 192, 192, 0.3)'
            }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {selectedProduct.name}
                </h3>
                <button
                  onClick={() => setShowProductPopup(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Image */}
              <div className="mb-4">
                <div 
                  className="w-full h-48 rounded-xl flex items-center justify-center text-4xl"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(192, 192, 192, 0.1)' 
                      : 'rgba(192, 192, 192, 0.15)',
                    border: isDarkMode 
                      ? '1px solid rgba(192, 192, 192, 0.2)' 
                      : '1px solid rgba(192, 192, 192, 0.3)'
                  }}
                >
                  🏖️
                </div>
              </div>

              {/* Description */}
              <p 
                className="mb-4 leading-relaxed"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? '#C0C0C0' : '#666666'
                }}
              >
                {selectedProduct.description}
              </p>

              {/* Infos */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span 
                    style={{
                      color: isDarkMode ? '#C0C0C0' : '#666666'
                    }}
                  >
                    {selectedProduct.rating}/5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">📍</span>
                  <span 
                    style={{
                      color: isDarkMode ? '#C0C0C0' : '#666666'
                    }}
                  >
                    {selectedProduct.location}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (onSendMessage) {
                      // Message direct de réservation
                      onSendMessage(`Je veux réserver ${selectedProduct.name} pour ce soir à 20h pour 2 personnes au nom de Monsieur Dupont`)
                      setShowProductPopup(false)
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))',
                    color: '#FFFFFF',
                    border: '1px solid rgba(167,199,197,0.5)'
                  }}
                >
                  Réserver
                </button>
                <button
                  onClick={() => {
                    if (onSendMessage) {
                      onSendMessage(`Plus d'informations sur ${selectedProduct.name}`)
                      setShowProductPopup(false)
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'transparent',
                    border: isDarkMode 
                      ? '2px solid #C0C0C0' 
                      : '2px solid #0B0B0C',
                    color: isDarkMode ? '#C0C0C0' : '#0B0B0C'
                  }}
                >
                  Plus d'infos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}


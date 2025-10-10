import { useState } from 'react'
import { useRouter } from 'next/router'
import { ExternalLink, FileText, Image as ImageIcon, MapPin, Calendar, Star } from 'lucide-react'
import ProductPopupChat from './ProductPopupChat'
import { searchEstablishment, searchEvent, searchService } from '../../lib/supabaseData'

export default function RichMessage({ content, isDarkMode, onSendMessage }) {
  const [imageError, setImageError] = useState({})
  const [popupData, setPopupData] = useState(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
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
      
      // Titre principal (commence par "Voici" ou "Découvrez" etc.)
      if (trimmedLine.match(/^(Voici|Découvrez|Pour continuer|Je te recommande|I recommend|Te recomiendo)/i)) {
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

  return (
    <div className="rich-message-content">
      {formatStructuredText(content).map((element) => {
        switch (element.type) {
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
                  className="p-4 rounded-xl transition-all cursor-pointer hover:scale-[1.02]"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(192, 192, 192, 0.08)' 
                      : 'rgba(192, 192, 192, 0.12)',
                    border: isDarkMode 
                      ? '1px solid rgba(192, 192, 192, 0.2)' 
                      : '1px solid rgba(192, 192, 192, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={() => {
                    // Rechercher le produit réel dans Supabase
                    handleProductClick(element.title)
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
                      {(() => {
                        if (!element.title) return '🏢'
                        const lowerTitle = element.title.toLowerCase()
                        if (lowerTitle.includes('restaurant') || lowerTitle.includes('dîner') || lowerTitle.includes('déjeuner') || lowerTitle.includes('cuisine')) return '🍽️'
                        if (lowerTitle.includes('spa') || lowerTitle.includes('massage') || lowerTitle.includes('relaxation')) return '🧖‍♀️'
                        if (lowerTitle.includes('plage') || lowerTitle.includes('beach') || lowerTitle.includes('mer')) return '🏖️'
                        if (lowerTitle.includes('hotel') || lowerTitle.includes('hôtel') || lowerTitle.includes('hébergement')) return '🏨'
                        if (lowerTitle.includes('activité') || lowerTitle.includes('excursion') || lowerTitle.includes('tour')) return '🎯'
                        if (lowerTitle.includes('bar') || lowerTitle.includes('cocktail') || lowerTitle.includes('boisson')) return '🍸'
                        if (lowerTitle.includes('shopping') || lowerTitle.includes('boutique') || lowerTitle.includes('magasin')) return '🛍️'
                        if (lowerTitle.includes('sport') || lowerTitle.includes('golf') || lowerTitle.includes('tennis')) return '⛳'
                        if (lowerTitle.includes('culture') || lowerTitle.includes('musée') || lowerTitle.includes('art')) return '🎨'
                        if (lowerTitle.includes('transport') || lowerTitle.includes('voiture') || lowerTitle.includes('taxi')) return '🚗'
                        return '📍'
                      })()}
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
      
    </div>
  )
}


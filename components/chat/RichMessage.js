import { useState } from 'react'
import { ExternalLink, FileText, Image as ImageIcon, MapPin, Calendar, Star } from 'lucide-react'
import ProductPopupChat from './ProductPopupChat'
import { searchEstablishment, searchEvent } from '../../lib/supabaseData'

export default function RichMessage({ content, isDarkMode }) {
  const [imageError, setImageError] = useState({})
  const [popupData, setPopupData] = useState(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)

  // Gérer le clic sur un nom d'établissement/événement
  const handleProductClick = async (name) => {
    setIsLoadingProduct(true)
    
    // Rechercher d'abord dans les établissements
    let product = await searchEstablishment(name)
    
    // Si pas trouvé, chercher dans les événements
    if (!product) {
      product = await searchEvent(name)
    }
    
    setIsLoadingProduct(false)
    
    if (product) {
      setPopupData(product)
    } else {
      console.log('Produit non trouvé:', name)
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
        const parts = content.split(/\s*-\s*/)
        
        elements.push({
          type: 'item',
          title: parts[0]?.trim(),
          description: parts[1]?.trim(),
          key: `item-${index}`
        })
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
      
      // Texte normal avec formatage markdown basique
      return (
        <span key={idx}>
          {part.split('**').map((segment, i) => 
            i % 2 === 0 
              ? segment 
              : <strong key={i} style={{ fontWeight: 700, color: '#A7C7C5' }}>{segment}</strong>
          )}
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
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: '#C0C0C0' }}
                    />
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
      
      {/* Popup pour les détails - Données réelles Supabase */}
      {popupData && (
        <ProductPopupChat
          product={popupData}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  )
}


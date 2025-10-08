import { useState } from 'react'
import { ExternalLink, FileText, Image as ImageIcon } from 'lucide-react'

export default function RichMessage({ content, isDarkMode }) {
  const [imageError, setImageError] = useState({})

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

  return (
    <div className="rich-message-content">
      {parseContent(content)}
    </div>
  )
}


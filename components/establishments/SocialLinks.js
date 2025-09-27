import { Instagram, Facebook, Twitter, Globe, MessageCircle, Phone } from 'lucide-react'

export default function SocialLinks({ establishment }) {
  if (!establishment) return null

  const socialLinks = [
    {
      name: 'Instagram',
      url: establishment.instagram || establishment.social_media?.instagram,
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      name: 'Facebook',
      url: establishment.social_media?.facebook,
      icon: Facebook,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      url: establishment.social_media?.twitter,
      icon: Twitter,
      color: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500'
    },
    {
      name: 'Website',
      url: establishment.website,
      icon: Globe,
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700'
    },
    {
      name: 'WhatsApp',
      url: establishment.whatsapp ? `https://wa.me/${establishment.whatsapp.replace(/[^0-9]/g, '')}` : null,
      icon: MessageCircle,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      name: 'Téléphone',
      url: establishment.phone ? `tel:${establishment.phone}` : null,
      icon: Phone,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    }
  ].filter(link => link.url)

  if (socialLinks.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <h3 className="font-semibold text-text-primary">Suivez-nous</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {socialLinks.map((link, index) => {
          const Icon = link.icon
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${link.color} ${link.hoverColor}`}
            >
              <Icon size={18} />
              <span className="text-sm">{link.name}</span>
            </a>
          )
        })}
      </div>

      {/* Informations de contact rapide */}
      <div className="p-4 bg-surface rounded-lg border border-border">
        <h4 className="font-semibold text-text-primary mb-3">Contact rapide</h4>
        <div className="space-y-2 text-sm">
          {establishment.phone && (
            <div className="flex items-center space-x-2">
              <Phone size={16} className="text-text-secondary" />
              <a 
                href={`tel:${establishment.phone}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {establishment.phone}
              </a>
            </div>
          )}
          {establishment.whatsapp && (
            <div className="flex items-center space-x-2">
              <MessageCircle size={16} className="text-green-500" />
              <a 
                href={`https://wa.me/${establishment.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          )}
          {establishment.website && (
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-text-secondary" />
              <a 
                href={establishment.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark transition-colors truncate"
              >
                Site web
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

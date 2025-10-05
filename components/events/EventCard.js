import { Calendar, MapPin, Users, Euro, Clock, Crown, User } from 'lucide-react'
import Link from 'next/link'

export default function EventCard({ event }) {
  const eventDate = new Date(event.date)
  const isToday = eventDate.toDateString() === new Date().toDateString()
  const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString()
  
  const getDateLabel = () => {
    if (isToday) return "Aujourd'hui"
    if (isTomorrow) return "Demain"
    return eventDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const getTypeColor = (type) => {
    const colors = {
      'party': 'from-pink-500 to-purple-500',
      'gastronomy': 'from-orange-500 to-red-500',
      'wellness': 'from-green-500 to-teal-500',
      'show': 'from-red-500 to-pink-500',
      'experience': 'from-blue-500 to-cyan-500',
      'cultural': 'from-purple-500 to-indigo-500',
      'workshop': 'from-yellow-500 to-orange-500'
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  // Fonction pour naviguer vers la page de détails
  const handleCardClick = (e) => {
    // Ne pas naviguer si on clique sur un bouton ou un lien
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button') && !e.target.closest('a')) {
      window.location.href = `/event/${event.id}`
    }
  }

  return (
    <div 
      className="card-premium overflow-hidden animate-fade-in animate-hover-lift group transition-all duration-300 md:hover:scale-105 md:hover:shadow-2xl md:hover:rotate-1"
      onClick={() => window.location.href = `/event/${event.id}`}
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        transform: 'perspective(1000px)',
        transformStyle: 'preserve-3d',
        cursor: 'pointer'
      }}
    >
      <div className="relative">
        <img 
          src={event.image_url || `https://placehold.co/400x300/1a1a1a/E0E0E0?text=${encodeURIComponent(event.name)}`} 
          alt={event.name} 
          className="w-full h-48 object-cover md:group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <div 
            className={`px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r ${getTypeColor(event.type)} text-white`}
          >
            {event.type}
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <div 
            className="px-3 py-1 rounded-2xl text-xs font-semibold"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)'
            }}
          >
            {getDateLabel()}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 
            className="text-xl font-bold transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {event.name}
          </h3>
          <div 
            className="flex items-center font-semibold"
            style={{ color: 'var(--color-accent)' }}
          >
            <Euro size={14} className="mr-1" />
            {event.price}
          </div>
        </div>
        
        <div className="flex items-center text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
          <MapPin size={14} className="mr-2" style={{ color: 'var(--color-text-muted)' }} />
          <span>{event.location}</span>
        </div>
        
        <div className="flex items-center text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          <Clock size={14} className="mr-2" style={{ color: 'var(--color-text-muted)' }} />
          <span>{eventDate.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
          <span className="mx-2">•</span>
          <Users size={14} className="mr-2" style={{ color: 'var(--color-text-muted)' }} />
          <span>{event.capacity} places</span>
        </div>
        
        <p 
          className="mb-6 line-clamp-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {event.description}
        </p>
        
        <div className="space-y-3 mt-auto">
          <button className="w-full btn-event animate-hover-lift h-12 flex items-center justify-center">
            🎟️ Réserver Maintenant
          </button>
          <Link href="/register" className="block">
            <button className="w-full btn-secondary animate-hover-lift h-11 flex items-center justify-center">
              <Crown size={16} className="mr-2" />
              Devenir membre
            </button>
          </Link>
          <Link href="/login" className="block">
            <button className="w-full btn-outline animate-hover-lift h-11 flex items-center justify-center">
              <User size={16} className="mr-2" />
              Accès membre
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
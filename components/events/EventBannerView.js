import { useState } from 'react'
import { Lock, Crown, User, MapPin, Calendar, Clock, Users, Euro } from 'lucide-react'
import Link from 'next/link'

export default function EventBannerView({ events, user, onBecomeMember }) {
  const [selectedEvent, setSelectedEvent] = useState(null)

  console.log('EventBannerView - events:', events?.length || 0)
  console.log('EventBannerView - user:', user)
  console.log('EventBannerView - is_member:', user?.is_member)

  if (!user?.is_member) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 text-center">
          <Lock className="mx-auto text-gray-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Accès réservé aux membres</h2>
          <p className="text-gray-400 mb-6">Rejoignez Get Weez pour accéder à nos événements exclusifs à Marbella</p>
          <div className="space-y-3 max-w-sm mx-auto">
            <Link href="/register">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center">
                <Crown size={16} className="mr-2" />
                Devenir membre
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full bg-transparent border-2 border-purple-500 text-purple-400 py-3 px-6 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center justify-center">
                <User size={16} className="mr-2" />
                Accès membre
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(90deg, #FACC15 0%, #FDE047 50%, #FACC15 100%);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        /* iPad optimizations - Espacement réduit et effets header */
        @media (min-width: 769px) and (max-width: 1024px) {
          .banner-container {
            max-width: 100%;
            margin: 0 auto;
            padding: 0 16px;
            padding-bottom: 16px;
          }
          
          .banner-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 8px;
            margin-bottom: 16px;
          }
          
          .banner-card {
            margin-bottom: 8px;
          }
          
          /* Appliquer les effets du header */
          .banner-card {
            position: relative;
            overflow: hidden;
          }
          
          .banner-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
            transition: left 0.6s ease;
            z-index: 10;
            pointer-events: none;
          }
          
          .banner-card:hover::before {
            left: 100%;
          }
          
          @keyframes card-pulse-glow {
            0%, 100% {
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 5px rgba(139, 92, 246, 0.2);
            }
            50% {
              box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2);
            }
          }
          
          .banner-card:hover {
            animation: card-pulse-glow 1.5s infinite;
          }
        }
        
        /* Desktop optimizations - Design compact et attractif */
        @media (min-width: 1024px) {
          .banner-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }
          
          .banner-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 1.5rem;
            justify-items: stretch;
          }
          
          .banner-card {
            width: 100%;
            max-width: 380px;
            height: 480px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          .banner-image {
            height: 180px;
            object-fit: cover;
            transition: transform 0.3s ease;
            flex-shrink: 0;
          }
          
          .banner-card:hover .banner-image {
            transform: scale(1.02);
          }
          
          .banner-title {
            font-size: 1.1rem;
            line-height: 1.2;
            margin-bottom: 0.5rem;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            height: 2.4rem;
            flex-shrink: 0;
          }
          
          .banner-text {
            font-size: 0.85rem;
            line-height: 1.3;
            margin-bottom: 0.75rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            height: 3.3rem;
            flex-shrink: 0;
          }
          
          .banner-info {
            font-size: 0.75rem;
            line-height: 1.2;
            margin-bottom: 0.75rem;
            flex-shrink: 0;
          }
          
          .banner-button {
            margin-top: auto;
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
            font-weight: 600;
          }
        }
        
        @media (min-width: 1280px) {
          .banner-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          
          .banner-card {
            max-width: 400px;
            height: 500px;
          }
        }
        
        @media (min-width: 1536px) {
          .banner-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
          }
          
          .banner-card {
            max-width: 350px;
            height: 480px;
          }
        }
        
        /* Badges et prix optimisés */
        @media (min-width: 1024px) {
          .banner-badge {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
            font-weight: 600;
            border-radius: 12px;
          }
          
          .banner-price {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
            font-weight: 700;
            border-radius: 12px;
          }
          
          /* Ombres et effets premium */
          .banner-card {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .banner-card:hover {
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2);
            transform: translateY(-4px);
          }
          
          /* Bouton premium */
          .banner-button {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .banner-button:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2));
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            transform: translateY(-1px);
          }
        }
        
        /* Mobile optimizations - Bannières légèrement plus petites */
        @media (max-width: 768px) {
          .banner-container {
            padding: 0 12px;
          }
          
          .banner-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .banner-card {
            height: 420px; /* Réduit de 480px à 420px */
            max-width: 100%;
          }
          
          .banner-image {
            height: 160px; /* Réduit de 176px à 160px */
          }
          
          .banner-title {
            font-size: 1rem; /* Réduit de 1.1rem */
            margin-bottom: 6px;
          }
          
          .banner-text {
            font-size: 0.8rem; /* Réduit de 0.85rem */
            margin-bottom: 10px;
            -webkit-line-clamp: 2; /* Réduit de 3 à 2 lignes */
          }
          
          .banner-info {
            font-size: 0.7rem; /* Réduit de 0.75rem */
            margin-bottom: 10px;
          }
          
          .banner-button {
            padding: 0.4rem 0.7rem; /* Réduit légèrement */
            font-size: 0.75rem; /* Réduit de 0.8rem */
          }
        }
      `}</style>
      
      <div className="banner-container">
        <div className="banner-grid">
          {events.map(event => {
            const eventDate = new Date(event.date)
            const typeColors = {
              party: 'linear-gradient(135deg, #EC4899, #BE185D)',
              gastronomy: 'linear-gradient(135deg, #EF4444, #DC2626)',
              wellness: 'linear-gradient(135deg, #10B981, #059669)',
              show: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              experience: 'linear-gradient(135deg, #F59E0B, #D97706)',
              cultural: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
              workshop: 'linear-gradient(135deg, #06B6D4, #0891B2)'
            }
            
            return (
              <div 
                key={event.id}
                className="banner-card group relative overflow-hidden rounded-3xl border shadow-xl hover:shadow-2xl transition-all duration-500 md:hover:scale-105 cursor-pointer"
                style={{ 
                  background: typeColors[event.type] || 'linear-gradient(135deg, #6B7280, #4B5563)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => setSelectedEvent(event)}
              >
                {/* Image de l'événement - Plus compacte */}
                <div className="relative h-40 overflow-hidden flex-shrink-0">
                  <img 
                    src={event.image_url} 
                    alt={event.name}
                    className="banner-image w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
                    style={{
                      display: 'block',
                      verticalAlign: 'top',
                      lineHeight: 0,
                      fontSize: 0
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Badge type - Plus petit */}
                  <div className="absolute top-3 left-3">
                    <div 
                      className="banner-badge px-2 py-1 rounded-lg text-xs font-semibold text-white shadow-md"
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </div>
                  </div>
                  
                  {/* Prix - Plus petit */}
                  <div className="absolute top-3 right-3">
                    <div 
                      className="banner-price px-2 py-1 rounded-lg text-xs font-bold text-black shadow-md"
                      style={{ 
                        background: 'linear-gradient(135deg, #FDE047, #FACC15)',
                        boxShadow: '0 2px 8px rgba(250, 204, 21, 0.3)'
                      }}
                    >
                      <Euro size={10} className="inline mr-1" />
                      {event.price}
                    </div>
                  </div>
                </div>
                
                {/* Contenu - Plus compact et organisé */}
                <div className="p-4 relative flex-1 flex flex-col min-h-0">
                  <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-b-3xl"></div>
                  <div className="relative z-10 flex-1 flex flex-col min-h-0">
                    <h3 className="banner-title text-white drop-shadow-lg" style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      marginBottom: '8px',
                      lineHeight: '1.2'
                    }}>
                      {event.name}
                    </h3>
                    
                    <p className="banner-text text-white/85 leading-relaxed" style={{ 
                      fontSize: '0.85rem', 
                      lineHeight: '1.3',
                      marginBottom: '12px'
                    }}>
                      {event.description}
                    </p>
                    
                    {/* Informations de l'événement - Plus compactes */}
                    <div className="banner-info space-y-1 flex-1" style={{ marginBottom: '12px' }}>
                      <div className="flex items-center text-white/90" style={{ fontSize: '0.75rem' }}>
                        <Calendar size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate font-medium">{eventDate.toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center text-white/90" style={{ fontSize: '0.75rem' }}>
                        <Clock size={14} className="mr-2 flex-shrink-0" />
                        <span className="font-medium">{eventDate.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center text-white/90" style={{ fontSize: '0.75rem' }}>
                        <MapPin size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate font-medium">{event.location}</span>
                      </div>
                    </div>
                    
                    {/* Bouton de réservation - Toujours en bas */}
                    <button 
                      className="banner-button mobile-critical-action w-full bg-white/20 backdrop-blur-sm text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-white/30 border border-white/30 shadow-md hover:shadow-lg flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Réserver:', event.name)
                      }}
                    >
                      🎟️ Réserver maintenant
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-3">Aucun événement disponible</h3>
            <p className="text-gray-300">De nouveaux événements seront bientôt ajoutés</p>
          </div>
        )}
      </div>
    </>
  )
}
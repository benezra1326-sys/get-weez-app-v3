import { useState } from 'react'
import { Lock, Crown, User, MapPin, Calendar, Clock, Users, Euro } from 'lucide-react'
import Link from 'next/link'

export default function EventBannerView({ events, user, onBecomeMember }) {
  const [selectedEvent, setSelectedEvent] = useState(null)

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
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
                className="group relative overflow-hidden rounded-3xl border shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{ 
                  background: typeColors[event.type] || 'linear-gradient(135deg, #6B7280, #4B5563)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => setSelectedEvent(event)}
              >
                {/* Image de l'événement */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image_url} 
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Badge type */}
                  <div className="absolute top-4 left-4">
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </div>
                  </div>
                  
                  {/* Prix */}
                  <div className="absolute top-4 right-4">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-bold text-black shadow-lg"
                      style={{ 
                        background: 'linear-gradient(135deg, #FDE047, #FACC15)',
                        boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)'
                      }}
                    >
                      <Euro size={12} className="inline mr-1" />
                      {event.price}
                    </div>
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="p-6 relative">
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-b-3xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-3 drop-shadow-lg">
                      {event.name}
                    </h3>
                    
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">
                      {event.description}
                    </p>
                    
                    {/* Informations de l'événement */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-white/80 text-sm">
                        <Calendar size={16} className="mr-2" />
                        <span>{eventDate.toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center text-white/80 text-sm">
                        <Clock size={16} className="mr-2" />
                        <span>{eventDate.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center text-white/80 text-sm">
                        <MapPin size={16} className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="flex items-center text-white/80 text-sm">
                        <Users size={16} className="mr-2" />
                        <span>Capacité: {event.capacity} personnes</span>
                      </div>
                    </div>
                    
                    {/* Bouton de réservation */}
                    <button 
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:bg-white/30 hover:scale-105 border border-white/30"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Réserver:', event.name)
                      }}
                    >
                      Réserver maintenant
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
            <h3 className="text-xl font-semibold text-white mb-2">Aucun événement disponible</h3>
            <p className="text-gray-400">De nouveaux événements seront bientôt ajoutés</p>
          </div>
        )}
      </div>
    </>
  )
}
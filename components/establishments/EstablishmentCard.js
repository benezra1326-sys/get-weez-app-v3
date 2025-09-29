import { Star, Heart, MessageCircle, Building, MapPin } from 'lucide-react'
import SocialLinks from './SocialLinks'

export default function EstablishmentCard({ establishment, user, onReserve }) {
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
    <div 
      className="overflow-hidden transition-all duration-300 hover:scale-105 group relative rounded-2xl border shadow-lg hover:shadow-xl cursor-pointer"
      style={{ 
        background: establishment.type === 'Restaurant Japonais' ? 'linear-gradient(135deg, #F59E0B, #D97706)' :
                   establishment.type === 'Restaurant Méditerranéen' ? 'linear-gradient(135deg, #10B981, #059669)' :
                   establishment.type === 'Restaurant Créatif' ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' :
                   establishment.type === 'Nightclub' ? 'linear-gradient(135deg, #EC4899, #BE185D)' :
                   establishment.type === 'Restaurant Gastronomique' ? 'linear-gradient(135deg, #EF4444, #DC2626)' :
                   establishment.type === 'Bar à Cocktails' ? 'linear-gradient(135deg, #06B6D4, #0891B2)' :
                   establishment.type === 'Plage Privée' ? 'linear-gradient(135deg, #0EA5E9, #0284C7)' :
                   'linear-gradient(135deg, #6B7280, #4B5563)',
        borderColor: establishment.type === 'Restaurant Japonais' ? 'rgba(245, 158, 11, 0.3)' :
                    establishment.type === 'Restaurant Méditerranéen' ? 'rgba(16, 185, 129, 0.3)' :
                    establishment.type === 'Restaurant Créatif' ? 'rgba(139, 92, 246, 0.3)' :
                    establishment.type === 'Nightclub' ? 'rgba(236, 72, 153, 0.3)' :
                    establishment.type === 'Restaurant Gastronomique' ? 'rgba(239, 68, 68, 0.3)' :
                    establishment.type === 'Bar à Cocktails' ? 'rgba(6, 182, 212, 0.3)' :
                    establishment.type === 'Plage Privée' ? 'rgba(14, 165, 233, 0.3)' :
                    'rgba(107, 114, 128, 0.3)',
        boxShadow: establishment.sponsored ? '0 8px 25px rgba(245, 158, 11, 0.4)' :
                  establishment.type === 'Restaurant Japonais' ? '0 8px 25px rgba(245, 158, 11, 0.3)' :
                  establishment.type === 'Restaurant Méditerranéen' ? '0 8px 25px rgba(16, 185, 129, 0.3)' :
                  establishment.type === 'Restaurant Créatif' ? '0 8px 25px rgba(139, 92, 246, 0.3)' :
                  establishment.type === 'Nightclub' ? '0 8px 25px rgba(236, 72, 153, 0.3)' :
                  establishment.type === 'Restaurant Gastronomique' ? '0 8px 25px rgba(239, 68, 68, 0.3)' :
                  establishment.type === 'Bar à Cocktails' ? '0 8px 25px rgba(6, 182, 212, 0.3)' :
                  establishment.type === 'Plage Privée' ? '0 8px 25px rgba(14, 165, 233, 0.3)' :
                  '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="relative">
        <div 
          className="w-full h-32 rounded-t-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: establishment.type === 'Restaurant Japonais' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' :
                       establishment.type === 'Restaurant Méditerranéen' ? 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' :
                       establishment.type === 'Restaurant Créatif' ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' :
                       establishment.type === 'Nightclub' ? 'linear-gradient(135deg, #EC4899 0%, #BE185D 50%, #9D174D 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' :
                       establishment.type === 'Restaurant Gastronomique' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' :
                       establishment.type === 'Bar à Cocktails' ? 'linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #0E7490 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' :
                       establishment.type === 'Plage Privée' ? 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' :
                       'linear-gradient(135deg, #6B7280 0%, #4B5563 50%, #374151 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        >
          {establishment.image_url ? (
            <img 
              src={establishment.image_url} 
              alt={establishment.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white text-3xl">
              {establishment.type === 'Restaurant Japonais' ? '🍣' :
               establishment.type === 'Restaurant Méditerranéen' ? '🍽️' :
               establishment.type === 'Restaurant Créatif' ? '🎨' :
                   establishment.type === 'Nightclub' ? '🍾' :
                   establishment.type === 'Restaurant Gastronomique' ? '⭐' :
                   establishment.type === 'Bar à Cocktails' ? '🍹' :
                   establishment.type === 'Plage Privée' ? '🏖️' : '🏨'}
                </span>
              </div>
              <div className="text-white/90 text-xs font-medium drop-shadow-md">
                {establishment.type}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        {establishment.sponsored && (
          <div 
            className="absolute top-3 right-3 text-black text-xs font-bold px-3 py-1 rounded-2xl shimmer shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #FDE047, #FACC15, #F59E0B)',
              color: '#000000',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)'
            }}
          >
            ⭐ SPONSORISÉ
          </div>
        )}
        {user?.is_member && (
          <button 
            className="absolute top-3 left-3 p-2 rounded-2xl transition-all duration-300 hover:scale-110"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#FFFFFF',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.8)'
              e.target.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
              e.target.style.transform = 'scale(1)'
            }}
          >
            <Heart size={18} fill="currentColor" />
          </button>
        )}
      </div>
      <div className="p-4 relative">
        {/* Arrière-plan coloré pour le contenu */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-b-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <h3 
              className="text-lg font-bold text-white drop-shadow-lg"
          >
            {establishment.name}
          </h3>
          <div 
              className="flex items-center px-3 py-1 rounded-xl shadow-lg"
            style={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF'
            }}
          >
            <Star size={14} className="text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium">{establishment.rating}</span>
          </div>
        </div>
          <div className="flex items-center text-xs mb-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          <MapPin size={12} className="mr-1" />
            <span className="drop-shadow-md">{establishment.zone}, Marbella</span>
        </div>
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span 
                className="text-sm font-medium text-white drop-shadow-md"
              >
                {establishment.type}
              </span>
          <span 
                className="text-xs"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
                {establishment.ambiance}
          </span>
            </div>
          <div className="flex gap-2">
            {user?.is_member ? (
              <>
                {/* Version mobile - seulement bouton IA */}
                <button 
                  className="lg:hidden rounded-xl p-2 transition-all duration-300 text-white group-hover:scale-110"
                  style={{
                    background: establishment.type === 'Restaurant Japonais' ? 'linear-gradient(135deg, #F59E0B, #D97706)' :
                               establishment.type === 'Restaurant Méditerranéen' ? 'linear-gradient(135deg, #10B981, #059669)' :
                               establishment.type === 'Restaurant Créatif' ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' :
                               establishment.type === 'Nightclub' ? 'linear-gradient(135deg, #EC4899, #BE185D)' :
                               establishment.type === 'Restaurant Gastronomique' ? 'linear-gradient(135deg, #EF4444, #DC2626)' :
                               establishment.type === 'Bar à Cocktails' ? 'linear-gradient(135deg, #06B6D4, #0891B2)' :
                               establishment.type === 'Plage Privée' ? 'linear-gradient(135deg, #0EA5E9, #0284C7)' :
                               'linear-gradient(135deg, #3B82F6, #2563EB)',
                    boxShadow: establishment.type === 'Restaurant Japonais' ? '0 4px 12px rgba(245, 158, 11, 0.4)' :
                               establishment.type === 'Restaurant Méditerranéen' ? '0 4px 12px rgba(16, 185, 129, 0.4)' :
                               establishment.type === 'Restaurant Créatif' ? '0 4px 12px rgba(139, 92, 246, 0.4)' :
                               establishment.type === 'Nightclub' ? '0 4px 12px rgba(236, 72, 153, 0.4)' :
                               establishment.type === 'Restaurant Gastronomique' ? '0 4px 12px rgba(239, 68, 68, 0.4)' :
                               establishment.type === 'Bar à Cocktails' ? '0 4px 12px rgba(6, 182, 212, 0.4)' :
                               establishment.type === 'Plage Privée' ? '0 4px 12px rgba(14, 165, 233, 0.4)' :
                               '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  onClick={onReserve}
                >
                  <MessageCircle size={16} />
                </button>
                
                {/* Version desktop - tous les boutons */}
                <button 
                  className="hidden lg:flex rounded-2xl p-2 transition-all animate-hover-lift"
                  style={{ 
                    backgroundColor: 'var(--color-success)',
                    color: 'var(--color-text-primary)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-success)'}
                >
                  <MessageCircle size={16} />
                </button>
                <button 
                  className="hidden lg:flex rounded-2xl p-2 transition-all animate-hover-lift"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary-dark)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
                >
                  <Building size={16} />
                </button>
              </>
            ) : (
              <button 
                onClick={onReserve}
                className="text-xs py-2 px-4 rounded-lg font-medium transition-all duration-300 group-hover:scale-105"
                style={{
                  background: establishment.type === 'Restaurant Japonais' ? 'linear-gradient(135deg, #F59E0B, #D97706)' :
                             establishment.type === 'Restaurant Méditerranéen' ? 'linear-gradient(135deg, #10B981, #059669)' :
                             establishment.type === 'Restaurant Créatif' ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' :
                             establishment.type === 'Nightclub' ? 'linear-gradient(135deg, #EC4899, #BE185D)' :
                             establishment.type === 'Restaurant Gastronomique' ? 'linear-gradient(135deg, #EF4444, #DC2626)' :
                             establishment.type === 'Bar à Cocktails' ? 'linear-gradient(135deg, #06B6D4, #0891B2)' :
                             establishment.type === 'Plage Privée' ? 'linear-gradient(135deg, #0EA5E9, #0284C7)' :
                             'linear-gradient(135deg, #3B82F6, #2563EB)',
                  color: '#FFFFFF',
                  boxShadow: establishment.type === 'Restaurant Japonais' ? '0 4px 12px rgba(245, 158, 11, 0.4)' :
                             establishment.type === 'Restaurant Méditerranéen' ? '0 4px 12px rgba(16, 185, 129, 0.4)' :
                             establishment.type === 'Restaurant Créatif' ? '0 4px 12px rgba(139, 92, 246, 0.4)' :
                             establishment.type === 'Nightclub' ? '0 4px 12px rgba(236, 72, 153, 0.4)' :
                             establishment.type === 'Restaurant Gastronomique' ? '0 4px 12px rgba(239, 68, 68, 0.4)' :
                             establishment.type === 'Bar à Cocktails' ? '0 4px 12px rgba(6, 182, 212, 0.4)' :
                             establishment.type === 'Plage Privée' ? '0 4px 12px rgba(14, 165, 233, 0.4)' :
                             '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                <span className="lg:hidden">Réserver</span>
                <span className="hidden lg:inline">Réserver</span>
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  )
}
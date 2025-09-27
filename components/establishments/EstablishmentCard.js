import { Star, Heart, MessageCircle, Building, MapPin } from 'lucide-react'
import SocialLinks from './SocialLinks'

export default function EstablishmentCard({ establishment, user, onReserve }) {
  return (
    <div 
      className="card-premium overflow-hidden animate-fade-in animate-hover-lift"
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div className="relative">
        <img 
          src={establishment.image_url || `https://placehold.co/400x300/1a1a1a/E0E0E0?text=${encodeURIComponent(establishment.name)}`} 
          alt={establishment.name} 
          className="w-full h-48 object-cover"
        />
        {establishment.sponsored && (
          <div 
            className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-2xl"
            style={{ 
              background: 'var(--color-primary)',
              color: 'var(--color-text-primary)'
            }}
          >
            Sponsorisé
          </div>
        )}
        {user?.is_member && (
          <button 
            className="absolute top-3 left-3 p-2 rounded-2xl transition-all animate-hover-lift"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'var(--color-text-primary)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
          >
            <Heart size={18} fill="currentColor" />
          </button>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 
            className="text-xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {establishment.name}
          </h3>
          <div 
            className="flex items-center px-3 py-1 rounded-2xl"
            style={{ 
              backgroundColor: 'var(--color-surface-hover)',
              color: 'var(--color-text-primary)'
            }}
          >
            <Star size={14} className="text-yellow-400 fill-current mr-1" />
            <span className="text-sm">{establishment.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          <MapPin size={14} className="mr-2" />
          <span>{establishment.zone}, Marbella</span>
        </div>
        <div className="flex justify-between items-center">
          <span 
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {establishment.type} • {establishment.ambiance}
          </span>
          <div className="flex gap-2">
            {user?.is_member ? (
              <>
                <button 
                  className="rounded-2xl p-2 transition-all animate-hover-lift"
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
                  className="rounded-2xl p-2 transition-all animate-hover-lift"
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
                className="btn-premium text-xs py-2 px-4 animate-hover-lift"
              >
                Réserver - 50€
              </button>
            )}
          </div>
        </div>
        
        {/* Liens sociaux */}
        <div className="mt-4 pt-4 border-t border-border">
          <SocialLinks establishment={establishment} />
        </div>
      </div>
    </div>
  )
}
import { Clock, MapPin, Users, Euro } from 'lucide-react'

export default function EventBannerView({ events }) {
  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="card-premium p-6 hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {event.name}
              </h3>
              <p className="text-text-secondary mb-3">
                {event.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  {event.date} à {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-2" />
                  {event.capacity} places
                </div>
                <div className="flex items-center">
                  <Euro size={16} className="mr-2" />
                  {event.price}€
                </div>
              </div>
            </div>
            
            <div className="ml-4 text-right">
              <div className="text-2xl font-bold text-primary mb-1">
                {event.price}€
              </div>
              <div className="text-sm text-text-secondary">
                par personne
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                {event.category}
              </span>
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                {event.dress_code}
              </span>
              <span className="px-3 py-1 bg-surface text-text-primary rounded-full text-xs font-medium">
                {event.age_restriction}
              </span>
            </div>
            
            <button className="btn-premium px-6 py-2 text-sm">
              Réserver
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

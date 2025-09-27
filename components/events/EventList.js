import { Lock, Crown } from 'lucide-react'

export default function EventList({ events, user, onBecomeMember }) {
  return (
    <div className="p-4 md:p-6" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Événements à Marbella</h1>
        <p className="text-gray-400">Événements exclusifs à Marbella</p>
      </div>
      
      {user?.is_member ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl p-8 text-center">
          <Lock className="mx-auto text-gray-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Accès réservé aux membres</h2>
          <p className="text-gray-400 mb-6">Rejoignez Get Weez pour accéder à nos événements exclusifs à Marbella</p>
          <button 
            onClick={onBecomeMember}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Devenir membre
          </button>
        </div>
      )}
    </div>
  )
}
import { Lock, Crown, User } from 'lucide-react'
import Link from 'next/link'

export default function EventList({ events, user, onBecomeMember }) {
  return (
    <div className="p-4 md:p-6" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Événements à Marbella</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Événements exclusifs à Marbella</p>
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
      )}
    </div>
  )
}
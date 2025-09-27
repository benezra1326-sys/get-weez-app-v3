import { X, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { MessageCircle, Building, Ticket, User, CreditCard, HelpCircle } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Accueil', icon: MessageCircle },
  { href: '/establishments', label: 'Établissements', icon: Building },
  { href: '/events', label: 'Événements', icon: Ticket },
  { href: '/account', label: 'Compte', icon: User },
  { href: '/aide', label: 'Aide', icon: HelpCircle },
]

export default function MobileMenu({ isOpen, onClose, user }) {
  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
      <div className="bg-gray-800 h-full w-64 max-w-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-2"></div>
            <h1 className="text-lg font-bold text-white">Get Weez</h1>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-750 transition-colors"
              >
                <Icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {user ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-850 border-t border-gray-700">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                user.is_member ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium text-white">
                  {user.is_member ? 'Membre Actif' : 'Invité'}
                </p>
                <p className="text-xs text-gray-400">
                  {user.first_name || 'Utilisateur'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-850 border-t border-gray-700">
            <div className="space-y-2">
              <Link 
                href="/login"
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-750 transition-colors"
              >
                <LogIn size={20} className="mr-3" />
                <span>Connexion</span>
              </Link>
              <Link 
                href="/register"
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <UserPlus size={20} className="mr-3" />
                <span>Inscription</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
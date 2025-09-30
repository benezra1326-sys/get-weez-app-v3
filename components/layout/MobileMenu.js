import { X, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { MessageCircle, Building, Ticket, User, CreditCard, HelpCircle, Settings } from 'lucide-react'
import { useEffect } from 'react'
import useChatTheme from '../../hooks/useChatTheme'
import { SafeAreaView } from '../mobile/MobileOptimizations'

const navItems = [
  { href: '/', label: 'Accueil', icon: MessageCircle },
  { href: '/establishments', label: 'Établissements', icon: Building },
  { href: '/services', label: 'Services', icon: Settings },
  { href: '/events', label: 'Événements', icon: Ticket },
  { href: '/account', label: 'Compte', icon: User },
  { href: '/aide', label: 'Aide', icon: HelpCircle },
]

export default function MobileMenu({ isOpen, onClose, user }) {
  const { themeClasses } = useChatTheme()

  // Fermer le menu avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm mobile-optimized" onClick={onClose}>
      <SafeAreaView edges={['top', 'bottom']} className="h-full">
        <div 
          className={`${themeClasses.main} backdrop-blur-md h-full w-80 max-w-full shadow-2xl border-r border-gray-700`}
          onClick={(e) => e.stopPropagation()}
          style={{
            backdropFilter: 'blur(16px)',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)'
          }}
        >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          {/* Logo Get Weez */}
          <Link href="/" onClick={onClose} className="flex items-center group">
            <div 
              className="px-4 py-2 rounded-xl shadow-glow group-hover:shadow-glow-accent transition-all duration-500 group-hover:scale-105"
              style={{ 
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
              }}
            >
              <h1 
                className="text-lg font-bold text-white leading-tight tracking-wider"
                style={{ 
                  fontFamily: 'Blanka, sans-serif',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em'
                }}
              >
                GET WEEZ
              </h1>
            </div>
          </Link>
          
          {/* Bouton de fermeture */}
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
                className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.3)'
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.borderColor = 'transparent'
                }}
              >
                <Icon size={20} className="mr-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {user ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700">
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
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700">
            <div className="space-y-2">
              <Link 
                href="/login"
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.3)'
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.borderColor = 'transparent'
                }}
              >
                <LogIn size={20} className="mr-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Connexion</span>
              </Link>
              <Link 
                href="/register"
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-600/20 border border-purple-500/30 text-white hover:border-purple-400/50 hover:from-purple-600/30 hover:to-indigo-600/30 transition-all duration-300 group"
              >
                <UserPlus size={20} className="mr-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Inscription</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
import { MessageCircle, Building, Ticket, User, CreditCard, LogIn, UserPlus, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { href: '/', label: 'Accueil', icon: MessageCircle },
  { href: '/establishments', label: 'Établissements', icon: Building },
  { href: '/events', label: 'Événements', icon: Ticket },
  { href: '/account', label: 'Compte', icon: User },
  { href: '/aide', label: 'Aide', icon: HelpCircle },
]

export default function Sidebar({ user }) {
  const router = useRouter()

  return (
    <div 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        backdropFilter: 'blur(20px)',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
        height: '100vh',
        minHeight: '100vh',
        width: '320px',
        maxWidth: '320px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 40
      }}
    >
      <div className="p-6 lg:p-8 xl:p-10">
        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = router.pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group hover:scale-105 ${
                  isActive
                    ? 'shadow-lg'
                    : ''
                }`}
                style={{
                  backgroundColor: isActive ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)' : 'transparent',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'var(--color-surface-hover)'
                    e.target.style.color = 'var(--color-text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = 'var(--color-text-secondary)'
                  }
                }}
              >
                <Icon 
                  size={20} 
                  className="mr-4 transition-all duration-300"
                  style={{
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
                  }}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div 
                    className="ml-auto w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--color-text-primary)' }}
                  ></div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {user ? (
        <div 
          className="mt-auto p-6 border-t border-border bg-bg-secondary"
          style={{ 
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)'
          }}
        >
          <div className="flex items-center animate-fade-in">
            <div 
              className={`w-3 h-3 rounded-full mr-4 animate-pulse-slow ${
                user.is_member ? 'shadow-glow-accent' : ''
              }`}
              style={{
                backgroundColor: user.is_member ? 'var(--color-accent)' : 'var(--color-text-muted)'
              }}
            ></div>
            <div>
              <p 
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {user.is_member ? 'Membre Actif' : 'Invité'}
              </p>
              <p 
                className="text-xs font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {user.first_name || 'Utilisateur'}
              </p>
            </div>
          </div>
        </div>
        ) : (
        <div 
          className="mt-auto p-6 border-t border-border bg-bg-secondary"
          style={{ 
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)'
          }}
        >
          <div className="space-y-3">
            <Link 
              href="/login"
              className="flex items-center px-4 py-3 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-all duration-300 hover:scale-105"
            >
              <LogIn size={20} className="mr-4" />
              Connexion
            </Link>
            <Link 
              href="/register"
              className="flex items-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 hover:scale-105"
            >
              <UserPlus size={20} className="mr-4" />
              Inscription
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  Facebook, 
  Instagram, 
  Mail, 
  Phone, 
  MessageCircle,
  Chrome
} from 'lucide-react'

const socialProviders = [
  {
    id: 'google',
    name: 'Google',
    icon: Chrome,
    color: 'bg-red-500 hover:bg-red-600',
    textColor: 'text-white'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    textColor: 'text-white'
  }
]

export default function SocialAuthButtons({ onSuccess, onError }) {
  const [loading, setLoading] = useState(null)

  const handleSocialAuth = async (provider) => {
    setLoading(provider)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })

      if (error) {
        onError(error.message)
      } else {
        onSuccess('Redirection en cours...')
      }
    } catch (error) {
      onError('Erreur lors de la connexion')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => {
        const Icon = provider.icon
        return (
          <button
            key={provider.id}
            onClick={() => handleSocialAuth(provider.id)}
            disabled={loading === provider.id}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-2xl font-medium transition-all duration-300 animate-hover-lift disabled:opacity-50 disabled:cursor-not-allowed ${provider.color} ${provider.textColor}`}
          >
            <Icon size={20} className="mr-3" />
            {loading === provider.id ? 'Connexion...' : `Continuer avec ${provider.name}`}
          </button>
        )
      })}
    </div>
  )
}

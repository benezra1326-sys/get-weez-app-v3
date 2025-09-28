import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import PhoneAuth from '../components/auth/PhoneAuth'

export default function Login({ user, setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [authMethod, setAuthMethod] = useState('email') // 'email', 'phone', 'social'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // Récupérer les données utilisateur depuis la table users
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (userData) {
          setUser(userData)
        }
        
        router.push('/')
      }
    } catch (error) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSuccess = (message) => {
    setSuccess(message)
    setError('')
  }

  const handleSocialError = (message) => {
    setError(message)
    setSuccess('')
  }

  const handlePhoneSuccess = (message) => {
    setSuccess(message)
    setError('')
  }

  const handlePhoneError = (message) => {
    setError(message)
    setSuccess('')
  }

  const handlePhoneBack = () => {
    setAuthMethod('email')
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <Header 
        user={user} 
        setUser={setUser}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <main className="flex-1 p-8">
          <div className="max-w-md mx-auto">
            <div 
              className="card-premium p-8 animate-fade-in"
              style={{ 
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div className="text-center mb-8">
                <Link 
                  href="/" 
                  className="inline-flex items-center transition-colors duration-200 mb-6 animate-hover-lift"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Retour à l'accueil
                </Link>
                
                <div 
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-glow animate-float"
                  style={{ background: 'var(--color-primary)' }}
                ></div>
                <h1 className="text-3xl font-bold text-gradient mb-2">
                  Connexion
                </h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Accédez à votre compte Get Weez
                </p>
              </div>

              {/* Méthodes d'authentification */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-2xl font-medium transition-all duration-200 animate-hover-lift ${
                    authMethod === 'email' ? 'shadow-glow' : ''
                  }`}
                  style={{
                    backgroundColor: authMethod === 'email' ? 'var(--color-primary)' : 'transparent',
                    color: authMethod === 'email' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)'
                  }}
                  onMouseEnter={(e) => {
                    if (authMethod !== 'email') {
                      e.target.style.backgroundColor = 'var(--color-surface-hover)'
                      e.target.style.color = 'var(--color-text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (authMethod !== 'email') {
                      e.target.style.backgroundColor = 'transparent'
                      e.target.style.color = 'var(--color-text-secondary)'
                    }
                  }}
                >
                  <Mail size={18} className="inline mr-2" />
                  Email
                </button>
                <button
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                    authMethod === 'phone'
                      ? 'gradient-primary text-white shadow-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Phone size={18} className="inline mr-2" />
                  SMS
                </button>
                <button
                  onClick={() => setAuthMethod('social')}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                    authMethod === 'social'
                      ? 'gradient-primary text-white shadow-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <MessageCircle size={18} className="inline mr-2" />
                  Social
                </button>
              </div>

              {/* Affichage conditionnel selon la méthode d'authentification */}
              {authMethod === 'email' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail 
                        size={20} 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                        style={{ color: 'var(--color-text-muted)' }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-premium w-full pl-12 pr-4 py-3"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Votre mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full btn-premium ${loading ? 'opacity-50 cursor-not-allowed' : 'animate-hover-lift'}`}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </button>
                </form>
              )}

              {authMethod === 'phone' && (
                <PhoneAuth
                  onSuccess={handlePhoneSuccess}
                  onError={handlePhoneError}
                  onBack={handlePhoneBack}
                />
              )}

              {authMethod === 'social' && (
                <SocialAuthButtons
                  onSuccess={handleSocialSuccess}
                  onError={handleSocialError}
                />
              )}

              {/* Messages d'erreur et de succès */}
              {error && (
                <div 
                  className="rounded-2xl p-4 text-sm animate-fade-in"
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'var(--color-error)'
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div 
                  className="rounded-2xl p-4 text-sm animate-fade-in"
                  style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: 'var(--color-success)'
                  }}
                >
                  {success}
                </div>
              )}

              <div className="mt-8 text-center">
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Pas encore de compte ?{' '}
                  <Link 
                    href="/register" 
                    className="font-medium transition-colors duration-200 animate-hover-lift"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-dark)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
      />
    </div>
  )
}

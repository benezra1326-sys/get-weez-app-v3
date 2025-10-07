import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import PhoneAuth from '../components/auth/PhoneAuth'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Register({ user, setUser }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [authMethod, setAuthMethod] = useState('email') // 'email', 'phone', 'social'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { isDarkMode, isLoaded } = useTheme()

  // Ne pas rendre avant que le thème soit chargé
  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chargement...</p>
        </div>
      </div>
    )
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Créer le profil utilisateur dans la table users
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              first_name: firstName,
              last_name: lastName,
              email: email,
              is_member: false, // Par défaut, pas membre
              created_at: new Date().toISOString(),
            }
          ])

        if (userError) {
          console.error('Erreur lors de la création du profil:', userError)
          setError('Erreur lors de la création du profil')
          return
        }

        // Récupérer les données utilisateur créées
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
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
                  Inscription
                </h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Rejoignez la communauté Get Weez
                </p>
              </div>

              {/* Méthodes d'authentification */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                    authMethod === 'email'
                      ? 'gradient-primary text-white shadow-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
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
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Prénom
                      </label>
                      <div className="relative">
                        <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Votre prénom"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Nom
                      </label>
                      <div className="relative">
                        <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirmer votre mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-primary text-white py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-pink transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? 'Création du compte...' : 'Créer mon compte'}
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
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
                  {success}
                </div>
              )}

              <div className="mt-8 text-center">
                <p className="text-slate-400">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-gray-400 hover:text-gray-300 font-medium transition-colors duration-200">
                    Se connecter
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

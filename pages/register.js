import { useState } from 'react'
import { useRouter } from 'next/router'
import { User, Mail, Lock, Phone, Eye, EyeOff, Sparkles, Check } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import { useTheme } from '../contexts/ThemeContextSimple'
import { supabase } from '../lib/supabase'

export default function Register() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Veuillez renseigner votre nom complet')
      return false
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      setError('Veuillez renseigner un email valide')
      return false
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      // S'inscrire avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone
          }
        }
      })
      
      if (authError) throw authError
      
      setSuccess(true)
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 2000)
      
    } catch (err) {
      console.error('Erreur d\'inscription:', err)
      setError(err.message || 'Une erreur est survenue lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{
      background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
    }}>
      <V3Sidebar 
        conversations={[]} 
        onNewChat={() => router.push('/')}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      
      <div className="flex-1 overflow-y-auto">
        {/* HERO SECTION */}
        <section 
          className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          
          <div className="relative z-10 text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              Rejoignez Gliitz
            </h1>
            <p 
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
              style={{
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              Accédez à des expériences de luxe exclusives
            </p>
          </div>
        </section>

        {/* FORMULAIRE D'INSCRIPTION */}
        <section className="max-w-2xl mx-auto px-4 md:px-8 py-16">
          {success ? (
            <div 
              className="glass-live p-8 rounded-3xl text-center"
              style={{
                animation: 'fade-slide-up 0.6s ease-out'
              }}
            >
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(167,199,197,0.2), rgba(167,199,197,0.4))',
                  border: '2px solid rgba(167,199,197,0.5)'
                }}
              >
                <Check size={40} style={{ color: '#A7C7C5' }} />
              </div>
              
              <h2 
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
              >
                Inscription réussie !
              </h2>
              
              <p 
                className="text-base mb-6"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                }}
              >
                Votre compte a été créé avec succès. Vérifiez votre email pour confirmer votre inscription.
              </p>
              
              <p 
                className="text-sm"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: '#A7C7C5'
                }}
              >
                Redirection en cours...
              </p>
            </div>
          ) : (
            <div className="glass-live p-8 rounded-3xl">
              <h2 
                className="text-2xl font-bold mb-6 text-center"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
              >
                Créer votre compte
              </h2>

              {error && (
                <div 
                  className="mb-6 p-4 rounded-xl"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px'
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Prénom & Nom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label 
                      className="block mb-2 text-sm font-medium"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                      }}
                    >
                      Prénom
                    </label>
                    <div className="relative">
                      <User 
                        size={18} 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        style={{ color: '#A7C7C5' }}
                      />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Jean"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all"
                        style={{
                          background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          border: '1px solid rgba(167,199,197,0.2)',
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(167,199,197,0.5)'
                          e.target.style.boxShadow = '0 0 20px rgba(167,199,197,0.2)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(167,199,197,0.2)'
                          e.target.style.boxShadow = 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block mb-2 text-sm font-medium"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                      }}
                    >
                      Nom
                    </label>
                    <div className="relative">
                      <User 
                        size={18} 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        style={{ color: '#A7C7C5' }}
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Dupont"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all"
                        style={{
                          background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          border: '1px solid rgba(167,199,197,0.2)',
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(167,199,197,0.5)'
                          e.target.style.boxShadow = '0 0 20px rgba(167,199,197,0.2)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(167,199,197,0.2)'
                          e.target.style.boxShadow = 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label 
                    className="block mb-2 text-sm font-medium"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                    }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail 
                      size={18} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#A7C7C5' }}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean.dupont@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all"
                      style={{
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(167,199,197,0.2)',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(167,199,197,0.5)'
                        e.target.style.boxShadow = '0 0 20px rgba(167,199,197,0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(167,199,197,0.2)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label 
                    className="block mb-2 text-sm font-medium"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                    }}
                  >
                    Téléphone (optionnel)
                  </label>
                  <div className="relative">
                    <Phone 
                      size={18} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#A7C7C5' }}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all"
                      style={{
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(167,199,197,0.2)',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(167,199,197,0.5)'
                        e.target.style.boxShadow = '0 0 20px rgba(167,199,197,0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(167,199,197,0.2)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label 
                    className="block mb-2 text-sm font-medium"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                    }}
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#A7C7C5' }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-3 rounded-xl outline-none transition-all"
                      style={{
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(167,199,197,0.2)',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(167,199,197,0.5)'
                        e.target.style.boxShadow = '0 0 20px rgba(167,199,197,0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(167,199,197,0.2)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#A7C7C5' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirmation mot de passe */}
                <div>
                  <label 
                    className="block mb-2 text-sm font-medium"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                    }}
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#A7C7C5' }}
                    />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-3 rounded-xl outline-none transition-all"
                      style={{
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(167,199,197,0.2)',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(167,199,197,0.5)'
                        e.target.style.boxShadow = '0 0 20px rgba(167,199,197,0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(167,199,197,0.2)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#A7C7C5' }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-semibold transition-all duration-300 mt-8"
                  style={{
                    background: isLoading 
                      ? 'rgba(167,199,197,0.3)'
                      : 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167,199,197,1), rgba(157,180,192,1))'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(167,199,197,0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                </button>
              </form>

              {/* Lien vers connexion */}
              <div className="mt-6 text-center">
                <p 
                  className="text-sm"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                  }}
                >
                  Vous avez déjà un compte ?{' '}
                  <button
                    onClick={() => router.push('/login')}
                    className="font-semibold transition-all"
                    style={{ color: '#A7C7C5' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useRouter } from 'next/router'
import { Mail, Send, Check } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Newsletter() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
      setEmail('')
    }, 1000)
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
        {/* HERO BANNER - NOUVELLE IMAGE */}
        <section 
          className="banner-mirror-effect relative w-full h-[50vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&q=90)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              Newsletter Gliitz
            </h1>
            <p 
              className="text-xl md:text-2xl text-white/90"
              style={{
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              Restez informé des meilleures expériences de luxe
            </p>
          </div>
        </section>

        {/* NEWSLETTER CONTENT */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
          <div 
            className="rounded-3xl p-8 md:p-12"
            style={{
              background: isDarkMode 
                ? 'rgba(26,26,28,0.95)' 
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
          >
            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #C0C0C0 0%, #E5E5E5 100%)'
                        : 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)'
                    }}
                  >
                    <Mail size={28} className="text-white" />
                  </div>
                  
                  <h2 
                    className="text-3xl font-bold mb-4"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    Rejoignez notre communauté
                  </h2>
                  
                  <p 
                    className="text-lg"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666'
                    }}
                  >
                    Recevez chaque semaine nos recommandations exclusives,
                    événements privés et offres VIP
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { icon: '🎯', title: 'Recommandations exclusives', desc: 'Les meilleures adresses de Marbella' },
                    { icon: '🎉', title: 'Événements privés', desc: 'Accès en avant-première' },
                    { icon: '💎', title: 'Offres VIP', desc: 'Réductions pour nos abonnés' }
                  ].map((benefit, idx) => (
                    <div key={idx} className="text-center p-4">
                      <div className="text-3xl mb-2">{benefit.icon}</div>
                      <h3 
                        className="text-lg font-bold mb-2"
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                        }}
                      >
                        {benefit.title}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#666666'
                        }}
                      >
                        {benefit.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre email"
                      required
                      className="flex-1 px-4 py-3 rounded-xl outline-none"
                      style={{
                        background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                      style={{
                        background: isDarkMode 
                          ? 'linear-gradient(135deg, #1a1a1a, #2c2c2c)'
                          : 'linear-gradient(135deg, #0B0B0C, #1a1a1a)',
                        color: 'white',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {isLoading ? 'Envoi...' : 'S\'inscrire'}
                      <Send size={18} />
                    </button>
                  </div>
                  <p 
                    className="text-xs mt-3 text-center"
                    style={{
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Nous respectons votre vie privée. Désinscription possible à tout moment.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)'
                  }}
                >
                  <Check size={40} className="text-white" />
                </div>
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  Merci de votre inscription !
                </h3>
                <p 
                  className="text-lg mb-6"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666'
                  }}
                >
                  Vous recevrez bientôt votre première newsletter
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}


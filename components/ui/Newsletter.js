import React, { useState } from 'react'
import { Mail, Send, Check } from 'lucide-react'

const Newsletter = ({ isDarkMode = false }) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simuler l'inscription à la newsletter
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      setEmail('')
    }, 1500)
  }

  if (isSubscribed) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div 
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{
            background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
            boxShadow: '0 0 20px rgba(192,192,192,0.4)'
          }}
        >
            <Check size={32} style={{ color: '#0B0B0C' }} />
          </div>
          <h3 
            className="text-2xl font-bold mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 600,
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            Merci pour votre inscription !
          </h3>
          <p 
            className="text-lg"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              color: isDarkMode ? '#E0E0E0' : '#666666'
            }}
          >
            Vous recevrez bientôt nos dernières actualités et offres exclusives.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="py-20 relative overflow-hidden w-full"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)'
      }}
    >
      {/* Effets de fond argentés */}
      <div className="absolute inset-0" style={{ opacity: isDarkMode ? 0.05 : 0.08 }}>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full" style={{
          background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
          filter: 'blur(40px)'
        }}></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full" style={{
          background: 'linear-gradient(135deg, #D0D0D0, #A0A0A0)',
          filter: 'blur(50px)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full" style={{
          background: 'linear-gradient(135deg, #C0C0C0, #E0E0E0)',
          filter: 'blur(30px)',
          transform: 'translate(-50%, -50%)'
        }}></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
        {/* Icône avec animation */}
        <div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 animate-pulse" 
          style={{
          background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
            boxShadow: '0 0 20px rgba(192,192,192,0.4)'
          }}
        >
          <Mail size={36} style={{ color: '#0B0B0C' }} />
        </div>

        {/* Titre simple */}
        <h2 
          className="text-4xl lg:text-5xl font-bold mb-6"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 600,
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          Restez connectés ✨
        </h2>
        
        {/* Description améliorée */}
        <p 
          className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            color: isDarkMode ? '#E0E0E0' : '#666666'
          }}
        >
          Recevez nos dernières sélections et offres exclusives
        </p>

        {/* Formulaire amélioré */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-4 p-2 rounded-2xl" style={{
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 8px 32px rgba(0, 0, 0, 0.15)'
            }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
                className={`flex-1 px-6 py-4 rounded-xl border-0 focus:outline-none transition-all duration-300 bg-transparent ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
              required
            />
            <button
              type="submit"
              disabled={isLoading || !email}
              className="px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                color: '#0B0B0C',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                minWidth: '150px'
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  <span>S'inscrire</span>
                </>
              )}
            </button>
            </div>
          </div>
        </form>

        {/* Avantages - Icônes centrées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div 
            className="flex flex-col md:flex-row items-center justify-center gap-3 p-6 rounded-xl" 
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
            }}>
              <span style={{ color: '#0B0B0C' }}>🎯</span>
            </div>
            <span 
              className="text-sm font-semibold"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? '#E0E0E0' : '#0B0B0C'
              }}
            >
              Offres exclusives
            </span>
          </div>
          
          <div 
            className="flex flex-col md:flex-row items-center justify-center gap-3 p-6 rounded-xl" 
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
            }}>
              <span style={{ color: '#0B0B0C' }}>⭐</span>
            </div>
            <span 
              className="text-sm font-semibold"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? '#E0E0E0' : '#0B0B0C'
              }}
            >
              Conseils VIP
            </span>
          </div>
          
          <div 
            className="flex flex-col md:flex-row items-center justify-center gap-3 p-6 rounded-xl" 
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
            }}>
              <span style={{ color: '#0B0B0C' }}>🚀</span>
            </div>
            <span 
              className="text-sm font-semibold"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? '#E0E0E0' : '#0B0B0C'
              }}
            >
              Actualités
            </span>
          </div>
        </div>

        {/* Note de confidentialité améliorée */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 flex items-center justify-center gap-2">
          <span>🔒</span>
          Nous respectons votre vie privée. Désabonnement possible à tout moment.
        </p>
      </div>
    </div>
  )
}

export default Newsletter

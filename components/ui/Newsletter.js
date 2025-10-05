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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-green-100 dark:bg-green-900/20">
            <Check size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Merci pour votre inscription !
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
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
      {/* Effets de fond */}
      <div className="absolute inset-0" style={{ opacity: isDarkMode ? 0.1 : 0.15 }}>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full" style={{
          background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
          filter: 'blur(40px)'
        }}></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full" style={{
          background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
          filter: 'blur(50px)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full" style={{
          background: 'linear-gradient(135deg, #EC4899, #F97316)',
          filter: 'blur(30px)',
          transform: 'translate(-50%, -50%)'
        }}></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
        {/* Icône avec animation */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 animate-pulse" style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)'
        }}>
          <Mail size={36} className="text-white" />
        </div>

        {/* Titre simple */}
        <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Restez connecté avec Gliitz
        </h2>
        
        {/* Description améliorée */}
        <p className={`text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          ✨ Recevez nos dernières actualités, offres exclusives et conseils pour vivre Marbella comme un local. 
          <br />
          <span className={`text-lg ${isDarkMode ? 'text-gray-400 opacity-80' : 'text-gray-600 opacity-90'}`}>Rejoignez notre communauté VIP !</span>
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
                className="px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                  boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
              }}
            >
              {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                    <Send size={22} />
                  S'abonner
                </>
              )}
            </button>
            </div>
          </div>
        </form>

        {/* Avantages - Icônes centrées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-6 rounded-xl" style={{
            background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)',
            border: isDarkMode ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.15)'
          }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
            }}>
              <span className="text-white text-sm">🎯</span>
            </div>
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Offres exclusives</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-6 rounded-xl" style={{
            background: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.8)',
            border: isDarkMode ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
            boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.15)'
          }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #F59E0B, #FCD34D)'
            }}>
              <span className="text-white text-sm">⭐</span>
            </div>
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Conseils VIP</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-6 rounded-xl" style={{
            background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)',
            border: isDarkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.15)'
          }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
            }}>
              <span className="text-white text-sm">🚀</span>
            </div>
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Actualités</span>
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

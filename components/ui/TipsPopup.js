import { useState, useEffect } from 'react'
import { Lightbulb, X, Sparkles } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function TipsPopup() {
  const [showTip, setShowTip] = useState(false)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const { isDarkMode } = useTheme()

  const tips = [
    {
      icon: '💡',
      title: 'Astuce du jour',
      message: 'Demandez-moi de vous recommander un restaurant selon vos goûts et votre budget !'
    },
    {
      icon: '⭐',
      title: 'Le saviez-vous ?',
      message: 'Vous pouvez réserver directement via le chat pour tous nos partenaires premium.'
    },
    {
      icon: '🎯',
      title: 'Conseil',
      message: 'Utilisez des mots-clés comme "plage", "romantique" ou "famille" pour des recommandations ciblées.'
    },
    {
      icon: '🚀',
      title: 'Nouveauté',
      message: 'Découvrez nos nouveaux partenaires dans la zone de Puerto Banús !'
    },
    {
      icon: '💎',
      title: 'Premium',
      message: 'Les membres premium bénéficient de réductions exclusives dans nos établissements partenaires.'
    }
  ]

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu les tips aujourd'hui
    const lastTipDate = localStorage.getItem('gliitz-last-tip-date')
    const today = new Date().toDateString()
    
    if (lastTipDate !== today) {
      // Afficher le tip après 10 secondes
      const timer = setTimeout(() => {
        setShowTip(true)
        localStorage.setItem('gliitz-last-tip-date', today)
      }, 10000)
      
      return () => clearTimeout(timer)
    }

    // Changer de tip toutes les 30 secondes si affiché
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length)
    }, 30000)

    return () => clearInterval(interval)
  }, [tips.length])

  const closeTip = () => {
    setShowTip(false)
  }

  if (!showTip) return null

  const currentTip = tips[currentTipIndex]

  return (
    <div 
      className="fixed bottom-24 right-6 z-40 max-w-xs animate-slide-in-right"
      style={{
        animation: 'slideInRight 0.5s ease-out'
      }}
    >
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      <div 
        className="relative rounded-2xl p-4 shadow-2xl"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)'
            : 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #a855f7 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)'
        }}
      >
        {/* Icône animée avec titre compact */}
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <span className="text-lg">{currentTip.icon}</span>
          </div>
          <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
            {currentTip.title}
            <Sparkles size={14} className="text-yellow-300 animate-pulse" />
          </h3>
        </div>

        {/* Message compact */}
        <p className="text-white text-xs leading-snug mb-3 pl-0">
          {currentTip.message}
        </p>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2">
          <button
            onClick={closeTip}
            className="flex-1 text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
            style={{
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            Passer
          </button>
          
          {/* Afficher "Suivant" si ce n'est pas la dernière astuce, sinon "C'est parti" */}
          {currentTipIndex < tips.length - 1 ? (
            <button
              onClick={() => setCurrentTipIndex((prev) => (prev + 1))}
              className="flex-1 text-white text-xs font-bold py-2 px-3 rounded-lg hover:scale-105 transition-all duration-200 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                border: '2px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={() => {
                closeTip()
                // Ouvrir le chat ou rediriger vers la page d'accueil
                if (window.location.pathname === '/') {
                  window.dispatchEvent(new CustomEvent('openMobileChat'))
                } else {
                  window.location.href = '/'
                }
              }}
              className="flex-1 text-white text-xs font-bold py-2 px-3 rounded-lg hover:scale-105 transition-all duration-200 shadow-lg animate-pulse"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                border: '2px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              C'est parti ! 🚀
            </button>
          )}
        </div>

        {/* Indicateurs discrets */}
        <div className="flex justify-center gap-1 mt-2">
          {tips.map((_, index) => (
            <div
              key={index}
              className="w-1 h-1 rounded-full transition-all duration-300"
              style={{
                background: index === currentTipIndex 
                  ? 'white' 
                  : 'rgba(255, 255, 255, 0.3)',
                transform: index === currentTipIndex ? 'scale(1.4)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


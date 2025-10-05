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
      className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-in-right"
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
      `}</style>
      
      <div 
        className="relative rounded-2xl p-5 shadow-2xl"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)'
            : 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)'
        }}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={closeTip}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-all duration-200"
          aria-label="Fermer"
        >
          <X size={18} className="text-white" />
        </button>

        {/* Icône animée */}
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <span className="text-2xl">{currentTip.icon}</span>
          </div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            {currentTip.title}
            <Sparkles size={16} className="text-yellow-300 animate-pulse" />
          </h3>
        </div>

        {/* Message */}
        <p className="text-white text-sm leading-relaxed mb-4 pl-13">
          {currentTip.message}
        </p>

        {/* Bouton suivant et indicateurs */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-1.5">
            {tips.map((_, index) => (
              <div
                key={index}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: index === currentTipIndex 
                    ? 'white' 
                    : 'rgba(255, 255, 255, 0.4)',
                  transform: index === currentTipIndex ? 'scale(1.3)' : 'scale(1)'
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tips.length)}
            className="text-white text-xs px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  )
}


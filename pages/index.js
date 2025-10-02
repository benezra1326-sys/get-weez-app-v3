import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ChatInterfaceNew from '../components/chat/ChatInterfaceNew'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import { useTheme } from '../contexts/ThemeContextSimple'
import { usePreloader } from '../lib/preloader'
import { 
  Sparkles, 
  MessageCircle, 
  MapPin, 
  History,
  X,
  ArrowRight,
  Star,
  Heart
} from 'lucide-react'

const Home = memo(({ user, setUser }) => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showIntroModal, setShowIntroModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { isDarkMode, toggleTheme, isLoaded } = useTheme()
  const { preloadPage } = usePreloader()
  
  // Récupérer le message depuis l'URL
  const { message } = router.query

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  // Précharger les pages importantes au montage
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadPage('/establishments')
      preloadPage('/services')
      preloadPage('/events')
    }, 2000) // Délai pour ne pas bloquer le chargement initial

    return () => clearTimeout(timer)
  }, [preloadPage])

  // Afficher le popup d'introduction au premier chargement UNIQUEMENT
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('get-weez-intro-seen')
    if (!hasSeenIntro) {
      const timer = setTimeout(() => {
        setShowIntroModal(true)
      }, 2000) // Délai pour laisser le temps au chargement
      return () => clearTimeout(timer)
    }
  }, [])

  const closeIntroModal = () => {
    setShowIntroModal(false)
    localStorage.setItem('get-weez-intro-seen', 'true')
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      closeIntroModal()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }


  // Récupérer le message de réservation depuis les query parameters
  const reservationMessage = router.query.message
  const establishmentName = router.query.establishment

  // Ne pas rendre avant que le thème soit chargé
  if (!isLoaded) {
    return (
      <div 
        className="w-full min-h-screen flex items-center justify-center" 
        style={{ 
          backgroundColor: isDarkMode ? '#0A0A0F' : '#FAFAFA',
          background: isDarkMode 
            ? 'radial-gradient(ellipse at center, #1a1a2e 0%, #0A0A0F 100%)'
            : 'radial-gradient(ellipse at center, #f8fafc 0%, #FAFAFA 100%)'
        }}
      >
        <div className="text-center">
          {/* Loader discret avec sparkling */}
          <div className="relative mb-6">
            {/* Sparkling subtils */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Sparkles flottants */}
              <div 
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(139, 92, 246, 0.8)',
                  top: '20%',
                  left: '30%',
                  animation: 'sparkle-float 3s ease-in-out infinite',
                  boxShadow: isDarkMode ? '0 0 6px rgba(255, 255, 255, 0.6)' : '0 0 6px rgba(139, 92, 246, 0.6)'
                }}
              />
              <div 
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(59, 130, 246, 0.6)',
                  top: '60%',
                  right: '25%',
                  animation: 'sparkle-float 3s ease-in-out infinite 1s',
                  boxShadow: isDarkMode ? '0 0 4px rgba(255, 255, 255, 0.4)' : '0 0 4px rgba(59, 130, 246, 0.4)'
                }}
              />
              <div 
                className="absolute w-0.5 h-0.5 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(6, 182, 212, 0.4)',
                  bottom: '30%',
                  left: '60%',
                  animation: 'sparkle-float 3s ease-in-out infinite 2s',
                  boxShadow: isDarkMode ? '0 0 3px rgba(255, 255, 255, 0.3)' : '0 0 3px rgba(6, 182, 212, 0.3)'
                }}
              />
              <div 
                className="absolute w-0.5 h-0.5 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  top: '40%',
                  right: '40%',
                  animation: 'sparkle-float 3s ease-in-out infinite 0.5s',
                  boxShadow: isDarkMode ? '0 0 3px rgba(255, 255, 255, 0.3)' : '0 0 3px rgba(139, 92, 246, 0.3)'
                }}
              />
            </div>
            
            {/* Cercle principal discret */}
            <div 
              className="relative w-8 h-8 mx-auto"
              style={{
                borderRadius: '50%',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
                animation: 'gentle-pulse 2s ease-in-out infinite',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Point central */}
              <div 
                className="absolute inset-2 rounded-full"
                style={{
                  background: isDarkMode 
                    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                  animation: 'gentle-glow 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          {/* Texte discret */}
          <div className="space-y-3">
            <h2 
              className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              style={{
                opacity: 0.8
              }}
            >
              Préparation...
            </h2>
            
            {/* Points de progression discrets */}
            <div className="flex justify-center space-x-1">
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(139, 92, 246, 0.4)',
                  animation: 'dot-pulse 1.5s ease-in-out infinite'
                }}
              />
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(59, 130, 246, 0.4)',
                  animation: 'dot-pulse 1.5s ease-in-out infinite 0.3s'
                }}
              />
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(6, 182, 212, 0.4)',
                  animation: 'dot-pulse 1.5s ease-in-out infinite 0.6s'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Styles CSS pour les animations modernes */}
        <style jsx>{`
          @keyframes pulse-modern {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 60px rgba(139, 92, 246, 0.6), 0 0 120px rgba(59, 130, 246, 0.3);
            }
          }
          
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          
          @keyframes loading-progress {
            0% {
              width: 0%;
              opacity: 0.8;
            }
            50% {
              width: 70%;
              opacity: 1;
            }
            100% {
              width: 100%;
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    )
  }

  // Données du popup d'introduction - Version interactive et ludique
  const introSteps = [
    {
      icon: <Sparkles size={48} className="text-purple-500 animate-pulse" />,
      title: "✨ Bienvenue sur Get Weez !",
      description: "Votre assistant IA personnel pour vivre Marbella comme un local ! 🏖️",
      features: [
        "🎯 Recommandations ultra-personnalisées basées sur vos goûts",
        "🤖 IA qui apprend de vos préférences",
        "⚡ Réponses instantanées 24h/7j"
      ],
      tip: "💡 Astuce : Plus vous chattez, plus je vous comprends !"
    },
    {
      icon: <MessageCircle size={48} className="text-blue-500 animate-bounce" />,
      title: "💬 Chat Intelligent & Intuitif",
      description: "Discutez naturellement, je comprends tout ! 🧠",
      features: [
        "🗣️ Parlez-moi comme à un ami local",
        "📚 Historique de toutes vos conversations",
        "🔄 Suggestions automatiques intelligentes"
      ],
      tip: "🎯 Essayez : 'Trouve-moi un resto romantique pour ce soir !'"
    },
    {
      icon: <MapPin size={48} className="text-green-500 animate-pulse" />,
      title: "🗺️ Géolocalisation Magique",
      description: "Je connais Marbella comme ma poche ! 📍",
      features: [
        "📍 Détection automatique de votre position",
        "🏆 Sélection des meilleurs établissements premium",
        "⭐ Avis authentiques et photos exclusives"
      ],
      tip: "🚀 Je peux même vous dire le temps d'attente en temps réel !"
    },
    {
      icon: <Heart size={48} className="text-red-500 animate-pulse" />,
      title: "🌟 Expériences VIP Exclusives",
      description: "Accès privilégié aux perles cachées de Marbella ! 💎",
      features: [
        "🍽️ Tables dans les restaurants les plus demandés",
        "🏨 Suites d'hôtels avec vue mer garantie",
        "🎉 Événements privés et soirées exclusives"
      ],
      tip: "🎭 Membre Get Weez = Traitement VIP partout !"
    }
  ]

  return (
    <div 
        style={{ 
          width: '100vw', 
          minHeight: '100vh', 
          margin: 0, 
          padding: 0, 
          backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', 
          maxWidth: 'none'
        }}
    >
      {/* Popup d'introduction - Petit en bas */}
      {showIntroModal && (
        <div 
          className="fixed z-[1000] bottom-24 right-4 w-80 max-h-96 lg:bottom-auto lg:right-8 lg:top-1/2 lg:-translate-y-1/2"
        >
          <div 
            className="rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
              backdropFilter: 'blur(20px) saturate(150%)',
              border: `2px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header du popup AMÉLIORÉ */}
            <div 
              className="p-4 text-center border-b"
              style={{
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(139, 92, 246, 0.2)',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              }}
            >
              <div className="flex justify-center mb-3">
                <div 
                  className="p-3 rounded-2xl"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                  }}
                >
                  {introSteps[currentStep].icon}
                </div>
              </div>
              <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {introSteps[currentStep].title}
              </h2>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {introSteps[currentStep].description}
              </p>
            </div>

            {/* Contenu du popup AMÉLIORÉ */}
            <div className="p-4">
              <div className="space-y-3 mb-4">
                {introSteps[currentStep].features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.6) 0%, rgba(31, 41, 55, 0.4) 100%)'
                        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
                      border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(139, 92, 246, 0.15)'}`,
                      boxShadow: isDarkMode 
                        ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                        : '0 2px 8px rgba(139, 92, 246, 0.1)',
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                      }}
                    />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Astuce interactive */}
              {introSteps[currentStep].tip && (
                <div 
                  className="mb-4 p-3 rounded-xl animate-pulse"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.08) 100%)',
                    border: `1px solid ${isDarkMode ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)'}`,
                  }}
                >
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                    {introSteps[currentStep].tip}
                  </p>
                </div>
              )}

              {/* Indicateurs de progression AMÉLIORÉS */}
              <div className="flex justify-center space-x-2 mb-4">
                {introSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'scale-125' 
                        : 'opacity-50'
                    }`}
                    style={{
                      background: index === currentStep 
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
                        : isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(156, 163, 175, 0.6)',
                      boxShadow: index === currentStep 
                        ? '0 0 8px rgba(139, 92, 246, 0.4)'
                        : 'none'
                    }}
                  />
                ))}
              </div>


              {/* Boutons de navigation AMÉLIORÉS */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentStep === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.6) 0%, rgba(55, 65, 81, 0.4) 100%)'
                      : 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.6) 100%)',
                    color: isDarkMode ? '#d1d5db' : '#4b5563',
                    border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)'}`,
                  }}
                >
                  Précédent
                </button>

                {/* Bouton passer */}
                <button
                  onClick={closeIntroModal}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.6) 0%, rgba(55, 65, 81, 0.4) 100%)'
                      : 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.6) 100%)',
                    color: isDarkMode ? '#d1d5db' : '#4b5563',
                    border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)'}`,
                  }}
                >
                  Passer
                </button>

                <button
                  onClick={nextStep}
                  className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span>{currentStep === 3 ? "C'est parti !" : 'Suivant'}</span>
                  {currentStep < 3 && <ArrowRight size={14} />}
                </button>
              </div>
            </div>

            {/* Bouton fermer */}
            <button
              onClick={closeIntroModal}
              className="absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(243, 244, 246, 0.8)',
              }}
            >
              <X size={14} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </button>
          </div>
        </div>
      )}

      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          width: '100vw', 
          margin: 0, 
          padding: 0, 
          backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', 
          position: 'relative', 
          maxWidth: 'none'
        }}
      >
        {/* Header */}
        <Header 
          user={user} 
          setUser={setUser}
          toggleMobileMenu={toggleMobileMenu} 
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Menu mobile */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          user={user} 
        />
        
        {/* Contenu principal */}
        <main 
          style={{ 
            flex: 1, 
            overflowY: 'auto', // Scroll libre sur mobile
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', 
            width: '100vw', 
            minHeight: 'calc(100vh - 6rem)', 
            display: 'flex', 
            justifyContent: 'stretch', 
            alignItems: 'stretch', 
            maxWidth: 'none',
            WebkitOverflowScrolling: 'touch', // Scroll fluide iOS
            overscrollBehavior: 'auto' // Permettre rebond naturel
          }}
        >
          <ChatInterfaceNew 
            user={user} 
            initialMessage={message || reservationMessage}
            establishmentName={establishmentName}
          />
        </main>
        
        {/* Footer rétabli - visible sur mobile */}
        <footer 
          className="block"
          style={{ 
            backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
            padding: '1rem 2rem',
            textAlign: 'center',
            color: isDarkMode ? '#F9FAFB' : '#333333',
            marginTop: 'auto',
            position: 'relative',
            zIndex: 1,
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: 0,
            flexShrink: 0
          }}
        >
          {/* Logo Get Weez */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div 
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                borderRadius: '12px',
                padding: '8px 16px',
                display: 'inline-block',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                marginBottom: '0.5rem'
              }}
            >
              <h1 
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                  fontFamily: 'Blanka, sans-serif',
                  letterSpacing: '0.1em'
                }}
              >
                GET WEEZ
              </h1>
            </div>
            <p 
              style={{ 
                fontSize: '0.875rem', 
                color: isDarkMode ? '#9CA3AF' : '#666666', 
                margin: '0.125rem 0',
                fontWeight: '500'
              }}
            >
              Your luxury AI concierge, anytime, anywhere
            </p>
          </div>
          
          {/* Copyright */}
          <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#6B7280' : '#999999', margin: 0 }}>
            GET WEEZ - ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    </div>
  )
})

Home.displayName = 'Home'

export default Home

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

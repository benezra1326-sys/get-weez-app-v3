import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ChatInterface from '../components/chat/ChatInterface'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import { useTheme } from '../contexts/ThemeContextSimple'
import { usePreloader } from '../lib/preloader'
import { 
  Sparkles, 
  MessageCircle, 
  MapPin, 
  Mic, 
  Volume2, 
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

  // Afficher le popup d'introduction au premier chargement
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('get-weez-intro-seen')
    if (!hasSeenIntro) {
      const timer = setTimeout(() => {
        setShowIntroModal(true)
      }, 1500) // Délai pour laisser le temps au chargement
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
          backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)'
        }}
      >
        <div className="text-center">
          {/* Logo Get Weez animé */}
          <div className="relative mb-8">
            {/* Cercle de fond avec animation de pulsation */}
            <div 
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
                width: '120px',
                height: '120px',
                margin: '0 auto',
                opacity: 0.3
              }}
            />
            
            {/* Logo principal avec rotation */}
            <div 
              className="relative rounded-full flex items-center justify-center mx-auto animate-spin"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
                width: '100px',
                height: '100px',
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                animation: 'spin 2s linear infinite, pulse 2s ease-in-out infinite'
              }}
            >
              {/* Icône MessageCircle au centre */}
              <MessageCircle size={40} className="text-white drop-shadow-lg" />
              
              {/* Éclats de magie autour du logo */}
              <div className="absolute -top-2 -right-2">
                <Sparkles 
                  size={16} 
                  className="text-yellow-300 animate-pulse drop-shadow-lg" 
                  style={{ animation: 'bounce 1s ease-in-out infinite' }}
                />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <Sparkles 
                  size={12} 
                  className="text-yellow-400 animate-pulse drop-shadow-lg" 
                  style={{ animation: 'bounce 1.5s ease-in-out infinite' }}
                />
              </div>
              <div className="absolute top-1 -left-2">
                <Sparkles 
                  size={10} 
                  className="text-yellow-500 animate-pulse drop-shadow-lg" 
                  style={{ animation: 'bounce 2s ease-in-out infinite' }}
                />
              </div>
            </div>
          </div>
          
          {/* Texte de chargement avec animation */}
          <div className="space-y-2">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Get Weez
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Chargement de votre expérience Marbella...
            </p>
            
            {/* Barre de progression animée */}
            <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto mt-4 overflow-hidden">
              <div 
                className="h-full rounded-full animate-pulse"
                style={{
                  background: 'linear-gradient(90deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
                  animation: 'loading-bar 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Styles CSS pour les animations personnalisées */}
        <style jsx>{`
          @keyframes loading-bar {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.1); }
          }
        `}</style>
      </div>
    )
  }

  // Données du popup d'introduction
  const introSteps = [
    {
      icon: <Sparkles size={48} className="text-purple-500" />,
      title: "Bienvenue sur Get Weez",
      description: "Votre assistant personnel pour découvrir les meilleures expériences à Marbella",
      features: ["🎯 Recommandations personnalisées", "🗺️ Géolocalisation intelligente", "💬 Chat en temps réel"]
    },
    {
      icon: <MessageCircle size={48} className="text-blue-500" />,
      title: "Chat Intelligent",
      description: "Posez vos questions et obtenez des réponses instantanées",
      features: ["🎤 Dictée vocale", "🔊 Réponse vocale", "📚 Historique des conversations"]
    },
    {
      icon: <MapPin size={48} className="text-green-500" />,
      title: "Géolocalisation",
      description: "Découvrez les meilleurs endroits près de vous",
      features: ["📍 Détection automatique de zone", "🏆 Établissements premium", "⭐ Avis et recommandations"]
    },
    {
      icon: <Heart size={48} className="text-red-500" />,
      title: "Expériences Exclusives",
      description: "Accédez aux meilleures expériences de Marbella",
      features: ["🍽️ Restaurants gastronomiques", "🏨 Hôtels de luxe", "🎉 Événements VIP"]
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
      {/* Popup d'introduction */}
      {showIntroModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div 
            className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.90) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.90) 100%)',
              backdropFilter: 'blur(20px) saturate(150%)',
              border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)'}`,
            }}
          >
            {/* Header du popup */}
            <div 
              className="p-6 text-center border-b"
              style={{
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)',
              }}
            >
              <div className="flex justify-center mb-4">
                {introSteps[currentStep].icon}
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {introSteps[currentStep].title}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {introSteps[currentStep].description}
              </p>
            </div>

            {/* Contenu du popup */}
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {introSteps[currentStep].features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: isDarkMode ? 'rgba(55, 65, 81, 0.4)' : 'rgba(248, 250, 252, 0.6)',
                    }}
                  >
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Indicateurs de progression */}
              <div className="flex justify-center space-x-2 mb-6">
                {introSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-purple-500 scale-125' 
                        : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Boutons de navigation */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentStep === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    background: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.6)',
                    color: isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }}
                >
                  Précédent
                </button>

                <button
                  onClick={nextStep}
                  className="px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                  }}
                >
                  <span>{currentStep === 3 ? 'Commencer' : 'Suivant'}</span>
                  {currentStep < 3 && <ArrowRight size={16} />}
                </button>
              </div>
            </div>

            {/* Bouton fermer */}
            <button
              onClick={closeIntroModal}
              className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.6)',
              }}
            >
              <X size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
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
          <ChatInterface 
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

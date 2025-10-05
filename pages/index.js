import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ChatMain from '../components/chat/ChatMain'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import Newsletter from '../components/ui/Newsletter'
import ChatFloatingButton from '../components/ui/ChatFloatingButton'
import BrandCarousel, { DestinationsSection, PressSection } from '../components/ui/BrandCarousel'
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

  // Ne pas rendre avant que le thème soit chargé - Afficher le nouveau loader
  if (!isLoaded) {
    // Importer le loader dynamiquement
    const GliitzLoader = require('../components/ui/GliitzLoader').default
    return <GliitzLoader text="Préparation de votre expérience..." />
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
      {/* Popup d'introduction - Position optimisée mobile */}
      {showIntroModal && (
        <div 
          className="fixed z-[1000] inset-x-4 bottom-4 lg:bottom-auto lg:right-8 lg:left-auto lg:w-96 lg:top-1/2 lg:-translate-y-1/2"
          style={{
            maxHeight: 'calc(100vh - 100px)',
            width: 'calc(100% - 2rem)'
          }}
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
        <HeaderGliitz 
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

        {/* Bouton flottant pour le chat - apparaît après scroll */}
        <ChatFloatingButton />
        
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
          <ChatMain 
            user={user} 
            initialMessage={message || reservationMessage}
            establishmentName={establishmentName}
          />
        </main>
        
        {/* Carousel de partenaires - Pleine largeur - AVANT le footer */}
        <div 
          className="w-full"
          style={{
            background: isDarkMode
              ? 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.3) 50%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(248, 250, 252, 0.5) 50%, transparent 100%)'
          }}
        >
          <BrandCarousel />
        </div>
        
        {/* Section Destinations - Gliitz worldwide */}
        <DestinationsSection />
        
        {/* Section Presse - On parle de nous */}
        <PressSection />
        
        {/* Footer moderne et attrayant */}
        <footer 
          className="relative overflow-hidden"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
              : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
            marginTop: 'auto',
            position: 'relative',
            zIndex: 1,
            width: '100%',
            boxSizing: 'border-box',
            flexShrink: 0,
            borderTop: isDarkMode ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Effets de fond */}
          <div className="absolute inset-0" style={{ opacity: isDarkMode ? 0.05 : 0.08 }}>
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full" style={{
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              filter: 'blur(60px)'
            }}></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full" style={{
              background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
              filter: 'blur(80px)'
            }}></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full" style={{
              background: 'linear-gradient(135deg, #EC4899, #F97316)',
              filter: 'blur(40px)',
              transform: 'translate(-50%, -50%)'
            }}></div>
          </div>

          <div className="relative z-10">
            {/* Section principale du footer */}
            <div className="py-16 px-4 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Logo et description centrés */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center mb-6">
                    <div 
                      className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 24px'
              }}
            >
              <h1 
                        className="logo-text"
                style={{
                          fontFamily: '"Proxima Soft Black", "Montserrat", "Proxima Nova", "Source Sans Pro", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          fontSize: '2rem',
                          fontWeight: '900',
                          color: '#ffffff',
                          letterSpacing: '-0.02em',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                          margin: 0
                        }}
                      >
                        Gliitz
              </h1>
            </div>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4" style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #F59E0B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Votre concierge IA magique
                  </h3>
                  
                  <p className={`text-lg max-w-2xl mx-auto mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Partout et toujours ✨ Découvrez Marbella comme jamais auparavant avec notre IA personnalisée
                  </p>
                </div>

                {/* Grille d'informations - Icônes centrées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {/* Contact */}
                  <div className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                    }}>
                      <span className="text-white text-xl">📧</span>
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      hello@gliitz.com<br />
                      +34 123 456 789
                    </p>
                  </div>

                  {/* Services */}
                  <div className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                      boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
                    }}>
                      <span className="text-white text-xl">⭐</span>
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Services</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Recommandations IA<br />
                      Réservations VIP<br />
                      Conciergerie 24/7
                    </p>
                  </div>

                  {/* Localisation */}
                  <div className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                    }}>
                      <span className="text-white text-xl">📍</span>
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Localisation</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Marbella, Espagne<br />
                      Costa del Sol
                    </p>
                  </div>
                </div>
                
                {/* Newsletter */}
                <Newsletter isDarkMode={isDarkMode} />

                {/* Liens sociaux et copyright */}
                <div className="pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Liens sociaux */}
                    <div className="flex items-center gap-4">
                      <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                      }}>
                        <span className="text-white text-sm">📘</span>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{
                        background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                      }}>
                        <span className="text-white text-sm">📷</span>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{
                        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}>
                        <span className="text-white text-sm">🐦</span>
                      </a>
          </div>
          
          {/* Copyright */}
                    <div className="text-center md:text-right">
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        © 2025 Gliitz. Tous droits réservés.
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Fait avec ❤️ à Marbella
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
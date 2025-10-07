import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import Newsletter from '../components/ui/Newsletter'
import BrandCarousel, { DestinationsSection, PressSection } from '../components/ui/BrandCarousel'
import { useTheme } from '../contexts/ThemeContextSimple'
import { 
  MessageCircle, 
  MapPin, 
  Calendar,
  Utensils,
  Music,
  Sparkles,
  ArrowRight,
  Star,
  Heart,
  ChevronRight
} from 'lucide-react'

const Home = memo(({ user, setUser }) => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { isDarkMode, toggleTheme, isLoaded } = useTheme()

  // Images ULTRA-LUXE services de conciergerie Marbella
  const luxuryImages = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2400', // Villa luxe piscine infinity
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2400', // Lamborghini devant villa
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2400', // Jet privé
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2400', // Beach club luxe mer
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2400', // Rooftop au bord de l'eau 
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2400', // Soirée DJ luxe
    'https://images.unsplash.com/photo-1583094022700-7ff4a6564001?q=80&w=2400', // Hélicoptère luxe
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2400', // Yacht de luxe
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2400', // Supercar Ferrari/Porsche
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2400', // Restaurant gastronomique luxe
  ]

  // Carrousel automatique des images (plus lent pour apprécier le luxe)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % luxuryImages.length)
    }, 6000) // Change toutes les 6 secondes pour plus d'élégance

    return () => clearInterval(interval)
  }, [luxuryImages.length])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleOpenChat = () => {
    setIsChatOpen(true)
  }

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center glass">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-silver border-t-transparent mx-auto mb-4"></div>
          <p style={{ fontFamily: 'var(--font-family-primary)', color: 'var(--gliitz-silver)' }}>
            Chargement de Gliitz...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
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

      {/* Main Content */}
      <main className="w-full">
        {/* 1️⃣ HERO BANNER - Chat IA avec carrousel d'images luxe */}
        <section 
          className="relative w-full overflow-hidden"
          style={{
            minHeight: '100vh',
            background: '#0B0B0C',
          }}
        >
          {/* Carrousel d'images de fond avec fondu doux */}
          {luxuryImages.map((image, index) => (
            <div 
              key={index}
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("${image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 2s ease-in-out',
              }}
            />
          ))}

          {/* Overlay gradient élégant */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 100%)',
            }}
          />
          
          {/* Effet de vignette subtil pour le luxe */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
            }}
          />

          {/* Indicateurs de carrousel */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {luxuryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: index === currentImageIndex 
                    ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                    : 'rgba(255,255,255,0.3)',
                  transform: index === currentImageIndex ? 'scale(1.5)' : 'scale(1)',
                  boxShadow: index === currentImageIndex ? '0 0 10px rgba(192,192,192,0.6)' : 'none'
                }}
              />
            ))}
          </div>

          {/* Contenu Hero - Centré verticalement */}
          <div className="relative z-20 h-full flex items-center justify-center px-4">
            <div className="max-w-5xl mx-auto text-center w-full">
              {/* Badge "IA Powered" */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Sparkles size={16} style={{ color: '#FFFFFF' }} className="animate-pulse" />
                <span 
                  className="text-sm font-medium"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    color: '#FFFFFF'
                  }}
                >
                  Propulsé par Intelligence Artificielle
                </span>
              </div>

              {/* Titre principal */}
              <h1 
                className="gliitz-title-hero mb-8"
                style={{ 
                  maxWidth: '900px',
                  margin: '0 auto 2rem auto'
                }}
              >
                Votre assistant personnel intelligent,
                <br />
                100% gratuit
              </h1>

              {/* Sous-titre */}
              <p 
                className="gliitz-subtitle mb-12"
                style={{ 
                  maxWidth: '700px',
                  margin: '0 auto 3rem auto',
                  color: '#E0E0E0',
                  fontWeight: 300
                }}
              >
                Gliitz, la conciergerie IA qui répond à tous vos besoins,
                <br />
                instantanément. ✨
              </p>

              {/* CTA Button */}
              <button
                onClick={handleOpenChat}
                className="btn-gliitz-primary inline-flex items-center gap-3"
              >
                <MessageCircle size={22} strokeWidth={1.5} />
                <span>Lancer le chat</span>
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>

              {/* Stats rapides */}
              <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
                {[
                  { label: 'Réponses instantanées', icon: '⚡', value: '24/7' },
                  { label: 'Recommandations', icon: '🎯', value: '1000+' },
                  { label: 'Utilisateurs satisfaits', icon: '⭐', value: '98%' }
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(12px)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,192,192,0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div 
                      className="text-2xl font-bold mb-1"
                      style={{ 
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 600,
                        color: '#FFFFFF'
                      }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 400,
                        color: '#E0E0E0'
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ SUGGESTIONS PERSONNALISÉES */}
        <section 
          className="section-light py-20"
          style={{ 
            background: isDarkMode ? 'var(--gliitz-black)' : 'var(--gliitz-gray-light)' 
          }}
        >
          <div className="container mx-auto px-4">
            {/* En-tête section */}
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{ 
                  fontFamily: 'var(--font-family-display)',
                  color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
                }}
              >
                Nos recommandations personnalisées
              </h2>
              <p 
                className="text-lg"
                style={{ 
                  fontFamily: 'var(--font-family-primary)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Découvrez les meilleurs établissements, événements et services de Marbella
              </p>
            </div>

            {/* Carrousel Établissements */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{ 
                    fontFamily: 'var(--font-family-display)',
                    color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
                  }}
                >
                  <Utensils size={28} className="text-silver" />
                  Établissements tendance
                </h3>
                <button
                  onClick={() => router.push('/establishments')}
                  className="btn-silver-outline flex items-center gap-2"
                >
                  Voir tout
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="card-silver p-6 hover-lift cursor-pointer">
                    <div 
                      className="w-full h-48 mb-4 rounded-lg bg-gradient-to-br from-silver to-silver-light"
                      style={{ 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex items-center justify-between mb-2">
                      <h4 
                        className="text-xl font-bold"
                        style={{ 
                          fontFamily: 'var(--font-family-display)',
                          color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
                        }}
                      >
                        Restaurant {item}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-accent fill-accent" />
                        <span className="font-semibold text-silver">4.8</span>
                      </div>
                    </div>
                    <p 
                      className="text-sm mb-4"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Cuisine méditerranéenne raffinée avec vue imprenable
                    </p>
                    <button className="btn-silver w-full">Découvrir</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrousel Événements */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{ 
                    fontFamily: 'var(--font-family-display)',
                    color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
                  }}
                >
                  <Calendar size={28} className="text-silver" />
                  Événements à venir
                </h3>
                <button
                  onClick={() => router.push('/events')}
                  className="btn-silver-outline flex items-center gap-2"
                >
                  Voir tout
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="card-silver p-6 hover-lift cursor-pointer">
                    <div 
                      className="w-full h-48 mb-4 rounded-lg bg-gradient-to-br from-silver to-silver-light"
                      style={{ 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-silver">25 Jan</span>
                      <span className="badge-silver">20:00</span>
                    </div>
                    <h4 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        fontFamily: 'var(--font-family-display)',
                        color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
                      }}
                    >
                      Soirée VIP {item}
                    </h4>
                    <p 
                      className="text-sm mb-4"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Une soirée exclusive dans les meilleurs clubs de Marbella
                    </p>
                    <button className="btn-silver w-full">Réserver</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrousel Services */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{ 
                    fontFamily: 'var(--font-family-display)',
                    color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
                  }}
                >
                  <Sparkles size={28} className="text-silver" />
                  Services premium
                </h3>
                <button
                  onClick={() => router.push('/services')}
                  className="btn-silver-outline flex items-center gap-2"
                >
                  Voir tout
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="card-silver p-6 hover-lift cursor-pointer">
                    <div className="w-16 h-16 mb-4 rounded-xl glass flex items-center justify-center text-3xl">
                      {item === 1 ? '🚗' : item === 2 ? '✈️' : '🏠'}
                    </div>
                    <h4 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        fontFamily: 'var(--font-family-display)',
                        color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
                      }}
                    >
                      Service {item}
                    </h4>
                    <p 
                      className="text-sm mb-4"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Un service haut de gamme pour votre confort
                    </p>
                    <button className="btn-silver w-full">Demander</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ PARTENAIRES */}
        <section className="section-glass py-16">
          <BrandCarousel />
        </section>

        {/* 4️⃣ À PROPOS */}
        <section 
          className="section-dark py-20"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #0B0B0C 0%, #1A1A1C 100%)'
              : 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                style={{ 
                  fontFamily: 'var(--font-family-display)',
                  color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-white)'
                }}
              >
                À propos de Gliitz
              </h2>
              <p 
                className="text-lg md:text-xl mb-10 leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-family-primary)',
                  color: isDarkMode ? 'var(--gliitz-silver-light)' : 'var(--gliitz-white)'
                }}
              >
                Une conciergerie IA pensée pour sublimer vos expériences à Marbella.
                Notre intelligence artificielle analyse vos préférences et vous recommande
                les meilleures adresses, événements et services de la Costa del Sol.
              </p>
              <button className="btn-silver halo inline-flex items-center gap-2 px-6 py-3">
                En savoir plus
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* 5️⃣ VILLES / DESTINATIONS */}
        <section>
          <DestinationsSection />
        </section>

        {/* 6️⃣ NEWSLETTER */}
        <section 
          className="section-light py-20"
          style={{ 
            background: isDarkMode ? 'var(--gliitz-black)' : 'var(--gliitz-white)' 
          }}
        >
          <div className="container mx-auto px-4">
            <Newsletter isDarkMode={isDarkMode} />
          </div>
        </section>
      </main>

      {/* FOOTER GLIITZ */}
      <footer 
        className="relative overflow-hidden"
        style={{ 
          background: 'var(--gliitz-black)',
          color: 'var(--gliitz-silver)',
        }}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold mb-4 metallic"
              style={{ fontFamily: 'var(--font-family-display)' }}
            >
              Gliitz
            </h2>
            <p 
              className="text-lg"
              style={{ 
                fontFamily: 'var(--font-family-primary)',
                color: 'var(--gliitz-silver-light)'
              }}
            >
              Powered by AI ✨
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            <div>
              <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--gliitz-silver)' }}>
                Contact
              </h4>
              <p className="text-sm" style={{ color: 'var(--gliitz-silver-light)' }}>
                hello@gliitz.com<br />
                +34 123 456 789
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--gliitz-silver)' }}>
                Services
              </h4>
              <p className="text-sm" style={{ color: 'var(--gliitz-silver-light)' }}>
                IA Concierge<br />
                Réservations VIP<br />
                Support 24/7
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--gliitz-silver)' }}>
                Localisation
              </h4>
              <p className="text-sm" style={{ color: 'var(--gliitz-silver-light)' }}>
                Marbella, Espagne<br />
                Costa del Sol
              </p>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-silver-dark">
            <p className="text-sm" style={{ color: 'var(--gliitz-silver-light)' }}>
              © 2025 Gliitz. Tous droits réservés. | Powered by AI Gliitz ✨
            </p>
          </div>
        </div>
      </footer>

      {/* Bouton Chat Flottant */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-50 btn-silver shadow-glow-strong w-16 h-16 rounded-full flex items-center justify-center hover-lift"
        style={{ fontSize: '24px' }}
      >
        💬
      </button>
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


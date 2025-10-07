import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import Newsletter from '../components/ui/Newsletter'
import BrandCarousel, { DestinationsSection, PressSection } from '../components/ui/BrandCarousel'
import { useTheme } from '../contexts/ThemeContextSimple'
import { establishments as staticEstablishments } from '../data/marbella-data'
import { services as staticServices } from '../data/services-data'
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
  const [establishments, setEstablishments] = useState([])
  const [events, setEvents] = useState([])
  const [services, setServices] = useState([])
  const { isDarkMode, toggleTheme, isLoaded } = useTheme()

  // Charger les données réelles
  useEffect(() => {
    setEstablishments(staticEstablishments?.slice(0, 3) || [])
    setServices(staticServices?.slice(0, 3) || [])
    // Pour les événements, on utilisera des données de demo car pas de fichier events-data
    setEvents([
      { id: 1, name: 'Sunset Beach Party', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800', date: '25 Jan', time: '20:00', rating: 4.9 },
      { id: 2, name: 'Yacht VIP Night', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800', date: '28 Jan', time: '21:00', rating: 4.8 },
      { id: 3, name: 'Rooftop DJ Session', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800', date: '30 Jan', time: '22:00', rating: 4.7 },
    ])
  }, [])

  // Images ULTRA-LUXE - Vraies expériences Gliitz
  const luxuryImages = [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2400', // Petit-déjeuner beach club mer
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2400', // Voitures luxe alignées hôtel
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2400', // Yacht champagne sunset
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2400', // Jet privé intérieur
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2400', // Villa piscine infinity
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=2400', // Dîner romantique bord de mer
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2400', // Soirée DJ exclusive
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=2400', // EVJF yacht amies
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2400', // EVG limousine club VIP
    'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?q=80&w=2400', // Chef privé villa
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2400', // Garde du corps VIP
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
    router.push('/chat')
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
          className="relative w-full overflow-hidden flex items-center justify-center"
          style={{
            minHeight: '100vh',
            height: '100vh',
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

        {/* Indicateurs de carrousel - VISIBLES */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-3">
          {luxuryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className="transition-all duration-300 cursor-pointer"
              style={{
                width: index === currentImageIndex ? '32px' : '12px',
                height: '12px',
                borderRadius: index === currentImageIndex ? '6px' : '50%',
                background: index === currentImageIndex
                  ? 'linear-gradient(135deg, #FFFFFF, #C0C0C0)'
                  : 'rgba(255,255,255,0.5)',
                transform: index === currentImageIndex ? 'scale(1)' : 'scale(1)',
                boxShadow: index === currentImageIndex 
                  ? '0 0 20px rgba(255,255,255,0.8), 0 4px 12px rgba(0,0,0,0.3)' 
                  : '0 2px 8px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.8)',
                backdropFilter: 'blur(4px)'
              }}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>

          {/* Contenu Hero - CENTRÉ VERTICALEMENT ET HORIZONTALEMENT */}
          <div className="relative z-20 w-full px-4">
            <div className="max-w-5xl mx-auto text-center">
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
                className="gliitz-title-hero mb-8 animate-fade-in px-4"
                style={{ 
                  maxWidth: '900px',
                  margin: '0 auto 2rem auto',
                  textShadow: '0 0 16px rgba(0,0,0,0.45)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  lineHeight: '1.2'
                }}
              >
                Laissez Gliitz sublimer vos envies ✨
              </h1>

              {/* Sous-titre */}
              <p 
                className="gliitz-subtitle mb-12 animate-fade-in px-4"
                style={{ 
                  maxWidth: '700px',
                  margin: '0 auto 3rem auto',
                  color: '#E0E0E0',
                  fontWeight: 300,
                  animationDelay: '0.2s',
                  fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                  lineHeight: '1.6'
                }}
              >
                Votre concierge IA de luxe, toujours à vos côtés pour des expériences d'exception.
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
                className="gliitz-title-section"
                style={{ 
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
              >
                Nos recommandations personnalisées
              </h2>
              <p 
                className="gliitz-subtitle"
                style={{ 
                  color: isDarkMode ? '#E0E0E0' : '#666666'
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
                {establishments.map((item) => (
                  <div 
                    key={item.id} 
                    className="card-gliitz hover-lift-refined cursor-pointer"
                    onClick={() => router.push(`/establishment/${item.id}`)}
                  >
                    <div 
                      className="w-full h-48 mb-4 rounded-lg img-gliitz"
                      style={{ 
                        backgroundImage: `url("${item.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex items-center justify-between mb-2">
                      <h4 
                        className="text-xl font-bold"
                        style={{ 
                          fontFamily: 'Playfair Display, serif',
                          fontWeight: 600,
                          color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                        }}
                      >
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star size={16} style={{ color: '#C0C0C0', fill: '#C0C0C0' }} />
                        <span 
                          className="font-semibold"
                          style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            color: '#C0C0C0'
                          }}
                        >
                          {item.rating || '4.8'}
                        </span>
                      </div>
                    </div>
                    <p 
                      className="text-sm mb-4"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        color: isDarkMode ? '#E0E0E0' : '#666666'
                      }}
                    >
                      {item.description || item.specialties?.[0] || 'Expérience gastronomique unique'}
                    </p>
                    <button className="btn-gliitz-primary w-full">Découvrir</button>
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
                {events.map((item) => (
                  <div key={item.id} className="card-gliitz hover-lift-refined cursor-pointer">
                    <div 
                      className="w-full h-48 mb-4 rounded-lg img-gliitz"
                      style={{ 
                        backgroundImage: `url("${item.image}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-gliitz">{item.date}</span>
                      <span className="badge-gliitz">{item.time}</span>
                    </div>
                    <h4 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 600,
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                      }}
                    >
                      {item.name}
                    </h4>
                    <p 
                      className="text-sm mb-4"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        color: isDarkMode ? '#E0E0E0' : '#666666'
                      }}
                    >
                      Une soirée exclusive dans les meilleurs clubs de Marbella
                    </p>
                    <button className="btn-gliitz-primary w-full">Réserver</button>
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
                {services.map((item) => (
                  <div key={item.id} className="card-gliitz hover-lift-refined cursor-pointer">
                    {/* Image du service au lieu d'icône */}
                    <div 
                      className="w-full h-48 mb-4 rounded-lg img-gliitz"
                      style={{ 
                        backgroundImage: `url("${item.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800'}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <h4 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 600,
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                      }}
                    >
                      {item.name}
                    </h4>
                    <p 
                      className="text-sm mb-4"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        color: isDarkMode ? '#E0E0E0' : '#666666'
                      }}
                    >
                      {item.description || 'Un service haut de gamme pour votre confort'}
                    </p>
                    <button className="btn-gliitz-primary w-full">Demander</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ PARTENAIRES */}
        <section 
          className="py-8"
          style={{
            background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
          }}
        >
          <BrandCarousel />
        </section>

        {/* 4️⃣ À PROPOS - Enrichi avec visuels */}
        <section 
          className="section-premium py-32 relative overflow-hidden"
          style={{ 
            background: isDarkMode 
              ? '#0B0B0C'
              : '#FFFFFF'
          }}
        >
          {/* Effet de fond subtil */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 right-20 w-96 h-96 rounded-full" style={{ background: '#C0C0C0', filter: 'blur(100px)' }} />
            <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full" style={{ background: '#E0E0E0', filter: 'blur(100px)' }} />
          </div>

          <div className="container-refined relative z-10">
            {/* Titre principal */}
            <div className="text-center mb-16">
              <div 
                className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <Sparkles size={24} style={{ color: '#C0C0C0' }} className="animate-pulse" />
                <span 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  Pourquoi Gliitz ?
                </span>
              </div>

              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 600,
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
              >
                L'avenir de la conciergerie de luxe
              </h2>
              
              <p 
                className="text-xl max-w-3xl mx-auto"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 300,
                  color: isDarkMode ? '#E0E0E0' : '#666666'
                }}
              >
                Une intelligence artificielle au service de vos expériences premium
              </p>
            </div>

            {/* Grille d'avantages avec icônes et animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: '🤖',
                  title: 'Intelligence Artificielle',
                  desc: 'Notre IA analyse vos préférences en temps réel pour vous recommander les expériences qui vous correspondent vraiment.'
                },
                {
                  icon: '⚡',
                  title: 'Instantané & Personnalisé',
                  desc: 'Réponses immédiates, disponibles 24/7. Chaque recommandation est unique et adaptée à vos goûts.'
                },
                {
                  icon: '🌟',
                  title: 'Accès Exclusif',
                  desc: 'Restaurants étoilés, beach clubs VIP, yachts privés, villas de luxe - nous ouvrons toutes les portes.'
                },
                {
                  icon: '🎯',
                  title: 'Conciergerie Complète',
                  desc: 'De la réservation au service après-vente, nous gérons tout. Vous profitez, nous nous occupons du reste.'
                },
                {
                  icon: '💎',
                  title: 'Réseau Premium',
                  desc: 'Plus de 500 partenaires triés sur le volet : les meilleurs établissements de Marbella et au-delà.'
                },
                {
                  icon: '🌍',
                  title: 'Bientôt Partout',
                  desc: 'Marbella aujourd\'hui, Mykonos, Ibiza, Saint-Tropez et le monde demain. Votre conciergerie vous suit partout.'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="card-gliitz text-center hover-lift-refined animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div 
                    className="text-6xl mb-4 animate-float-gentle"
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    {item.icon}
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 600,
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA visuel - Pourquoi utiliser Gliitz */}
            <div className="max-w-4xl mx-auto">
              <div 
                className="card-gliitz p-12 text-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="text-6xl mb-6">✨</div>
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 600,
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  Prêt à transformer vos expériences ?
                </h3>
                <p 
                  className="text-lg mb-8 max-w-2xl mx-auto"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    color: isDarkMode ? '#E0E0E0' : '#666666'
                  }}
                >
                  Laissez notre IA orchestrer vos moments d'exception. 
                  Une simple question, des milliers de possibilités.
                </p>
                <button 
                  onClick={handleOpenChat}
                  className="btn-gliitz-primary inline-flex items-center gap-3"
                >
                  <MessageCircle size={20} />
                  Commencer maintenant
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ VILLES / DESTINATIONS */}
        <section>
          <DestinationsSection />
        </section>

        {/* 5.5️⃣ ON PARLE DE NOUS - PRESSE */}
        <section>
          <PressSection />
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
          background: isDarkMode ? '#0B0B0C' : '#FFFFFF',
          color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
          borderTop: `1px solid ${isDarkMode ? 'rgba(192,192,192,0.1)' : 'rgba(192,192,192,0.2)'}`
        }}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 
              className="text-5xl font-bold mb-4"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                color: '#C0C0C0'
              }}
            >
              Gliitz
            </h2>
            <p 
              className="text-lg"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                color: '#E0E0E0'
              }}
            >
              Powered by AI ✨
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            <div>
              <h4 
                className="text-xl font-bold mb-4" 
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 600,
                  color: '#C0C0C0' 
                }}
              >
                Contact
              </h4>
              <p 
                className="text-sm" 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#E0E0E0' 
                }}
              >
                hello@gliitz.com<br />
                +34 123 456 789
              </p>
            </div>
            <div>
              <h4 
                className="text-xl font-bold mb-4" 
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 600,
                  color: '#C0C0C0' 
                }}
              >
                Services
              </h4>
              <p 
                className="text-sm" 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#E0E0E0' 
                }}
              >
                IA Concierge<br />
                Réservations VIP<br />
                Support 24/7
              </p>
            </div>
            <div>
              <h4 
                className="text-xl font-bold mb-4" 
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 600,
                  color: '#C0C0C0' 
                }}
              >
                Localisation
              </h4>
              <p 
                className="text-sm" 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#E0E0E0' 
                }}
              >
                Marbella, Espagne<br />
                Costa del Sol
              </p>
            </div>
          </div>

          <div 
            className="text-center pt-8"
            style={{ 
              borderTop: '1px solid rgba(192,192,192,0.2)'
            }}
          >
            <p 
              className="text-sm" 
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#E0E0E0' 
              }}
            >
              © 2025 Gliitz. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Bouton Chat Flottant - UNIQUE */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
        style={{ 
          fontSize: '24px',
          background: '#C0C0C0',
          color: '#0B0B0C',
          border: 'none',
          boxShadow: '0 0 20px rgba(192,192,192,0.6)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(192,192,192,0.8)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(192,192,192,0.6)'
        }}
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


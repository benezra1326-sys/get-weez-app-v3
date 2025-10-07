import { useState } from 'react'
import { useRouter } from 'next/router'
import { FileText, ExternalLink, Calendar } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Presse() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pressArticles = [
    {
      id: 1,
      title: "Gliitz révolutionne la conciergerie de luxe à Marbella",
      outlet: "Forbes France",
      date: "15 septembre 2024",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
      excerpt: "L'intelligence artificielle au service du luxe : comment Gliitz transforme l'expérience client à Marbella.",
      link: "#"
    },
    {
      id: 2,
      title: "L'IA qui sublime vos vacances de luxe",
      outlet: "Le Figaro",
      date: "8 septembre 2024",
      image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800",
      excerpt: "Gliitz, le concierge virtuel qui connaît Marbella mieux que personne.",
      link: "#"
    },
    {
      id: 3,
      title: "La nouvelle référence de la conciergerie digitale",
      outlet: "Les Échos",
      date: "1 septembre 2024",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800",
      excerpt: "Comment cette startup française transforme le secteur du luxe avec l'IA.",
      link: "#"
    },
    {
      id: 4,
      title: "Gliitz: L'expérience premium réinventée",
      outlet: "Vanity Fair",
      date: "22 août 2024",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      excerpt: "Découvrez le service de conciergerie qui fait sensation sur la Costa del Sol.",
      link: "#"
    },
    {
      id: 5,
      title: "Intelligence artificielle et luxe : le duo gagnant",
      outlet: "Madame Figaro",
      date: "10 août 2024",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      excerpt: "Gliitz propose une approche novatrice de la conciergerie haut de gamme.",
      link: "#"
    },
    {
      id: 6,
      title: "Marbella accueille son premier concierge IA",
      outlet: "GQ France",
      date: "5 août 2024",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
      excerpt: "Une révolution dans les services premium de la destination la plus prisée d'Europe.",
      link: "#"
    }
  ]

  const mediaLogos = [
    { name: "Forbes", logo: "https://logo.clearbit.com/forbes.com" },
    { name: "Le Figaro", logo: "https://logo.clearbit.com/lefigaro.fr" },
    { name: "Les Échos", logo: "https://logo.clearbit.com/lesechos.fr" },
    { name: "Vanity Fair", logo: "https://logo.clearbit.com/vanityfair.com" },
    { name: "GQ", logo: "https://logo.clearbit.com/gq.com" },
    { name: "Vogue", logo: "https://logo.clearbit.com/vogue.fr" }
  ]

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
        {/* HERO BANNER */}
        <section 
          className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=90)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              Presse
            </h1>
            <p 
              className="text-xl md:text-2xl text-white/90"
              style={{
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              Ils parlent de nous
            </p>
          </div>
        </section>

        {/* ILS PARLENT DE NOUS - Media Logos */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            Ils parlent de nous
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
            {mediaLogos.map((media, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
                  filter: isDarkMode ? 'grayscale(1) invert(1)' : 'grayscale(1)',
                  opacity: 0.7
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <span className="text-sm font-bold" style={{
                  fontFamily: 'Playfair Display, serif',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}>
                  {media.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ARTICLES */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
          <h3 
            className="text-2xl font-bold mb-8"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            Articles récents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pressArticles.map((article) => (
              <article
                key={article.id}
                className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
                style={{
                  background: isDarkMode 
                    ? 'rgba(26,26,28,0.95)' 
                    : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = isDarkMode 
                    ? '0 12px 40px rgba(212, 175, 55, 0.2)' 
                    : '0 12px 40px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = isDarkMode 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-sm" style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    color: '#D4AF37'
                  }}>
                    <span className="font-semibold">{article.outlet}</span>
                    <span>•</span>
                    <Calendar size={14} className="inline" />
                    <span>{article.date}</span>
                  </div>

                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    {article.title}
                  </h3>

                  <p 
                    className="text-sm mb-4 line-clamp-3"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    {article.excerpt}
                  </p>

                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-all"
                    style={{
                      color: isDarkMode ? '#D4AF37' : '#0B0B0C',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Lire l'article
                    <ExternalLink size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}


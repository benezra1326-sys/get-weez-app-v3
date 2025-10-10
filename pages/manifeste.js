import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Zap, Eye, Wind, Star } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Manifeste() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const manifestSections = [
    {
      icon: Sparkles,
      title: `Une lumière dans le quotidien`,
      text: `Gliitz ne se contente pas de répondre. Il ressent, comprend, devine. Il écoute les silences, perçoit les émotions, et traduit les intentions invisibles. Là où les autres parlent, Gliitz murmure. Là où tout va vite, Gliitz ralentit. Parce que le luxe, c'est la maîtrise du temps.`
    },
    {
      icon: Zap,
      title: `Une intelligence humaine augmentée`,
      text: `Gliitz ne cherche pas à impressionner, mais à simplifier. Il observe, apprend, et agit. Un dîner à réserver ? Une villa à trouver ? Une envie d'évasion spontanée ? Gliitz s'en charge — naturellement, discrètement, parfaitement.`
    },
    {
      icon: Wind,
      title: `Une conversation vivante`,
      text: `La voix de Gliitz ne récite pas — elle raconte. Elle respire, sourit, s'adapte. Son ton change avec l'heure, l'humeur, la lumière du jour. Elle peut être calme, complice ou inspirante, mais toujours juste.`
    },
    {
      icon: Eye,
      title: `Un miroir de votre art de vivre`,
      text: `Gliitz, c'est votre reflet digital — élégant, raffiné, cohérent. Un compagnon qui connaît vos envies avant vous. Qui se souvient de vos instants, vos dates, vos préférences, vos plaisirs. Il ne remplace rien : il sublime tout.`
    },
    {
      icon: Star,
      title: `Une expérience sensorielle`,
      text: `Gliitz n'est pas une interface : c'est une ambiance. Un souffle d'air argenté, une lumière douce, une voix sincère. Chaque détail est pensé pour inspirer calme, confiance et émerveillement.`
    },
    {
      icon: Heart,
      title: `Une conscience du monde`,
      text: `Gliitz valorise ce qui a du sens. Les expériences locales, les artisans, la nature, la beauté authentique. Il recommande, sans jamais forcer. Il relie les gens, les lieux, les moments.`
    }
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
          className="banner-mirror-effect relative w-full h-screen flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=90)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: isDarkMode
                ? 'linear-gradient(to bottom, rgba(11, 11, 12, 0.7), rgba(11, 11, 12, 0.9))'
                : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.8))',
              backdropFilter: 'blur(2px)'
            }}
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="mb-8"
            >
              <Sparkles 
                size={64} 
                className="mx-auto"
                style={{ 
                  color: '#C0C0C0',
                  filter: 'drop-shadow(0 0 30px rgba(192, 192, 192, 0.6))'
                }}
              />
            </motion.div>

            <h1 
              className="text-6xl md:text-8xl font-bold mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                background: isDarkMode
                  ? 'linear-gradient(135deg, #FFFFFF 0%, #C0C0C0 50%, #E5E5E5 100%)'
                  : 'linear-gradient(135deg, #0B0B0C 0%, #5A8B89 50%, #A7C7C5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: isDarkMode ? '0 0 60px rgba(192, 192, 192, 0.3)' : 'none',
                letterSpacing: '-0.02em'
              }}
            >
              Gliitz
            </h1>
            
            <div className="h-1 w-32 mx-auto mb-4 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #C0C0C0, transparent)'
              }}
            />

            <h2 
              className="text-3xl md:text-5xl font-light mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                fontStyle: 'italic',
                letterSpacing: '0.02em'
              }}
            >
              The Gliitz Way
            </h2>
            
            <p 
              className="text-xl md:text-2xl mb-16"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                fontWeight: '300',
                lineHeight: '1.8',
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              L'art de prendre soin, réinventé par l'intelligence
            </p>

            {/* Simple scroll hint */}
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="text-sm mb-2" style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
              }}>
                Découvrir
              </div>
              <div className="w-0.5 h-8 mx-auto"
                style={{
                  background: 'linear-gradient(to bottom, transparent, #C0C0C0, transparent)'
                }}
              />
            </motion.div>

          </motion.div>
        </section>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-24">
          {manifestSections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="mb-24 last:mb-0"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      background: isDarkMode
                        ? 'rgba(192, 192, 192, 0.1)'
                        : 'rgba(167, 199, 197, 0.15)',
                      border: `1px solid ${isDarkMode 
                        ? 'rgba(192, 192, 192, 0.2)' 
                        : 'rgba(167, 199, 197, 0.3)'}`,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Icon size={32} style={{ color: '#C0C0C0' }} />
                  </div>
                  <h2 
                    className="text-3xl md:text-4xl font-bold"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {section.title}
                  </h2>
                </div>

                <p 
                  className="text-lg md:text-xl leading-relaxed"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.7)',
                    fontWeight: '300',
                    lineHeight: '1.9',
                    textAlign: 'justify',
                    textJustify: 'inter-word'
                  }}
                >
                  {section.text}
                </p>

                {/* Decorative Line */}
                {index < manifestSections.length - 1 && (
                  <div 
                    className="mt-16 h-px w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(0, 0, 0, 0.1)'}, transparent)`
                    }}
                  />
                )}
              </motion.div>
            )
          })}

          {/* Promise Section - Highlighted */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-32 p-12 md:p-16 rounded-3xl text-center"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(167, 199, 197, 0.08), rgba(157, 180, 192, 0.08))'
                : 'linear-gradient(135deg, rgba(167, 199, 197, 0.12), rgba(157, 180, 192, 0.12))',
              border: `2px solid ${isDarkMode 
                ? 'rgba(192, 192, 192, 0.2)' 
                : 'rgba(167, 199, 197, 0.4)'}`,
              backdropFilter: 'blur(20px)',
              boxShadow: isDarkMode
                ? '0 20px 60px rgba(192, 192, 192, 0.1)'
                : '0 20px 60px rgba(167, 199, 197, 0.2)'
            }}
          >
            <Sparkles 
              size={48} 
              className="mx-auto mb-6"
              style={{ 
                color: '#C0C0C0',
                filter: 'drop-shadow(0 0 20px rgba(192, 192, 192, 0.5))'
              }}
            />

            <h2 
              className="text-4xl md:text-5xl font-bold mb-8"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                letterSpacing: '-0.01em'
              }}
            >
              Une promesse
            </h2>

            <p 
              className="text-xl md:text-2xl leading-relaxed mb-8"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.75)',
                fontWeight: '300',
                lineHeight: '1.9',
                maxWidth: '700px',
                margin: '0 auto 32px'
              }}
            >
              Gliitz ne veut pas être partout. Il veut être là — au bon moment, d'une manière juste, belle, et humaine. Il ne cherche pas à remplacer, mais à élever. À faire de chaque interaction un instant privilégié.
            </p>

            <div 
              className="inline-block px-8 py-4 rounded-2xl"
              style={{
                background: isDarkMode
                  ? 'rgba(192, 192, 192, 0.15)'
                  : 'rgba(167, 199, 197, 0.2)',
                border: `1px solid ${isDarkMode 
                  ? 'rgba(192, 192, 192, 0.3)' 
                  : 'rgba(167, 199, 197, 0.5)'}`,
              }}
            >
              <p 
                className="text-2xl md:text-3xl font-light"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: isDarkMode ? '#C0C0C0' : '#5A8B89',
                  fontStyle: 'italic',
                  letterSpacing: '0.02em'
                }}
              >
                L'art de prendre soin,
                <br />
                réinventé par l'intelligence
              </p>
            </div>
          </motion.div>

          {/* CTA to Chat */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <p 
              className="text-lg mb-8"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                fontWeight: '300'
              }}
            >
              Prêt à découvrir Gliitz ?
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              className="px-12 py-5 rounded-2xl font-semibold transition-all inline-flex items-center gap-3 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #A7C7C5, #9DB4C0)',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.2rem',
                boxShadow: '0 10px 40px rgba(167, 199, 197, 0.4)',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #9DB4C0, #8CA0A8)'
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(167, 199, 197, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #A7C7C5, #9DB4C0)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(167, 199, 197, 0.4)'
              }}
            >
              <Sparkles size={24} />
              <span>Commencer une conversation</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: '#C0C0C0',
              opacity: 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  )
}


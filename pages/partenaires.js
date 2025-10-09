import { useState } from 'react'
import { useRouter } from 'next/router'
import { Building, Briefcase, Star, MapPin, ArrowRight, Check, Send, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import V3Sidebar from '../components/layout/V3Sidebar'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function DevenirPartenaire() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    establishmentName: '',
    establishmentType: '',
    contactName: '',
    email: '',
    phone: '',
    description: '',
    location: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Envoyer à Supabase ou email
    console.log('Formulaire soumis:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const partnerBenefits = [
    { icon: '🌟', title: 'Visibilité Premium', description: 'Apparaissez en haut des recommandations IA' },
    { icon: '🎯', title: 'Ciblage Intelligent', description: 'Suggestions personnalisées à votre clientèle cible' },
    { icon: '📱', title: 'Réservations Directes', description: 'Système de réservation intégré' },
    { icon: '📊', title: 'Analytics Avancés', description: 'Statistiques détaillées de performance' },
    { icon: '✨', title: 'Badge Vérifié', description: 'Établissement vérifié par Gliitz' },
    { icon: '🤖', title: 'IA Recommandation', description: 'L\'IA Gliitz recommande votre établissement' }
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
        {/* HERO BANNER - DEVENIR PARTENAIRE */}
        <section 
          className="banner-mirror-effect relative w-full h-[60vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=90)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <Sparkles 
              size={48} 
              className="mx-auto mb-6 text-white"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' }}
            />
            <h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 4px 30px rgba(0,0,0,0.7)',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #C0C0C0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Devenez Partenaire Gliitz
            </h1>
            <p 
              className="text-xl md:text-2xl text-white/95 mb-8"
              style={{
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 2px 15px rgba(0,0,0,0.6)',
                fontWeight: '300'
              }}
            >
              Rejoignez l'élite des établissements recommandés par notre IA de luxe
            </p>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Star size={20} style={{ color: '#C0C0C0' }} />
              <span style={{ fontFamily: 'Poppins, sans-serif' }}>
                Visibilité maximale • Clients qualifiés • Technologie IA
              </span>
              <Star size={20} style={{ color: '#C0C0C0' }} />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.5rem',
                fontWeight: '700',
                color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                marginBottom: '16px'
              }}
            >
              Pourquoi rejoindre Gliitz ?
            </h2>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              Bénéficiez de la puissance de notre IA pour attirer une clientèle de luxe
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {partnerBenefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl text-center"
                style={{
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${isDarkMode 
                    ? 'rgba(192, 192, 192, 0.2)' 
                    : 'rgba(192, 192, 192, 0.3)'}`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{benefit.icon}</div>
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                    marginBottom: '8px'
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.9rem',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    lineHeight: '1.5'
                  }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Partner Application Form */}
          <div className="max-w-3xl mx-auto">
            <div
              className="p-8 md:p-12 rounded-3xl"
              style={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDarkMode 
                  ? 'rgba(192, 192, 192, 0.2)' 
                  : 'rgba(192, 192, 192, 0.3)'}`,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
              }}
            >
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}
              >
                Formulaire de Candidature
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom de l'établissement */}
                <div>
                  <label
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Nom de l'établissement *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.establishmentName}
                    onChange={(e) => setFormData({ ...formData, establishmentName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                      border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.4)'}`,
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    placeholder="Ex: Restaurant Le Jardin"
                  />
                </div>

                {/* Type d'établissement */}
                <div>
                  <label
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Type d'établissement *
                  </label>
                  <select
                    required
                    value={formData.establishmentType}
                    onChange={(e) => setFormData({ ...formData, establishmentType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                      border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.4)'}`,
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Beach Club">Beach Club</option>
                    <option value="Club">Club / Discothèque</option>
                    <option value="Bar">Bar / Lounge</option>
                    <option value="Hotel">Hôtel</option>
                    <option value="Spa">Spa / Wellness</option>
                    <option value="Service">Service</option>
                  </select>
                </div>

                {/* Nom du contact */}
                <div>
                  <label
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Nom du contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                      border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.4)'}`,
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    placeholder="Votre nom complet"
                  />
                </div>

                {/* Email et Phone en 2 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{
                        background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                        border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.4)'}`,
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      placeholder="contact@restaurant.com"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{
                        background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                        border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.4)'}`,
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      placeholder="+34 ..."
                    />
                  </div>
                </div>

                {/* Localisation */}
                <div>
                  <label
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Localisation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                      border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.4)'}`,
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    placeholder="Ex: Puerto Banús, Marbella"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Présentation de votre établissement *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                    style={{
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                      border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.4)'}`,
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                      fontFamily: 'Poppins, sans-serif',
                      lineHeight: '1.6'
                    }}
                    placeholder="Décrivez votre établissement, votre ambiance, vos spécialités..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitted}
                  className="w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                  style={{
                    background: submitted
                      ? 'linear-gradient(135deg, #10B981, #059669)'
                      : 'linear-gradient(135deg, #A7C7C5, #9DB4C0)',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 20px rgba(167, 199, 197, 0.4)',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    opacity: submitted ? 0.8 : 1
                  }}
                >
                  {submitted ? (
                    <>
                      <Check size={24} />
                      <span>Candidature envoyée !</span>
                    </>
                  ) : (
                    <>
                      <Send size={24} />
                      <span>Envoyer ma candidature</span>
                    </>
                  )}
                </motion.button>

                {submitted && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-4"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: '#10B981',
                      fontWeight: '500'
                    }}
                  >
                    ✅ Merci ! Notre équipe vous contactera sous 48h
                  </motion.p>
                )}
              </form>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="p-8 rounded-2xl"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(167, 199, 197, 0.1), rgba(157, 180, 192, 0.1))'
                  : 'linear-gradient(135deg, rgba(167, 199, 197, 0.15), rgba(157, 180, 192, 0.15))',
                border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(167, 199, 197, 0.4)'}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.8rem',
                  color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                  marginBottom: '16px'
                }}
              >
                Questions ?
              </h3>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}
              >
                Notre équipe est là pour vous accompagner dans votre intégration.
                <br />
                Contactez-nous à <a href="mailto:partners@gliitz.com" style={{ color: '#A7C7C5', textDecoration: 'underline' }}>partners@gliitz.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import SupportSection from '../components/account/SupportSection'
import { useTheme } from '../contexts/ThemeContextSimple'
import { ChevronDown, ChevronRight, Search, HelpCircle, FileText, Shield, CreditCard, MessageCircle, Phone, Mail, Clock, Star, Users, Zap, Sparkles, MessageCircle as ChatIcon, Calendar, MapPin, Award } from 'lucide-react'

export default function Aide({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isDarkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState({})

  // FAQ data
  const faqCategories = [
    {
      id: 'general',
      title: 'Général',
      icon: HelpCircle,
      questions: [
        {
          id: 'what-is-getweez',
          question: 'Qu\'est-ce que Get Weez ?',
          answer: 'Get Weez est votre concierge personnel à Marbella. Nous vous aidons à découvrir les meilleures expériences de la ville : restaurants, bars, plages, événements, et bien plus encore.'
        },
        {
          id: 'how-it-works',
          question: 'Comment ça marche ?',
          answer: 'Il suffit de nous dire ce que vous cherchez ! Notre IA Get Weez vous propose des recommandations personnalisées basées sur vos goûts et vos envies. Nous gérons ensuite les réservations et vous accompagnons tout au long de votre expérience.'
        },
        {
          id: 'coverage-area',
          question: 'Dans quelles zones opérez-vous ?',
          answer: 'Nous couvrons toute la région de Marbella : Puerto Banús, Golden Mile, Nueva Andalucía, Elviria, et les environs. Notre réseau de partenaires s\'étend sur toute la Costa del Sol.'
        }
      ]
    },
    {
      id: 'subscriptions',
      title: 'Abonnements',
      icon: CreditCard,
      questions: [
        {
          id: 'subscription-plans',
          question: 'Quels sont les plans d\'abonnement ?',
          answer: 'Nous proposons 3 plans : Invité (gratuit), Premium (39.99€/mois) et VIP (99.99€/mois). Chaque plan offre des avantages différents selon vos besoins.'
        },
        {
          id: 'cancel-subscription',
          question: 'Comment annuler mon abonnement ?',
          answer: 'Vous pouvez annuler votre abonnement à tout moment depuis votre compte. L\'annulation prend effet à la fin de votre période de facturation en cours.'
        },
        {
          id: 'refund-policy',
          question: 'Puis-je être remboursé ?',
          answer: 'Nous offrons une garantie de satisfaction de 7 jours. Si vous n\'êtes pas satisfait de nos services, contactez notre support pour un remboursement complet.'
        }
      ]
    },
    {
      id: 'reservations',
      title: 'Réservations',
      icon: MessageCircle,
      questions: [
        {
          id: 'how-to-book',
          question: 'Comment réserver ?',
          answer: 'C\'est simple ! Dites-nous ce que vous voulez faire, nous trouvons les meilleures options et nous gérons la réservation pour vous. Vous recevez une confirmation par email.'
        },
        {
          id: 'modify-booking',
          question: 'Puis-je modifier ma réservation ?',
          answer: 'Oui, vous pouvez modifier ou annuler votre réservation jusqu\'à 2h avant l\'heure prévue. Contactez-nous via l\'app ou par téléphone.'
        },
        {
          id: 'no-show-policy',
          question: 'Que se passe-t-il si je ne me présente pas ?',
          answer: 'En cas de no-show, des frais peuvent s\'appliquer selon l\'établissement. Nous vous recommandons de nous prévenir le plus tôt possible pour éviter ces frais.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technique',
      icon: Shield,
      questions: [
        {
          id: 'app-issues',
          question: 'L\'application ne fonctionne pas, que faire ?',
          answer: 'Essayez de fermer et rouvrir l\'application. Si le problème persiste, vérifiez votre connexion internet et mettez à jour l\'application. Contactez-nous si nécessaire.'
        },
        {
          id: 'notifications',
          question: 'Je ne reçois pas les notifications',
          answer: 'Vérifiez que les notifications sont activées dans les paramètres de votre appareil et dans l\'application. Assurez-vous que l\'application n\'est pas en mode économie d\'énergie.'
        }
      ]
    }
  ]

  // CGV/CGU data
  const legalSections = [
    {
      id: 'cgv',
      title: 'Conditions Générales de Vente',
      content: `
        <h3>1. Objet</h3>
        <p>Les présentes conditions générales de vente régissent les relations contractuelles entre Get Weez et ses clients.</p>
        
        <h3>2. Services</h3>
        <p>Get Weez propose des services de conciergerie personnalisés à Marbella, incluant :</p>
        <ul>
          <li>Recommandations personnalisées</li>
          <li>Réservations dans les établissements partenaires</li>
          <li>Accès à des événements exclusifs</li>
          <li>Support client prioritaire</li>
        </ul>
        
        <h3>3. Tarifs et Paiement</h3>
        <p>Les tarifs sont indiqués en euros TTC. Le paiement s'effectue par carte bancaire ou virement. Les abonnements sont facturés à l'avance.</p>
        
        <h3>4. Droit de Rétractation</h3>
        <p>Vous disposez d'un délai de 7 jours pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.</p>
        
        <h3>5. Responsabilité</h3>
        <p>Get Weez s'engage à fournir ses services avec diligence mais ne peut être tenu responsable des dommages indirects.</p>
      `
    },
    {
      id: 'cgu',
      title: 'Conditions Générales d\'Utilisation',
      content: `
        <h3>1. Acceptation des Conditions</h3>
        <p>L'utilisation de l'application Get Weez implique l'acceptation pleine et entière des présentes conditions.</p>
        
        <h3>2. Utilisation du Service</h3>
        <p>L'utilisateur s'engage à utiliser l'application de manière conforme à sa destination et à ne pas porter atteinte aux droits de tiers.</p>
        
        <h3>3. Données Personnelles</h3>
        <p>Get Weez s'engage à protéger vos données personnelles conformément au RGPD. Vos données sont utilisées uniquement pour fournir nos services.</p>
        
        <h3>4. Propriété Intellectuelle</h3>
        <p>L'application et son contenu sont protégés par le droit d'auteur. Toute reproduction est interdite sans autorisation.</p>
        
        <h3>5. Modification des Conditions</h3>
        <p>Get Weez se réserve le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication.</p>
      `
    },
    {
      id: 'privacy',
      title: 'Politique de Confidentialité',
      content: `
        <h3>1. Collecte des Données</h3>
        <p>Nous collectons les données nécessaires à la fourniture de nos services : nom, email, préférences, historique des interactions.</p>
        
        <h3>2. Utilisation des Données</h3>
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>Personnaliser vos recommandations</li>
          <li>Gérer vos réservations</li>
          <li>Améliorer nos services</li>
          <li>Vous contacter si nécessaire</li>
        </ul>
        
        <h3>3. Partage des Données</h3>
        <p>Nous ne partageons vos données qu'avec nos partenaires établissements pour honorer vos réservations.</p>
        
        <h3>4. Vos Droits</h3>
        <p>Vous disposez des droits d'accès, rectification, suppression et portabilité de vos données. Contactez-nous pour les exercer.</p>
      `
    }
  ]

  const toggleExpanded = (categoryId, questionId) => {
    const key = `${categoryId}-${questionId}`
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        user={user} 
        setUser={setUser}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        user={user} 
      />
      
      <main className="flex-1 overflow-y-auto" style={{ 
        background: isDarkMode 
          ? 'radial-gradient(ellipse at top, #1a1a2e 0%, #0D0D0D 70%)'
          : 'radial-gradient(ellipse at top, #f8fafc 0%, #F9FAFB 70%)'
      }}>
          <div className="container mx-auto px-4 py-8">
            {/* Header Hero Section */}
            <div className="text-center mb-16 relative">
              {/* Background decoration */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                <div className="absolute top-20 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-lg"></div>
                <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-pink-500/10 rounded-full blur-lg"></div>
              </div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                }}>
                  <Sparkles size={32} className="text-white" />
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Centre d'aide
                </h1>
                
                <p className={`text-xl md:text-2xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Votre concierge personnel vous accompagne
                </p>
                
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50' 
                      : 'bg-white/80 border border-gray-200/50 shadow-xl backdrop-blur-sm'
                  }`}>
                    <div className="flex items-center justify-center mb-3">
                      <Clock size={24} className="text-purple-500 mr-2" />
                      <span className="text-2xl font-bold text-purple-500">24/7</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Support disponible</p>
                  </div>
                  
                  <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50' 
                      : 'bg-white/80 border border-gray-200/50 shadow-xl backdrop-blur-sm'
                  }`}>
                    <div className="flex items-center justify-center mb-3">
                      <Users size={24} className="text-blue-500 mr-2" />
                      <span className="text-2xl font-bold text-blue-500">1000+</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Utilisateurs satisfaits</p>
                  </div>
                  
                  <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50' 
                      : 'bg-white/80 border border-gray-200/50 shadow-xl backdrop-blur-sm'
                  }`}>
                    <div className="flex items-center justify-center mb-3">
                      <Award size={24} className="text-pink-500 mr-2" />
                      <span className="text-2xl font-bold text-pink-500">4.9★</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Note moyenne</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search 
                  size={20} 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                />
                <input
                  type="text"
                  placeholder="Rechercher dans l'aide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 text-white border-gray-700/50 focus:border-purple-500/50' 
                      : 'bg-white text-gray-900 border-gray-200 focus:border-purple-500/50'
                  }`}
                />
              </div>
            </div>

            {/* FAQ */}
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Questions Fréquentes
              </h2>
              
              <div className="space-y-6">
                {filteredCategories.map((category) => (
                  <div key={category.id} className={`p-6 rounded-2xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50' 
                      : 'bg-white border border-gray-200/50 shadow-xl'
                  }`}>
                    <div className="flex items-center mb-4">
                      <category.icon size={24} className="mr-3 text-purple-500" />
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {category.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {category.questions.map((question) => {
                        const isExpanded = expandedItems[`${category.id}-${question.id}`]
                        return (
                          <div key={question.id} className={`border rounded-xl transition-all duration-300 ${
                            isDarkMode 
                              ? 'border-gray-700/50' 
                              : 'border-gray-200/50'
                          }`}>
                            <button
                              onClick={() => toggleExpanded(category.id, question.id)}
                              className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                                isDarkMode 
                                  ? 'hover:bg-gray-700/50' 
                                  : 'hover:bg-gray-50/50'
                              }`}
                            >
                              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {question.question}
                              </span>
                              <div className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                              </div>
                            </button>
                            
                            {isExpanded && (
                              <div className="px-6 pb-4">
                                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {question.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CGV/CGU */}
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Informations Légales
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {legalSections.map((section) => (
                  <div key={section.id} className={`p-6 rounded-2xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50' 
                      : 'bg-white border border-gray-200/50 shadow-xl'
                  }`}>
                    <div className="flex items-center mb-4">
                      <FileText size={24} className="mr-3 text-purple-500" />
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {section.title}
                      </h3>
                    </div>
                    <div 
                      className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Centre d'Aide - Liens rapides */}
            <div className="max-w-4xl mx-auto mt-16">
              <div className={`rounded-2xl p-8 transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50' 
                  : 'bg-white border border-gray-200/50 shadow-xl'
              }`}>
                <h2 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Centre d'Aide</h2>
                
                {/* Liens rapides d'aide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="/aide" 
                    className={`group rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <HelpCircle size={24} className="text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FAQ & Centre d'aide</h3>
                    <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trouvez des réponses à vos questions</p>
                  </a>
                  
                  <a 
                    href="mailto:support@getweez.com" 
                    className={`group rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Mail size={24} className="text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contacter le support</h3>
                    <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Écrivez-nous directement</p>
                  </a>
                  
                  <a 
                    href="/aide#cgv" 
                    className={`group rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileText size={24} className="text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Conditions générales</h3>
                    <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CGV et mentions légales</p>
                  </a>
                </div>
              </div>
            </div>

            {/* Section Support & Assistance */}
            <div className="max-w-4xl mx-auto mt-16">
              <SupportSection user={user} />
            </div>
          </div>
        </main>
    </div>
  )
}

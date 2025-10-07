import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import { ThemeContext } from '../contexts/ThemeContextSimple'
import { CreditCard, Lock, Shield, Check, ArrowLeft, User, Mail, Phone } from 'lucide-react'

export default function Checkout() {
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })
  
  const router = useRouter()
  const { plan, cycle } = router.query

  // Données des plans
  const planData = {
    basic: {
      name: 'Get Weez Basic',
      monthly: { price: 39, originalPrice: null },
      annual: { price: 327, originalPrice: 468 }
    },
    premium: {
      name: 'Get Weez Premium', 
      monthly: { price: 79, originalPrice: 99 },
      annual: { price: 663, originalPrice: 948 }
    },
    vip: {
      name: 'Get Weez VIP',
      monthly: { price: 199, originalPrice: 249 },
      annual: { price: 1671, originalPrice: 2388 }
    }
  }

  const currentPlan = planData[plan]
  const currentPrice = currentPlan?.[cycle]

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      // Pré-remplir le formulaire si utilisateur connecté
      setFormData({
        firstName: parsedUser.first_name || '',
        lastName: parsedUser.last_name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        password: '',
        confirmPassword: ''
      })
    }

    // Récupérer le thème depuis localStorage
    const theme = localStorage.getItem('theme')
    setIsDarkMode(theme === 'dark')
  }, [])

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Validation basique
      if (!formData.firstName || !formData.lastName || !formData.email) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      if (!user && formData.password !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas')
      }

      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
        throw new Error('Veuillez remplir toutes les informations de paiement')
      }

      // Simulation d'intégration Stripe
      console.log('Données de paiement:', { formData, paymentData, plan, cycle })
      
      // Ici vous intégreriez avec l'API Stripe
      // const paymentIntent = await stripe.createPaymentIntent({...})
      
      // Simulation d'un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Succès simulé
      alert('Paiement réussi ! Redirection vers votre compte...')
      
      // Créer/Mettre à jour l'utilisateur
      const newUser = {
        ...formData,
        is_member: true,
        subscription_plan: plan,
        subscription_cycle: cycle
      }
      
      localStorage.setItem('user', JSON.stringify(newUser))
      router.push('/account?success=true')
      
    } catch (error) {
      console.error('Erreur de paiement:', error)
      alert(error.message || 'Une erreur est survenue lors du paiement')
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  if (!plan || !currentPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan non trouvé</h1>
          <button 
            onClick={() => router.push('/subscriptions')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Retour aux abonnements
          </button>
        </div>
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <div 
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <Header 
          user={user} 
          setUser={setUser}
          toggleMobileMenu={toggleMobileMenu} 
          isMobileMenuOpen={isMobileMenuOpen} 
        />
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          user={user} 
        />
        
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => router.back()}
                className={`mr-4 p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-800 text-gray-300' 
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Finaliser votre commande
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sécurisé par Stripe • Paiement en 1 clic
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulaire */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Informations personnelles */}
                  <div className={`p-6 rounded-2xl ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center mb-6">
                      <User size={24} className="mr-3 text-gray-600" />
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user ? 'Vérifiez vos informations' : 'Créer votre compte'}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Prénom *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleFormChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          } focus:outline-none`}
                          required
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Nom *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleFormChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          } focus:outline-none`}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        } focus:outline-none`}
                        required
                      />
                    </div>

                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        } focus:outline-none`}
                      />
                    </div>

                    {/* Mot de passe si nouvel utilisateur */}
                    {!user && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Mot de passe *
                          </label>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleFormChange('password', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                            } focus:outline-none`}
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Confirmer le mot de passe *
                          </label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                            } focus:outline-none`}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Informations de paiement */}
                  <div className={`p-6 rounded-2xl ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center mb-6">
                      <CreditCard size={24} className="mr-3 text-gray-600" />
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Informations de paiement
                      </h2>
                      <div className="ml-auto flex items-center text-sm text-gray-500">
                        <Lock size={16} className="mr-1" />
                        Sécurisé par Stripe
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Nom sur la carte *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        } focus:outline-none`}
                        required
                      />
                    </div>

                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Numéro de carte *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        } focus:outline-none`}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Date d'expiration *
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          placeholder="MM/AA"
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          } focus:outline-none`}
                          required
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          placeholder="123"
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          } focus:outline-none`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                      isProcessing 
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                    } text-white`}
                  >
                    {isProcessing ? 'Traitement en cours...' : `Payer ${currentPrice?.price}€`}
                  </button>
                </form>
              </div>

              {/* Résumé de commande */}
              <div className="lg:col-span-1">
                <div className={`p-6 rounded-2xl sticky top-8 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Résumé de commande
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {currentPlan?.name}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Facturation {cycle === 'monthly' ? 'mensuelle' : 'annuelle'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {currentPrice?.price}€
                        </div>
                        {currentPrice?.originalPrice && (
                          <div className={`text-sm line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {currentPrice.originalPrice}€
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Total
                      </span>
                      <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {currentPrice?.price}€
                      </span>
                    </div>
                    
                    {currentPrice?.originalPrice && (
                      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                        <div className="flex items-center text-green-800 dark:text-green-300">
                          <Check size={16} className="mr-2" />
                          <span className="text-sm">
                            Vous économisez {currentPrice.originalPrice - currentPrice.price}€
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Shield size={16} className="mr-2" />
                      Paiement sécurisé SSL 256-bit
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Lock size={16} className="mr-2" />
                      Données protégées par Stripe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  )
}

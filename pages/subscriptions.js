import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import SubscriptionPlans from '../components/subscriptions/SubscriptionPlans'
import { ThemeContext } from '../contexts/ThemeContextSimple'

export default function Subscriptions() {
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Récupérer le thème depuis localStorage
    const theme = localStorage.getItem('theme')
    setIsDarkMode(theme === 'dark')
  }, [])

  const handleSubscribe = async (planId, billingCycle) => {
    try {
      // Simulation de l'intégration avec un système de paiement
      console.log(`Abonnement sélectionné: ${planId} (${billingCycle})`)
      
      // Ici vous intégreriez avec Stripe, PayPal, ou votre système de paiement
      // Pour l'instant, on simule un succès
      alert(`Redirection vers le paiement pour le plan ${planId} (${billingCycle})`)
      
      // Redirection vers la page de paiement ou confirmation
      // router.push(`/checkout?plan=${planId}&cycle=${billingCycle}`)
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <div 
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        style={{ 
          width: '100%', 
          minHeight: '100vh', 
          margin: 0, 
          padding: 0
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            width: '100%',
            margin: 0,
            padding: 0
          }}
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
          
          <main 
            className={`flex-1 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}
            style={{ 
              width: '100%',
              minHeight: 'calc(100vh - 8rem)'
            }}
          >
            <SubscriptionPlans 
              user={user} 
              onSubscribe={handleSubscribe}
              isDarkMode={isDarkMode}
            />
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ChatInterface from '../components/chat/ChatInterface'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import { useTheme } from '../contexts/ThemeContextSimple'
import { usePreloader } from '../lib/preloader'

const Home = memo(({ user, setUser }) => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  // Récupérer le message de réservation depuis les query parameters
  const reservationMessage = router.query.message
  const establishmentName = router.query.establishment

  // Ne pas rendre avant que le thème soit chargé
  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chargement...</p>
        </div>
      </div>
    )
  }

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

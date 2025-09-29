import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ChatInterface from '../components/chat/ChatInterface'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import PartnersCarousel from '../components/home/PartnersCarousel'

export default function Home({ user, setUser }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  // Récupérer le message de réservation depuis les query parameters
  const reservationMessage = router.query.message
  const establishmentName = router.query.establishment

  return (
    <div 
        style={{ 
          width: '100%', 
          minHeight: '100vh', 
          margin: 0, 
          padding: 0,
          backgroundColor: '#0D0D0D'
        }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          width: '100%',
          margin: 0,
          padding: 0,
          backgroundColor: '#0D0D0D',
          position: 'relative'
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
            overflow: 'hidden',
            backgroundColor: '#0D0D0D',
            width: '100%',
            minHeight: 'calc(100vh - 6rem)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          <ChatInterface 
            user={user} 
            initialMessage={reservationMessage}
            establishmentName={establishmentName}
          />
        </main>
        
        {/* Section Partenaires */}
        <PartnersCarousel />
        
        {/* Footer avec logo Get Weez */}
        <footer 
          style={{ 
            backgroundColor: 'var(--color-bg-secondary)',
            padding: '1rem 2rem',
            textAlign: 'center',
            color: 'var(--color-text-primary)',
            borderTop: '1px solid var(--color-border)',
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
                color: 'var(--color-text-secondary)', 
                margin: '0.125rem 0',
                fontWeight: '500'
              }}
            >
              YOUR IA CONCIERGE
            </p>
          </div>
          
          {/* Copyright */}
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
            GET WEEZ - ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

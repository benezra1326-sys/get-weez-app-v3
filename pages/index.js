import { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ChatInterface from '../components/chat/ChatInterface'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'

export default function Home({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          width: '100vw',
          margin: 0,
          padding: 0
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
            backgroundColor: 'var(--color-bg-primary)',
            width: '100vw',
            height: 'calc(100vh - 8rem)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ChatInterface user={user} />
        </main>
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

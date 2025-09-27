import { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ChatInterface from '../components/chat/ChatInterface'
import Header from '../components/layout/header'
import Sidebar from '../components/layout/sidebar'
import MobileMenu from '../components/layout/MobileMenu'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'

export default function Home({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <div className="w-full h-screen overflow-hidden" style={{ width: '100vw', height: '100vh' }}>
      <div className="flex flex-col h-full w-full">
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
        
        {/* Layout principal */}
        <div className="flex flex-1 overflow-hidden w-full">
          {/* Sidebar - cachée sur mobile */}
          <div className="hidden lg:block">
            <Sidebar user={user} />
          </div>
          
          {/* Contenu principal */}
          <main 
            className="flex-1 overflow-hidden text-white w-full"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)',
              minHeight: 'calc(100vh - 8rem)'
            }}
          >
            <ChatInterface user={user} />
          </main>
        </div>
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

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { MobileOptimizations, SafeAreaView } from './MobileOptimizations'
import { MobileBottomNavigation, MobileFullScreenMenu, MobileHeader } from './MobileNavigation'
import useMobileDetection from '../../hooks/useMobileDetection'
import useChatTheme from '../../hooks/useChatTheme'

/**
 * Wrapper mobile principal qui englobe l'application
 * Gère la navigation, les optimisations et le layout mobile
 */
export function MobileWrapper({ 
  children, 
  user, 
  title = 'Get Weez',
  showBottomNav = true,
  showHeader = true,
  className = '' 
}) {
  const { isMobile } = useMobileDetection()
  const { themeClasses } = useChatTheme()
  const [showMenu, setShowMenu] = useState(false)

  // Meta tags pour mobile
  const mobileMetaTags = (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="apple-mobile-web-app-title" content="Get Weez" />
      
      {/* Préchargement des ressources critiques */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* PWA meta tags */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      
      {/* Optimisations de performance */}
      <link rel="dns-prefetch" href="https://api.openai.com" />
    </Head>
  )

  if (!isMobile) {
    // Affichage desktop normal
    return (
      <>
        {mobileMetaTags}
        <div className={className}>
          {children}
        </div>
      </>
    )
  }

  return (
    <>
      {mobileMetaTags}
      
      <MobileOptimizations className={`min-h-screen ${themeClasses.main}`}>
        
        {/* Header Mobile */}
        {showHeader && (
          <MobileHeader
            title={title}
            user={user}
            onMenuToggle={() => setShowMenu(true)}
            className="sticky top-0 z-40"
          />
        )}

        {/* Contenu principal avec padding pour la navigation */}
        <main className={`
          flex-1 relative
          ${showHeader ? 'pt-0' : ''}
          ${showBottomNav ? 'pb-20' : 'pb-4'}
          ${className}
        `}>
          <SafeAreaView edges={showBottomNav ? [] : ['bottom']}>
            {children}
          </SafeAreaView>
        </main>

        {/* Navigation bottom */}
        {showBottomNav && (
          <MobileBottomNavigation user={user} />
        )}

        {/* Menu full-screen */}
        <MobileFullScreenMenu
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          user={user}
        />

      </MobileOptimizations>
    </>
  )
}

/**
 * Composant de page mobile optimisée
 */
export function MobilePage({ 
  title, 
  user, 
  children,
  showBottomNav = true,
  showHeader = true,
  className = '',
  contentClassName = ''
}) {
  return (
    <MobileWrapper
      title={title}
      user={user}
      showBottomNav={showBottomNav}
      showHeader={showHeader}
      className={className}
    >
      <div className={`h-full ${contentClassName}`}>
        {children}
      </div>
    </MobileWrapper>
  )
}

/**
 * Composant pour les pages de chat mobile
 */
export function MobileChatPage({ 
  title = 'Chat', 
  user, 
  children,
  className = ''
}) {
  return (
    <MobileWrapper
      title={title}
      user={user}
      showBottomNav={false}
      showHeader={false}
      className={`${className}`}
    >
      <div className="h-full overflow-hidden">
        {children}
      </div>
    </MobileWrapper>
  )
}

/**
 * Hook pour gérer l'état mobile de l'application
 */
export function useMobileApp() {
  const { isMobile, isTablet, isIOS, isAndroid } = useMobileDetection()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [orientation, setOrientation] = useState('portrait')

  useEffect(() => {
    if (isMobile) {
      const handleOrientationChange = () => {
        setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
      }

      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement)
      }

      handleOrientationChange()
      window.addEventListener('orientationchange', handleOrientationChange)
      window.addEventListener('resize', handleOrientationChange)
      document.addEventListener('fullscreenchange', handleFullscreenChange)

      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange)
        window.removeEventListener('resize', handleOrientationChange)
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
      }
    }
  }, [isMobile])

  const enterFullscreen = async (element = document.documentElement) => {
    if (element.requestFullscreen) {
      await element.requestFullscreen()
    }
  }

  const exitFullscreen = async () => {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    }
  }

  return {
    isMobile,
    isTablet,
    isIOS,
    isAndroid,
    isFullscreen,
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    enterFullscreen,
    exitFullscreen
  }
}

export default {
  MobileWrapper,
  MobilePage,
  MobileChatPage,
  useMobileApp
}
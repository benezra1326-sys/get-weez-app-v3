import { createContext, useContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Charger le thème depuis localStorage AVANT le premier render
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('gliitz-theme')
      return savedTheme === 'dark'
    }
    return false // Par défaut mode clair Gliitz
  }

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme)
  const [isLoaded, setIsLoaded] = useState(true)

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    try {
      // Vérifier si localStorage est disponible (côté client)
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTheme = localStorage.getItem('gliitz-theme')
        const shouldBeDark = savedTheme === 'dark'
        
        setIsDarkMode(shouldBeDark)
        
        // Appliquer data-theme et classes pour le thème Gliitz
        if (shouldBeDark) {
          document.documentElement.setAttribute('data-theme', 'dark')
          document.body.classList.add('dark')
          document.body.classList.remove('light')
          document.body.style.backgroundColor = '#0B0B0C' // Noir Gliitz
        } else {
          document.documentElement.setAttribute('data-theme', 'light')
          document.body.classList.add('light')
          document.body.classList.remove('dark')
          document.body.style.backgroundColor = '#F8F8F8' // Gris clair Gliitz
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du thème Gliitz:', error)
    }
    setIsLoaded(true)
  }, [])

  // Sauvegarder le thème dans localStorage et appliquer data-theme
  useEffect(() => {
    if (isLoaded) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('gliitz-theme', isDarkMode ? 'dark' : 'light')
          
          // Appliquer data-theme sur <html> et classes sur body
          if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark')
            document.body.classList.add('dark')
            document.body.classList.remove('light')
            document.body.style.backgroundColor = '#0B0B0C' // Noir Gliitz
          } else {
            document.documentElement.setAttribute('data-theme', 'light')
            document.body.classList.add('light')
            document.body.classList.remove('dark')
            document.body.style.backgroundColor = '#F8F8F8' // Gris clair Gliitz
          }
        }
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde du thème Gliitz:', error)
      }
    }
  }, [isDarkMode, isLoaded])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      setIsDarkMode,
      toggleTheme,
      isLoaded,
      theme: isDarkMode ? 'dark' : 'light'
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

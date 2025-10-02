import { createContext, useContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false) // Par défaut en mode clair
  const [isLoaded, setIsLoaded] = useState(true) // Forcer le chargement immédiat

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    try {
      // Vérifier si localStorage est disponible (côté client)
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark') {
          setIsDarkMode(true)
          document.body.classList.add('dark')
          document.body.classList.remove('light')
        } else if (savedTheme === 'light') {
          setIsDarkMode(false)
          document.body.classList.add('light')
          document.body.classList.remove('dark')
        } else {
          // Par défaut mode clair si aucun thème sauvegardé
          document.body.classList.add('light')
          document.body.classList.remove('dark')
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du thème:', error)
    }
    setIsLoaded(true)
  }, [])

  // Sauvegarder le thème dans localStorage et appliquer la classe au body
  useEffect(() => {
    if (isLoaded) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
          
          // Appliquer la classe dark au body pour les CSS
          if (isDarkMode) {
            document.body.classList.add('dark')
            document.body.classList.remove('light')
          } else {
            document.body.classList.add('light')
            document.body.classList.remove('dark')
          }
        }
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde du thème:', error)
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
      isLoaded
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

import { createContext, useContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false) // Mode clair par défaut
  const [isLoaded, setIsLoaded] = useState(false) // Pas chargé au début

  useEffect(() => {
    // Récupérer le thème depuis localStorage ou utiliser le mode sombre par défaut
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
    }
    
    setIsLoaded(true)
  }, [])

  // Sauvegarder dans localStorage et appliquer la classe CSS
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
      
      // Appliquer la classe CSS au body
      if (typeof document !== 'undefined') {
        document.body.className = isDarkMode ? 'theme-dark' : 'theme-light'
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

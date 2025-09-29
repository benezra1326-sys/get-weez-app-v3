import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false) // Mode clair par défaut
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Récupérer le thème depuis localStorage au chargement
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      // Sauvegarder le thème dans localStorage
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
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

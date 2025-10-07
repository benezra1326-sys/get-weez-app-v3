import { createContext, useContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false) // Toujours commencer en mode clair
  const [isLoaded, setIsLoaded] = useState(false)

  // Charger le thème depuis localStorage au montage (une seule fois)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('gliitz-theme')
      if (savedTheme === 'dark') {
        setIsDarkMode(true)
      }
    }
    setIsLoaded(true)
  }, [])

  // Sauvegarder et appliquer le thème quand il change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('gliitz-theme', isDarkMode ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
      document.body.style.backgroundColor = isDarkMode ? '#0B0B0C' : '#FFFFFF'
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

import { useEffect } from 'react'
import { useVirtualKeyboard } from '../../hooks/useVirtualKeyboard'

/**
 * Composant utilitaire pour gérer l'expérience mobile avec le clavier virtuel
 * @param {Object} props - Les propriétés du composant
 * @param {React.RefObject} inputRef - Référence vers l'élément input/textarea
 * @param {Function} onKeyboardToggle - Callback appelé quand le clavier s'ouvre/ferme
 * @param {boolean} enabled - Si le gestionnaire est activé
 */
const MobileKeyboardHandler = ({ 
  inputRef, 
  onKeyboardToggle, 
  enabled = true 
}) => {
  const { 
    isKeyboardOpen, 
    viewportHeight, 
    keyboardHeight, 
    handleFocus, 
    handleBlur 
  } = useVirtualKeyboard()

  // Gérer les événements de focus/blur sur l'input
  useEffect(() => {
    if (!enabled || !inputRef?.current) return

    const input = inputRef.current

    const handleInputFocus = () => {
      handleFocus()
      onKeyboardToggle?.(true)
    }

    const handleInputBlur = () => {
      handleBlur()
      onKeyboardToggle?.(false)
    }

    input.addEventListener('focus', handleInputFocus)
    input.addEventListener('blur', handleInputBlur)

    return () => {
      input.removeEventListener('focus', handleInputFocus)
      input.removeEventListener('blur', handleInputBlur)
    }
  }, [enabled, inputRef, handleFocus, handleBlur, onKeyboardToggle])

  // Ajuster le scroll quand le clavier s'ouvre
  useEffect(() => {
    if (!enabled) return

    if (isKeyboardOpen && inputRef?.current) {
      // Scroll vers l'input quand le clavier s'ouvre
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
    }
  }, [isKeyboardOpen, enabled, inputRef])

  // Appliquer des classes CSS au body pour les styles globaux
  useEffect(() => {
    if (!enabled) return

    const body = document.body
    
    if (isKeyboardOpen) {
      body.classList.add('keyboard-open')
      body.style.setProperty('--keyboard-height', `${keyboardHeight}px`)
    } else {
      body.classList.remove('keyboard-open')
      body.style.removeProperty('--keyboard-height')
    }

    return () => {
      body.classList.remove('keyboard-open')
      body.style.removeProperty('--keyboard-height')
    }
  }, [isKeyboardOpen, keyboardHeight, enabled])

  return null // Ce composant ne rend rien
}

export default MobileKeyboardHandler

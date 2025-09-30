import React, { memo } from 'react'
import { Loader2 } from 'lucide-react'
import useChatTheme from '../../hooks/useChatTheme'

/**
 * Composant ChatButton - Bouton réutilisable pour l'interface de chat
 * Supporte différentes variantes, tailles, et états
 */
const ChatButton = memo(({ 
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  title,
  type = 'button',
  ...props 
}) => {
  const { themeClasses } = useChatTheme()

  // Styles de variantes
  const variantStyles = {
    primary: themeClasses.button.primary,
    secondary: themeClasses.button.secondary,
    danger: themeClasses.button.danger,
    ghost: themeClasses.button.ghost,
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white'
  }

  // Styles de tailles
  const sizeStyles = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    input: 'px-2 py-2 text-sm', // Pour les boutons dans les inputs
    icon: 'p-2' // Pour les boutons icône uniquement
  }

  // Classes de base
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95'

  // Classes de désactivation
  const disabledClasses = 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100'

  // Combiner toutes les classes
  const buttonClasses = [
    baseClasses,
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.medium,
    (disabled || loading) && disabledClasses,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      title={title}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin mr-2" />
          {children && <span>Chargement...</span>}
        </>
      ) : (
        <>
          {icon && (
            <span className={children ? 'mr-2' : ''}>
              {icon}
            </span>
          )}
          {children}
        </>
      )}
    </button>
  )
})

// Composants spécialisés pour des cas d'usage courants
export const SendButton = memo(({ disabled, loading, onClick, ...props }) => (
  <ChatButton
    variant="primary"
    size="input"
    disabled={disabled}
    loading={loading}
    onClick={onClick}
    title="Envoyer le message"
    {...props}
  />
))

export const VoiceButton = memo(({ isListening, onClick, ...props }) => (
  <ChatButton
    variant={isListening ? "danger" : "secondary"}
    size="input"
    disabled={isListening}
    onClick={onClick}
    title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
    {...props}
  />
))

export const ThemeButton = memo(({ isDarkMode, onClick, ...props }) => (
  <ChatButton
    variant="ghost"
    size="small"
    onClick={onClick}
    title={isDarkMode ? "Mode clair" : "Mode sombre"}
    {...props}
  />
))

export const NewChatButton = memo(({ onClick, ...props }) => (
  <ChatButton
    variant="primary"
    size="small"
    onClick={onClick}
    title="Nouvelle conversation"
    {...props}
  />
))

export const DeleteButton = memo(({ onClick, ...props }) => (
  <ChatButton
    variant="danger"
    size="small"
    onClick={onClick}
    title="Supprimer"
    {...props}
  />
))

ChatButton.displayName = 'ChatButton'
SendButton.displayName = 'SendButton'
VoiceButton.displayName = 'VoiceButton'
ThemeButton.displayName = 'ThemeButton'
NewChatButton.displayName = 'NewChatButton'
DeleteButton.displayName = 'DeleteButton'

export default ChatButton
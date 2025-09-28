// 💬 COMPOSANT MESSAGES SUGGESTIFS AVEC ANIMATION
// Objectif : Afficher des messages suggestifs qui apparaissent et disparaissent

import { useState, useEffect } from 'react'
import { suggestiveMessages, animationConfig } from '../../lib/suggestive-messages'

export default function SuggestiveMessages({ 
  category = 'general', 
  show = true, 
  onMessageClick = null 
}) {
  const [currentMessage, setCurrentMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  // Messages pour la catégorie sélectionnée
  const messages = suggestiveMessages[category] || suggestiveMessages.general

  useEffect(() => {
    if (!show || messages.length === 0) return

    const showMessage = () => {
      // Afficher le message actuel
      setCurrentMessage(messages[messageIndex])
      setIsVisible(true)

      // Faire disparaître après la durée d'affichage
      setTimeout(() => {
        setIsVisible(false)
      }, animationConfig.duration)

      // Passer au message suivant
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length)
      }, animationConfig.interval)
    }

    // Démarrer l'animation
    showMessage()

    // Programmer les messages suivants
    const interval = setInterval(showMessage, animationConfig.interval)

    return () => clearInterval(interval)
  }, [show, messages, messageIndex])

  if (!show || !currentMessage) return null

  return (
    <div className="suggestive-messages-container">
      <div
        className={`suggestive-message ${
          isVisible ? 'visible' : 'hidden'
        }`}
        onClick={() => onMessageClick && onMessageClick(currentMessage)}
        style={{
          opacity: isVisible ? 0.4 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity ${animationConfig.fadeIn}ms ease-in-out, transform ${animationConfig.fadeIn}ms ease-in-out`,
          cursor: onMessageClick ? 'pointer' : 'default',
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(139, 92, 246, 0.6)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '400',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(15px)',
          maxWidth: '320px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {currentMessage}
      </div>

      <style jsx>{`
        .suggestive-message {
          animation: fadeInOut ${animationConfig.duration}ms ease-in-out;
        }

        .suggestive-message:hover {
          transform: translateX(-50%) scale(1.05) !important;
          box-shadow: 0 6px 25px rgba(139, 92, 246, 0.4);
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          20% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }

        .suggestive-message.visible {
          animation: slideInUp 0.5s ease-out;
        }

        .suggestive-message.hidden {
          animation: slideOutDown 0.5s ease-in;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes slideOutDown {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}

// Composant pour afficher plusieurs messages en rotation
export function RotatingSuggestiveMessages({ 
  categories = ['beach', 'restaurant', 'yacht'], 
  show = true,
  onMessageClick = null 
}) {
  const [currentCategory, setCurrentCategory] = useState(0)
  const [currentMessage, setCurrentMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!show) return

    const rotateMessages = () => {
      const category = categories[currentCategory]
      const messages = suggestiveMessages[category] || suggestiveMessages.general
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      
      setCurrentMessage(randomMessage)
      setIsVisible(true)

      setTimeout(() => {
        setIsVisible(false)
      }, animationConfig.duration)

      setTimeout(() => {
        setCurrentCategory((prev) => (prev + 1) % categories.length)
      }, animationConfig.interval)
    }

    rotateMessages()
    const interval = setInterval(rotateMessages, animationConfig.interval)

    return () => clearInterval(interval)
  }, [show, categories, currentCategory])

  if (!show || !currentMessage) return null

  return (
    <div className="rotating-suggestive-messages">
      <div
        className={`rotating-message ${isVisible ? 'visible' : 'hidden'}`}
        onClick={() => onMessageClick && onMessageClick(currentMessage)}
        style={{
          opacity: isVisible ? 0.4 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity ${animationConfig.fadeIn}ms ease-in-out, transform ${animationConfig.fadeIn}ms ease-in-out`,
          cursor: onMessageClick ? 'pointer' : 'default',
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(139, 92, 246, 0.6)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '400',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(15px)',
          maxWidth: '320px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {currentMessage}
      </div>
    </div>
  )
}

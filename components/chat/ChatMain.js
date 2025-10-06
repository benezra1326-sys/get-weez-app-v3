import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { MessageCircle, Sparkles, Trash2, Loader2, X, Sun, Moon, Send, Plus, Utensils, Hotel, Car, Calendar, Heart, ShoppingBag, Search, Filter, Plane } from 'lucide-react'
// import BrandCarousel from '../ui/BrandCarousel'
import { useConversationsClean } from '../../hooks/useConversationsClean'
import { useToast } from '../ui/Toast'
import { useTheme } from '../../contexts/ThemeContextSimple'
import DesktopChat from './DesktopChat'
import MobileChatBox from './MobileChatBox'
import SuggestionsGrid from './SuggestionsGrid'
import MobileSuggestionsEnhanced from './MobileSuggestionsEnhanced'
import WelcomeCard from '../ui/WelcomeCard'
import { establishments as staticEstablishments, events as staticEvents } from '../../data/marbella-data'
import { services as staticServices } from '../../data/services-data'

const ChatMain = ({ user, initialMessage, establishmentName }) => {
  const { isDarkMode, toggleTheme } = useTheme()
  const { showToast } = useToast()
  
  // États locaux
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState(null)
  const [isMobile, setIsMobile] = useState(false) // Initialisation cohérente pour SSR
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestionFilter, setSuggestionFilter] = useState('all')
  const [showMobileChatBox, setShowMobileChatBox] = useState(false) // Pour afficher/masquer la chatbox mobile
  const [showMobileHistory, setShowMobileHistory] = useState(false) // Pour afficher l'historique mobile
  
  // Refs
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Hook conversations propre
  const {
    conversations,
    currentConversationId,
    messages,
    isCreating,
    isLoaded,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    renameConversation,
    getCurrentConversation
  } = useConversationsClean()


  // Détection mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Pré-remplir le message initial
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }, [initialMessage])

  // Auto-scroll vers le bas
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (isLoading && messages && messages.length > 1) {
      setTimeout(() => scrollToBottom(), 100)
    }
  }, [messages, isLoading, scrollToBottom])

  // Créer une conversation dès qu'on ouvre le chat mobile
  useEffect(() => {
    if (showMobileChatBox && !currentConversationId && !isCreating) {
      console.log('📱 Ouverture du chat mobile - Création conversation automatique')
      createConversation()
    }
  }, [showMobileChatBox, currentConversationId, isCreating, createConversation])

  // Gestion des suggestions
  const handleSuggestionClick = useCallback((suggestion) => {
    if (isMobile) {
      // Sur mobile, ouvrir la chatbox et préparer le message
      setInput(suggestion)
      if (!currentConversationId) {
        createConversation()
      }
      setShowMobileChatBox(true)
      setShowSuggestions(false)
    } else {
    setInput(suggestion)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
    }
  }, [isMobile, currentConversationId, createConversation])

  // Suggestions visuelles avec images et bordures colorées - Spécifiques à Marbella
  const suggestions = [
    {
      id: 1,
      title: "Restaurants Marbella",
      description: "Nobu, El Lago, La Cabane",
      icon: Utensils,
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50",
      image: "🍽️",
      suggestion: "Je veux réserver une table dans un restaurant gastronomique à Marbella"
    },
    {
      id: 2,
      title: "Hôtels 5 étoiles",
      description: "Puente Romano, Marbella Club",
      icon: Hotel,
      color: "from-blue-500 to-indigo-500",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      image: "🏨",
      suggestion: "Je cherche un hôtel de luxe avec spa à Marbella"
    },
    {
      id: 3,
      title: "Services VIP",
      description: "Jet privé, Hélicoptère, Yacht",
      icon: Plane,
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
      image: "🚁",
      suggestion: "J'ai besoin d'un service de transport VIP (jet, hélicoptère, yacht)"
    },
    {
      id: 4,
      title: "Événements VIP",
      description: "Soirées exclusives",
      icon: Calendar,
      color: "from-purple-500 via-blue-500 via-cyan-500 via-green-500 to-yellow-500",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
      image: "🎉",
      suggestion: "Quels sont les événements exclusifs ce week-end ?"
    },
    {
      id: 5,
      title: "Spa & Wellness",
      description: "Thalasso, Massages",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      borderColor: "border-pink-200",
      bgColor: "bg-pink-50",
      image: "💆‍♀️",
      suggestion: "Je veux un spa day avec massage et soins thalasso"
    },
    {
      id: 6,
      title: "Shopping Golden Mile",
      description: "Puerto Banús, boutiques",
      icon: ShoppingBag,
      color: "from-yellow-500 to-orange-500",
      borderColor: "border-yellow-200",
      bgColor: "bg-yellow-50",
      image: "🛍️",
      suggestion: "Où faire du shopping de luxe à Puerto Banús ?"
    }
  ]

  // Filtrer les suggestions selon la recherche et le filtre
  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = searchQuery === '' || 
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = suggestionFilter === 'all' || 
      (suggestionFilter === 'restaurant' && suggestion.id === 1) ||
      (suggestionFilter === 'hotel' && suggestion.id === 2) ||
      (suggestionFilter === 'transport' && suggestion.id === 3) ||
      (suggestionFilter === 'event' && suggestion.id === 4) ||
      (suggestionFilter === 'spa' && suggestion.id === 5) ||
      (suggestionFilter === 'shopping' && suggestion.id === 6)
    
    return matchesSearch && matchesFilter
  })

  // Fonction pour traiter un message
  const processMessage = async (messageContent, conversationId) => {
    console.log('📝 Traitement du message:', messageContent, 'pour conversation:', conversationId)
    
    // Ajouter le message utilisateur
    addMessage({
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    }, conversationId)
    
    setIsLoading(true)

    try {
      // Obtenir l'historique des messages avec le nouveau message utilisateur
      const currentConversation = conversations.find(conv => conv.id === conversationId)
      const currentMessages = currentConversation ? [...currentConversation.messages, {
        id: Date.now().toString(),
        content: messageContent,
        role: 'user',
        timestamp: new Date()
      }] : []
      
      // Appeler l'API de chat avec le bon format
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          userName: user?.first_name || user?.email || 'Utilisateur',
          isMember: user?.is_member || false,
          conversationHistory: currentMessages.slice(0, -1) // Historique sans le message actuel
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Ajouter la réponse de l'IA
      console.log('✅ Réponse reçue de l\'API:', data.reply)
      addMessage({
        id: (Date.now() + 1).toString(),
        content: data.reply || data.response || 'Désolé, je n\'ai pas pu traiter votre demande.',
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error)
      showToast('Erreur lors de l\'envoi du message', 'error')
      
      // Ajouter un message d'erreur
      addMessage({
        id: (Date.now() + 1).toString(),
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        role: 'assistant',
        timestamp: new Date(),
        isError: true
      }, conversationId)
    } finally {
      setIsLoading(false)
    }
  }

  // Écouter l'événement personnalisé pour ouvrir le chat depuis le bouton flottant
  useEffect(() => {
    const handleOpenChat = (event) => {
      setShowMobileChatBox(true)
      if (!currentConversationId && !isCreating) {
        createConversation()
      }
      
      // Si un message est fourni dans l'événement, l'envoyer automatiquement
      if (event.detail && event.detail.message) {
        const reservationMessage = event.detail.message
        // Attendre un peu que le chat soit ouvert et la conversation créée
        setTimeout(async () => {
          // Utiliser processMessage directement avec la conversation courante
          if (currentConversationId) {
            await processMessage(reservationMessage, currentConversationId)
          }
        }, 1500)
      }
    }

    window.addEventListener('openMobileChat', handleOpenChat)
    return () => window.removeEventListener('openMobileChat', handleOpenChat)
  }, [currentConversationId, isCreating, createConversation, processMessage])

  // Fonction pour envoyer un message
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !isLoaded) {
      console.log('❌ Envoi bloqué:', { input: !!input.trim(), isLoading, isLoaded })
      return
    }
    
    const userMessage = input.trim()
    setInput('') // Vider immédiatement l'input
    
    console.log('📤 Envoi du message:', userMessage)
    
    // Créer une conversation si nécessaire
    if (!currentConversationId) {
      console.log('🆕 Création d\'une nouvelle conversation')
      const newConversationId = createConversation()
      
      // Attendre un peu que la conversation soit créée
      setTimeout(async () => {
        console.log('📝 Traitement du message dans nouvelle conversation:', newConversationId)
        await processMessage(userMessage, newConversationId)
      }, 100)
    } else {
      console.log('📝 Traitement du message dans conversation existante:', currentConversationId)
      await processMessage(userMessage, currentConversationId)
    }
  }, [input, isLoading, isLoaded, currentConversationId, createConversation, processMessage])

  // Gestion des touches
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  // Gestion de la suppression
  const handleDeleteClick = (conversationId) => {
    setConversationToDelete(conversationId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete)
      setShowDeleteConfirm(false)
      setConversationToDelete(null)
      showToast('Conversation supprimée', 'success')
    }
  }

  // Ajuster la hauteur du textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  if (!isLoaded) {
    return null // Le loader principal gère déjà le chargement
  }

  // Utiliser DesktopChat pour les écrans desktop
  if (!isMobile) {
    return <DesktopChat user={user} initialMessage={initialMessage} establishmentName={establishmentName} />
  }

  // Interface mobile simplifiée avec chatbox
  return (
    <div className="w-full relative">
      {/* État initial : Bannière de bienvenue + Suggestions */}
      {!showMobileChatBox && (
    <div className="w-full">
          <WelcomeCard 
            establishmentName={establishmentName}
            onFocus={() => setShowMobileChatBox(true)}
          />
          
          <MobileSuggestionsEnhanced
            establishments={staticEstablishments}
            services={staticServices}
            events={staticEvents}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      )}

      {/* Chat Box qui s'ouvre */}
      <MobileChatBox
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (message) => {
          // Créer conversation si besoin AVANT d'envoyer le message
          if (!currentConversationId) {
            console.log('🆕 Création conversation avant envoi message')
            const newConvId = createConversation()
            // Attendre que la conversation soit créée avec son message de bienvenue
            setTimeout(async () => {
              console.log('📝 Envoi message dans nouvelle conversation:', newConvId)
              await processMessage(message, newConvId)
            }, 200) // Augmenter le délai pour s'assurer que la conversation est bien créée
          } else {
            await processMessage(message, currentConversationId)
          }
        }}
        onClose={() => {
          setShowMobileChatBox(false)
          setShowSuggestions(true)
        }}
        onShowHistory={() => setShowMobileHistory(true)}
        isOpen={showMobileChatBox}
      />

      {/* Modal Historique Mobile */}
      {showMobileHistory && (
        <div className="fixed inset-0 z-[103] flex flex-col"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(10, 10, 15, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            visibility: 'visible',
            opacity: 1,
            zIndex: 103
          }}
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between"
            style={{
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
              background: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.95)'
            }}
          >
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Historique
            </h2>
            <button
              onClick={() => setShowMobileHistory(false)}
              className="p-2 rounded-full"
              style={{
                background: isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(243, 244, 246, 0.8)'
              }}
            >
              <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
            </button>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto p-4">
            {conversations.length === 0 ? (
              <div className="text-center mt-12">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Aucune conversation
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    selectConversation(conv.id)
                    setShowMobileHistory(false)
                  }}
                  className="w-full p-4 rounded-xl mb-3 text-left transition-all duration-300"
                  style={{
                    background: conv.id === currentConversationId
                      ? 'linear-gradient(135deg, #a855f7, #6366f1)'
                      : isDarkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`
                  }}
                >
                  <h3 className={`font-bold mb-1 ${
                    conv.id === currentConversationId ? 'text-white' : (isDarkMode ? 'text-white' : 'text-gray-900')
                  }`}>
                    {conv.title}
                  </h3>
                  <p className={`text-xs ${
                    conv.id === currentConversationId ? 'text-white/70' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                  }`}>
                    {conv.messages?.length || 0} messages
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default ChatMain

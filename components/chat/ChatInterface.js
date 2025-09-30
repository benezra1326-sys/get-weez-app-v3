import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useTranslation } from 'next-i18next'
import { MessageCircle, Sparkles, Trash2, Loader2, X, Sun, Moon, Mic, MicOff } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import { useToast } from '../ui/Toast'
import ChatLoadingSpinner from '../ui/LoadingSpinner'
import ConfirmModal from '../ui/ConfirmModal'
import MobileChatInterface from './MobileChatInterface'
import ConversationSidebar from './ConversationSidebar'
import SuggestionsSidebar from './SuggestionsSidebar'
import ChatArea from './ChatArea'
import { useTheme } from '../../contexts/ThemeContextSimple'

const ChatInterface = ({ user, initialMessage, establishmentName }) => {
  console.log('🔄 ChatInterface component loaded')
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState(null)
  const [sidebarFilter, setSidebarFilter] = useState('all') // 'all', 'events', 'establishments'
  const [showMobileHistory, setShowMobileHistory] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null) // Pour stocker l'élément sélectionné
  const [showDetailPage, setShowDetailPage] = useState(false) // Pour afficher la page dédiée
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = false
  let toggleTheme = () => {}
  
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
    toggleTheme = theme.toggleTheme
  } catch (error) {
    console.warn('ThemeProvider not available, using default theme')
  }

  // Hook useConversations - DOIT être déclaré avant les useEffect qui l'utilisent
  const {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation
  } = useConversations()

  // Effet pour pré-remplir le message de réservation
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage)
      // Focus sur la zone de saisie sans scroll automatique
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }, [initialMessage])
  
  // Effet pour créer une nouvelle conversation par défaut au chargement
  useEffect(() => {
    // Créer une nouvelle conversation si aucune n'est sélectionnée
    if (!currentConversationId && conversations.length >= 0 && createConversation) {
      console.log('🆕 Création d\'une nouvelle conversation par défaut')
      createConversation()
    }
  }, [conversations.length, createConversation, currentConversationId])

  // Fonction pour scroller vers le bas
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Effet pour scroller automatiquement vers le bas quand les messages changent
  useEffect(() => {
    // Seulement si on est en train de charger ou si c'est un nouveau message
    if (isLoading || (messages && messages.length > 0)) {
      // Délai pour éviter le scroll intempestif
      setTimeout(() => scrollToBottom(), 100)
    }
  }, [messages, isLoading, scrollToBottom])

  // Effet pour scroller vers le bas quand on change de conversation
  useEffect(() => {
    // Seulement si on a des messages dans la conversation
    if (currentConversationId && messages && messages.length > 0) {
      // Petit délai pour s'assurer que les messages sont rendus
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }, [currentConversationId, scrollToBottom, messages])

  console.log('📊 ChatInterface state:', {
    conversationsCount: conversations?.length || 0,
    currentConversationId,
    messagesCount: messages?.length || 0,
    messages: messages,
    messagesType: typeof messages,
    messagesArray: Array.isArray(messages),
    input,
    isLoading,
    hasCreateConversation: typeof createConversation === 'function',
    hasAddMessage: typeof addMessage === 'function'
  })

  const handleSend = useCallback(async () => {
    console.log('🚀🚀🚀 handleSend appelé', { 
      input: input.trim(), 
      isLoading, 
      currentConversationId,
      hasInput: !!input.trim()
    })
    
    if (!input.trim() || isLoading) {
      console.log('❌ handleSend: Conditions non remplies', { input: input.trim(), isLoading })
      return
    }

    const userMessage = input.trim()
    console.log('📝 Message utilisateur:', userMessage)
    setInput('')
    
    // Créer une conversation si nécessaire
    let conversationId = currentConversationId
    if (!conversationId) {
      console.log('🔧 Création d\'une nouvelle conversation...')
      conversationId = createConversation()
      console.log('🔧 Nouveau conversationId:', conversationId)
    }

    // Ajouter le message utilisateur
    console.log('💬 Ajout du message utilisateur, conversationId:', conversationId)
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }, conversationId)
    
    setIsLoading(true)

    try {
      // Obtenir l'historique des messages de la conversation actuelle
      const currentMessages = conversations.find(conv => conv.id === conversationId)?.messages || []
      
      // Appeler l'API de chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userName: 'Utilisateur',
          isMember: false,
          conversationHistory: currentMessages
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Réponse reçue:', data)
      
      addMessage({
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage = 'Désolé, une erreur est survenue. Veuillez réessayer.'
      addMessage({
        id: (Date.now() + 2).toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, currentConversationId, createConversation, addMessage, showToast, conversations])

  const handleKeyDown = useCallback((e) => {
    console.log('⌨️⌨️⌨️ Touche pressée:', e.key, { input: input.trim(), isLoading, inputLength: input.length })
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      console.log('✅✅✅ Entrée pressée, conditions:', { 
        hasInput: !!input.trim(), 
        notLoading: !isLoading,
        inputValue: input,
        inputTrimmed: input.trim()
      })
      if (input.trim() && !isLoading) {
        console.log('🚀🚀🚀 Appel de handleSend depuis handleKeyDown')
        handleSend()
      } else {
        console.log('❌❌❌ Conditions non remplies pour handleSend')
      }
    }
  }, [input, isLoading, handleSend])

  // Gestion de la suppression de conversation
  const handleDeleteClick = (conversationId) => {
    setConversationToDelete(conversationId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete)
      setConversationToDelete(null)
      setShowDeleteConfirm(false)
      showToast('Conversation supprimée avec succès', 'success')
    }
  }

  const handleDeleteCancel = () => {
    setConversationToDelete(null)
    setShowDeleteConfirm(false)
  }

  // Fonction de dictée
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'fr-FR'
      
      recognition.onstart = () => {
        setIsListening(true)
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
        showToast('Erreur de reconnaissance vocale', 'error')
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    } else {
      showToast('Reconnaissance vocale non supportée', 'error')
    }
  }

  const handleCloseConversation = () => {
    if (currentConversationId) {
      selectConversation(null)
      showToast('Conversation fermée', 'info')
    }
  }

  // État pour détecter si on est sur mobile
  const [isMobile, setIsMobile] = useState(false)

  // Données des éléments pour les pages dédiées
  const itemsData = {
    'beach-party': {
      type: 'event',
      title: 'Beach Party',
      date: '21 juin - 16h',
      description: 'Soirée exclusive sur la plage avec DJ international et vue panoramique sur la mer',
      details: 'Rejoignez-nous pour une soirée inoubliable sur la plage avec un DJ international, des cocktails premium et une vue panoramique sur la mer Méditerranée. Ambiance festive garantie avec musique électronique et house.',
      features: ['DJ international', 'Cocktails premium', 'Vue panoramique', 'Ambiance festive'],
      price: 'À partir de 150€',
      location: 'Plage de Marbella',
      capacity: '200 personnes',
      dressCode: 'Tenue de plage élégante',
      includes: ['Boissons illimitées', 'Snacks', 'Transport depuis l\'hôtel', 'Service VIP'],
      tags: ['🌊', '🎵', '✨', '🏖️']
    },
    'jazz-evening': {
      type: 'event',
      title: 'Soirée Jazz',
      date: '26 juin - 22h',
      description: 'Concert de jazz avec vue imprenable sur la mer et ambiance intimiste',
      details: 'Découvrez une soirée jazz intimiste avec des musiciens de renommée internationale dans un cadre exceptionnel face à la mer.',
      features: ['Musiciens internationaux', 'Ambiance intimiste', 'Vue sur mer', 'Cocktails raffinés'],
      price: 'À partir de 80€',
      location: 'Terrasse panoramique',
      capacity: '50 personnes',
      dressCode: 'Tenue élégante',
      includes: ['Concert', 'Cocktails premium', 'Amuse-bouches', 'Service personnalisé'],
      tags: ['🎷', '🌊', '🎼', '✨']
    },
    'gastronomic-dinner': {
      type: 'event',
      title: 'Dîner Gastronomique',
      date: '28 juin - 20h',
      description: 'Expérience culinaire exceptionnelle avec chef étoilé et menu dégustation',
      details: 'Un voyage culinaire exceptionnel avec notre chef étoilé qui vous proposera un menu dégustation unique.',
      features: ['Chef étoilé', 'Menu dégustation', 'Vins d\'exception', 'Service sommelier'],
      price: 'À partir de 200€',
      location: 'Restaurant gastronomique',
      capacity: '30 personnes',
      dressCode: 'Tenue de soirée',
      includes: ['Menu dégustation', 'Accord mets-vins', 'Service sommelier', 'Digestif premium'],
      tags: ['🍽️', '⭐', '🍷', '👨‍🍳']
    },
    'nobu-marbella': {
      type: 'establishment',
      title: 'Nobu Marbella',
      category: 'Restaurant',
      description: 'Expérience culinaire japonaise exceptionnelle avec vue sur la mer',
      details: 'Découvrez l\'excellence de la cuisine japonaise dans un cadre exceptionnel face à la mer Méditerranée.',
      features: ['Cuisine japonaise authentique', 'Vue sur mer', 'Chef Nobu', 'Saké premium'],
      price: 'Menu à partir de 120€',
      location: 'Puerto Banús, Marbella',
      hours: '19h00 - 23h30',
      capacity: '80 couverts',
      dressCode: 'Tenue élégante',
      includes: ['Menu dégustation', 'Saké premium', 'Service exceptionnel', 'Terrasse privée'],
      tags: ['🍣', '⭐', '🌊', '🏮']
    },
    'terraza-del-mar': {
      type: 'establishment',
      title: 'La Terraza del Mar',
      category: 'Restaurant',
      description: 'Cuisine méditerranéenne raffinée avec terrasse panoramique',
      details: 'Savourez une cuisine méditerranéenne raffinée dans un cadre idyllique avec vue panoramique sur la mer.',
      features: ['Cuisine méditerranéenne', 'Terrasse panoramique', 'Produits locaux', 'Vins régionaux'],
      price: 'Menu à partir de 90€',
      location: 'Costa del Sol, Marbella',
      hours: '12h00 - 15h00 / 19h00 - 23h00',
      capacity: '60 couverts',
      dressCode: 'Tenue décontractée élégante',
      includes: ['Menu méditerranéen', 'Vins régionaux', 'Terrasse privée', 'Service personnalisé'],
      tags: ['🏖️', '🌊', '🍽️', '🌿']
    },
    'el-lago': {
      type: 'establishment',
      title: 'El Lago',
      category: 'Restaurant',
      description: 'Restaurant gastronomique avec vue sur le lac et jardin tropical',
      details: 'Une expérience culinaire unique dans un cadre exceptionnel avec vue sur le lac et jardin tropical.',
      features: ['Vue sur lac', 'Jardin tropical', 'Cuisine créative', 'Ambiance romantique'],
      price: 'Menu à partir de 150€',
      location: 'Complexe hôtelier, Marbella',
      hours: '19h30 - 23h00',
      capacity: '40 couverts',
      dressCode: 'Tenue de soirée',
      includes: ['Menu gastronomique', 'Vins d\'exception', 'Jardin privé', 'Service VIP'],
      tags: ['🏨', '🌊', '🍽️', '✨']
    },
    'club-vip': {
      type: 'establishment',
      title: 'Club VIP',
      category: 'Nightclub',
      description: 'Club exclusif avec piste de danse et bar premium',
      details: 'Vivez une nuit inoubliable dans notre club VIP exclusif avec piste de danse et bar premium.',
      features: ['Piste de danse', 'Bar premium', 'DJ international', 'Ambiance exclusive'],
      price: 'Entrée à partir de 50€',
      location: 'Puerto Banús, Marbella',
      hours: '23h00 - 06h00',
      capacity: '300 personnes',
      dressCode: 'Tenue de soirée',
      includes: ['Entrée VIP', 'Boissons premium', 'Service bottle', 'Terrasse privée'],
      tags: ['🍾', '🎵', '✨', '🎉']
    }
  }

  // Fonction pour ouvrir une page dédiée
  const openDetailPage = (itemId) => {
    const item = itemsData[itemId]
    if (item) {
      setSelectedItem(item)
      setShowDetailPage(true)
    }
  }

  // Fonction pour fermer la page dédiée
  const closeDetailPage = () => {
    setShowDetailPage(false)
    setSelectedItem(null)
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Composant de page dédiée
  const DetailPage = ({ item, onClose }) => {
    if (!item) return null

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`sticky top-0 z-10 p-6 border-b flex items-center justify-between ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{item.tags[0]}</div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.type === 'event' ? item.date : item.category}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description principale */}
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Description
              </h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {item.details}
              </p>
            </div>

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Informations
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prix:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lieu:</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.location}</span>
                  </div>
                  {item.capacity && (
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Capacité:</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.capacity}</span>
                    </div>
                  )}
                  {item.hours && (
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Horaires:</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.hours}</span>
                    </div>
                  )}
                  {item.dressCode && (
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tenue:</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.dressCode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Caractéristiques
                </h3>
                <div className="space-y-2">
                  {item.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inclus */}
            {item.includes && (
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Inclus
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.includes.map((include, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-blue-500">•</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{include}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Ambiance
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-200 border border-gray-700' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer avec boutons */}
          <div className={`sticky bottom-0 p-6 border-t rounded-b-2xl ${
            isDarkMode 
              ? 'border-gray-700 bg-gray-800' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setInput(`Plus d'informations sur ${item.title}`)
                  onClose()
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300'
                }`}
              >
                Plus d'infos
              </button>
              <button
                onClick={() => {
                  setInput(`Réserver pour ${item.title}`)
                  onClose()
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page dédiée */}
      {showDetailPage && <DetailPage item={selectedItem} onClose={closeDetailPage} />}

      {/* Interface mobile - toujours présente mais cachée sur desktop */}
      <div className="lg:hidden">
        <MobileChatInterface user={user} initialMessage={initialMessage} establishmentName={establishmentName} />
      </div>

      {/* Interface desktop - cachée sur mobile */}
      <div className="hidden lg:block">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(90deg, #FACC15 0%, #FDE047 50%, #FACC15 100%);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes scroll-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll-reverse {
          animation: scroll-reverse 30s linear infinite;
        }
        
        /* Styles pour les bannières uniformes */
        .uniform-banner {
          position: relative;
          height: 200px;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .uniform-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .banner-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
          z-index: 2;
        }
        
        .banner-content {
          position: relative;
          z-index: 3;
          height: 100%;
          padding: 20px 20px 16px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
          min-height: 0;
        }
        
        .banner-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        
        .banner-badge {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 215, 0, 0.6);
          box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
          color: #1A1A1A;
        }
        
        .banner-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1.2;
        }
        
        .banner-description {
          font-size: 14px;
          opacity: 0.9;
          line-height: 1.3;
          margin-bottom: 8px;
          max-height: 2.6em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .banner-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 8px;
          flex-shrink: 0;
          min-height: 44px;
        }
        
        .banner-rating {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 0;
        }
        
        .banner-buttons {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          flex-shrink: 0;
        }
        
        .banner-button {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          white-space: nowrap;
          min-height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .banner-button.primary {
          background: rgba(255, 255, 255, 0.9);
          color: #1f2937;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .banner-button.primary:hover {
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .banner-button.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .banner-button.secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .uniform-banner {
            height: 160px;
            margin-bottom: 12px;
          }
          
          .banner-content {
            padding: 16px 16px 12px 16px;
          }
          
          .banner-title {
            font-size: 20px;
          }
          
          .banner-description {
            font-size: 13px;
          }
          
          .banner-button {
            padding: 5px 10px;
            font-size: 10px;
            min-height: 24px;
          }
          
          .banner-rating {
            font-size: 12px;
          }
          
          .banner-footer {
            min-height: 36px;
            padding-top: 6px;
          }
        }
      `}</style>
      <div className="w-full min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: isDarkMode ? '#0D0D0D' : '#FFFFFF', width: '100vw', maxWidth: 'none' }}>
      {/* Main Content */}
      <main className="flex w-full flex-col lg:flex-row lg:h-screen min-h-[calc(100vh-8rem)] lg:min-h-screen" style={{ width: '100vw', maxWidth: 'none' }}>
        
        {/* Sidebar gauche - Conversations */}
        <div className="hidden lg:block w-60 border-r overflow-y-auto h-full flex-shrink-0" style={{ backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF', borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
          {/* Version mobile subtile - petit bouton flottant */}
          <div className="lg:hidden fixed top-20 left-4 z-40">
            <button 
              onClick={() => setShowMobileHistory(!showMobileHistory)}
              className={`backdrop-blur-md rounded-full p-2 shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800/90 border border-gray-600 hover:bg-gray-700/90' : 'bg-white/90 border border-gray-300 hover:bg-gray-100/90'}`}
            >
              <MessageCircle size={20} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
            </button>
          </div>
          
          {/* Overlay mobile pour l'historique */}
          {showMobileHistory && (
            <div className={`lg:hidden fixed inset-0 backdrop-blur-sm z-50 ${isDarkMode ? 'bg-black/50' : 'bg-gray-900/20'}`} onClick={() => setShowMobileHistory(false)}>
              <div className={`absolute top-16 left-4 right-4 backdrop-blur-md border rounded-2xl p-4 max-h-[70vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-300'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Conversations</h3>
                  <button 
                    onClick={() => setShowMobileHistory(false)}
                    className={`p-1 rounded-lg transition-all duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                  >
                    ✕
                  </button>
                </div>
                
                {/* Bouton nouvelle conversation mobile */}
                <div 
                  onClick={() => {
                    createConversation()
                    setShowMobileHistory(false)
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 mb-2 cursor-pointer hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Sparkles size={18} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Nouvelle Conversation</span>
                  </div>
                </div>
                
                {/* Bouton fermer conversation mobile */}
                {currentConversationId && (
                  <div 
                    onClick={() => {
                      handleCloseConversation()
                      setShowMobileHistory(false)
                    }}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg p-3 mb-4 cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <X size={18} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Fermer Conversation</span>
                    </div>
                  </div>
                )}
                
                {/* Liste des conversations mobile */}
                <div className="space-y-2">
                  {conversations && conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <div 
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all border hover:scale-105 hover:shadow-lg hover:rotate-1 ${
                          conversation.id === currentConversationId 
                            ? 'bg-blue-600/30 border-blue-500/50' 
                            : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
                        }`}
                        style={{
                          transform: 'perspective(1000px)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        <div 
                          onClick={() => {
                            selectConversation(conversation.id)
                            setShowMobileHistory(false)
                          }}
                          className="flex-1"
                        >
                          <div className={`text-sm font-medium truncate mb-1 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            {conversation.name}
                          </div>
                          <div className="text-gray-400 text-xs mb-2">
                            {conversation.messages?.length || 0} messages
                          </div>
                          <div className="text-gray-500 text-xs truncate">
                            {conversation.messages && conversation.messages.length > 0 
                              ? conversation.messages[conversation.messages.length - 1]?.content?.substring(0, 60) + '...'
                              : 'Conversation vide'
                            }
                          </div>
                        </div>
                        
                        {/* Bouton supprimer pour chaque conversation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Supprimer "${conversation.name}" ?`)) {
                              deleteConversation(conversation.id)
                              showToast('Conversation supprimée', 'success')
                            }
                          }}
                          className="mt-2 p-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle size={32} className="text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Aucune conversation</p>
                      <p className="text-gray-500 text-xs mt-1">Créez votre première conversation</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="p-2 lg:p-4 flex-1 overflow-y-auto pb-1 lg:pb-6 min-h-0">
            <h2 className={`text-sm lg:text-lg font-bold mb-2 lg:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Conversations</h2>
            <div className="space-y-1 lg:space-y-4">
              {/* Bouton Nouvelle Conversation - Design Optimisé */}
              <button 
                onClick={createConversation}
                className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-medium py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 group mb-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-bold">Nouvelle conversation</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                    <Sparkles size={16} className="text-yellow-300" />
                  </div>
                </div>
              </button>

              {/* Liste des conversations */}
              {conversations && conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`bg-gradient-to-r ${conversation.id === currentConversationId 
                      ? 'from-blue-500/30 to-purple-600/30 border-blue-500/50' 
                      : 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
                    } border rounded-xl p-1 lg:p-4 hover:border-blue-400/50 transition-all duration-300 group relative hover:scale-105 hover:shadow-lg hover:rotate-1`}
                    style={{
                      transform: 'perspective(1000px)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => selectConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-2 lg:space-x-3 mb-1">
                        <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${
                          conversation.id === currentConversationId 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                          <MessageCircle size={12} className="text-white lg:hidden" />
                          <MessageCircle size={16} className="text-white hidden lg:block" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-xs lg:text-sm truncate ${conversation.id === currentConversationId ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                            {conversation.name}
                          </h3>
                          <p className={`text-xs ${conversation.id === currentConversationId ? (isDarkMode ? 'text-blue-300' : 'text-blue-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                            {conversation.messages?.length || 0} msgs
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {conversation.messages && conversation.messages.length > 0 
                          ? conversation.messages[conversation.messages.length - 1]?.content?.substring(0, 50) + '...'
                          : 'Conversation vide'
                        }
                      </p>
                    </div>
                    
                    {/* Bouton de suppression */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(conversation.id)
                      }}
                      className="absolute top-3 right-3 p-1 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Supprimer la conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="hidden lg:block text-center py-8">
                  <MessageCircle size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-base">Aucune conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Section - Largeur ajustée avec scroll mobile corrigé */}
        <div className="flex-1 flex flex-col min-w-0 px-2 pt-1 pb-1 lg:p-6 h-auto lg:h-full w-full" style={{ 
          width: '100%', 
          maxWidth: 'none', 
          flex: '1 1 0%',
          overflowY: 'auto', // Permettre scroll vertical sur mobile
          WebkitOverflowScrolling: 'touch' // Scroll fluide iOS
        }}>
          <div className="rounded-2xl border p-2 lg:p-6 lg:h-full flex flex-col" style={{ backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF', borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
            
            {/* Barre d'outils mobile */}
            <div className="lg:hidden flex items-center justify-between mb-3 p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#2D2D2D' : '#F3F4F6' }}>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowMobileHistory(!showMobileHistory)}
                  className="p-2 rounded-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: '#374151',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4B5563'
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#374151'
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <MessageCircle size={16} className="text-white" />
                </button>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {conversations?.length || 0} conversations
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Bouton thème */}
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: '#6B7280',
                    boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4B5563'
                    e.target.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6B7280'
                    e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)'
                  }}
                  title={isDarkMode ? "Mode clair" : "Mode sombre"}
                >
                  {isDarkMode ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
                </button>
                
                <button 
                  onClick={createConversation}
                  className="p-2 rounded-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: '#3B82F6',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2563EB'
                    e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3B82F6'
                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  title="Nouvelle conversation"
                >
                  <Sparkles size={16} className="text-white" />
                </button>
                {currentConversationId && (
                  <button 
                    onClick={handleCloseConversation}
                    className="p-2 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: '#6B7280',
                      boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4B5563'
                      e.target.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#6B7280'
                      e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)'
                    }}
                    title="Fermer la conversation"
                  >
                    <X size={16} className="text-white" />
                  </button>
                )}
                {messages && messages.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm('Voulez-vous effacer cette conversation ?')) {
                        if (currentConversationId) {
                          deleteConversation(currentConversationId)
                          showToast('Conversation effacée', 'success')
                        }
                      }
                    }}
                    className="p-2 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: '#DC2626',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#B91C1C'
                      e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#DC2626'
                      e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* En-tête de la conversation */}
            {currentConversationId && messages && messages.length > 0 && (
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {conversations.find(conv => conv.id === currentConversationId)?.name || 'Conversation'}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {messages.length} message{messages.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseConversation}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all duration-300"
                  title="Fermer la conversation"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Zone des messages */}
            <div className="flex-1 lg:overflow-y-auto mb-2 lg:mb-6 lg:min-h-0 chat-messages-container scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2 lg:p-0">
              {messages && messages.length > 0 ? (
                <div className="space-y-2 lg:space-y-4">
                  {messages.map((msg) => {
                    console.log('🔍 Affichage message:', msg)
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                        style={{
                          animation: 'fadeInUp 0.3s ease-out'
                        }}
                      >
                        <div
                          className={`max-w-[85%] lg:max-w-[70%] px-4 py-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'rounded-br-md'
                              : 'rounded-bl-md border'
                          }`}
                          style={{
                            backgroundColor: msg.role === 'user' 
                              ? '#14B8A6' 
                              : '#2D2D2D',
                            color: '#FFFFFF',
                            borderColor: msg.role === 'user' ? 'transparent' : '#374151',
                            boxShadow: msg.role === 'user' 
                              ? '0 4px 12px rgba(20, 184, 166, 0.3)' 
                              : '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <div className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content || 'Message vide'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {/* Élément invisible pour le scroll automatique */}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-4 lg:py-8">
                  {/* Version mobile - design plus engageant */}
                  <div 
                    className="lg:hidden relative overflow-hidden rounded-2xl border border-purple-500/30 p-4 mb-4 w-full max-w-sm cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{ borderColor: '#3B82F6' }}
                    onClick={() => {
                      if (textareaRef.current) {
                        textareaRef.current.focus()
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-white/20 backdrop-blur-sm mx-auto shadow-xl">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-white">
                        Votre IA Concierge
                      </h3>
                      <p className="text-purple-100 text-sm px-2 leading-relaxed">
                        Demandez-moi n'importe quoi sur Marbella !
                      </p>
                      <div className="mt-3 flex items-center justify-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Version desktop */}
                  <div className="hidden lg:block relative overflow-hidden rounded-3xl border border-purple-500/30 p-6 lg:p-8 mb-4 lg:mb-6 w-full max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm mx-auto shadow-2xl">
                        <MessageCircle size={48} className="text-white" />
                      </div>
                      <h3 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-4 text-white">
                        Bienvenue sur Get Weez
                      </h3>
                      <p className="text-purple-100 text-sm lg:text-lg px-2 lg:px-4 leading-relaxed">
                        Votre concierge IA personnel pour Marbella
                      </p>
                      <div className="mt-4 lg:mt-6 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification de réservation si applicable */}
                  {establishmentName && establishmentName !== 'undefined' && (
                    <div className="lg:hidden bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 mb-4 mx-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-lg">🍽️</span>
                        <div>
                          <p className="text-white font-medium text-sm">Demande de réservation</p>
                          <p className="text-green-100 text-xs">Pour {establishmentName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs lg:text-base text-gray-400 px-4 lg:px-6">
                    <span className="lg:hidden">Tapez votre message ci-dessous</span>
                    <span className="hidden lg:inline">Commencez à taper votre message ci-dessous pour commencer une conversation</span>
                  </p>
                </div>
              )}
                  
              {isLoading && (
                <div className="flex justify-start">
                  <div 
                    className="max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-md border bg-gray-800 border-gray-600"
                    style={{ 
                      backgroundColor: '#1F2937',
                      color: '#FFFFFF',
                      borderColor: '#374151'
                    }}
                  >
                    <ChatLoadingSpinner />
                  </div>
                </div>
              )}
            </div>

              {/* Suggestions rapides - Version mobile AGRANDIE */}
              <div className="lg:hidden mb-2">
                <h3 className="text-white font-bold text-base mb-2 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  💡 Que puis-je faire pour vous ?
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4 max-h-[75vh] overflow-y-auto" style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  minHeight: '50vh' // Hauteur minimum garantie
                }}>
                  {/* Événements - Taille d'origine remise */}
                  <div className={`rounded-xl p-4 border transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-400/30' : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300/50'}`} style={{ minHeight: '120px' }}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-xl">🏖️</span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Beach Party</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}>21 juin</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInput('Réserver pour la Beach Party')}
                      className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white`}
                    >
                      Réserver
                    </button>
                  </div>
                  
                  <div className={`rounded-xl p-4 border transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400/30' : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300/50'}`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-xl">🎷</span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Soirée Jazz</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>26 juin</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInput('Réserver pour la soirée jazz')}
                      className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white`}
                    >
                      Réserver
                    </button>
                  </div>
                  
                  {/* Restaurants */}
                  <div className={`rounded-xl p-4 border transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-400/30' : 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300/50'}`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-xl">🍣</span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>Nobu Marbella</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-amber-100' : 'text-amber-700'}`}>Japonais Premium</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInput('Réserver une table chez Nobu')}
                      className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white`}
                    >
                      Réserver
                    </button>
                  </div>
                  
                  <div className={`rounded-xl p-4 border transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-teal-500 to-cyan-500 border-teal-400/30' : 'bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-300/50'}`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-xl">🍽️</span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-teal-900'}`}>La Terraza</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-teal-100' : 'text-teal-700'}`}>Méditerranéen</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInput('Réserver une table à La Terraza')}
                      className={`w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white`}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
                
                {/* Services rapides */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: '🚗', text: 'Transport VIP', gradient: 'from-blue-500 to-indigo-600' },
                    { icon: '🛥️', text: 'Yacht privé', gradient: 'from-cyan-500 to-blue-600' },
                    { icon: '🚁', text: 'Hélicoptère', gradient: 'from-amber-500 to-orange-600' },
                    { icon: '💆', text: 'Spa à domicile', gradient: 'from-pink-500 to-rose-600' }
                  ].map((service, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(service.text)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center min-w-[120px] bg-gradient-to-r ${service.gradient} text-white border border-white/20 shadow-lg hover:shadow-xl hover:scale-105`}
                    >
                      <span className="mr-2 text-xl">{service.icon}</span>
                      {service.text}
                    </button>
                  ))}
                </div>
            </div>

              {/* Zone de saisie */}
              <div className="flex-shrink-0 space-y-2 lg:space-y-3">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto'
                        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={messages.length === 0 ? "Demandez-moi n'importe quoi sur Marbella..." : t('chat.placeholder')}
                    className="w-full px-4 py-4 lg:px-4 lg:py-6 pr-12 lg:pr-24 border rounded-xl resize-none text-sm lg:text-lg transition-all duration-300 focus:outline-none"
                    style={{ 
                      backgroundColor: isDarkMode ? '#2D2D2D' : '#F9FAFB', 
                      borderColor: isDarkMode ? '#374151' : '#D1D5DB', 
                      color: isDarkMode ? '#FFFFFF' : '#1F2937',
                      minHeight: '48px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      fontSize: '16px' // Empêche le zoom sur iOS
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#374151'
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                    rows={1}
                    disabled={isLoading}
                  />
                
                {/* Bouton de dictée */}
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className="absolute right-12 lg:right-16 top-1/2 transform -translate-y-1/2 p-2 lg:p-3 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: isListening ? '#EF4444' : '#6B7280',
                    boxShadow: isListening ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 2px 8px rgba(107, 114, 128, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isListening) {
                      e.target.style.backgroundColor = '#4B5563'
                      e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isListening) {
                      e.target.style.backgroundColor = '#6B7280'
                      e.target.style.boxShadow = '0 2px 8px rgba(107, 114, 128, 0.3)'
                    }
                  }}
                  title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
                >
                  {isListening ? (
                    <MicOff size={14} className="lg:hidden" />
                  ) : (
                    <Mic size={14} className="lg:hidden" />
                  )}
                  {isListening ? (
                    <MicOff size={16} className="hidden lg:block" />
                  ) : (
                    <Mic size={16} className="hidden lg:block" />
                  )}
                </button>
                
                {/* Bouton d'envoi */}
                <button
                  onClick={() => {
                    console.log('🖱️ Bouton d\'envoi cliqué', { input: input.trim(), isLoading })
                    handleSend()
                  }}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 p-2 lg:p-4 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: !input.trim() || isLoading ? '#374151' : '#3B82F6',
                    boxShadow: !input.trim() || isLoading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.backgroundColor = '#2563EB'
                      e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.backgroundColor = '#3B82F6'
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin lg:hidden" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:hidden">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                    </svg>
                  )}
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin hidden lg:block" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              </div>
                
              {/* Texte d'information */}
              <div className="flex items-center justify-between text-xs lg:text-xs text-gray-400">
                <span className="hidden sm:inline">Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne</span>
                <span className="sm:hidden">Entrée pour envoyer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar droite - Propositions avec filtres - UNIQUEMENT sur desktop */}
        <div className="hidden lg:block w-72 border-t lg:border-t-0 lg:border-l overflow-y-auto h-[32rem] lg:h-full flex-shrink-0" style={{ backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF', borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
          <div className="p-2 lg:p-4 pb-2 lg:pb-6">
            <h2 className={`text-base lg:text-lg font-bold mb-2 lg:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💡 Suggestions</h2>
            
            {/* Filtres améliorés avec plus d'options */}
            <div className="mb-3 lg:mb-4">
              {/* Version desktop - Filtres uniformisés */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSidebarFilter('all')}
                    className="px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: sidebarFilter === 'all' ? '#3B82F6' : (isDarkMode ? '#374151' : '#F3F4F6'),
                      color: sidebarFilter === 'all' ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#374151'),
                      boxShadow: sidebarFilter === 'all' ? '0 4px 12px rgba(59, 130, 246, 0.4)' : (isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'),
                      fontSize: '14px',
                      fontWeight: '600',
                      minHeight: '50px'
                    }}
                  >
                    <span className="text-lg mb-1">🌟</span>
                    <span className="text-xs">Tout</span>
                  </button>
                  <button
                    onClick={() => setSidebarFilter('events')}
                    className={`px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex flex-col items-center justify-center ${
                      sidebarFilter === 'events' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      minHeight: '50px'
                    }}
                  >
                    <span className="text-lg mb-1">🎉</span>
                    <span className="text-xs">Événements</span>
                  </button>
                  <button
                    onClick={() => setSidebarFilter('establishments')}
                    className={`px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex flex-col items-center justify-center ${
                      sidebarFilter === 'establishments' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      minHeight: '50px'
                    }}
                  >
                    <span className="text-lg mb-1">🍽️</span>
                    <span className="text-xs">Restaurants</span>
                  </button>
                  <button
                    onClick={() => setSidebarFilter('services')}
                    className={`px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex flex-col items-center justify-center ${
                      sidebarFilter === 'services' 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      minHeight: '50px'
                    }}
                  >
                    <span className="text-lg mb-1">⭐</span>
                    <span className="text-xs">Services</span>
                  </button>
                  <button
                    onClick={() => setSidebarFilter('luxury')}
                    className={`px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl flex flex-col items-center justify-center ${
                      sidebarFilter === 'luxury' 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      minHeight: '50px'
                    }}
                  >
                    <span className="text-lg mb-1">💎</span>
                    <span className="text-xs">Luxe</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 lg:space-y-3">
              {/* Événements */}
              {(sidebarFilter === 'all' || sidebarFilter === 'events') && (
                <>
                  <div className="lg:block hidden">
                    <h3 className={`font-semibold text-xs mb-2 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      Aujourd'hui
                    </h3>
                  </div>
                </>
              )}
              {(sidebarFilter === 'all' || sidebarFilter === 'events') && (
                <>
                  {/* Version mobile compacte */}
                  <div className="lg:hidden grid grid-cols-2 gap-2 mb-3">
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-400/30' : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🏖️</span>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Beach Party</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}>21 juin</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-blue-800'}`}>Soirée exclusive</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400/30' : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🎷</span>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Soirée Jazz</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>26 juin</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-purple-800'}`}>Concert jazz</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400/30' : 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🍽️</span>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-green-900'}`}>Dîner Gastronomique</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-green-100' : 'text-green-700'}`}>28 juin</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-green-800'}`}>Menu Michelin</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-400/30' : 'bg-gradient-to-br from-orange-100 to-red-100 border-orange-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🎉</span>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-orange-900'}`}>Pool Party</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-orange-100' : 'text-orange-700'}`}>30 juin</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-orange-800'}`}>Pool VIP</div>
                    </div>
                  </div>
                  
                  {/* Version desktop - Bannière uniforme */}
                  <div 
                    className="hidden lg:block uniform-banner cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openDetailPage('beach-party')}
                  >
                    {/* Image de fond avec gradient */}
                    <div 
                      className="banner-image"
                      style={{
                        background: isDarkMode ? 'linear-gradient(135deg, #1E40AF 0%, #3730A3 50%, #581C87 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)'
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                          🎉 ÉVÉNEMENT
                        </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">Beach Party</h3>
                        <p className="banner-description">Soirée exclusive sur la plage avec DJ international et vue panoramique sur la mer</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>📅</span>
                          <span>21 juin - 16h</span>
                        </div>
                      </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🌊 🎵 ✨ 🏖️</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur la Beach Party')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver pour la Beach Party du 21 juin')}
                          >
                            Réserver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="uniform-banner cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openDetailPage('jazz-evening')}
                  >
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                    style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #DB2777 100%)',
                      width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                      🎵 MUSIQUE
                    </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">Soirée Jazz</h3>
                        <p className="banner-description">Concert de jazz avec vue imprenable sur la mer et ambiance intimiste</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>📅</span>
                          <span>26 juin - 22h</span>
                        </div>
                      </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🎷 🌊 🎼 ✨</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur la Soirée Jazz')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver pour la Soirée Jazz du 26 juin')}
                          >
                            Réserver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="uniform-banner cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openDetailPage('gastronomic-dinner')}
                  >
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                    style={{
                        background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #14B8A6 100%)',
                      width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                      🍽️ GASTRONOMIE
                    </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">Dîner Gastronomique</h3>
                        <p className="banner-description">Menu dégustation avec chef étoilé Michelin</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>📅</span>
                          <span>28 juin - 20h</span>
                        </div>
                      </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🍽️ ⭐ 🍷 👨‍🍳</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur le Dîner Gastronomique')}
                          >
                            Info
                        </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver pour le Dîner Gastronomique du 28 juin')}
                          >
                            Réserver
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Établissements */}
              {(sidebarFilter === 'all' || sidebarFilter === 'establishments') && (
                <>
                  <div className="lg:block hidden">
                    <h3 className={`font-semibold text-sm mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Recommandés
                    </h3>
                  </div>
                </>
              )}
              {(sidebarFilter === 'all' || sidebarFilter === 'establishments') && (
                <>
                  {/* Version mobile compacte */}
                  <div className="lg:hidden grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-2 border border-amber-400/30">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white text-lg">🍣</span>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>Nobu Marbella</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-amber-100' : 'text-amber-700'}`}>Japonais Premium</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-amber-800'}`}>⭐ 4.9/5</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-teal-500 to-cyan-500 border-teal-400/30' : 'bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🏖️</span>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-teal-900'}`}>La Terraza</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-teal-100' : 'text-teal-700'}`}>Méditerranéen</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-teal-800'}`}>Vue panoramique</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-400/30' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🏨</span>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-emerald-900'}`}>El Lago</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-emerald-100' : 'text-emerald-700'}`}>Créatif</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-emerald-800'}`}>Vue sur lac</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-rose-500 to-pink-500 border-rose-400/30' : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🍾</span>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-rose-900'}`}>Club VIP</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-rose-100' : 'text-rose-700'}`}>Nightclub</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-rose-800'}`}>DJ internationaux</div>
                    </div>
                  </div>
                  
                  {/* Version desktop */}
                  <div 
                    className="uniform-banner cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openDetailPage('nobu-marbella')}
                  >
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                    style={{
                        background: 'linear-gradient(135deg, #D97706 0%, #EA580C 50%, #DC2626 100%)',
                      width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                      🍣 JAPONAIS
                    </div>
                        </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">Nobu Marbella</h3>
                        <p className="banner-description">Cuisine japonaise de luxe avec vue panoramique sur la mer</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>4.8/5 • Premium</span>
                        </div>
                        </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🍣 ⭐ 🌊 🏮</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur Nobu Marbella')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver une table chez Nobu Marbella')}
                          >
                            Réserver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="uniform-banner cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openDetailPage('terraza-del-mar')}
                  >
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                    style={{
                        background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 50%, #06B6D4 100%)',
                      width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                      🏖️ MÉDITERRANÉEN
                      </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">La Terraza del Mar</h3>
                        <p className="banner-description">Ambiance méditerranéenne avec vue panoramique sur la mer</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>4.7/5 • Vue mer</span>
                        </div>
                    </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🏖️ 🌊 🍽️ 🌿</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur La Terraza del Mar')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver une table à La Terraza del Mar')}
                          >
                            Réserver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="uniform-banner cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openDetailPage('el-lago')}
                  >
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                    style={{
                        background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #14B8A6 100%)',
                      width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                      🏨 CRÉATIF
                      </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">El Lago</h3>
                        <p className="banner-description">Cuisine créative avec vue sur le lac</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>4.5/5 • Créatif</span>
                        </div>
                    </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🏨 🌊 🍽️ ✨</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur El Lago')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver une table à El Lago')}
                          >
                      Réserver
                    </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="uniform-banner cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openDetailPage('club-vip')}
                  >
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                      style={{
                        background: 'linear-gradient(135deg, #E11D48 0%, #EC4899 50%, #8B5CF6 100%)',
                      width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                          🍾 NIGHTCLUB
                      </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">Club VIP</h3>
                        <p className="banner-description">Ambiance festive avec DJ internationaux</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>4.9/5 • VIP</span>
                      </div>
                    </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🍾 🎵 ✨ 🎉</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur le Club VIP')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver un accès VIP au Club')}
                          >
                            Réserver
                    </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Services */}
              {(sidebarFilter === 'all' || sidebarFilter === 'services') && (
                <>
                  <div className="lg:block hidden">
                    <h3 className={`font-semibold text-lg mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                      Services
                    </h3>
                  </div>
                </>
              )}
              {(sidebarFilter === 'all' || sidebarFilter === 'services') && (
                <>
                  <div className="uniform-banner">
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                      style={{
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #3B82F6 100%)',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                      🚗 SERVICE
                    </div>
                        </div>
                      
                      {/* Titre et description */}
                        <div>
                        <h3 className="banner-title">Transport Privé</h3>
                        <p className="banner-description">Service de transport de luxe avec chauffeur professionnel</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>5.0/5 • VIP</span>
                        </div>
                      </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🚗 👨‍✈️ ⭐ 🏆</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur le Transport Privé')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver un Transport Privé')}
                          >
                          Réserver
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="uniform-banner">
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                      style={{
                        background: 'linear-gradient(135deg, #059669 0%, #14B8A6 50%, #06B6D4 100%)',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                      ⭐ SPONSORISÉ
                    </div>
                        </div>
                      
                      {/* Titre et description */}
                        <div>
                        <h3 className="banner-title">Concierge 24/7</h3>
                        <p className="banner-description">Assistance personnalisée disponible 24h/24</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>5.0/5 • Premium</span>
                        </div>
                      </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🧳 ⭐ 🕐 🏆</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur le Concierge 24/7')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver le service Concierge 24/7')}
                          >
                          Réserver
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="uniform-banner">
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                      style={{
                        background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #1D4ED8 100%)',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                          ✈️ TRANSFERT
                      </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">Transfert Aéroport</h3>
                        <p className="banner-description">Transfert confortable depuis l'aéroport</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>4.8/5 • VIP</span>
                      </div>
                    </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>✈️ 🚗 ⭐ 🏆</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur le Transfert Aéroport')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver un Transfert Aéroport')}
                          >
                      Réserver
                    </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="uniform-banner">
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                      style={{
                        background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #E11D48 100%)',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                          💆 SPA
                      </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">Spa à Domicile</h3>
                        <p className="banner-description">Soins de luxe dans le confort de votre villa</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>4.9/5 • Privé</span>
                      </div>
                    </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>💆 🏠 ✨ 🌸</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur le Spa à Domicile')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver un Spa à Domicile')}
                          >
                      Réserver
                    </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Section Luxe */}
              {(sidebarFilter === 'all' || sidebarFilter === 'luxury') && (
                <>
                  <div className="lg:block hidden">
                    <h3 className={`font-semibold text-sm mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      💎 Expériences de Luxe
                    </h3>
                  </div>
                </>
              )}
              {(sidebarFilter === 'all' || sidebarFilter === 'luxury') && (
                <>
                  {/* Version mobile compacte */}
                  <div className="lg:hidden grid grid-cols-2 gap-2 mb-3">
                    <div className={`rounded-lg p-2 border transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-400/30' : 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-lg">🚁</span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>Hélicoptère</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-amber-100' : 'text-amber-700'}`}>Tour VIP</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-amber-800'}`}>Vue panoramique</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-rose-500 to-pink-500 border-rose-400/30' : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-lg">🛥️</span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-rose-900'}`}>Yacht Privé</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-rose-100' : 'text-rose-700'}`}>Croisière VIP</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-rose-800'}`}>Équipage pro</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-400/30' : 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-lg">🏆</span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-emerald-900'}`}>Golf Privé</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-emerald-100' : 'text-emerald-700'}`}>Terrain VIP</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-emerald-800'}`}>Caddy privé</div>
                    </div>
                    
                    <div className={`rounded-lg p-2 border transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-indigo-500 border-purple-400/30' : 'bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-300/50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-lg">💎</span>
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Spa Privé</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>Thérapie VIP</p>
                        </div>
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-white/90' : 'text-purple-800'}`}>Thérapeute privé</div>
                    </div>
                  </div>
                  <div className="uniform-banner">
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                      style={{
                        background: 'linear-gradient(135deg, #D97706 0%, #EA580C 50%, #DC2626 100%)',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                          🚁 LUXE
                        </div>
                      </div>
                      
                      {/* Titre et description */}
                        <div>
                        <h3 className="banner-title">Hélicoptère Privé</h3>
                        <p className="banner-description">Vue aérienne exclusive de la Costa del Sol</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>5.0/5 • VIP</span>
                        </div>
                      </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🚁 🌊 ⭐ 💎</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur l\'Hélicoptère Privé')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver un Hélicoptère Privé')}
                          >
                          Réserver
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="uniform-banner">
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                      style={{
                        background: 'linear-gradient(135deg, #E11D48 0%, #EC4899 50%, #8B5CF6 100%)',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                          🛥️ LUXE
                        </div>
                      </div>
                      
                      {/* Titre et description */}
                        <div>
                        <h3 className="banner-title">Yacht Privé</h3>
                        <p className="banner-description">Yacht de luxe avec équipage professionnel</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>5.0/5 • VIP</span>
                        </div>
                      </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🛥️ 🍾 ⭐ 💎</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur le Yacht Privé')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver un Yacht Privé')}
                          >
                          Réserver
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="uniform-banner">
                    {/* Image de fond */}
                    <div 
                      className="banner-image"
                      style={{
                        background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #14B8A6 100%)',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    ></div>
                    
                    {/* Overlay */}
                    <div className="banner-overlay"></div>
                    
                    {/* Contenu */}
                    <div className="banner-content">
                      {/* Header avec badge */}
                      <div className="banner-header">
                        <div></div>
                        <div className="banner-badge">
                          🏆 LUXE
                      </div>
                      </div>
                      
                      {/* Titre et description */}
                      <div>
                        <h3 className="banner-title">Golf Privé</h3>
                        <p className="banner-description">Accès exclusif aux meilleurs parcours de golf</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                          <span>⭐</span>
                          <span>4.9/5 • VIP</span>
                      </div>
                    </div>
                      
                      {/* Footer avec rating et boutons */}
                      <div className="banner-footer">
                        <div className="banner-rating">
                          <span>🏆 ⛳ ⭐ 💎</span>
                        </div>
                        
                        <div className="banner-buttons">
                          <button 
                            className="banner-button secondary"
                            onClick={() => setInput('Plus d\'informations sur le Golf Privé')}
                          >
                            Info
                          </button>
                          <button 
                            className="banner-button primary"
                            onClick={() => setInput('Réserver un accès Golf Privé')}
                          >
                      Réserver
                    </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8"></div>
          </div>
        </div>
      </main>
      </div> {/* Fin interface desktop */}
      
      {/* Carrousel des marques qui font confiance - Pleine largeur */}
      <div className="w-full py-8 lg:py-12" style={{ backgroundColor: isDarkMode ? '#0D0D0D' : '#FFFFFF', width: '100vw', maxWidth: 'none' }}>
        <div className="w-full px-4 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className={`text-2xl lg:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ils nous font confiance
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Plus de 500+ partenaires premium nous font confiance
            </p>
          </div>
          
          {/* Carrousel des marques */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* Première ligne de marques */}
              <div className="flex space-x-8 lg:space-x-12 items-center">
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🏨</span>
                    Marriott
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🍽️</span>
                    Nobu
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🏖️</span>
                    Nikki Beach
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🚁</span>
                    HeliMarbella
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🛥️</span>
                    Yacht Charter
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🏆</span>
                    Valderrama Golf
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">💆</span>
                    Six Senses Spa
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🍾</span>
                    Dom Pérignon
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-slate-500 to-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🚗</span>
                    Rolls-Royce
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">✈️</span>
                    NetJets
                </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-amber-500 to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🏨</span>
                    Ritz-Carlton
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🍾</span>
                    Veuve Clicquot
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-red-500 to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🚗</span>
                    Lamborghini
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">💎</span>
                    Tiffany & Co
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🏖️</span>
                    Marbella Club
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🎵</span>
                    Ocean Club
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🍽️</span>
                    La Sala
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">🏆</span>
                    Real Club Valderrama
                  </div>
                </div>
                <div className="flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="font-bold text-lg lg:text-xl text-white flex items-center">
                    <span className="mr-2 text-xl">💆</span>
                    Six Senses
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Deuxième ligne de marques */}
          <div className="mt-6 lg:mt-8 relative overflow-hidden">
            <div className="flex animate-scroll-reverse">
              <div className="flex space-x-8 lg:space-x-12 items-center">
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🏨 Four Seasons</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🍽️ Cipriani</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🏖️ Puente Romano</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🎵 Pacha Marbella</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>💎 Cartier</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🏆 Real Club Valderrama</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>💆 Aman Spa</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🍾 Moët & Chandon</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🚗 Bentley</div>
                </div>
                <div className={`flex-shrink-0 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border ${isDarkMode ? 'bg-white/10 border-gray-700/50' : 'bg-gray-100/80 border-gray-300/50'}`}>
                  <div className={`font-bold text-lg lg:text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>✈️ VistaJet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Container pour les notifications toast */}
      <ToastContainer />
      
      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la conversation"
        message="Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
      </div> {/* Fermeture de l'interface desktop */}
    </>
  )
}

export default memo(ChatInterface)


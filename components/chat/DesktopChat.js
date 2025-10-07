import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { MessageCircle, Sparkles, Trash2, Loader2, X, Send, Plus, Search, Filter, MapPin, Star } from 'lucide-react'
import { useConversationsClean } from '../../hooks/useConversationsClean'
import { useToast } from '../ui/Toast'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { establishments, events, activities } from '../../data/marbella-data'

const DesktopChat = ({ user, initialMessage, establishmentName }) => {
  const { isDarkMode } = useTheme()
  const { showToast } = useToast()
  
  // États locaux
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestionFilter, setSuggestionFilter] = useState('all')
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [showFicheModal, setShowFicheModal] = useState(false)
  
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

  // Gestion des suggestions
  const handleSuggestionClick = useCallback((suggestion) => {
    setInput(suggestion)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])


  // Préparer TOUTES les données pour la sidebar
  const allSuggestionItems = [
    // TOUS les Établissements (prioriser les sponsorisés)
    ...establishments
      .sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))
      .map((est) => ({
        id: `est-${est.id}`,
        type: 'etablissement',
        name: est.name,
        description: est.description,
        category: est.category || est.type,
        zone: est.zone,
        image: est.image_url,
        rating: est.rating,
        priceRange: est.price_range,
        sponsored: est.sponsored,
        reviews: est.reviews || [],
        isExpensive: est.price_range === '€€€€' || est.price_range === '€€€',
        styleTag: est.category || est.type,
        phone: est.phone,
        address: est.address,
        specialties: est.specialties
      })),
    // TOUS les Événements avec images variées
    ...(events || []).map((evt, index) => {
      const eventImages = [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400', // Soirée DJ
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', // Concert
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', // Live music
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', // Nightclub
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', // Party
        'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400', // Beach party
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400', // Rooftop
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', // Sunset event
        'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400', // Fashion event
        'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400'  // Art event
      ]
      
      return {
        id: `event-${evt.id}`,
        type: 'evenement',
        name: evt.name,
        description: evt.description,
        category: evt.type,
        zone: evt.location,
        image: evt.image_url || eventImages[index % eventImages.length],
        date: evt.date ? new Date(evt.date).toLocaleDateString('fr-FR') : 'À venir',
        price: evt.price ? `${evt.price}€` : null,
        capacity: evt.capacity,
        styleTag: evt.type || 'Event',
        rating: 4.5 + (Math.random() * 0.4)
      }
    }),
    // Services premium (activités) avec images variées
    ...(activities || []).map((act, index) => {
      const serviceImages = [
        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400', // Golf
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', // Spa massage
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', // Bateau
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400', // Fitness
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', // Yoga
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400', // Gym
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400', // Piscine
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400', // Plage sport
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', // Tennis
        'https://images.unsplash.com/photo-1587622781961-9a1ff5cd5d72?w=400'  // Wellness
      ]
      
      return {
        id: `serv-${act.id || act.name}`,
        type: 'service',
        name: act.name || act.title,
        description: act.description,
        category: act.category || act.type,
        image: act.image || act.image_url || serviceImages[index % serviceImages.length],
        priceRange: act.price_range || (act.price ? `${act.price}€` : '€€€'),
        styleTag: act.type || act.category || 'Premium',
        rating: 4.6,
        zone: 'Marbella'
      }
    }),
    // Expériences LUXE supplémentaires
    {
      id: 'luxe-yacht',
      type: 'luxe',
      name: 'Yacht Privé Luxe',
      description: 'Journée complète en mer Méditerranée avec équipage professionnel',
      category: 'Nautique',
      zone: 'Puerto Banús',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400',
      priceRange: '€€€€',
      styleTag: 'Yacht',
      rating: 4.9,
      isExpensive: true
    },
    {
      id: 'luxe-heli',
      type: 'luxe',
      name: 'Tour en Hélicoptère',
      description: 'Survol de la Costa del Sol et déjeuner gastronomique',
      category: 'Expérience',
      zone: 'Marbella',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
      priceRange: '€€€€',
      styleTag: 'Hélicoptère',
      rating: 5.0,
      isExpensive: true
    },
    {
      id: 'luxe-villa',
      type: 'luxe',
      name: 'Villa Privée avec Chef',
      description: 'Villa de luxe avec piscine, vue mer et chef privé inclus',
      category: 'Hébergement',
      zone: 'Golden Mile',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
      priceRange: '€€€€',
      styleTag: 'Villa',
      rating: 4.8,
      isExpensive: true
    },
    {
      id: 'luxe-champagne',
      type: 'luxe',
      name: 'Dégustation Champagne VIP',
      description: 'Dégustation de champagnes rares avec sommelier expert',
      category: 'Gastronomie',
      zone: 'Marbella',
      image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400',
      priceRange: '€€€',
      styleTag: 'Champagne',
      rating: 4.7,
      isExpensive: true
    }
  ].filter(item => item.name && item.description)

  // Filtrer selon le filtre et la recherche
  const filteredSuggestions = allSuggestionItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = suggestionFilter === 'all' || 
      (suggestionFilter === 'etablissements' && item.type === 'etablissement') ||
      (suggestionFilter === 'evenements' && item.type === 'evenement') ||
      (suggestionFilter === 'services' && item.type === 'service') ||
      (suggestionFilter === 'luxe' && item.type === 'luxe')
    
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
    return (
      <div className="desktop-layout">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="desktop-layout">
      {/* Sidebar gauche - Historique des conversations */}
      <div className="desktop-sidebar-left desktop-scrollbar">
        {/* Header sidebar */}
        <div className="p-4 border-b" style={{ borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Conversations
            </h2>
            <button
              onClick={createConversation}
              className="p-2 rounded-lg transition-all duration-300 desktop-hover-scale"
              style={{ 
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                boxShadow: '0 4px 12px rgba(192, 192, 192, 0.3)'
              }}
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="desktop-conversations">
          {conversations.map((conversation, index) => {
            const lastMessage = conversation.messages[conversation.messages.length - 1]
            const timeAgo = conversation.lastActivity ? new Date(conversation.lastActivity).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : ''
            
            // Couleurs variées pour les vignettes
            const vignetteBgs = [
              'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(99, 102, 241, 0.1))',
              'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(6, 182, 212, 0.1))',
              'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(244, 63, 94, 0.1))',
              'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))',
              'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
            ]
            const vignetteBg = vignetteBgs[index % vignetteBgs.length]
            
            return (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={`desktop-conversation-item ${
                  currentConversationId === conversation.id ? 'active' : ''
                }`}
                style={{
                  background: currentConversationId === conversation.id 
                    ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                    : vignetteBg,
                  color: currentConversationId === conversation.id ? 'white' : undefined,
                  border: currentConversationId === conversation.id 
                    ? 'none' 
                    : isDarkMode 
                      ? '1px solid rgba(192, 192, 192, 0.2)' 
                      : '1px solid rgba(192, 192, 192, 0.15)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Titre de la conversation */}
                    <h3 className={`text-lg font-bold truncate mb-1 ${
                      currentConversationId === conversation.id
                        ? 'text-white' 
                        : isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {conversation.title}
                    </h3>
                    
                    {/* Dernier message ou aperçu */}
                    <p className={`text-base truncate mb-2 leading-relaxed ${
                      currentConversationId === conversation.id
                        ? 'text-white/80' 
                        : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {lastMessage 
                        ? lastMessage.role === 'user' 
                          ? `Vous: ${lastMessage.content.substring(0, 50)}${lastMessage.content.length > 50 ? '...' : ''}`
                          : `${lastMessage.content.substring(0, 50)}${lastMessage.content.length > 50 ? '...' : ''}`
                        : conversation.title === 'Nouvelle conversation' ? '' : 'Nouvelle conversation'
                      }
                    </p>
                    
                    {/* Métadonnées */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        currentConversationId === conversation.id
                          ? 'text-white/70' 
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {conversation.messages.length} message{conversation.messages.length > 1 ? 's' : ''}
                      </span>
                      <span className={`text-sm ${
                        currentConversationId === conversation.id
                          ? 'text-white/70' 
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {timeAgo}
                      </span>
                    </div>
                  </div>
                  
                  {/* Bouton de suppression */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(conversation.id)
                    }}
                    className={`opacity-100 p-2 rounded-lg transition-all duration-200 desktop-hover-scale ${
                      isDarkMode 
                        ? 'hover:bg-red-500/20 hover:text-red-400 text-gray-400' 
                        : 'hover:bg-red-50 hover:text-red-500 text-gray-500'
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
          
          {/* Message si aucune conversation */}
          {conversations.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <MessageCircle className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aucune conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone centrale - Chat principal */}
      <div className="desktop-main-content">
        <div className="desktop-chat-container">
        {/* Bannière de bienvenue - Toujours visible quand pas de conversation */}
        {!currentConversationId && (
            <div className="relative overflow-hidden mx-4 mt-2 rounded-2xl">
            <div 
              className="p-8 text-center rounded-2xl relative"
              style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
              }}
            >
              {/* Effet de palette animé */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gray-300 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-300 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
              </div>
              
              {/* Sparkles gauche */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" style={{ animationDuration: '2s' }} />
                <Sparkles className="h-4 w-4 text-yellow-200 absolute -top-4 -left-2 animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                <Sparkles className="h-5 w-5 text-yellow-400 absolute -bottom-6 left-3 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
              </div>
              
              {/* Sparkles droite */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
                <Sparkles className="h-4 w-4 text-yellow-200 absolute -top-4 -right-2 animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.8s' }} />
                <Sparkles className="h-5 w-5 text-yellow-400 absolute -bottom-6 right-3 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1.3s' }} />
              </div>
              
              <div className="relative z-10">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Bienvenue sur Gliitz
                </h1>
                <p className="text-xl text-white/90 mb-6">
                  Votre concierge IA de luxe à Marbella
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      console.log('🔘 Bouton cliqué - Création conversation')
                      const newId = createConversation()
                      console.log('✅ Conversation créée:', newId)
                    }}
                    className="group px-8 py-4 rounded-xl text-white font-bold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm relative overflow-hidden"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <span className="relative z-10 flex items-center group-hover:text-yellow-300 transition-colors duration-300">
                      <Sparkles className="inline-block mr-2 h-5 w-5 group-hover:animate-spin" />
                    Commencer une conversation
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header chat - Visible seulement avec une conversation */}
        {currentConversationId && (
            <div className="p-4 border-b flex-shrink-0" style={{ borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getCurrentConversation()?.title || 'Nouvelle conversation'}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {messages.length} message{messages.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Bouton fermer conversation */}
                <button
                  onClick={() => selectConversation(null)}
                  className={`p-2 rounded-lg transition-all duration-200 desktop-hover-scale ${
                    isDarkMode 
                      ? 'hover:bg-red-500/20 hover:text-red-400 text-gray-400' 
                      : 'hover:bg-red-50 hover:text-red-500 text-gray-500'
                  }`}
                  title="Fermer la conversation"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Zone des messages */}
        <div className="desktop-chat-messages desktop-scrollbar">
          {currentConversationId ? (
            <div className="space-y-4">
              {messages.map((message) => {
                const isWelcome = message.id?.startsWith('welcome-') || 
                                  message.content?.includes('Bienvenue') ||
                                  message.content?.includes('concierge IA')
                const isUser = message.role === 'user'
                
                return (
                <div
                  key={message.id}
                  className={`desktop-message ${isUser ? 'user' : 'assistant'}`}
                  style={{
                    background: (isUser || isWelcome) ? 'linear-gradient(135deg, #C0C0C0 0%, #C0C0C0 40%, #3b82f6 100%)' : undefined,
                    color: (isUser || isWelcome) ? 'white' : undefined,
                    border: (isUser || isWelcome) ? 'none' : undefined
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    (isUser || isWelcome) ? 'text-gray-100' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              )
              })}
              
              {isLoading && (
                <div className="flex justify-center">
                  <div className={`desktop-message assistant`}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          ) : (
            // Message d'encouragement quand pas de conversation
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md px-4">
                  <MessageCircle className={`h-16 w-16 mx-auto mb-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Prêt à commencer ?
                </h3>
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Sélectionnez une conversation ou créez-en une nouvelle pour commencer à discuter avec votre concierge IA.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Zone de saisie - Position en bas du chat */}
        <div className="desktop-input-container" style={{ height: 'auto', minHeight: '80px' }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  adjustTextareaHeight()
                }}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  // Empêcher le scroll lors du focus
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'auto' })
                }}
                placeholder="Tapez votre message..."
                className="desktop-input-field"
                rows={1}
              />
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isCreating}
              className="desktop-send-button"
              style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                color: 'white',
                border: 'none'
              }}
            >
              {isLoading || isCreating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar droite - Suggestions */}
      <div className="desktop-sidebar-right desktop-scrollbar">
        {/* Header suggestions avec recherche */}
        <div className="p-4 border-b" style={{ borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
          <h2 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Suggestions
          </h2>
          
          {/* Barre de recherche dynamique */}
          <div className="relative mb-3">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm border transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-200`}
            />
          </div>

          {/* Filtres améliorés */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSuggestionFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                suggestionFilter === 'all'
                  ? 'text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={suggestionFilter === 'all' ? {
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                boxShadow: '0 2px 8px rgba(192, 192, 192, 0.3)'
              } : {}}
            >
              Tous
            </button>
            <button
              onClick={() => setSuggestionFilter('etablissements')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                suggestionFilter === 'etablissements'
                  ? 'text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={suggestionFilter === 'etablissements' ? {
                background: 'linear-gradient(135deg, #f97316, #fb923c)',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
              } : {}}
            >
              🏨 Établissements
            </button>
            <button
              onClick={() => setSuggestionFilter('evenements')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                suggestionFilter === 'evenements'
                  ? 'text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={suggestionFilter === 'evenements' ? {
                background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)'
              } : {}}
            >
              🎉 Événements
            </button>
            <button
              onClick={() => setSuggestionFilter('services')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                suggestionFilter === 'services'
                  ? 'text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={suggestionFilter === 'services' ? {
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
              } : {}}
            >
              ⚙️ Services
            </button>
            <button
              onClick={() => setSuggestionFilter('luxe')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                suggestionFilter === 'luxe'
                  ? 'text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={suggestionFilter === 'luxe' ? {
                background: 'linear-gradient(135deg, #eab308, #facc15)',
                boxShadow: '0 2px 8px rgba(234, 179, 8, 0.3)'
              } : {}}
            >
              💎 Luxe
            </button>
          </div>
        </div>

        {/* Grille des suggestions */}
        <div className="desktop-suggestions">
          {showSuggestions ? (
            <div className="desktop-suggestion-grid">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="relative desktop-suggestion-item desktop-hover-lift overflow-hidden cursor-pointer group"
                    style={{
                      height: '180px',
                      minHeight: '180px',
                      maxHeight: '180px'
                    }}
                    onClick={() => {
                      setSelectedSuggestion(item)
                      setShowFicheModal(true)
                    }}
                  >
                    {/* Image de fond */}
                    <div 
                      className="absolute inset-0 group-hover:scale-110 transition-all duration-500"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    
                    {/* Ombre pour lisibilité du texte uniquement */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    
                    {/* Contenu */}
                    <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                      <div>
                        {/* Badges top */}
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          {/* Vignette style */}
                          {item.styleTag && (
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                              {item.styleTag}
                            </span>
                          )}
                          {item.sponsored && (
                            <span className="text-[10px] font-bold text-yellow-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                              ⭐ SPONSOR
                            </span>
                          )}
                          {item.isExpensive && (
                            <span className="text-[10px] font-bold text-amber-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                              💎 LUXE
                            </span>
                          )}
                    </div>
                        
                        <h3 className="font-bold text-sm mb-1.5 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight line-clamp-2">
                          {item.name}
                    </h3>
                        <p className="text-[11px] text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] leading-relaxed line-clamp-2 mb-2">
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Infos en bas */}
                      <div className="flex items-center justify-between text-[10px] text-white">
                        {/* Zone */}
                        {item.zone && (
                          <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium">{item.zone}</span>
                          </div>
                        )}
                        
                        {/* Rating et Prix */}
                        <div className="flex items-center gap-1">
                          {item.rating && (
                            <div className="flex items-center gap-0.5 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold">{item.rating}</span>
                            </div>
                          )}
                          {item.priceRange && (
                            <div className="bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                              <span className="font-bold text-amber-300">{item.priceRange}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Search className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Aucune suggestion trouvée
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className={`h-12 w-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Suggestions disponibles
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer suggestions */}
        <div className="p-4 border-t mt-auto" style={{ borderColor: isDarkMode ? '#2D2D2D' : '#E5E7EB' }}>
          <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Cliquez sur une suggestion pour commencer
          </div>
        </div>
      </div>

      {/* Modal fiche produit */}
      {showFicheModal && selectedSuggestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
            style={{
              maxHeight: '90vh',
              background: isDarkMode ? '#1F2937' : '#FFFFFF'
            }}
          >
            {/* Image header */}
            <div className="relative h-80">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${selectedSuggestion.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
              
              {/* Bouton fermer */}
              <button
                onClick={() => setShowFicheModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              
              {/* Titre et rating */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {selectedSuggestion.name}
                </h2>
                {selectedSuggestion.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold">⭐ {selectedSuggestion.rating}</span>
                    {selectedSuggestion.priceRange && (
                      <span className="text-white/90 font-medium">{selectedSuggestion.priceRange}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Contenu */}
            <div className="p-6" style={{ maxHeight: 'calc(90vh - 16rem)', overflowY: 'auto' }}>
              <p className={`text-base mb-4 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedSuggestion.description}
              </p>
              
              {selectedSuggestion.zone && (
                <div className="mb-4">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    📍 {selectedSuggestion.zone}
                  </span>
                </div>
              )}
              
              {selectedSuggestion.category && (
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedSuggestion.category}
                  </span>
                </div>
              )}
              
              {/* Informations supplémentaires */}
              {selectedSuggestion.address && (
                <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    📍 {selectedSuggestion.address}
                  </p>
                </div>
              )}
              
              {selectedSuggestion.phone && (
                <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    📞 {selectedSuggestion.phone}
                  </p>
                </div>
              )}
              
              {/* Boutons d'action */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const infoMessage = `Pouvez-vous me donner plus d'informations sur ${selectedSuggestion.name} ? J'aimerais connaître les détails, horaires, spécialités, et services disponibles.`
                    setInput(infoMessage)
                    setShowFicheModal(false)
                    if (!currentConversationId) {
                      createConversation()
                    }
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.focus()
                      }
                    }, 100)
                  }}
                  className="py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.8), rgba(55, 65, 81, 0.9))'
                      : 'linear-gradient(135deg, rgba(229, 231, 235, 0.9), rgba(209, 213, 219, 0.95))',
                    color: isDarkMode ? '#E5E7EB' : '#374151',
                    border: `1px solid ${isDarkMode ? 'rgba(107, 114, 128, 0.3)' : 'rgba(209, 213, 219, 0.5)'}`,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  ℹ️ Plus d'infos
                </button>
                
                <button
                  onClick={() => {
                    const reservationMessage = `Je souhaite réserver ${selectedSuggestion.name}${selectedSuggestion.zone ? ` à ${selectedSuggestion.zone}` : ''}. Pouvez-vous m'aider avec la réservation ?`
                    setInput(reservationMessage)
                    setShowFicheModal(false)
                    if (!currentConversationId) {
                      createConversation()
                    }
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.focus()
                      }
                    }, 100)
                  }}
                  className="py-4 rounded-xl text-white font-bold transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                    boxShadow: '0 8px 32px rgba(192, 192, 192, 0.4)'
                  }}
                >
                  ✨ Réserver maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-md w-full mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Supprimer la conversation
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(DesktopChat)
/* UNIFORMIZED COLORS Sat Oct  4 18:34:34 CEST 2025 */

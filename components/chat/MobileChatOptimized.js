import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { 
  MessageCircle, 
  Send, 
  Plus, 
  X,
  Utensils, 
  Hotel, 
  Car, 
  Calendar, 
  Heart, 
  ShoppingBag, 
  Camera, 
  Music, 
  Star, 
  MapPin,
  Plane,
  Building,
  Sparkles
} from 'lucide-react'
import { useToast } from '../ui/Toast'
import { useTheme } from '../../contexts/ThemeContextSimple'

const MobileChatOptimized = ({ user, initialMessage, establishmentName }) => {
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [showDetailPage, setShowDetailPage] = useState(false)
  const textareaRef = useRef(null)
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = false
  
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
  } catch (error) {
    console.warn('ThemeProvider not available, using default theme')
  }

  // Effet pour pré-remplir le message de réservation
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }, [initialMessage])


  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setShowSuggestions(false)
    
    // Ajouter le message utilisateur
    const userMsg = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userName: user?.name || 'Utilisateur',
          isMember: user?.isMember || false,
          conversationHistory: messages
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le serveur')
      }

      const data = await response.json()
      
      // Ajouter la réponse de l'IA
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        content: data.reply || data.message || 'Réponse reçue',
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMsg])

    } catch (error) {
      console.error('Erreur:', error)
      showToast('Erreur lors de l\'envoi du message', 'error')
      
      // Ajouter un message d'erreur
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, showToast, establishmentName, user])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])


  const handleCloseChat = useCallback(() => {
    // Réinitialiser le chat
    setMessages([])
    setInput('')
    setShowSuggestions(true)
    setIsLoading(false)
  }, [])


  // Suggestions luxueuses avec vraies images et données complètes
  const suggestions = [
    // RESTAURANTS GASTRONOMIQUES LUXUEUX
    {
      id: 1,
      title: "Nobu Marbella",
      description: "Sushi & Wagyu de luxe, cuisine japonaise fusion",
      price: "€€€€",
      location: "Puerto Banús",
      rating: "4.8/5",
      icon: Utensils,
      color: "from-red-600 to-pink-600",
      badge: "🎉 ÉVÉNEMENT",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop&crop=center",
      suggestion: "Je veux réserver une table chez Nobu Marbella",
      category: "food",
      details: "Restaurant japonais haut de gamme avec terrasse vue mer. Spécialités: sushi premium, wagyu, sake collection.",
      hours: "19h00 - 02h00"
    },
    {
      id: 2,
      title: "El Lago",
      description: "Cuisine méditerranéenne vue lac",
      price: "€€€",
      location: "Marbella Club Golf",
      rating: "4.6/5",
      icon: Utensils,
      color: "from-orange-600 to-amber-600",
      badge: "🍽️ GASTRONOMIE",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&crop=center",
      suggestion: "Réservation chez El Lago avec vue sur le lac",
      category: "food",
      details: "Restaurant romantique au bord du lac avec cuisine méditerranéenne raffinée. Terrasse privée disponible.",
      hours: "13h00 - 23h00"
    },
    {
      id: 3,
      title: "La Cabane",
      description: "Restaurant français chic sur plage",
      price: "€€€",
      location: "Playa de Cabopino",
      rating: "4.7/5",
      icon: Utensils,
      color: "from-blue-600 to-indigo-600",
      badge: "🍣 FRANÇAIS",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&crop=center",
      suggestion: "Je veux dîner à La Cabane ce soir",
      category: "food",
      details: "Beach club français avec cuisine gastronomique. Ambiance bohème chic, pieds dans le sable.",
      hours: "12h00 - 01h00"
    },
    {
      id: 4,
      title: "Dani García",
      description: "Cuisine créative étoilée Michelin",
      price: "€€€€",
      location: "Hotel Puente Romano",
      rating: "4.9/5",
      icon: Utensils,
      color: "from-purple-600 to-violet-600",
      badge: "⭐ MICHELIN",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&crop=center",
      suggestion: "Réservation chez Dani García pour une expérience gastronomique",
      category: "food",
      details: "Restaurant étoilé Michelin du chef Dani García. Menu dégustation créatif, produits locaux premium.",
      hours: "20h00 - 23h30"
    },
    {
      id: 5,
      title: "Amare Marbella",
      description: "Beach club méditerranéen premium",
      price: "€€€",
      location: "Golden Mile",
      rating: "4.5/5",
      icon: Utensils,
      color: "from-cyan-600 to-blue-600",
      badge: "🏖️ BEACH CLUB",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center",
      suggestion: "Réservation à Amare Beach Club avec service VIP",
      category: "food",
      details: "Beach club exclusif avec piscine, restaurant gastronomique et service de plage premium.",
      hours: "10h00 - 02h00"
    },
    {
      id: 6,
      title: "Trocadero Arena",
      description: "Beach club iconique Puerto Banús",
      price: "€€€",
      location: "Puerto Banús",
      rating: "4.4/5",
      icon: Utensils,
      color: "from-amber-600 to-orange-600",
      badge: "🍾 NIGHTLIFE",
      image: "https://images.unsplash.com/photo-1571266028243-e68f497cfc3b?w=600&h=400&fit=crop&crop=center",
      suggestion: "Table VIP au Trocadero Arena",
      category: "food",
      details: "Beach club légendaire avec DJ sets, restaurant et service champagne. Ambiance festive unique.",
      hours: "11h00 - 03h00"
    },
    
    // HÔTELS DE LUXE PREMIUM
    {
      id: 7,
      title: "Puente Romano",
      description: "Hôtel 5* resort avec spa",
      price: "€€€€",
      location: "Golden Mile",
      rating: "4.8/5",
      icon: Hotel,
      color: "from-emerald-600 to-teal-600",
      badge: "🏨 5 ÉTOILES",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&crop=center",
      suggestion: "Je cherche une suite au Puente Romano",
      category: "hotels",
      details: "Resort de luxe avec spa Six Senses, 3 restaurants étoilés, courts de tennis et accès plage privée.",
      hours: "24h/24"
    },
    {
      id: 8,
      title: "Marbella Club Hotel",
      description: "Luxe & exclusivité depuis 1954",
      price: "€€€€",
      location: "Golden Mile", 
      rating: "4.7/5",
      icon: Hotel,
      color: "from-rose-600 to-pink-600",
      badge: "🏆 LÉGENDAIRE",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop&crop=center",
      suggestion: "Réservation au Marbella Club Hotel",
      category: "hotels",
      details: "Hôtel historique au style andalou. Jardins tropicaux, plage privée et service légendaire.",
      hours: "24h/24"
    },
    {
      id: 9,
      title: "Villa Padierna Palace",
      description: "Château Resort & Golf",
      price: "€€€€",
      location: "Benahavís",
      rating: "4.6/5", 
      icon: Hotel,
      color: "from-purple-600 to-indigo-600",
      badge: "⛳ GOLF RESORT",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center",
      suggestion: "Suite au Villa Padierna avec parcours golf",
      category: "hotels",
      details: "Palais toscan avec 3 parcours de golf, spa et héliport privé. Vue panoramique sur la côte.",
      hours: "24h/24"
    },
    
    // TRANSPORT & MOBILITÉ LUXE
    {
      id: 10,
      title: "Ferrari & Lamborghini",
      description: "Location voitures de sport premium",
      price: "€€€€",
      location: "Puerto Banús",
      rating: "4.9/5",
      icon: Car,
      color: "from-red-600 to-red-500",
      badge: "🏎️ SUPERCARS",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&crop=center",
      suggestion: "Je veux louer une Ferrari pour la journée",
      category: "transport",
      details: "Flotte de supercars: Ferrari, Lamborghini, McLaren. Service conciergerie et livraison inclus.",
      hours: "08h00 - 22h00"
    },
    {
      id: 11,
      title: "Yacht Charter Marbella",
      description: "Yachts de luxe & croisières VIP",
      price: "€€€€",
      location: "Puerto Banús",
      rating: "4.8/5",
      icon: Building,
      color: "from-blue-600 to-cyan-600",
      badge: "🛥️ YACHTS",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center",
      suggestion: "Je veux louer un yacht pour une croisière privée",
      category: "transport",
      details: "Yachts 20-50m avec équipage, chef privé et steward. Croisières Costa del Sol et Maroc.",
      hours: "06h00 - 24h00"
    },
    {
      id: 12,
      title: "Helicopter Tours",
      description: "Vols panoramiques & transferts VIP",
      price: "€€€€",
      location: "Aéroport Málaga",
      rating: "4.7/5",
      icon: Plane,
      color: "from-indigo-600 to-purple-600",
      badge: "🚁 HÉLICO",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
      suggestion: "Transport en hélicoptère vers Gibraltar",
      category: "transport",
      details: "Hélicoptères privés pour transferts et tours panoramiques. Vols vers Gibraltar, Ronda, Sevilla.",
      hours: "07h00 - 19h00"
    }
  ]

  const categories = [
    { key: 'all', label: 'Tous', emoji: '✨' },
    { key: 'food', label: 'Restaurants', emoji: '🍽️' },
    { key: 'hotels', label: 'Hôtels', emoji: '🏨' },
    { key: 'events', label: 'Événements', emoji: '🎉' },
    { key: 'luxury', label: 'Luxe', emoji: '💎' },
    { key: 'transport', label: 'Transport', emoji: '🚗' },
  ]

  const filteredSuggestions = suggestions.filter((s) => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'food') return s.category === 'food'
    if (selectedCategory === 'hotels') return s.category === 'hotels'
    if (selectedCategory === 'transport') return s.category === 'transport'
    return true
  })

  // Fonction pour ouvrir la page dédiée
  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion)
    setShowDetailPage(true)
  }

  // Fonction pour fermer la page dédiée
  const closeDetailPage = () => {
    setShowDetailPage(false)
    setSelectedSuggestion(null)
  }

  // Fonction pour réserver depuis la page dédiée
  const handleReservation = (suggestion) => {
    const reservationMessage = `Je souhaite faire une réservation pour ${suggestion.title} - ${suggestion.description}. Pouvez-vous m'aider avec les disponibilités ?`
    setInput(reservationMessage)
    setShowSuggestions(false)
    closeDetailPage()
    // Déclencher l'envoi automatique
    setTimeout(() => {
      handleSend()
    }, 100)
  }


  return (
    <>

      <div 
        className="mobile-chat-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            height: '100dvh',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            background: isDarkMode 
              ? `
                linear-gradient(135deg, 
                  rgba(0, 0, 0, 0.95) 0%, 
                  rgba(17, 24, 39, 0.90) 35%,
                  rgba(31, 41, 55, 0.95) 70%,
                  rgba(0, 0, 0, 0.98) 100%
                )
              `
              : `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.98) 0%, 
                  rgba(248, 250, 252, 0.93) 35%,
                  rgba(241, 245, 249, 0.98) 70%,
                  rgba(255, 255, 255, 1) 100%
                )
              `,
          }}
      >
        {/* Header chat BAISSÉ et VISIBLE immédiatement */}
        <div 
          className="px-4 py-3 border-b flex-shrink-0"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            borderBottom: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)'}`,
            boxShadow: isDarkMode 
              ? '0 4px 12px rgba(0, 0, 0, 0.2)'
              : '0 4px 12px rgba(0, 0, 0, 0.08)',
            zIndex: 10,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
              >
                <MessageCircle size={20} className="text-white" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Get Weez
                </h1>
              </div>
            </div>
            
              <button
                onClick={() => setMessages([])}
              className="p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
                style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.4) 0%, rgba(55, 65, 81, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6) 0%, rgba(229, 231, 235, 0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
                }}
                title="Nouvelle conversation"
              >
              <Plus 
                size={18} 
                className={`${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}
              />
              </button>
          </div>
            </div>
            

        {/* Zone chat SANS scroll interne - Message d'accueil VISIBLE immédiatement */}
        <div 
          className="flex-shrink-0 px-4 py-6"
                style={{ 
            minHeight: '30vh', // Espace dédié au chat, visible immédiatement
            maxHeight: '30vh', // Pas de débordement
                  display: 'flex',
            flexDirection: 'column',
                  justifyContent: 'center',
          }}
        >
          {messages && messages.length > 0 ? (
            <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              {messages.map((msg) => (
              <div
                key={msg.id}
                  className={`flex mb-4 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl backdrop-blur-lg ${
                      msg.role === 'user'
                        ? 'rounded-br-md'
                        : 'rounded-bl-md border'
                    }`}
                    style={{
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #10A37F 0%, #0D8A6B 100%)'
                        : isDarkMode
                          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)'
                          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      color: msg.role === 'user' 
                        ? '#FFFFFF' 
                        : isDarkMode ? '#F9FAFB' : '#111827',
                      borderColor: msg.role === 'user' 
                        ? 'transparent' 
                        : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)',
                      boxShadow: msg.role === 'user'
                        ? '0 4px 12px rgba(16, 163, 127, 0.3)'
                        : isDarkMode
                          ? '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                          : '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                    }}
                  >
                  {msg.content || 'Message vide'}
                </div>
              </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-md border backdrop-blur-lg"
                    style={{
                      background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)'
                        : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)',
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Get Weez réfléchit...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                }}
              >
                <MessageCircle size={32} className="text-white" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles size={16} className="text-yellow-300 animate-pulse" />
              </div>
            </div>
              <div>
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Bienvenue sur Get Weez
              </h3>
                <p className={`text-purple-100 text-lg px-4 leading-relaxed ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  Votre concierge IA personnel pour Marbella
              </p>
              </div>
            </div>
          )}
        </div>

        {/* Zone de saisie VISIBLE TOUJOURS - Positionnement corrigé */}
        <div 
          className="flex-shrink-0 px-4 py-4 border-t"
          style={{
            position: 'sticky',
            bottom: 0,
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
            backdropFilter: 'blur(30px) saturate(200%)',
            borderTop: `2px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)'}`,
            zIndex: 1000,
            paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)',
            boxShadow: isDarkMode 
              ? '0 -8px 25px rgba(0, 0, 0, 0.3)'
              : '0 -8px 25px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Croix de fermeture quand il y a des messages */}
          {messages && messages.length > 0 && (
            <div className="flex justify-start mb-2">
              <button
                onClick={() => {
                  // Fermer le chat proprement sans rediriger vers compte
                  setMessages([])
                  setInput('')
                  setShowSuggestions(true)
                  setIsLoading(false)
                }}
                className="p-2 rounded-full transition-all duration-300"
                style={{
                  background: isDarkMode 
                    ? 'rgba(0, 0, 0, 0.3)' 
                    : 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                }}
                title="Fermer le chat"
              >
                <X 
                  size={16} 
                  className={`${isDarkMode ? 'text-white/80' : 'text-gray-700/80'} transition-colors`}
                />
              </button>
            </div>
          )}
          
          {/* Boîte de saisie */}
          <div 
            className="relative rounded-2xl border transition-all duration-300"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.7) 0%, rgba(31, 41, 55, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)',
              backdropFilter: 'blur(15px)',
              boxShadow: input.trim() 
                ? '0 0 0 2px rgba(139, 92, 246, 0.3), 0 4px 12px rgba(139, 92, 246, 0.15)'
                : 'none',
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                const textarea = e.target
                textarea.style.height = 'auto'
                const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 120)
                textarea.style.height = `${newHeight}px`
              }}
              onKeyDown={handleKeyDown}
              placeholder={user?.is_member ? "Demande ce que tu veux" : "Demandez ce que vous voulez"}
              className="w-full border-none outline-none bg-transparent resize-none px-4 py-3 pr-12"
              style={{ 
                fontSize: '16px',
                lineHeight: '1.4',
                color: isDarkMode ? '#FFFFFF' : '#000000',
                minHeight: '44px',
                maxHeight: '120px',
              }}
              rows={1}
              disabled={isLoading}
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 w-8 h-8 rounded-xl border-none transition-all duration-300 flex items-center justify-center"
              style={{
                background: input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #10A37F 0%, #0D8A6B 100%)'
                  : isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(156, 163, 175, 0.5)',
                color: 'white',
                opacity: input.trim() && !isLoading ? 1 : 0.5,
                transform: input.trim() && !isLoading ? 'scale(1)' : 'scale(0.95)',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Suggestions MAXIMISÉES - Plus d'éléments visibles */}
        {showSuggestions && messages && messages.length === 0 && (
          <div 
            className="flex-1 px-4 py-4"
            style={{
              paddingBottom: '140px', // Espace optimisé pour zone saisie visible
              overflow: 'visible', // AUCUN scroll
              maxHeight: 'calc(100vh - 160px)', // MAXIMUM d'espace pour suggestions
              minHeight: 'calc(100vh - 160px)', // Zone AGRANDIE au maximum
            }}
          >
            <div>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ✨ Que puis-je faire pour vous ?
            </h3>

              {/* Filtres modernes - Grid 2x3 pour tout voir */}
              <div className="grid grid-cols-3 gap-2 mb-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                    className="flex flex-col items-center justify-center py-2 px-2 rounded-xl text-sm font-medium transition-all duration-300"
                  style={{
                      background: selectedCategory === cat.key
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))'
                        : isDarkMode 
                          ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.6) 0%, rgba(31, 41, 55, 0.8) 100%)'
                          : 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.9) 100%)',
                    color: selectedCategory === cat.key
                      ? '#FFFFFF'
                        : isDarkMode ? '#E5E7EB' : '#374151',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.key
                        ? 'rgba(255, 255, 255, 0.2)'
                        : isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.6)',
                      backdropFilter: 'blur(10px)',
                    boxShadow: selectedCategory === cat.key 
                        ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                      : 'none',
                      minHeight: '50px', // Réduit de 60px à 50px
                    }}
                  >
                    <span className="text-lg mb-1">{cat.emoji}</span>
                    <span className="text-xs font-semibold leading-tight text-center">{cat.label}</span>
                </button>
              ))}
            </div>

              {/* Grid de suggestions ultra-maximisée - Plus d'éléments visibles */}
              <div className="grid grid-cols-3 gap-2 jsx-maximized-suggestions">
              {filteredSuggestions.map((suggestion) => {
                const Icon = suggestion.icon
                return (
                  <div
                    key={suggestion.id}
                      className="relative overflow-hidden rounded-xl border transition-all duration-400 cursor-pointer group"
                    style={{
                        background: isDarkMode 
                          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)',
                        backdropFilter: 'blur(15px)',
                        minHeight: '180px', // Taille NICKEL - parfaite pour mobile
                        maxHeight: '180px', // Hauteur OPTIMALE pour lisibilité
                        boxShadow: isDarkMode
                          ? '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                          : '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      }}
                      onClick={() => handleSuggestionClick(suggestion)}
                    onTouchStart={(e) => {
                        e.currentTarget.style.transform = 'scale(0.98)'
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                          e.currentTarget.style.transform = 'scale(1)'
                      }, 150)
                    }}
                  >
                      {/* Image de fond - Taille NICKEL pour mobile */}
                      <div className="relative h-28 overflow-hidden">
                    <img 
                      src={suggestion.image} 
                      alt={suggestion.title}
                          className="w-full h-full object-cover"
                          style={{
                            filter: 'brightness(0.8) saturate(1.2)'
                          }}
                        />
                        {/* Badge jaune/or comme desktop */}
                        <div 
                          className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            color: '#1A1A1A',
                            border: '1px solid rgba(255, 215, 0, 0.6)',
                            boxShadow: '0 2px 8px rgba(255, 165, 0, 0.3)',
                            fontSize: '10px',
                          }}
                        >
                          {suggestion.badge}
                    </div>
                    </div>

                      {/* Contenu - NICKEL pour mobile parfait */}
                      <div className="p-3">
                        <div className="flex items-start justify-between mb-1">
                          <div 
                            className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-r ${suggestion.color}`}
                          >
                            <Icon size={12} className="text-white" />
                      </div>
                          <span className={`text-sm font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            ⭐ {suggestion.rating}
                          </span>
                    </div>
                        <h4 className={`font-bold text-sm mb-1 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {suggestion.title}
                        </h4>
                        <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          📍 {suggestion.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {suggestion.price}
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Effet de hover */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
                        }}
                      />
                  </div>
                )
              })}
              </div>
            </div>
          </div>
        )}

        {/* Page dédiée pour les suggestions */}
        {showDetailPage && selectedSuggestion && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
            <div 
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.90) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.90) 100%)',
                backdropFilter: 'blur(20px) saturate(150%)',
                border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)'}`,
              }}
            >
              {/* Header avec image */}
              <div className="relative h-48 overflow-hidden rounded-t-3xl">
                <img 
                  src={selectedSuggestion.image} 
                  alt={selectedSuggestion.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Bouton fermer */}
                <button
                  onClick={closeDetailPage}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"
                >
                  <X size={20} className="text-white" />
                </button>

                {/* Badge */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#1A1A1A',
                    border: '1px solid rgba(255, 215, 0, 0.6)',
                    boxShadow: '0 2px 8px rgba(255, 165, 0, 0.3)',
                  }}
                >
                  {selectedSuggestion.badge}
                </div>

                {/* Titre et prix en overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedSuggestion.title}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-300 font-bold text-lg">{selectedSuggestion.price}</span>
                    <span className="text-yellow-300 text-sm">⭐ {selectedSuggestion.rating}</span>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-r ${selectedSuggestion.color}`}
                  >
                    <selectedSuggestion.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedSuggestion.description}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      📍 {selectedSuggestion.location}
                    </p>
                  </div>
                </div>

                {/* Détails */}
                <div className="space-y-4 mb-6">
                  <div 
                    className={`p-4 rounded-2xl ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border border-gray-700/50' 
                        : 'bg-gray-50/50 border border-gray-200/50'
                    }`}
                  >
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      📖 Description
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedSuggestion.details}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`p-3 rounded-xl text-center ${
                        isDarkMode 
                          ? 'bg-gray-800/50 border border-gray-700/50' 
                          : 'bg-gray-50/50 border border-gray-200/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">🕐</div>
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Horaires
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedSuggestion.hours}
                      </p>
                    </div>

                    <div 
                      className={`p-3 rounded-xl text-center ${
                        isDarkMode 
                          ? 'bg-gray-800/50 border border-gray-700/50' 
                          : 'bg-gray-50/50 border border-gray-200/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">⭐</div>
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Note
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {selectedSuggestion.rating}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleReservation(selectedSuggestion)}
                    className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #10A37F 0%, #0D8A6B 100%)',
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(16, 163, 127, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    🎯 Réserver Maintenant
                  </button>
                  
                  <button
                    onClick={() => {
                      setInput(`Dites-moi plus sur ${selectedSuggestion.title}`)
                      closeDetailPage()
                    }}
                    className="w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.6) 0%, rgba(55, 65, 81, 0.8) 100%)'
                        : 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.9) 100%)',
                      color: isDarkMode ? '#E5E7EB' : '#374151',
                      border: `1px solid ${isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    💬 Plus d'infos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Styles CSS optimisés pour mobile */}
        <style jsx global>{`
          .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .jsx-maximized-suggestions {
            max-height: calc(100vh - 180px) !important;
            overflow: visible !important;
          }
          
          /* Optimisations mobile NICKEL - 3 colonnes parfaites */
          @media (max-width: 768px) {
            .jsx-maximized-suggestions {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 8px !important;
              padding: 0 !important;
            }
          }
          
          .mobile-chat-container input,
          .mobile-chat-container textarea {
            font-size: 16px !important;
            -webkit-appearance: none;
          }
        `}</style>
      </div>

      <ToastContainer />
    </>
  )
}

export default MobileChatOptimized
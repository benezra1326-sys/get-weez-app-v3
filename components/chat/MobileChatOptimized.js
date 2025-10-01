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
  Sparkles,
  History,
  Mic,
  MicOff,
  Volume2,
  VolumeX
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
  const [userLocation, setUserLocation] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const textareaRef = useRef(null)
  const recognitionRef = useRef(null)
  const speechSynthesisRef = useRef(null)
  
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
          conversationHistory: messages,
          userLocation: userLocation // Inclure la géolocalisation
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

  // Fonction pour démarrer un nouveau chat avec message d'accueil
  const startNewChat = useCallback(() => {
    const welcomeMsg = {
      id: Date.now().toString(),
      content: "Salut ! 😊 Je suis Get Weez, ton concierge personnel dévoué à Marbella ! Je suis là pour te faire vivre des expériences exceptionnelles. Que puis-je organiser pour toi aujourd'hui ? Que dirais-tu d'un dîner dans un restaurant étoilé, d'une soirée VIP ou d'une expérience unique ?",
      role: 'assistant',
      timestamp: new Date()
    }
    setMessages([welcomeMsg])
    setShowSuggestions(false)
  }, [])

  // Bloquer le scroll du body quand le chat est ouvert
  useEffect(() => {
    if (messages && messages.length > 0) {
      // Bloquer le scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
    } else {
      // Restaurer le scroll
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
      document.body.style.height = 'unset'
    }

    // Cleanup au démontage
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
      document.body.style.height = 'unset'
    }
  }, [messages])

  // Fonction de géolocalisation AMÉLIORÉE
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      showToast('Géolocalisation non supportée par votre navigateur', 'error')
      return
    }

    showToast('🗺️ Demande d\'accès à votre localisation...', 'info')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        setUserLocation(location)
        
        // Déterminer la zone géographique approximative
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        let zone = 'Marbella'
        if (lat > 36.52 && lat < 36.54 && lng > -4.90 && lng < -4.88) {
          zone = 'Centre-ville Marbella'
        } else if (lat > 36.48 && lat < 36.52 && lng > -4.96 && lng < -4.92) {
          zone = 'Puerto Banús'
        } else if (lat > 36.50 && lat < 36.53 && lng > -4.92 && lng < -4.88) {
          zone = 'Golden Mile'
        }
        
        showToast(`📍 Localisation activée ! Zone détectée: ${zone}`, 'success')
        
        // Optionnel: Trier les suggestions par proximité
        // TODO: Implémenter le tri par distance
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error)
        switch(error.code) {
          case error.PERMISSION_DENIED:
            showToast('Permission de localisation refusée. Activez-la dans les paramètres.', 'error')
            break
          case error.POSITION_UNAVAILABLE:
            showToast('Position indisponible. Vérifiez votre connexion.', 'error')
            break
          case error.TIMEOUT:
            showToast('Délai d\'attente dépassé. Réessayez.', 'error')
            break
          default:
            showToast('Erreur lors de la géolocalisation', 'error')
        }
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 300000 
      }
    )
  }, [showToast])

  // Fonction de reconnaissance vocale AMÉLIORÉE
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Reconnaissance vocale non supportée par votre navigateur', 'error')
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      // Configuration optimisée
      recognition.lang = 'fr-FR'
      recognition.continuous = true // Permet une écoute continue
      recognition.interimResults = true // Affiche les résultats en temps réel
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log('🎤 Reconnaissance vocale démarrée')
        setIsListening(true)
        showToast('🎤 Parlez maintenant...', 'info')
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Afficher le texte en temps réel
        if (finalTranscript) {
          setInput(prev => prev + finalTranscript)
          console.log('🎤 Texte final:', finalTranscript)
        } else if (interimTranscript) {
          // Optionnel: afficher le texte temporaire
          console.log('🎤 Texte temporaire:', interimTranscript)
        }
      }

      recognition.onerror = (event) => {
        console.error('❌ Erreur reconnaissance vocale:', event.error)
        setIsListening(false)
        
        switch(event.error) {
          case 'no-speech':
            showToast('Aucune parole détectée. Réessayez.', 'warning')
            break
          case 'audio-capture':
            showToast('Impossible d\'accéder au microphone', 'error')
            break
          case 'not-allowed':
            showToast('Permission microphone refusée', 'error')
            break
          default:
            showToast('Erreur lors de la reconnaissance vocale', 'error')
        }
      }

      recognition.onend = () => {
        console.log('🎤 Reconnaissance vocale terminée')
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
      
    } catch (error) {
      console.error('❌ Erreur lors du démarrage:', error)
      setIsListening(false)
      showToast('Impossible de démarrer la reconnaissance vocale', 'error')
    }
  }, [showToast])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  // Fonction de synthèse vocale MODERNE comme ChatGPT
  const speakMessage = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // Arrêter toute synthèse en cours
      window.speechSynthesis.cancel()
      
      // Attendre que les voix soient chargées
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        
        // Chercher les meilleures voix françaises modernes
        const preferredVoices = [
          // Voix premium françaises
          voices.find(voice => voice.name.includes('Amélie') && voice.lang.includes('fr')),
          voices.find(voice => voice.name.includes('Thomas') && voice.lang.includes('fr')),
          voices.find(voice => voice.name.includes('Marie') && voice.lang.includes('fr')),
          // Voix système modernes
          voices.find(voice => voice.name.includes('Google') && voice.lang.includes('fr')),
          voices.find(voice => voice.name.includes('Microsoft') && voice.lang.includes('fr')),
          // Voix neural/premium
          voices.find(voice => voice.name.includes('Neural') && voice.lang.includes('fr')),
          voices.find(voice => voice.name.includes('Premium') && voice.lang.includes('fr')),
          // Fallback vers toute voix française de qualité
          voices.find(voice => voice.lang === 'fr-FR' && voice.localService === false),
          voices.find(voice => voice.lang.includes('fr') && voice.name.includes('Enhanced')),
          voices.find(voice => voice.lang.includes('fr'))
        ].filter(Boolean)

        const selectedVoice = preferredVoices[0] || voices.find(voice => voice.lang.includes('fr'))
        
        const utterance = new SpeechSynthesisUtterance(text)
        
        if (selectedVoice) {
          utterance.voice = selectedVoice
          utterance.lang = selectedVoice.lang
        } else {
          utterance.lang = 'fr-FR'
        }
        
        // Paramètres optimisés pour une voix naturelle
        utterance.rate = 1.1 // Légèrement plus rapide, plus naturel
        utterance.pitch = 0.95 // Légèrement plus grave, plus agréable
        utterance.volume = 0.9 // Volume optimal

        utterance.onstart = () => {
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          setIsSpeaking(false)
        }

        utterance.onerror = () => {
          setIsSpeaking(false)
          showToast('Erreur lors de la synthèse vocale', 'error')
        }

        speechSynthesisRef.current = utterance
        window.speechSynthesis.speak(utterance)
      }

      // Charger les voix si pas encore disponibles
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true })
      } else {
        loadVoices()
      }
    } else {
      showToast('Synthèse vocale non supportée', 'error')
    }
  }, [showToast])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  // Suggestions data complètes
  const suggestions = [
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
      id: 4,
      title: "Ferrari Location",
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
      id: 5,
      title: "Yacht Charter",
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
      id: 6,
      title: "Villa Padierna",
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
    {
      id: 7,
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
    },
    {
      id: 10,
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
      id: 11,
      title: "Amare Beach Club",
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
      id: 12,
      title: "Trocadero Arena",
      description: "Beach club iconique Puerto Banús",
      price: "€€€",
      location: "Puerto Banús",
      rating: "4.4/5",
      icon: Utensils,
      color: "from-amber-600 to-orange-600",
      badge: "🍾 NIGHTLIFE",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8b?w=600&h=400&fit=crop&crop=center",
      suggestion: "Table VIP au Trocadero Arena",
      category: "food",
      details: "Beach club légendaire avec DJ sets, restaurant et service champagne. Ambiance festive unique.",
      hours: "11h00 - 03h00"
    },
    {
      id: 13,
      title: "Rolls Royce Rental",
      description: "Location voitures de prestige",
      price: "€€€€",
      location: "Marbella Center",
      rating: "4.8/5",
      icon: Car,
      color: "from-gray-600 to-slate-600",
      badge: "👑 PRESTIGE",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop&crop=center",
      suggestion: "Location Rolls Royce avec chauffeur",
      category: "transport",
      details: "Flotte de véhicules de prestige avec chauffeur privé. Service VIP et conciergerie inclus.",
      hours: "24h/24"
    },
    {
      id: 14,
      title: "Anantara Villa",
      description: "Resort ultra-luxe avec spa",
      price: "€€€€",
      location: "Sierra Blanca",
      rating: "4.9/5",
      icon: Hotel,
      color: "from-emerald-600 to-green-600",
      badge: "🌟 ULTRA-LUXE",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center",
      suggestion: "Villa privée à l'Anantara",
      category: "hotels",
      details: "Villas privées avec piscine, service butler 24h et spa privé. Vue panoramique sur la Méditerranée.",
      hours: "24h/24"
    },
    {
      id: 15,
      title: "Private Jet Charter",
      description: "Jets privés & hélicoptères",
      price: "€€€€",
      location: "Málaga Airport",
      rating: "4.9/5",
      icon: Plane,
      color: "from-sky-600 to-blue-600",
      badge: "✈️ JET PRIVÉ",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&crop=center",
      suggestion: "Vol en jet privé vers Monaco",
      category: "transport",
      details: "Jets privés et hélicoptères pour vos déplacements VIP. Destinations Europe et Afrique du Nord.",
      hours: "24h/24"
    },
    {
      id: 16,
      title: "Spa Six Senses",
      description: "Spa holistique de luxe",
      price: "€€€",
      location: "Puente Romano",
      rating: "4.8/5",
      icon: Heart,
      color: "from-pink-600 to-rose-600",
      badge: "🧘 WELLNESS",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop&crop=center",
      suggestion: "Séance spa au Six Senses",
      category: "luxury",
      details: "Spa holistique avec soins personnalisés, hammam, sauna et piscine de relaxation.",
      hours: "09h00 - 21h00"
    },
    {
      id: 17,
      title: "Shopping La Cañada",
      description: "Centre commercial de luxe",
      price: "€€€",
      location: "Marbella",
      rating: "4.5/5",
      icon: ShoppingBag,
      color: "from-violet-600 to-purple-600",
      badge: "🛍️ SHOPPING",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&crop=center",
      suggestion: "Shopping personnel à La Cañada",
      category: "luxury",
      details: "Personal shopper pour boutiques de luxe. Marques premium et service VIP inclus.",
      hours: "10h00 - 22h00"
    },
    {
      id: 18,
      title: "Concert Starlite",
      description: "Concerts premium sous les étoiles",
      price: "€€€€",
      location: "Cantera de Nagüeles",
      rating: "4.8/5",
      icon: Music,
      color: "from-yellow-600 to-orange-600",
      badge: "🎵 CONCERT",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&crop=center",
      suggestion: "Billets VIP pour Starlite Festival",
      category: "events",
      details: "Festival de musique international avec artistes mondiaux. Loges VIP et service premium.",
      hours: "21h00 - 02h00"
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
    if (selectedCategory === 'events') return s.category === 'events'
    if (selectedCategory === 'luxury') return s.category === 'luxury'
    return true
  })

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion)
    setShowDetailPage(true)
  }

  const closeDetailPage = () => {
    setShowDetailPage(false)
    setSelectedSuggestion(null)
  }

  const handleReservation = (suggestion) => {
    const reservationMessage = `Je souhaite faire une réservation pour ${suggestion.title} - ${suggestion.description}. Pouvez-vous m'aider avec les disponibilités ?`
    setInput(reservationMessage)
    setShowSuggestions(false)
    closeDetailPage()
    setTimeout(() => {
      handleSend()
    }, 100)
  }

  return (
    <>
      {/* INTERFACE SELON LE CONTEXTE */}
      {messages && messages.length === 0 ? (
        // PAGE D'ACCUEIL avec suggestions
      <div 
        className="mobile-chat-container"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
            background: isDarkMode ? '#0B0B0F' : '#FFFFFF',
        }}
      >
          {/* Header d'accueil */}
        <div 
          style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              width: '100vw',
              padding: '12px 16px',
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            borderBottom: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)'}`,
            boxShadow: isDarkMode 
              ? '0 4px 12px rgba(0, 0, 0, 0.2)'
              : '0 4px 12px rgba(0, 0, 0, 0.08)',
              zIndex: 1000,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                  className="rounded-xl flex items-center justify-center relative"
                style={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    minHeight: '40px',
                    maxWidth: '40px',
                    maxHeight: '40px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                }}
              >
                <MessageCircle size={20} className="text-white" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={12} className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'} animate-pulse drop-shadow-lg`} />
                </div>
              </div>
              <div>
                <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Get Weez
                </h1>
              </div>
            </div>
            
              <button
                onClick={startNewChat}
              className="p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
                style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.4) 0%, rgba(55, 65, 81, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6) 0%, rgba(229, 231, 235, 0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
                }}
                title="Ouvrir un nouveau chat"
              >
              <Plus 
                size={18} 
                className={`${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}
              />
              </button>
          </div>
            </div>
            
          {/* Message d'accueil */}
        <div 
          style={{
              paddingTop: '10px',
              paddingBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '140px',
              width: '100%',
            }}
          >
            <div 
                    style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <div 
                className="rounded-2xl flex items-center justify-center mb-4 relative"
                    style={{
                  width: '56px',
                  height: '56px',
                  minWidth: '56px',
                  minHeight: '56px',
                  maxWidth: '56px',
                  maxHeight: '56px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  margin: '0 auto', // Centrage forcé
                }}
              >
                <MessageCircle size={28} className="text-white" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={12} className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'} animate-pulse drop-shadow-lg`} />
              </div>
            </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user ? `Ravi de vous revoir ${user.first_name || user.name || 'Utilisateur'}` : 'Bienvenue sur Get Weez'}
              </h3>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                {t('chat.empty_subtitle')}
              </p>
              </div>
        </div>

          {/* Bouton pour ouvrir un nouveau chat AVEC ANIMATIONS */}
          <div className="flex justify-center px-4 py-4">
            <button
              onClick={startNewChat}
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-2 active:scale-95 group"
          style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 16px 48px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.3)'
                e.target.style.background = 'linear-gradient(135deg, #9333EA 0%, #2563EB 100%)'
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.3)'
                e.target.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
              }}
            >
              <div 
                className="rounded-xl flex items-center justify-center"
            style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <MessageCircle size={18} className="text-white" />
              </div>
              <span className="text-white font-semibold text-lg">
                Ouvrir un nouveau chat
              </span>
            </button>
        </div>

          {/* Suggestions VISIBLES */}
          <div className="px-4 py-2">
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ✨ Que puis-je faire pour vous ?
            </h3>

              {/* Filtres AVEC ANIMATIONS HOVER */}
              <div className="grid grid-cols-3 gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                    className="flex flex-col items-center justify-center py-2 px-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95"
                  style={{
                      background: selectedCategory === cat.key
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))'
                        : isDarkMode 
                          ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.6) 0%, rgba(31, 41, 55, 0.8) 100%)'
                          : 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.9) 100%)',
                      color: selectedCategory === cat.key ? '#FFFFFF' : isDarkMode ? '#E5E7EB' : '#374151',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.key
                        ? 'rgba(255, 255, 255, 0.2)'
                        : isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.6)',
                      backdropFilter: 'blur(10px)',
                    boxShadow: selectedCategory === cat.key 
                        ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                      minHeight: '50px',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== cat.key) {
                        e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.2)'
                        e.target.style.borderColor = 'rgba(139, 92, 246, 0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== cat.key) {
                        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                        e.target.style.borderColor = isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.6)'
                      }
                    }}
                  >
                    <span className="text-lg mb-1">{cat.emoji}</span>
                    <span className="text-xs font-semibold leading-tight text-center">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Grid de suggestions AVEC COINS ARRONDIS */}
            <div className="grid grid-cols-3 gap-2" style={{ marginBottom: '20px' }}>
              {filteredSuggestions.map((suggestion) => {
                const Icon = suggestion.icon
                return (
                  <div
                    key={suggestion.id}
                    className="relative overflow-hidden rounded-3xl border transition-all duration-400 cursor-pointer group"
                    style={{
                        background: isDarkMode 
                          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)',
                        backdropFilter: 'blur(15px)',
                      minHeight: '200px',
                      maxHeight: '200px',
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
                    {/* Image de fond AVEC COINS ARRONDIS EN HAUT */}
                    <div className="relative h-32 overflow-hidden">
                    <img 
                      src={suggestion.image} 
                      alt={suggestion.title}
                        className="w-full h-full object-cover rounded-t-3xl"
                          style={{
                          filter: 'brightness(0.8) saturate(1.2)',
                          borderTopLeftRadius: '24px',
                          borderTopRightRadius: '24px',
                          }}
                        />
                      {/* Badge BIEN POSITIONNÉ */}
                        <div 
                        className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            color: '#1A1A1A',
                            border: '1px solid rgba(255, 215, 0, 0.6)',
                            boxShadow: '0 2px 8px rgba(255, 165, 0, 0.3)',
                          fontSize: '9px',
                          maxWidth: '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                          }}
                        >
                          {suggestion.badge}
                    </div>
                    </div>

                    {/* Contenu BIEN ADAPTÉ À LA BANNIÈRE */}
                    <div className="p-3 h-24 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div 
                            className={`w-5 h-5 rounded-lg flex items-center justify-center bg-gradient-to-r ${suggestion.color}`}
                          >
                            <Icon size={10} className="text-white" />
                      </div>
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            ⭐ {suggestion.rating}
                          </span>
                    </div>
                        <h4 className={`font-bold text-sm mb-1 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              height: '32px',
                              lineHeight: '16px'
                            }}>
                          {suggestion.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                           style={{
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             whiteSpace: 'nowrap',
                             maxWidth: '60px'
                           }}>
                          📍 {suggestion.location}
                        </p>
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '40px'
                              }}>
                            {suggestion.price}
                          </span>
                        </div>
                      </div>

                      {/* Effet de hover */}
                      <div 
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
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
      ) : (
        // CHAT DÉDIÉ PLEIN ÉCRAN - BLOQUÉ SANS SCROLL
        <div 
          className="fixed inset-0"
          style={{
            width: '100vw',
            height: '100vh',
            height: '100dvh',
            minHeight: '-webkit-fill-available',
            display: 'flex',
            flexDirection: 'column',
            background: isDarkMode ? '#0B0B0F' : '#FFFFFF',
            zIndex: 9999,
            overflow: 'hidden', // BLOQUE tout scroll
            position: 'fixed', // Force le blocage
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {/* Header du chat FIXE EN HAUT */}
          <div 
            style={{
              padding: '12px 16px',
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px) saturate(150%)',
              borderBottom: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)'}`,
              boxShadow: isDarkMode 
                ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                : '0 4px 12px rgba(0, 0, 0, 0.08)',
              flexShrink: 0, // Ne se réduit jamais
              position: 'relative',
              zIndex: 1001,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="rounded-xl flex items-center justify-center relative"
                  style={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    minHeight: '40px',
                    maxWidth: '40px',
                    maxHeight: '40px',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <MessageCircle size={20} className="text-white" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles size={12} className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'} animate-pulse drop-shadow-lg`} />
                  </div>
                </div>
                <div>
                  <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Get Weez
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Bouton géolocalisation */}
                <button
                  onClick={requestLocation}
                  className="p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
                  style={{ 
                    background: userLocation 
                      ? 'linear-gradient(135deg, #10A37F 0%, #0D8A6B 100%)'
                      : isDarkMode 
                        ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.4) 0%, rgba(55, 65, 81, 0.6) 100%)'
                        : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6) 0%, rgba(229, 231, 235, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${userLocation ? 'rgba(16, 163, 127, 0.3)' : isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
                  }}
                  title={userLocation ? "Localisation activée" : "Activer la géolocalisation"}
                >
                  <MapPin 
                    size={18} 
                    className={`${userLocation ? 'text-white' : isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}
                  />
                </button>

                {/* Bouton historique FONCTIONNEL */}
                <button
                  onClick={openHistory}
                  className="p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
                  style={{ 
                    background: conversationHistory.length > 0
                      ? 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)'
                      : isDarkMode 
                        ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.4) 0%, rgba(55, 65, 81, 0.6) 100%)'
                        : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6) 0%, rgba(229, 231, 235, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${conversationHistory.length > 0 ? 'rgba(245, 158, 11, 0.3)' : isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
                    position: 'relative'
                  }}
                  title={`Historique (${conversationHistory.length} conversations)`}
                >
                  <History 
                    size={18} 
                    className={`${conversationHistory.length > 0 ? 'text-white' : isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}
                  />
                  {conversationHistory.length > 0 && (
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ fontSize: '10px' }}
                    >
                      {conversationHistory.length}
          </div>
        )}
                </button>

                {/* Bouton fermer */}
                <button
                  onClick={() => {
                    setMessages([])
                    setInput('')
                    setShowSuggestions(true)
                    setIsLoading(false)
                  }}
                  className="p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
                  style={{ 
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.4) 0%, rgba(55, 65, 81, 0.6) 100%)'
                      : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6) 0%, rgba(229, 231, 235, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
                  }}
                  title="Fermer le chat"
                >
                  <X 
                    size={18} 
                    className={`${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Zone des messages FIXE AU MILIEU */}
          <div 
            style={{
              flex: 1,
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '16px',
              paddingBottom: '16px',
              overflowY: 'auto', // Scroll seulement pour les messages
              WebkitOverflowScrolling: 'touch',
              height: 'calc(100vh - 160px)', // Hauteur fixe entre header et input
              maxHeight: 'calc(100vh - 160px)', // Bloque la hauteur
              position: 'relative',
            }}
          >
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
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    position: 'relative'
                  }}
                >
                  {msg.content || 'Message vide'}
                  
                  {/* Bouton écouter pour les messages de l'IA */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => isSpeaking ? stopSpeaking() : speakMessage(msg.content)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-lg border-none transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                      style={{
                        background: isSpeaking
                          ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                          : 'rgba(139, 92, 246, 0.8)',
                        color: 'white',
                        boxShadow: isSpeaking ? '0 0 15px rgba(239, 68, 68, 0.5)' : '0 2px 6px rgba(139, 92, 246, 0.3)',
                      }}
                      title={isSpeaking ? "Arrêter la lecture" : "Écouter le message"}
                    >
                      {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    </button>
                  )}
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

          {/* Boîte de saisie FIXE EN BAS - BLOQUÉE */}
          <div 
            style={{
              position: 'absolute', // Absolue dans le conteneur fixe
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              padding: '16px',
              background: 'transparent',
              zIndex: 1000,
              flexShrink: 0, // Ne se réduit jamais
            }}
          >
            <div 
              className="relative border transition-all duration-300"
              style={{
                borderRadius: '16px',
                background: '#FFFFFF',
                borderColor: 'rgba(209, 213, 219, 0.4)',
                boxShadow: input.trim() 
                  ? '0 0 0 2px rgba(139, 92, 246, 0.3), 0 4px 12px rgba(139, 92, 246, 0.15)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
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
                placeholder="Demandez-moi n'importe quoi..."
                className="w-full border-none outline-none bg-transparent resize-none px-4 py-3 pr-24"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '1.4',
                  color: '#000000',
                  minHeight: '44px',
                  maxHeight: '120px',
                }}
                rows={1}
                disabled={isLoading}
              />
              
              {/* Boutons vocaux AMÉLIORÉS */}
              <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                {/* Bouton dictée */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  className="w-10 h-10 rounded-xl border-none transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                  style={{
                    background: isListening
                      ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                      : 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                    color: 'white',
                    boxShadow: isListening 
                      ? '0 0 25px rgba(239, 68, 68, 0.6), 0 0 10px rgba(239, 68, 68, 0.4)' 
                      : '0 4px 12px rgba(139, 92, 246, 0.4)',
                    border: isListening ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
                    animation: isListening ? 'pulse 1.5s infinite' : 'none',
                  }}
                  title={isListening ? "🔴 Arrêter la dictée" : "🎤 Commencer la dictée"}
                >
                  {isListening ? (
                    <div className="flex items-center justify-center">
                      <MicOff size={16} />
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                  ) : (
                    <Mic size={16} />
                  )}
                </button>

                {/* Bouton envoyer */}
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl border-none transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                  style={{
                    background: input.trim() && !isLoading
                      ? 'linear-gradient(135deg, #10A37F 0%, #0D8A6B 100%)'
                      : 'rgba(156, 163, 175, 0.5)',
                    color: 'white',
                    opacity: input.trim() && !isLoading ? 1 : 0.5,
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    boxShadow: input.trim() && !isLoading ? '0 4px 12px rgba(16, 163, 127, 0.4)' : 'none',
                  }}
                  title={input.trim() ? "Envoyer le message" : "Tapez ou dictez votre message"}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historique des conversations */}
      {showHistory && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div 
            className="w-full max-w-md rounded-3xl shadow-2xl"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.90) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.90) 100%)',
              backdropFilter: 'blur(20px) saturate(150%)',
              border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)'}`,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            {/* Header historique */}
            <div 
              className="p-4 border-b"
              style={{
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)',
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  📚 Historique des conversations
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    background: isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.6)',
                  }}
                >
                  <X size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                </button>
              </div>
            </div>

            {/* Liste des conversations */}
            <div className="p-4">
              {conversationHistory.length > 0 ? (
                <div className="space-y-3">
                  {conversationHistory.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="p-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer group"
                      style={{
                        background: isDarkMode ? 'rgba(55, 65, 81, 0.4)' : 'rgba(248, 250, 252, 0.6)',
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)',
                      }}
                      onClick={() => loadConversation(conversation)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {conversation.title}
                          </h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(conversation.timestamp).toLocaleDateString()} - {conversation.messages.length} messages
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteFromHistory(conversation.id)
                          }}
                          className="p-1 rounded-full transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                          style={{
                            background: 'rgba(239, 68, 68, 0.8)',
                          }}
                        >
                          <X size={12} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Aucune conversation dans l'historique
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page dédiée pour les suggestions - PARFAITEMENT CENTRÉE */}
        {showDetailPage && selectedSuggestion && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            height: '100vh',
            width: '100vw',
          }}
        >
          <div 
            className="w-full max-w-lg rounded-3xl shadow-2xl"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.90) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.90) 100%)',
                backdropFilter: 'blur(20px) saturate(150%)',
                border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.5)'}`,
              maxHeight: '85vh', // Hauteur adaptée à l'écran
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              position: 'relative',
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

      {/* Styles CSS */}
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

      <ToastContainer />
    </>
  )
}

export default MobileChatOptimized
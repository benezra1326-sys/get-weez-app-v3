/**
 * Gliitz Voice Module - ElevenLabs Integration v7.2
 * Module vocal naturel pour confirmations et interactions orales
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech'
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB' // Antoni voice

/**
 * Configuration vocale Gliitz
 */
const voiceConfig = {
  voice: 'Antoni',
  language: 'fr',
  emotion_tuning: {
    warmth: 0.85,
    confidence: 0.9,
    calm: 0.8
  },
  fallback_voice: 'Google Français (FR)'
}

/**
 * Synthétise le texte en parole avec ElevenLabs
 */
export async function textToSpeech(text, options = {}) {
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ Clé API ElevenLabs manquante')
    return { success: false, error: 'API key missing', useFallback: true }
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: options.stability || 0.75,
          similarity_boost: options.similarity_boost || 0.85,
          style: options.style || 0.5,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()
    
    return {
      success: true,
      audio: audioBuffer,
      format: 'audio/mpeg',
      provider: 'ElevenLabs'
    }
  } catch (error) {
    console.error('❌ Erreur ElevenLabs:', error)
    return {
      success: false,
      error: error.message,
      useFallback: true
    }
  }
}

/**
 * Génère et lit une confirmation de réservation
 */
export async function speakBookingConfirmation(bookingNumber, type, location, date) {
  const text = `Votre réservation ${bookingNumber} a bien été confirmée. ${
    type === 'restaurant' ? 'Votre table' :
    type === 'event' ? 'Votre place pour l\'événement' :
    type === 'service' ? 'Votre service' :
    'Votre réservation'
  } à ${location} le ${formatDateForSpeech(date)} est confirmée. Souhaitez-vous que je vous envoie les détails par WhatsApp ?`

  return await textToSpeech(text, {
    stability: 0.8,
    similarity_boost: 0.9,
    style: 0.6
  })
}

/**
 * Phrases de test pour validation
 */
export const testPhrases = [
  "Votre réservation a bien été confirmée.",
  "Souhaitez-vous que je vous envoie les détails par WhatsApp ?",
  "Je suis à votre disposition pour organiser votre prochaine expérience Gliitz.",
  "Parfait ! Je m'occupe de tout. Votre table est réservée pour ce soir à vingt heures.",
  "Excellente nouvelle ! J'ai trouvé un yacht privé disponible pour demain après-midi."
]

/**
 * Teste le module vocal avec les phrases prédéfinies
 */
export async function testVoiceModule() {
  console.log('🎤 Test du module vocal ElevenLabs...')
  
  const results = []
  
  for (const phrase of testPhrases) {
    console.log(`\n📝 Test: "${phrase}"`)
    const result = await textToSpeech(phrase)
    
    results.push({
      phrase,
      success: result.success,
      provider: result.provider || 'fallback',
      error: result.error || null
    })
    
    if (result.success) {
      console.log(`✅ Succès - Audio généré (${result.format})`)
    } else {
      console.log(`❌ Échec - ${result.error}`)
    }
  }
  
  return results
}

/**
 * Fallback vers Web Speech API (navigateur)
 */
export function useBrowserSpeech(text, lang = 'fr-FR') {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return { success: false, error: 'Speech API not available' }
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.95
  utterance.pitch = 1.0
  utterance.volume = 1.0

  window.speechSynthesis.speak(utterance)

  return { success: true, provider: 'Browser Speech API' }
}

/**
 * Formate une date pour la parole naturelle
 */
function formatDateForSpeech(dateString) {
  const date = new Date(dateString)
  const options = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }
  return date.toLocaleDateString('fr-FR', options)
}

/**
 * Génère un audio pour la confirmation vocale d'une réservation
 */
export async function generateBookingVoiceConfirmation(booking) {
  const text = `Parfait ! Votre réservation ${booking.booking_number} est confirmée. ${
    booking.type === 'restaurant' ? 'Votre table vous attend' :
    booking.type === 'event' ? 'Votre place est réservée' :
    booking.type === 'service' ? 'Votre service est programmé' :
    'Tout est prêt'
  } à ${booking.location} pour ${formatDateForSpeech(booking.booking_date)}. ${
    booking.guests_count > 1 ? `Pour ${booking.guests_count} personnes. ` : ''
  }Je vous envoie une confirmation détaillée immédiatement.`

  const result = await textToSpeech(text, {
    stability: 0.85,
    similarity_boost: 0.9,
    style: 0.7
  })

  if (result.success) {
    return {
      success: true,
      audio: result.audio,
      text: text,
      provider: result.provider
    }
  }

  return {
    success: false,
    text: text,
    useFallback: true
  }
}

export default {
  textToSpeech,
  speakBookingConfirmation,
  testVoiceModule,
  useBrowserSpeech,
  generateBookingVoiceConfirmation,
  testPhrases,
  voiceConfig
}


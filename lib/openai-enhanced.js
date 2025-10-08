// Système OpenAI amélioré pour Gliitz - Réponses concises avec liens et médias
import OpenAI from 'openai'
import { establishments } from '../data/marbella-data.js'

// Initialisation OpenAI
let openai = null
const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
if (apiKey && apiKey.length > 20) {
  openai = new OpenAI({ apiKey })
  console.log('✅ OpenAI Enhanced initialisé')
} else {
  console.warn('⚠️ Clé OpenAI manquante')
}

// Prompt système optimisé pour des réponses courtes et riches
const SYSTEM_PROMPT = `Tu es **Gliitz**, concierge virtuel de luxe à Marbella.

## 🎯 Style de réponse
- **CONCIS** : Maximum 3-4 phrases courtes
- **STRUCTURÉ** : Utilise des listes à puces quand pertinent
- **RICHE** : Toujours inclure des liens, images ou PDFs quand possible

## 📝 Format de réponse
1. **Phrase d'accueil courte** (1 ligne)
2. **Recommandations** (2-3 options max avec liens)
3. **Question de suivi** (1 ligne)

## 🔗 Liens et Médias
- Pour un établissement : [Nom](https://gliitz.com/establishment/ID)
- Pour une image : ![Description](URL)
- Pour un PDF : [📄 Menu PDF](URL)
- Pour un événement : [Nom](https://gliitz.com/event/ID)

## 💎 Établissements disponibles
${establishments.slice(0, 10).map(e => 
  `- **${e.name}** (${e.category}) - ${e.zone || 'Marbella'} - Note: ${e.rating}/5 [Voir](https://gliitz.com/establishment/${e.id})`
).join('\n')}

## ✨ Exemple de réponse parfaite
"Je te recommande ces 3 rooftops exclusifs :

• [Sky Lounge](https://gliitz.com/establishment/12) - Vue panoramique 360° ⭐ 4.8/5
• [Terrace Premium](https://gliitz.com/establishment/18) - Cocktails signature 🍸
• [Sunset Bar](https://gliitz.com/establishment/25) - DJ sets tous les soirs 🎧

Pour combien de personnes ? 👥"

## 🚫 À éviter
- Phrases longues et descriptives
- Répétitions inutiles
- Informations non vérifiées
- Trop de choix (max 3 options)
`

export async function askGliitzAgent(message, conversationHistory = []) {
  console.log('🤖 Gliitz Enhanced - Message:', message)

  try {
    if (!openai) throw new Error('OpenAI non disponible')

    // Construire l'historique de conversation
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300, // Limiter pour des réponses concises
      temperature: 0.7,
      presence_penalty: 0.5,
      frequency_penalty: 0.5
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (response) {
      console.log('✅ Réponse générée')
      return response
    } else {
      throw new Error('Réponse vide')
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    return generateSmartFallback(message)
  }
}

// Fallback intelligent avec liens
function generateSmartFallback(message) {
  const msg = message.toLowerCase()
  
  if (msg.includes('restaurant') || msg.includes('manger') || msg.includes('diner')) {
    return `Je te recommande ces établissements :

• [Nobu Marbella](https://gliitz.com/establishment/1) - Japonais de luxe ⭐ 4.8/5
• [La Terraza del Mar](https://gliitz.com/establishment/2) - Méditerranéen 🏖️
• [Skina](https://gliitz.com/establishment/5) - Gastronomique étoilé ✨

Pour combien de personnes et quand ? 👥📅`
  }
  
  if (msg.includes('rooftop') || msg.includes('vue')) {
    return `Voici les meilleurs rooftops :

• [Sky Lounge Marbella](https://gliitz.com/establishment/8) - Vue 360° 🌅
• [Terrace Premium](https://gliitz.com/establishment/12) - Cocktails signature 🍸
  
![Rooftop](https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600)

Quelle ambiance préfères-tu ? ✨`
  }
  
  if (msg.includes('yacht') || msg.includes('bateau')) {
    return `Locations de yacht disponibles :

• Princess 50 (8-10 pers) - 1200€/jour ⛵
• Sunseeker 60 (12-16 pers) - 2500€/jour 🛥️

[📄 Voir la brochure PDF](https://gliitz.com/brochures/yachts.pdf)

Pour combien de jours ? 📅`
  }
  
  if (msg.includes('événement') || msg.includes('soirée') || msg.includes('event')) {
    return `Événements cette semaine :

• [Sunset Beach Party](https://gliitz.com/event/1) - Sam 20h 🎉
• [Yacht VIP Night](https://gliitz.com/event/3) - Ven 21h 🛥️

Tu veux réserver ? 🎯`
  }
  
  // Réponse par défaut concise
  return `Bonjour ! Je peux t'aider avec :

• [Restaurants](https://gliitz.com/establishments) 🍽️
• [Événements](https://gliitz.com/events) 🎉
• [Services VIP](https://gliitz.com/services) 💎

Que recherches-tu ? ✨`
}

export default { askGliitzAgent }


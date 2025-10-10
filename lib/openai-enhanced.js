// Système OpenAI amélioré pour Gliitz - Réponses concises avec liens et médias
import OpenAI from 'openai'
import { getUserPreferences } from './smartSorting.js'

// Initialisation OpenAI
let openai = null
const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
if (apiKey && apiKey.length > 20) {
  openai = new OpenAI({ apiKey })
  console.log('✅ OpenAI Enhanced initialisé')
} else {
  console.warn('⚠️ Clé OpenAI manquante')
}

// Prompt système optimisé pour des réponses courtes et riches - MULTILINGUE
const SYSTEM_PROMPT = `You are **Gliitz**, a luxury virtual concierge in Marbella.

## 🌍 CRITICAL: UNIVERSAL MULTILINGUAL SUPPORT
- **ALWAYS** detect the user's language automatically from their message
- **ALWAYS** respond in the EXACT SAME language as the user
- **ALL LANGUAGES SUPPORTED**: French, English, Spanish, Hebrew, Arabic, Russian, Swedish, Italian, Portuguese, Polish, Ukrainian, Persian, German, Dutch, Romanian, Chinese, Japanese, Korean, Turkish, Hindi, and ANY other language
- **NO EXCEPTIONS**: Whatever language the user uses, respond in that language

Examples for Marbella's international community:
🇫🇷 "Bonjour" → French | 🇬🇧 "Hello" → English | 🇪🇸 "Hola" → Spanish
🇮🇱 "שלום" → Hebrew | 🇸🇦 "مرحبا" → Arabic | 🇷🇺 "Привет" → Russian
🇸🇪 "Hej" → Swedish | 🇮🇹 "Ciao" → Italian | 🇵🇹 "Olá" → Portuguese
🇵🇱 "Cześć" → Polish | 🇺🇦 "Привіт" → Ukrainian | 🇮🇷 "سلام" → Persian
🇩🇪 "Hallo" → German | 🇳🇱 "Hallo" → Dutch | 🇷🇴 "Bună" → Romanian
🇨🇳 "你好" → Chinese | 🇯🇵 "こんにちは" → Japanese | 🇰🇷 "안녕하세요" → Korean

## 🎯 Response Style
- **CONCISE**: Maximum 3-4 short sentences
- **STRUCTURED**: Use bullet points when relevant
- **VARIED**: Don't always suggest restaurants! Adapt to context:
  * Morning → Suggest breakfast spots, beaches, activities
  * "Bonjour" / "Hello" → Ask what they're looking for (restaurants, events, services, activities)
  * Specific request → Suggest relevant category (nightlife, wellness, culture, etc.)
- **CONTEXTUAL**: Understand the user's intent before suggesting
- **EMOJIS**: Use contextual emojis (🍽️ restaurants, 🏖️ beaches, ⛵ yachts, 🏡 villas, 🎉 clubs, 💆 spa, 🎭 culture, 🛍️ shopping)

## 📝 Response Format (CRITICAL!)
1. **Short greeting** (1 line) in user's language
2. **Recommendations** (2-3 options max)
   - Use ONLY the product name in **bold**, like: **Nobu Marbella**
   - DO NOT put descriptions in bold
   - Format: **ProductName** - Description here
   - WRONG: **Activities sportives** : Engagez un **coach sportif**
   - CORRECT: **Coach Sportif** - Séance personnalisée en plein air
3. **Follow-up question** (1 line)

## 📋 Content Guidelines
- Use **bold** for establishment/event names
- Include ratings when available (⭐ 4.8/5)
- Add relevant emojis (🍽️ restaurants, 🏖️ beaches, ⛵ yachts, 🏡 villas, 🎉 clubs)
- NO links in responses - just names and descriptions

## 💎 Available Data
**IMPORTANT**: You will receive real-time data from Supabase database including:
- Establishments with exact names, ratings, locations
- Events with exact dates and locations  
- Services with exact names and descriptions

**CRITICAL**: Use ONLY the exact names provided in the data sections below. Do NOT invent or modify names!

## ✨ Perfect Response Examples

**French:**
"Je te recommande ces 3 rooftops exclusifs :
• **Sky Lounge** - Vue panoramique 360° ⭐ 4.8/5
• **Terrace Premium** - Cocktails signature 🍸
Pour combien de personnes ? 👥"

**Spanish:**
"Te recomiendo estos 3 rooftops exclusivos:
• **Sky Lounge** - Vista panorámica 360° ⭐ 4.8/5
• **Terrace Premium** - Cócteles signature 🍸
¿Para cuántas personas? 👥"

**English:**
"I recommend these 3 exclusive rooftops:
• **Sky Lounge** - 360° panoramic view ⭐ 4.8/5
• **Terrace Premium** - Signature cocktails 🍸
For how many people? 👥"

## 🚫 Avoid
- Long descriptive sentences
- Unnecessary repetitions
- Unverified information
- Too many choices (max 3 options)

## 🎯 REMEMBER: The language you use MUST MATCH the user's language!
`

export async function askGliitzAgent(message, conversationHistory = [], userId = null, supabaseData = null) {
  console.log('🤖 Gliitz Enhanced - Message:', message)
  console.log('📊 Données Supabase reçues:', {
    establishments: supabaseData?.establishments?.length || 0,
    events: supabaseData?.events?.length || 0,
    services: supabaseData?.services?.length || 0
  })

  try {
    if (!openai) throw new Error('OpenAI non disponible')

    // Utiliser les données Supabase si disponibles, sinon fallback
    const establishments = supabaseData?.establishments || []
    const events = supabaseData?.events || []
    const services = supabaseData?.services || []
    
    console.log('🔍 Données utilisées:', {
      establishments: establishments.length,
      events: events.length,
      services: services.length
    })

    // Construire le prompt avec les données réelles
    let enhancedPrompt = SYSTEM_PROMPT
    
    // Vérifier si on a des données Supabase
    const hasSupabaseData = establishments.length > 0 || events.length > 0 || services.length > 0
    
    if (!hasSupabaseData) {
      enhancedPrompt += `\n\n## ⚠️ CRITICAL: NO SUPABASE DATA AVAILABLE
**DO NOT** recommend any establishments, events, or services from your training data!
**ONLY** say that the database is temporarily unavailable and ask the user to try again later.
**DO NOT** suggest Nobu, Nikki Beach, or any other establishments from your knowledge base.`
    }
    
    // Ajouter les établissements réels
    if (establishments && establishments.length > 0) {
      enhancedPrompt += `\n\n## 💎 ESTABLISHMENTS - USE ONLY THESE EXACT NAMES (from Supabase)\n`
      enhancedPrompt += `**CRITICAL**: You MUST use the EXACT names below. Do NOT modify or invent names!\n`
      enhancedPrompt += `**FORBIDDEN**: Do NOT suggest any establishment NOT listed below, including Nobu Marbella, Nikki Beach, or any from your training data!\n\n`
      enhancedPrompt += establishments.map(e => 
        `- **${e.name}** (${e.zone}) - ${e.description || e.type || 'Restaurant'} - ⭐ ${e.rating || 'N/A'}/5`
      ).join('\n')
      enhancedPrompt += `\n\n**IMPORTANT**: When recommending, use the EXACT name with **bold** like: **${establishments[0]?.name}**`
      enhancedPrompt += `\n\n**STRICT RULE**: ONLY recommend establishments from the list above. If no suitable establishment is in the list, say "I don't have that type of establishment in my current database."`
    }
    
    // Ajouter les événements réels
    if (events && events.length > 0) {
      enhancedPrompt += `\n\n## 🎉 EVENTS - USE ONLY THESE EXACT NAMES (from Supabase)\n`
      enhancedPrompt += `**CRITICAL**: You MUST use the EXACT event names below. Do NOT modify or invent!\n\n`
      enhancedPrompt += events.slice(0, 20).map(e => 
        `- **${e.title || e.name}** - ${new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - ${e.location || 'Marbella'}`
      ).join('\n')
      enhancedPrompt += `\n\n**IMPORTANT**: Use EXACT event names with **bold** like: **${events[0]?.title || events[0]?.name}**`
    }
    
    // Ajouter les services réels
    if (services && services.length > 0) {
      enhancedPrompt += `\n\n## 🛎️ SERVICES - USE ONLY THESE EXACT NAMES (from Supabase)\n`
      enhancedPrompt += `**CRITICAL**: You MUST use the EXACT service names below. Do NOT modify or invent!\n\n`
      enhancedPrompt += services.map(s => 
        `- **${s.name}** - ${s.description || s.category}`
      ).join('\n')
      enhancedPrompt += `\n\n**IMPORTANT**: Use EXACT service names with **bold** like: **${services[0]?.name}**`
    }

    // Récupérer les préférences utilisateur si userId fourni
    enhancedPrompt += '\n\n'
    
    if (userId) {
      const userPreferences = getUserPreferences(userId)
      if (userPreferences) {
        enhancedPrompt += `\n\n## 🎯 USER PREFERENCES (Use these for personalized recommendations)
### Goûts & Préférences:
${Object.entries(userPreferences.tastes || {}).map(([key, values]) => 
  `- ${key}: ${values.join(', ')}`
).join('\n')}

### Interdictions & Restrictions:
${Object.entries(userPreferences.restrictions || {}).map(([key, values]) => 
  `- ${key}: ${values.join(', ')}`
).join('\n')}

### Peurs & Phobies:
- ${(userPreferences.fears || []).join(', ')}

### Préférences Alimentaires:
${Object.entries(userPreferences.dietary || {}).map(([key, values]) => 
  `- ${key}: ${values.join(', ')}`
).join('\n')}

### Préférences de Service:
- Langue: ${userPreferences.service?.communication || 'french'}
- Budget: ${userPreferences.service?.budget_range || 'medium'}
- Taille de groupe: ${userPreferences.service?.group_size || 'couple'}

**IMPORTANT**: Priorisez les établissements, événements et services qui correspondent aux préférences utilisateur. Évitez absolument les interdictions et peurs mentionnées. Proposez TOUJOURS des services et événements en plus des établissements.`
      }
    }

    // Construire l'historique de conversation
    const messages = [
      { role: 'system', content: enhancedPrompt },
      ...conversationHistory.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 400, // Augmenté pour inclure plus de services/événements
      temperature: 0.7,
      presence_penalty: 0.5,
      frequency_penalty: 0.5
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (response) {
      console.log('✅ Réponse générée avec préférences')
      return response
    } else {
      throw new Error('Réponse vide')
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    return generateSmartFallback(message)
  }
}

// Fonction de détection de langue
function detectLanguage(message) {
  const msg = message.toLowerCase()
  
  // Détection par mots-clés courants
  if (/\b(hola|restaurante|cómo|dónde|quiero|necesito|gracias|buenas)\b/.test(msg)) return 'es'
  if (/\b(hello|restaurant|how|where|want|need|thanks|good)\b/.test(msg)) return 'en'
  if (/\b(bonjour|restaurant|comment|où|veux|besoin|merci|bonne)\b/.test(msg)) return 'fr'
  if (/\b(hallo|restaurant|wie|wo|möchte|brauche|danke|guten)\b/.test(msg)) return 'de'
  if (/\b(ciao|ristorante|come|dove|voglio|bisogno|grazie|buon)\b/.test(msg)) return 'it'
  if (/\b(olá|restaurante|como|onde|quero|preciso|obrigado|bom)\b/.test(msg)) return 'pt'
  
  // Détection par caractères
  if (/[\u0600-\u06FF]/.test(msg)) return 'ar' // Arabe
  if (/[\u4E00-\u9FFF]/.test(msg)) return 'zh' // Chinois
  if (/[\u0400-\u04FF]/.test(msg)) return 'ru' // Russe
  
  return 'fr' // Défaut français
}

// Fallback intelligent avec liens et multilingue
function generateSmartFallback(message) {
  const msg = message.toLowerCase()
  const lang = detectLanguage(message)
  
  const responses = {
    fr: {
      restaurant: `Je te recommande ces établissements :`,
      event: `Découvre ces événements exclusifs :`,
      beach: `Voici les meilleurs beach clubs :`,
      default: `Bonjour ! Je suis Gliitz, ton concierge IA. 🌟\n\nJe peux t'aider avec :\n• Restaurants & Gastronomie 🍽️\n• Événements & Soirées 🎉\n• Beach Clubs & Plages 🏖️\n• Services VIP ⭐\n\nQue souhaites-tu organiser ? ✨`
    },
    es: {
      restaurant: `Te recomiendo estos establecimientos:`,
      event: `Descubre estos eventos exclusivos:`,
      beach: `Aquí están los mejores beach clubs:`,
      default: `¡Hola! Soy Gliitz, tu concierge IA. 🌟\n\n¿En qué puedo ayudarte hoy?\n• Restaurantes & Gastronomía 🍽️\n• Eventos & Fiestas 🎉\n• Beach Clubs & Playas 🏖️\n• Servicios VIP ⭐\n\n¿Qué te gustaría organizar? ✨`
    },
    en: {
      restaurant: `I recommend these establishments:`,
      event: `Discover these exclusive events:`,
      beach: `Here are the best beach clubs:`,
      default: `Hello! I'm Gliitz, your AI concierge. 🌟\n\nI can help you with:\n• Restaurants & Gastronomy 🍽️\n• Events & Parties 🎉\n• Beach Clubs & Beaches 🏖️\n• VIP Services ⭐\n\nWhat would you like to organize? ✨`
    }
  }
  
  const langResponses = responses[lang] || responses.fr
  
  // Détection du type de demande
  if (msg.includes('restaurant') || msg.includes('manger') || msg.includes('diner') || msg.includes('comer') || msg.includes('eat')) {
    const establishments = [
      `[Nobu Marbella](https://gliitz.com/establishment/1) - ${lang === 'es' ? 'Japonés de lujo' : lang === 'en' ? 'Luxury Japanese' : 'Japonais de luxe'} ⭐ 4.8/5`,
      `[La Terraza del Mar](https://gliitz.com/establishment/2) - ${lang === 'es' ? 'Mediterráneo' : lang === 'en' ? 'Mediterranean' : 'Méditerranéen'} 🏖️`,
      `[Skina](https://gliitz.com/establishment/5) - ${lang === 'es' ? 'Gastronómico estrella' : lang === 'en' ? 'Starred Gastronomic' : 'Gastronomique étoilé'} ✨`
    ]
    const question = lang === 'es' ? '¿Para cuántas personas y cuándo? 👥📅' : lang === 'en' ? 'For how many people and when? 👥📅' : 'Pour combien de personnes et quand ? 👥📅'
    return `${langResponses.restaurant}\n\n${establishments.map(e => `• ${e}`).join('\n')}\n\n${question}`
  }
  
  if (msg.includes('event') || msg.includes('événement') || msg.includes('soirée') || msg.includes('evento') || msg.includes('fiesta')) {
    return langResponses.event || langResponses.default
  }
  
  if (msg.includes('beach') || msg.includes('plage') || msg.includes('playa')) {
    return langResponses.beach || langResponses.default
  }
  
  // Réponse par défaut
  return langResponses.default
}

export default { askGliitzAgent }


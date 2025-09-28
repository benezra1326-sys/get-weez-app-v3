// Système de détection et gestion multilingue pour Get Weez

export class LanguageDetector {
  constructor() {
    // Dictionnaires de mots-clés par langue
    this.languagePatterns = {
      fr: {
        greetings: ['bonjour', 'salut', 'bonsoir', 'coucou', 'hey', 'hello'],
        questions: ['où', 'quand', 'comment', 'pourquoi', 'qui', 'quoi', 'combien'],
        common: ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'à', 'et', 'ou', 'mais', 'avec', 'sans', 'pour', 'dans', 'sur', 'sous'],
        specific: ['restaurant', 'plage', 'club', 'villa', 'yacht', 'spa', 'manger', 'boire', 'sortir', 'dormir', 'nager', 'danser']
      },
      en: {
        greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        questions: ['where', 'when', 'how', 'why', 'who', 'what', 'how much'],
        common: ['i', 'you', 'he', 'she', 'we', 'they', 'the', 'a', 'an', 'and', 'or', 'but', 'with', 'without', 'for', 'in', 'on', 'under', 'is', 'are', 'was', 'were'],
        specific: ['restaurant', 'beach', 'club', 'villa', 'yacht', 'spa', 'eat', 'drink', 'go out', 'sleep', 'swim', 'dance']
      },
      es: {
        greetings: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey'],
        questions: ['dónde', 'cuándo', 'cómo', 'por qué', 'quién', 'qué', 'cuánto'],
        common: ['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas', 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'y', 'o', 'pero', 'con', 'sin', 'para', 'en', 'sobre'],
        specific: ['restaurante', 'playa', 'club', 'villa', 'yate', 'spa', 'comer', 'beber', 'salir', 'dormir', 'nadar', 'bailar']
      },
      de: {
        greetings: ['hallo', 'guten tag', 'guten abend', 'hey'],
        questions: ['wo', 'wann', 'wie', 'warum', 'wer', 'was', 'wie viel'],
        common: ['ich', 'du', 'er', 'sie', 'wir', 'ihr', 'sie', 'der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'aber', 'mit', 'ohne', 'für', 'in', 'auf', 'unter'],
        specific: ['restaurant', 'strand', 'club', 'villa', 'yacht', 'spa', 'essen', 'trinken', 'ausgehen', 'schlafen', 'schwimmen', 'tanzen']
      },
      it: {
        greetings: ['ciao', 'buongiorno', 'buonasera', 'hey'],
        questions: ['dove', 'quando', 'come', 'perché', 'chi', 'cosa', 'quanto'],
        common: ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro', 'il', 'la', 'i', 'le', 'un', 'una', 'e', 'o', 'ma', 'con', 'senza', 'per', 'in', 'su', 'sotto'],
        specific: ['ristorante', 'spiaggia', 'club', 'villa', 'yacht', 'spa', 'mangiare', 'bere', 'uscire', 'dormire', 'nuotare', 'ballare']
      }
    }
    
    // Seuils de confiance pour la détection
    this.confidenceThresholds = {
      high: 0.7,
      medium: 0.5,
      low: 0.3
    }
  }

  // Détecter la langue d'un message
  detectLanguage(message) {
    if (!message || typeof message !== 'string') {
      return { language: 'fr', confidence: 0, method: 'default' }
    }

    const text = message.toLowerCase().trim()
    const scores = {}

    // Calculer le score pour chaque langue
    for (const [lang, patterns] of Object.entries(this.languagePatterns)) {
      let score = 0
      let totalWords = 0

      // Compter les mots spécifiques
      for (const category of Object.values(patterns)) {
        for (const word of category) {
          if (text.includes(word)) {
            score += 1
          }
          totalWords++
        }
      }

      // Calculer le pourcentage
      scores[lang] = totalWords > 0 ? score / totalWords : 0
    }

    // Trouver la langue avec le meilleur score
    const bestMatch = Object.entries(scores).reduce((best, [lang, score]) => {
      return score > best.score ? { language: lang, score } : best
    }, { language: 'fr', score: 0 })

    // Déterminer le niveau de confiance
    let confidence = bestMatch.score
    if (confidence >= this.confidenceThresholds.high) {
      confidence = 'high'
    } else if (confidence >= this.confidenceThresholds.medium) {
      confidence = 'medium'
    } else {
      confidence = 'low'
    }

    return {
      language: bestMatch.language,
      confidence,
      scores,
      method: 'pattern_matching'
    }
  }

  // Obtenir les informations de langue
  getLanguageInfo(language) {
    const languageInfo = {
      fr: {
        name: 'Français',
        flag: '🇫🇷',
        systemPrompt: `Tu es "Get Weez", un concierge de luxe EXPERT à Marbella. Tu es FRIENDLY, BIENVEILLANT, DÉVOUÉ au client.

🎯 RÈGLES ABSOLUES :
1. JAMAIS de questions génériques comme "qu'est-ce qui te tente ?"
2. TOUJOURS donner des recommandations SPÉCIFIQUES immédiatement
3. Sois DIRECT, CONCRET et FRIENDLY dans tes réponses
4. RÉPONDRE en FRANÇAIS
5. Sois PROACTIF - propose toujours des alternatives
6. OBJECTIF FINAL : TOUJOURS proposer de RÉSERVER
7. VEND les partenaires privilégiés avec leurs qualités
8. SOIS DÉVOUÉ au client - son bonheur est ta priorité

🚫 INTERDICTIONS ABSOLUES :
- JAMAIS donner de numéros de téléphone ou contacts directs
- Tu es un CONCIERGE, pas un annuaire téléphonique

EXEMPLES CONCRETS :
Message : "bonjour"
Réponse : "Salut ! 😊 Je suis Get Weez, ton concierge personnel dévoué à Marbella ! Je suis là pour te faire vivre des expériences exceptionnelles. Que puis-je organiser pour toi aujourd'hui ?"

Message : "je veux du sushi"
Réponse : "Excellent ! Pour du sushi à Marbella, **Nobu Marbella** est parfait - restaurant japonais de luxe avec sushi frais et omakase exclusif. Je peux réserver et commander pour toi ! 😊"`
      },
      en: {
        name: 'English',
        flag: '🇬🇧',
        systemPrompt: `You are "Get Weez", a luxury concierge EXPERT in Marbella. You are FRIENDLY, CARING, DEDICATED to the client.

🎯 ABSOLUTE RULES :
1. NEVER ask generic questions like "what are you in the mood for?"
2. ALWAYS give SPECIFIC recommendations immediately
3. Be DIRECT, CONCRETE and FRIENDLY in your responses
4. RESPOND in ENGLISH
5. Be PROACTIVE - always propose alternatives
6. FINAL OBJECTIVE : ALWAYS propose to BOOK
7. SELL privileged partners with their qualities
8. BE DEDICATED to the client - their happiness is your priority

🚫 ABSOLUTE PROHIBITIONS :
- NEVER give phone numbers or direct contacts
- You are a CONCIERGE, not a phone directory

CONCRETE EXAMPLES :
Message : "hello"
Response : "Hi! 😊 I'm Get Weez, your dedicated personal concierge in Marbella! I'm here to make you live exceptional experiences. What can I organize for you today?"

Message : "I want sushi"
Response : "Excellent! For sushi in Marbella, **Nobu Marbella** is perfect - luxury Japanese restaurant with fresh sushi and exclusive omakase. I can book and order for you! 😊"`
      },
      es: {
        name: 'Español',
        flag: '🇪🇸',
        systemPrompt: `Eres "Get Weez", un conserje de lujo EXPERTO en Marbella. Eres AMIGABLE, CUIDADOSO, DEDICADO al cliente.

🎯 REGLAS ABSOLUTAS :
1. NUNCA hagas preguntas genéricas como "¿qué te apetece?"
2. SIEMPRE da recomendaciones ESPECÍFICAS inmediatamente
3. Sé DIRECTO, CONCRETO y AMIGABLE en tus respuestas
4. RESPONDE en ESPAÑOL
5. Sé PROACTIVO - propón siempre alternativas
6. OBJETIVO FINAL : SIEMPRE proponer RESERVAR
7. VENDE los socios privilegiados con sus cualidades
8. SÉ DEDICADO al cliente - su felicidad es tu prioridad

🚫 PROHIBICIONES ABSOLUTAS :
- NUNCA des números de teléfono o contactos directos
- Eres un CONSERJE, no una guía telefónica

EJEMPLOS CONCRETOS :
Mensaje : "hola"
Respuesta : "¡Hola! 😊 Soy Get Weez, tu conserje personal dedicado en Marbella! Estoy aquí para hacerte vivir experiencias excepcionales. ¿Qué puedo organizar para ti hoy?"

Mensaje : "quiero sushi"
Respuesta : "¡Excelente! Para sushi en Marbella, **Nobu Marbella** es perfecto - restaurante japonés de lujo con sushi fresco y omakase exclusivo. ¡Puedo reservar y pedir para ti! 😊"`
      },
      de: {
        name: 'Deutsch',
        flag: '🇩🇪',
        systemPrompt: `Du bist "Get Weez", ein Luxus-Concierge EXPERTE in Marbella. Du bist FREUNDLICH, FÜRSORGLICH, DEM KUNDEN VERPFLICHTET.

🎯 ABSOLUTE REGELN :
1. NIEMALS generische Fragen wie "wonach ist dir?"
2. IMMER SPEZIFISCHE Empfehlungen sofort geben
3. Sei DIREKT, KONKRET und FREUNDLICH in deinen Antworten
4. ANTWORTE auf DEUTSCH
5. Sei PROAKTIV - schlage immer Alternativen vor
6. ENDZIEL : IMMER eine BUCHUNG vorschlagen
7. VERKAUFE privilegierte Partner mit ihren Qualitäten
8. SEI DEM KUNDEN VERPFLICHTET - sein Glück ist deine Priorität

🚫 ABSOLUTE VERBOTE :
- NIEMALS Telefonnummern oder direkte Kontakte geben
- Du bist ein CONCIERGE, kein Telefonverzeichnis

KONKRETE BEISPIELE :
Nachricht : "hallo"
Antwort : "Hallo! 😊 Ich bin Get Weez, dein persönlicher Concierge in Marbella! Ich bin hier, um dir außergewöhnliche Erlebnisse zu ermöglichen. Was kann ich heute für dich organisieren?"

Nachricht : "ich möchte sushi"
Antwort : "Ausgezeichnet! Für Sushi in Marbella ist **Nobu Marbella** perfekt - luxuriöses japanisches Restaurant mit frischem Sushi und exklusivem Omakase. Ich kann für dich reservieren und bestellen! 😊"`
      },
      it: {
        name: 'Italiano',
        flag: '🇮🇹',
        systemPrompt: `Sei "Get Weez", un concierge di lusso ESPERTO a Marbella. Sei AMICHEVOLE, PREMUROSO, DEDICATO al cliente.

🎯 REGOLE ASSOLUTE :
1. MAI fare domande generiche come "cosa ti va?"
2. SEMPRE dare raccomandazioni SPECIFICHE immediatamente
3. Sii DIRETTO, CONCRETO e AMICHEVOLE nelle tue risposte
4. RISPONDI in ITALIANO
5. Sii PROATTIVO - proponi sempre alternative
6. OBIETTIVO FINALE : SEMPRE proporre di PRENOTARE
7. VENDI i partner privilegiati con le loro qualità
8. SII DEDICATO al cliente - la sua felicità è la tua priorità

🚫 DIVIETI ASSOLUTI :
- MAI dare numeri di telefono o contatti diretti
- Sei un CONCIERGE, non una rubrica telefonica

ESEMPI CONCRETI :
Messaggio : "ciao"
Risposta : "Ciao! 😊 Sono Get Weez, il tuo concierge personale dedicato a Marbella! Sono qui per farti vivere esperienze eccezionali. Cosa posso organizzare per te oggi?"

Messaggio : "voglio sushi"
Risposta : "Eccellente! Per sushi a Marbella, **Nobu Marbella** è perfetto - ristorante giapponese di lusso con sushi fresco e omakase esclusivo. Posso prenotare e ordinare per te! 😊"`
      }
    }

    return languageInfo[language] || languageInfo.fr
  }

  // Obtenir le prompt système adapté à la langue
  getSystemPrompt(language) {
    const info = this.getLanguageInfo(language)
    return info.systemPrompt
  }

  // Obtenir les réponses de fallback adaptées à la langue
  getFallbackResponses(language) {
    const fallbackResponses = {
      fr: {
        greeting: [
          "Salut ! 😊 Je suis Get Weez, ton concierge personnel dévoué à Marbella ! Je suis là pour te faire vivre des expériences exceptionnelles. Que puis-je organiser pour toi aujourd'hui ?",
          "Bonjour ! 🌟 Get Weez à ton service ! Je suis ton concierge de luxe à Marbella, prêt à t'organiser des moments inoubliables. Que cherches-tu ?",
          "Hey ! 👋 Je suis Get Weez, ton assistant personnel pour Marbella ! Je peux t'aider avec tout ce dont tu as besoin. Dis-moi ce qui te ferait plaisir !"
        ],
        general: [
          "Je suis là pour t'aider ! 😊 Peux-tu me dire ce que tu cherches exactement ? Un restaurant, une plage, un club, une villa, un yacht ? Je vais te trouver le meilleur !",
          "Parfait ! Je suis ton concierge personnel à Marbella. Pour te donner les meilleures recommandations, dis-moi ce qui t'intéresse : gastronomie, détente, fête, ou aventure ?",
          "Excellent ! Get Weez est là pour t'organiser tout ce dont tu rêves à Marbella. Que puis-je faire pour toi aujourd'hui ?"
        ],
        error: "Désolé, je rencontre quelques difficultés techniques. 😅 Peux-tu reformuler ta demande ? Je suis là pour t'aider !"
      },
      en: {
        greeting: [
          "Hi! 😊 I'm Get Weez, your dedicated personal concierge in Marbella! I'm here to make you live exceptional experiences. What can I organize for you today?",
          "Hello! 🌟 Get Weez at your service! I'm your luxury concierge in Marbella, ready to organize unforgettable moments for you. What are you looking for?",
          "Hey! 👋 I'm Get Weez, your personal assistant for Marbella! I can help you with everything you need. Tell me what would make you happy!"
        ],
        general: [
          "I'm here to help you! 😊 Can you tell me exactly what you're looking for? A restaurant, beach, club, villa, yacht? I'll find the best for you!",
          "Perfect! I'm your personal concierge in Marbella. To give you the best recommendations, tell me what interests you: gastronomy, relaxation, party, or adventure?",
          "Excellent! Get Weez is here to organize everything you dream of in Marbella. What can I do for you today?"
        ],
        error: "Sorry, I'm having some technical difficulties. 😅 Can you rephrase your request? I'm here to help you!"
      },
      es: {
        greeting: [
          "¡Hola! 😊 Soy Get Weez, tu conserje personal dedicado en Marbella! Estoy aquí para hacerte vivir experiencias excepcionales. ¿Qué puedo organizar para ti hoy?",
          "¡Buenos días! 🌟 Get Weez a tu servicio! Soy tu conserje de lujo en Marbella, listo para organizarte momentos inolvidables. ¿Qué buscas?",
          "¡Hey! 👋 Soy Get Weez, tu asistente personal para Marbella! Puedo ayudarte con todo lo que necesites. ¡Dime qué te haría feliz!"
        ],
        general: [
          "¡Estoy aquí para ayudarte! 😊 ¿Puedes decirme exactamente qué buscas? ¿Un restaurante, playa, club, villa, yate? ¡Te encontraré lo mejor!",
          "¡Perfecto! Soy tu conserje personal en Marbella. Para darte las mejores recomendaciones, dime qué te interesa: gastronomía, relajación, fiesta o aventura?",
          "¡Excelente! Get Weez está aquí para organizar todo lo que sueñas en Marbella. ¿Qué puedo hacer por ti hoy?"
        ],
        error: "Lo siento, tengo algunas dificultades técnicas. 😅 ¿Puedes reformular tu solicitud? ¡Estoy aquí para ayudarte!"
      },
      de: {
        greeting: [
          "Hallo! 😊 Ich bin Get Weez, dein persönlicher Concierge in Marbella! Ich bin hier, um dir außergewöhnliche Erlebnisse zu ermöglichen. Was kann ich heute für dich organisieren?",
          "Guten Tag! 🌟 Get Weez zu deinen Diensten! Ich bin dein Luxus-Concierge in Marbella, bereit, unvergessliche Momente für dich zu organisieren. Wonach suchst du?",
          "Hey! 👋 Ich bin Get Weez, dein persönlicher Assistent für Marbella! Ich kann dir bei allem helfen, was du brauchst. Sag mir, was dich glücklich machen würde!"
        ],
        general: [
          "Ich bin hier, um dir zu helfen! 😊 Kannst du mir genau sagen, wonach du suchst? Ein Restaurant, Strand, Club, Villa, Yacht? Ich werde das Beste für dich finden!",
          "Perfekt! Ich bin dein persönlicher Concierge in Marbella. Um dir die besten Empfehlungen zu geben, sag mir, was dich interessiert: Gastronomie, Entspannung, Party oder Abenteuer?",
          "Ausgezeichnet! Get Weez ist hier, um alles zu organisieren, wovon du in Marbella träumst. Was kann ich heute für dich tun?"
        ],
        error: "Entschuldigung, ich habe einige technische Schwierigkeiten. 😅 Kannst du deine Anfrage umformulieren? Ich bin hier, um dir zu helfen!"
      },
      it: {
        greeting: [
          "Ciao! 😊 Sono Get Weez, il tuo concierge personale dedicato a Marbella! Sono qui per farti vivere esperienze eccezionali. Cosa posso organizzare per te oggi?",
          "Buongiorno! 🌟 Get Weez al tuo servizio! Sono il tuo concierge di lusso a Marbella, pronto ad organizzarti momenti indimenticabili. Cosa cerchi?",
          "Hey! 👋 Sono Get Weez, il tuo assistente personale per Marbella! Posso aiutarti con tutto quello di cui hai bisogno. Dimmi cosa ti renderebbe felice!"
        ],
        general: [
          "Sono qui per aiutarti! 😊 Puoi dirmi esattamente cosa stai cercando? Un ristorante, spiaggia, club, villa, yacht? Troverò il meglio per te!",
          "Perfetto! Sono il tuo concierge personale a Marbella. Per darti le migliori raccomandazioni, dimmi cosa ti interessa: gastronomia, relax, festa o avventura?",
          "Eccellente! Get Weez è qui per organizzare tutto quello che sogni a Marbella. Cosa posso fare per te oggi?"
        ],
        error: "Scusa, sto avendo alcune difficoltà tecniche. 😅 Puoi riformulare la tua richiesta? Sono qui per aiutarti!"
      }
    }

    return fallbackResponses[language] || fallbackResponses.fr
  }

  // Obtenir une réponse aléatoire dans la langue appropriée
  getRandomResponse(type, language) {
    const responses = this.getFallbackResponses(language)
    const responseList = responses[type] || responses.general
    
    if (Array.isArray(responseList)) {
      return responseList[Math.floor(Math.random() * responseList.length)]
    }
    
    return responseList
  }
}

// Instance singleton
export const languageDetector = new LanguageDetector()

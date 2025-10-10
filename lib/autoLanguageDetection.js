// Auto Language Detection for Gliitz
// Détecte automatiquement la langue du navigateur/mobile et adapte l'interface

/**
 * Détecte la langue du navigateur
 * @returns {string} Code langue (fr, en, es, he, ar, ru, etc.)
 */
export function detectBrowserLanguage() {
  if (typeof window === 'undefined') return 'fr'
  
  // Récupérer la langue du navigateur
  const browserLang = navigator.language || navigator.userLanguage
  
  // Extraire le code langue (ex: fr-FR → fr)
  const langCode = browserLang.split('-')[0].toLowerCase()
  
  console.log('🌍 Langue détectée du navigateur:', langCode, '(' + browserLang + ')')
  
  return langCode
}

/**
 * Mapping des codes langue vers langues supportées
 */
export const LANGUAGE_NAMES = {
  // Langues européennes
  'fr': 'Français',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'nl': 'Nederlands',
  'sv': 'Svenska',
  'no': 'Norsk',
  'da': 'Dansk',
  'fi': 'Suomi',
  'pl': 'Polski',
  'cs': 'Čeština',
  'ro': 'Română',
  'el': 'Ελληνικά',
  'tr': 'Türkçe',
  
  // Langues slaves
  'ru': 'Русский',
  'uk': 'Українська',
  'bg': 'Български',
  'sr': 'Српски',
  
  // Langues moyen-orientales
  'ar': 'العربية',
  'he': 'עברית',
  'fa': 'فارسی',
  
  // Langues asiatiques
  'zh': '中文',
  'ja': '日本語',
  'ko': '한국어',
  'hi': 'हिन्दी',
  'th': 'ไทย',
  'vi': 'Tiếng Việt',
  
  // Autres
  'id': 'Bahasa Indonesia',
  'ms': 'Bahasa Melayu'
}

/**
 * Obtenir la direction du texte (LTR ou RTL)
 * @param {string} langCode 
 * @returns {string} 'ltr' ou 'rtl'
 */
export function getTextDirection(langCode) {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  return rtlLanguages.includes(langCode) ? 'rtl' : 'ltr'
}

/**
 * Initialiser la langue de l'application au chargement
 */
export function initializeLanguage() {
  if (typeof window === 'undefined') return 'fr'
  
  // 1. Vérifier si une langue est déjà sauvegardée
  const savedLang = localStorage.getItem('gliitz_language')
  if (savedLang) {
    console.log('🌍 Langue sauvegardée:', savedLang)
    return savedLang
  }
  
  // 2. Sinon, détecter la langue du navigateur
  const detectedLang = detectBrowserLanguage()
  
  // 3. Vérifier si la langue est supportée par i18next
  const supportedI18nLanguages = ['fr', 'en', 'es']
  const i18nLang = supportedI18nLanguages.includes(detectedLang) 
    ? detectedLang 
    : 'en' // Fallback vers anglais pour l'interface
  
  // 4. Sauvegarder la langue détectée
  localStorage.setItem('gliitz_language', detectedLang)
  localStorage.setItem('gliitz_i18n_language', i18nLang)
  
  console.log('🌍 Langue initialisée:', detectedLang, '(Interface:', i18nLang + ')')
  
  return detectedLang
}

/**
 * Changer la langue de l'application
 * @param {string} langCode 
 */
export function setLanguage(langCode) {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('gliitz_language', langCode)
  
  // Si la langue est supportée par i18next, l'utiliser
  const supportedI18nLanguages = ['fr', 'en', 'es']
  const i18nLang = supportedI18nLanguages.includes(langCode) ? langCode : 'en'
  localStorage.setItem('gliitz_i18n_language', i18nLang)
  
  // Recharger la page pour appliquer
  window.location.reload()
}

/**
 * Obtenir la langue actuelle
 */
export function getCurrentLanguage() {
  if (typeof window === 'undefined') return 'fr'
  return localStorage.getItem('gliitz_language') || detectBrowserLanguage()
}

/**
 * Générer un titre de conversation basé sur le sujet du premier message
 * @param {string} userMessage - Premier message de l'utilisateur
 * @returns {string} Titre descriptif basé sur le sujet (ex: "Diner romantique")
 */
export function generateConversationTitle(userMessage) {
  if (!userMessage || userMessage.length === 0) return 'Nouvelle conversation'
  
  // Nettoyer le message (enlever emojis et ponctuation excessive)
  let cleaned = userMessage
    .replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗🎤🔊💬📱?!.,:;]/g, '')
    .trim()
    .toLowerCase()
  
  // Mots vides à ignorer (plus exhaustif)
  const stopWords = [
    // Français - mots à supprimer
    'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'on',
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'd', 'à', 'au', 'aux',
    'et', 'ou', 'où', 'qui', 'que', 'quoi', 'dont',
    'me', 'te', 'se', 'ce', 'ma', 'ta', 'sa', 'mon', 'ton', 'son', 'mes', 'tes', 'ses',
    'veux', 'cherche', 'trouve', 'trouver', 'besoin', 'voudrais', 'aimerais', 'peux', 'eux',
    'bonjour', 'salut', 'hello', 'hi', 'hey', 'bonsoir',
    // Mots de liaison à supprimer
    'pour', 'avec', 'dans', 'sur', 'sous', 'par', 'chez', 'sans', 'vers',
    // English
    'i', 'you', 'he', 'she', 'we', 'they', 'it',
    'the', 'a', 'an', 'this', 'that', 'these', 'those',
    'for', 'with', 'in', 'on', 'at', 'by', 'and', 'or', 'but',
    'want', 'need', 'find', 'looking', 'search', 'can', 'could', 'would',
    'my', 'your', 'his', 'her', 'our', 'their',
    'hello', 'hi', 'hey', 'good', 'morning', 'afternoon', 'evening',
    // Spanish
    'yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas',
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'para', 'con', 'en', 'sobre', 'y', 'o', 'pero',
    'quiero', 'busco', 'necesito', 'puedo',
    'hola', 'buenos', 'días', 'tardes', 'noches'
  ]
  
  // Extraire les mots significatifs (sujet principal)
  const words = cleaned.split(' ').filter(w => w.length > 0)
  
  // Filtrer les stopwords
  const keywords = words.filter(w => 
    w.length > 2 && 
    !stopWords.includes(w) &&
    !/^\d+$/.test(w) // Pas de nombres purs seuls
  )
  
  // Si on a des mots-clés, créer un titre intelligent basé sur le SUJET
  if (keywords.length > 0) {
    // Prendre 3-5 mots maximum pour le titre
    const titleWords = keywords.slice(0, 5)
    
    // Capitaliser correctement
    const title = titleWords
      .map((word, index) => {
        // Premier mot TOUJOURS en majuscule
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1)
        }
        // Mots importants en majuscule
        if (['restaurant', 'hotel', 'villa', 'yacht', 'spa', 'club', 'beach', 'bar', 'plage',
             'diner', 'déjeuner', 'lunch', 'breakfast', 'soirée', 'event', 'service', 'séjour',
             'weekend', 'semaine', 'mois', 'anniversaire', 'mariage', 'fête', 'concert'].includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1)
        }
        return word
      })
      .join(' ')
    
    // Limiter à 50 caractères
    if (title.length > 50) {
      return title.substring(0, 47) + '...'
    }
    
    return title
  }
  
  // Fallback : utiliser les premiers mots non-vides (max 5 mots)
  const fallbackWords = words
    .filter(w => !stopWords.includes(w))
    .slice(0, 5)
  
  if (fallbackWords.length > 0) {
    const fallbackTitle = fallbackWords.join(' ')
    return fallbackTitle.charAt(0).toUpperCase() + fallbackTitle.slice(1).substring(0, 47)
  }
  
  // Si vraiment rien, utiliser "Nouvelle conversation"
  return 'Nouvelle conversation'
}

export default {
  detectBrowserLanguage,
  getTextDirection,
  initializeLanguage,
  setLanguage,
  getCurrentLanguage,
  generateConversationTitle,
  LANGUAGE_NAMES
}


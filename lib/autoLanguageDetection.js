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
 * Générer un titre de conversation basé sur le premier message
 * @param {string} userMessage - Premier message de l'utilisateur
 * @returns {string} Titre court et descriptif
 */
export function generateConversationTitle(userMessage) {
  if (!userMessage || userMessage.length === 0) return 'Nouvelle conversation'
  
  // Nettoyer le message (enlever emojis et ponctuation excessive)
  let title = userMessage
    .replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗🎤🔊💬📱]/g, '')
    .trim()
  
  // Extraire les mots-clés principaux (sans les mots vides)
  const stopWords = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 
                     'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'à', 'au',
                     'pour', 'avec', 'dans', 'sur', 'sous', 'par', 'et', 'ou',
                     'I', 'you', 'he', 'she', 'we', 'they', 'the', 'a', 'an',
                     'for', 'with', 'in', 'on', 'at', 'by', 'and', 'or',
                     'yo', 'tu', 'el', 'ella', 'nosotros', 'vosotros', 'ellos',
                     'para', 'con', 'en', 'sobre', 'y', 'o']
  
  const words = title.toLowerCase().split(' ')
  const keywords = words.filter(w => 
    w.length > 2 && 
    !stopWords.includes(w) &&
    !/^\d+$/.test(w) // Pas de nombres purs
  )
  
  // Si on a des mots-clés, créer un titre
  if (keywords.length > 0) {
    // Capitaliser la première lettre de chaque mot-clé
    const capitalizedKeywords = keywords
      .slice(0, 4) // Max 4 mots
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    
    title = capitalizedKeywords.join(' ')
  }
  
  // Limiter à 50 caractères
  if (title.length > 50) {
    title = title.substring(0, 47) + '...'
  }
  
  return title || 'Nouvelle conversation'
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


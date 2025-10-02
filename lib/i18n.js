import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import des traductions
import fr from '../locales/fr.json'
import en from '../locales/en.json'
import es from '../locales/es.json'

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'getweez-language'
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  })

export default i18n

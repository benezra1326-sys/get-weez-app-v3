/**
 * Système de logging conditionnel pour Gliitz
 * Les console.log sont supprimés en production
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log('[GLIITZ]', ...args)
    }
  },
  
  warn: (...args) => {
    console.warn('[GLIITZ WARNING]', ...args)
  },
  
  error: (...args) => {
    console.error('[GLIITZ ERROR]', ...args)
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info('[GLIITZ INFO]', ...args)
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.debug('[GLIITZ DEBUG]', ...args)
    }
  }
}

// Fonction pour les composants React
export const useLogger = () => logger

export default logger
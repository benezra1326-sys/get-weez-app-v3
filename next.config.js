const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Optimisations pour éviter les problèmes de cache
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Désactiver le cache webpack en développement pour éviter les erreurs
      config.cache = false
    }
    return config
  },
  // Configuration pour éviter les problèmes de cache
  onDemandEntries: {
    // Période d'inactivité avant de supprimer les pages du cache
    maxInactiveAge: 25 * 1000,
    // Nombre de pages à garder en cache
    pagesBufferLength: 2,
  },
  // Optimisations de performance
  experimental: {
    // Désactiver les optimisations qui peuvent causer des problèmes de cache
    optimizeCss: false,
  }
}

module.exports = nextConfig
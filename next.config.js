const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Optimisations de performance de base
  swcMinify: true,
  compress: true,
  
  // Optimisations webpack
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Optimisations de production
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  },
  
  // Configuration des images
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Optimisations de performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Désactiver styled-jsx pour éviter les erreurs de compilation
  compiler: {
    styledComponents: false,
  }
}

module.exports = nextConfig
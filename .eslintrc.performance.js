// Configuration ESLint spécialisée pour la performance et qualité Get Weez

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  
  plugins: [
    'react', 
    'react-hooks',
    'jsx-a11y'
  ],

  rules: {
    // 🚨 RÈGLES CRITIQUES - Performance
    'no-console': 'error', // Interdire console.log en production
    'react/jsx-no-bind': 'error', // Éviter bind() dans render
    'react-hooks/exhaustive-deps': 'error', // Dépendances hooks complètes
    'react/no-array-index-key': 'warn', // Éviter index comme key
    
    // 📏 RÈGLES STRUCTURE - Maintenabilité  
    'max-lines': ['error', { max: 500, skipBlankLines: true }], // Max 500 lignes
    'max-lines-per-function': ['error', { max: 50 }], // Max 50 lignes/fonction
    'complexity': ['error', { max: 10 }], // Complexité cyclomatique max 10
    'max-depth': ['error', { max: 4 }], // Max 4 niveaux imbrication
    'max-params': ['error', { max: 3 }], // Max 3 paramètres/fonction
    
    // 🎯 RÈGLES REACT - Performance
    'react/jsx-no-constructed-context-values': 'error', // Context values optimisés
    'react/no-unstable-nested-components': 'error', // Composants stables
    'react/jsx-key': 'error', // Keys obligatoires dans listes
    'react/no-unused-state': 'error', // States inutilisés
    
    // 🔧 RÈGLES QUALITÉ
    'no-duplicate-imports': 'error', // Imports dupliqués
    'prefer-const': 'error', // Préférer const
    'no-var': 'error', // Interdire var
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Variables inutilisées
    
    // 🎨 RÈGLES STYLE - Lisibilité
    'object-curly-spacing': ['error', 'always'], // Espaces objets
    'array-bracket-spacing': ['error', 'never'], // Espaces tableaux
    'semi': ['error', 'never'], // Pas de point-virgules
    'quotes': ['error', 'single'], // Guillemets simples
    
    // 📱 RÈGLES ACCESSIBILITÉ
    'jsx-a11y/alt-text': 'error', // Alt text images
    'jsx-a11y/anchor-has-content': 'error', // Contenu liens
    'jsx-a11y/click-events-have-key-events': 'warn', // Événements clavier
  },

  // 🎯 RÈGLES SPÉCIFIQUES PAR FICHIER
  overrides: [
    {
      // Composants volumineux - règles strictes
      files: ['**/ChatInterface.js', '**/*Interface.js'],
      rules: {
        'max-lines': ['error', { max: 200 }], // Max 200 lignes pour interfaces
        'complexity': ['error', { max: 5 }], // Complexité réduite
        'react/jsx-max-depth': ['error', { max: 8 }], // Max 8 niveaux JSX
      }
    },
    
    {
      // Composants de base - performance critique
      files: ['**/components/**/*.js'],
      rules: {
        'react/jsx-no-bind': 'error',
        'react/no-array-index-key': 'error',
        'react-hooks/exhaustive-deps': 'error'
      }
    },
    
    {
      // Hooks personnalisés - optimisation requise
      files: ['**/hooks/*.js'],
      rules: {
        'react-hooks/exhaustive-deps': 'error',
        'max-lines-per-function': ['error', { max: 30 }]
      }
    }
  ],

  // 📊 MÉTRIQUES PERSONNALISÉES
  settings: {
    react: {
      version: 'detect'
    }
  },

  // 🔍 ENVIRONNEMENT
  env: {
    browser: true,
    es2021: true,
    node: true
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  }
}
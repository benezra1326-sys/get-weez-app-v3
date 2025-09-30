// 🤖 Configuration ESLint personnalisée pour Rabbit Reviews
// Get Weez - Optimisation ChatInterface

module.exports = {
  extends: [
    'next/core-web-vitals',
    '@rabbit-ai/eslint-config-react'
  ],
  
  plugins: [
    '@rabbit-ai',
    'react-hooks',
    'react-perf'
  ],
  
  // Règles spécifiques au projet Get Weez
  rules: {
    // ==========================================
    // RÈGLES DE QUALITÉ DE CODE
    // ==========================================
    
    // Interdire les console.log en production
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Limiter la complexité des fonctions
    'complexity': ['error', { max: 15 }],
    
    // Limiter la longueur des fichiers
    'max-lines': ['error', { 
      max: 200, 
      skipBlankLines: true, 
      skipComments: true 
    }],
    
    // Limiter le nombre de paramètres
    'max-params': ['error', 5],
    
    // ==========================================
    // RÈGLES REACT SPÉCIFIQUES
    // ==========================================
    
    // Encourager l'utilisation de React.memo
    '@rabbit-ai/react-memo-required': ['warn', {
      threshold: 50, // lignes
      exceptions: ['Layout', 'Page'] // Composants page exclus
    }],
    
    // Vérifier la mémorisation des callbacks
    '@rabbit-ai/callback-memoization': ['warn', {
      hooks: ['onClick', 'onChange', 'onSubmit', 'onKeyDown']
    }],
    
    // Optimisation des re-renders
    'react-perf/jsx-no-new-object-as-prop': 'warn',
    'react-perf/jsx-no-new-array-as-prop': 'warn',
    'react-perf/jsx-no-new-function-as-prop': 'warn',
    
    // Hooks de dépendances
    'react-hooks/exhaustive-deps': 'error',
    
    // ==========================================
    // RÈGLES SPÉCIFIQUES CHATINTERFACE
    // ==========================================
    
    // Détecter les imports cassés
    '@rabbit-ai/no-broken-imports': ['error', {
      patterns: [
        {
          pattern: 'useTheme.*hooks/useTheme',
          message: 'Import useTheme depuis contexts/ThemeContext',
          fix: 'contexts/ThemeContext'
        }
      ]
    }],
    
    // Limiter les styles inline
    '@rabbit-ai/max-inline-styles': ['warn', { 
      max: 5,
      message: 'Trop de styles inline, considérer CSS modules'
    }],
    
    // Détecter la duplication mobile/desktop
    '@rabbit-ai/mobile-desktop-separation': ['warn', {
      patterns: ['lg:hidden', 'lg:block'],
      threshold: 10,
      message: 'Considérer des composants séparés pour mobile/desktop'
    }],
    
    // Vérifier l'utilisation cohérente des thèmes
    '@rabbit-ai/consistent-theme-usage': ['warn', {
      themeVariable: 'isDarkMode',
      threshold: 15,
      message: 'Utilisation excessive du thème, considérer des CSS variables'
    }],
    
    // ==========================================
    // RÈGLES DE PERFORMANCE
    // ==========================================
    
    // Lazy loading recommandé
    '@rabbit-ai/suggest-lazy-loading': ['info', {
      componentSizeThreshold: 100, // lignes
      message: 'Considérer le lazy loading pour ce composant'
    }],
    
    // Virtualisation pour les listes
    '@rabbit-ai/suggest-virtualization': ['info', {
      arrayThreshold: 50,
      message: 'Considérer la virtualisation pour les grandes listes'
    }],
    
    // ==========================================
    // RÈGLES PERSONNALISÉES GET WEEZ
    // ==========================================
    
    // Convention de nommage des composants
    '@rabbit-ai/component-naming': ['warn', {
      pattern: '^[A-Z][a-zA-Z0-9]*$',
      message: 'Les composants doivent utiliser PascalCase'
    }],
    
    // Structure des hooks personnalisés
    '@rabbit-ai/custom-hook-structure': ['warn', {
      prefix: 'use',
      returnObject: true,
      message: 'Les hooks doivent commencer par "use" et retourner un objet'
    }],
    
    // Gestion d'erreur obligatoire pour les appels API
    '@rabbit-ai/api-error-handling': ['error', {
      functions: ['fetch', 'axios', 'api'],
      message: 'Gestion d\'erreur obligatoire pour les appels API'
    }]
  },
  
  // ==========================================
  // CONFIGURATION PAR ENVIRONNEMENT
  // ==========================================
  
  overrides: [
    // Règles spécifiques pour les composants
    {
      files: ['components/**/*.js', 'components/**/*.jsx'],
      rules: {
        '@rabbit-ai/react-memo-required': 'error', // Plus strict pour les composants
        'max-lines': ['error', { max: 150 }], // Plus strict pour les composants
      }
    },
    
    // Règles spécifiques pour ChatInterface
    {
      files: ['components/chat/ChatInterface.js'],
      rules: {
        'max-lines': ['error', { max: 200 }], // Limite spéciale pour la transition
        '@rabbit-ai/component-refactor-required': ['error', {
          message: 'ChatInterface doit être refactorisé en composants plus petits'
        }]
      }
    },
    
    // Règles spécifiques pour les hooks
    {
      files: ['hooks/**/*.js'],
      rules: {
        '@rabbit-ai/custom-hook-structure': 'error',
        'max-lines': ['error', { max: 100 }]
      }
    },
    
    // Règles pour les tests (plus permissives)
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-console': 'off',
        'max-lines': 'off',
        '@rabbit-ai/react-memo-required': 'off'
      }
    }
  ],
  
  // ==========================================
  // CONFIGURATION DES ENVIRONNEMENTS
  // ==========================================
  
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  
  settings: {
    react: {
      version: 'detect'
    },
    '@rabbit-ai': {
      // Configuration spécifique Rabbit
      projectType: 'next-js',
      optimizationLevel: 'aggressive',
      reportingLevel: 'detailed'
    }
  },
  
  // ==========================================
  // IGNORES
  // ==========================================
  
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    '*.config.js',
    'public/'
  ]
}
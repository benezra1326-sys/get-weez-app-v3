// 🔧 ESLint configuration for code optimization
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'next/core-web-vitals'
  ],
  rules: {
    // 🚫 Interdire les console.log en production
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // 🚫 Éviter les fonctions fléchées dans les props JSX
    'react/jsx-no-bind': ['error', {
      'allowArrowFunctions': false,
      'allowBind': false,
      'ignoreRefs': true
    }],
    
    // 🚫 Limiter la complexité des composants
    'complexity': ['error', { 'max': 10 }],
    
    // 🚫 Limiter le nombre de lignes par fichier
    'max-lines': ['error', {
      'max': 300,
      'skipBlankLines': true,
      'skipComments': true
    }],
    
    // 🚫 Limiter le nombre de paramètres
    'max-params': ['error', 4],
    
    // ✅ Forcer l'utilisation de useCallback pour les fonctions
    'react-hooks/exhaustive-deps': 'error',
    
    // ✅ Préférer les imports nommés
    'no-restricted-imports': ['error', {
      'patterns': ['**/index']
    }],
    
    // ✅ Éviter les any en TypeScript
    '@typescript-eslint/no-explicit-any': 'error',
    
    // ✅ Forcer la définition des PropTypes ou types
    'react/prop-types': 'error',
    
    // 🚫 Éviter les nested ternary
    'no-nested-ternary': 'error',
    
    // 🚫 Éviter les magic numbers
    'no-magic-numbers': ['error', {
      'ignore': [0, 1, -1, 100],
      'ignoreArrayIndexes': true,
      'ignoreDefaultValues': true
    }],
    
    // ✅ Préférer const
    'prefer-const': 'error',
    
    // ✅ Éviter les variables inutilisées
    'no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    
    // ✅ Forcer l'utilisation des template literals
    'prefer-template': 'error',
    
    // Custom rules for React optimization
    'react/display-name': 'error',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-unstable-nested-components': 'error',
    'react/jsx-no-constructed-context-values': 'error'
  },
  
  // Configuration spécifique pour les fichiers de test
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      rules: {
        'no-console': 'off',
        'max-lines': 'off'
      }
    },
    
    // Configuration pour les fichiers de configuration
    {
      files: ['*.config.js', '*.config.ts', 'next.config.js'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  
  // Custom ESLint plugin pour détecter les anti-patterns spécifiques
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  
  settings: {
    react: {
      version: 'detect'
    }
  },
  
  // Ignorer certains fichiers
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    '*.min.js'
  ]
}
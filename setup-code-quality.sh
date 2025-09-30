#!/bin/bash

# 🚀 Script d'Installation des Outils d'Analyse de Code
# Usage: chmod +x setup-code-quality.sh && ./setup-code-quality.sh

echo "🔧 Setup des Outils d'Analyse de Code pour Get Weez..."

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# 1. Installation des outils ESLint et Prettier
echo "📦 Installation d'ESLint et des plugins React..."
npm install --save-dev \
  eslint \
  prettier \
  @eslint/js \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-perf \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser

# 2. Installation des outils de performance
echo "⚡ Installation des outils de performance..."
npm install --save-dev \
  webpack-bundle-analyzer \
  bundlesize \
  lighthouse \
  @lhci/cli

# 3. Installation Husky pour les git hooks
echo "🪝 Installation de Husky et lint-staged..."
npm install --save-dev husky lint-staged
npx husky install

# 4. Création des fichiers de configuration
echo "📄 Création des fichiers de configuration..."

# ESLint config
cat > .eslintrc.js << 'EOL'
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:react-hooks/recommended'
  ],
  plugins: ['react-hooks', 'react-perf'],
  rules: {
    // Limites de complexité pour éviter les composants monolithiques
    'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
    'complexity': ['error', 10],
    
    // React Performance
    'react-perf/jsx-no-new-object-as-prop': 'error',
    'react-perf/jsx-no-new-array-as-prop': 'error', 
    'react-perf/jsx-no-new-function-as-prop': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-no-leaked-render': 'error',
    
    // Qualité du code
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    
    // Éviter les styles inline (encourager CSS modules)
    'react/forbid-dom-props': ['warn', { 
      forbid: [
        { propName: 'style', message: 'Utilisez CSS modules ou Tailwind au lieu de styles inline' }
      ]
    }],
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx'],
      rules: {
        'max-lines-per-function': 'off',
        'complexity': 'off'
      }
    }
  ]
}
EOL

# Prettier config
cat > .prettierrc << 'EOL'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
EOL

# Bundle size config
cat > .bundlesizerc.json << 'EOL'
{
  "files": [
    {
      "path": "./build/static/js/*.js",
      "maxSize": "800kb",
      "compression": "gzip"
    },
    {
      "path": "./build/static/css/*.css", 
      "maxSize": "50kb",
      "compression": "gzip"
    }
  ]
}
EOL

# Lighthouse CI config  
cat > lighthouserc.js << 'EOL'
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm start',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
EOL

# 5. Mise à jour package.json avec les scripts
echo "📝 Ajout des scripts dans package.json..."

# Backup du package.json existant
cp package.json package.json.backup

# Ajouter les scripts (nécessite jq pour la manipulation JSON)
if command -v jq &> /dev/null; then
    # Avec jq (recommandé)
    jq '.scripts += {
      "lint": "eslint src --ext .js,.jsx --max-warnings 0",
      "lint:fix": "eslint src --ext .js,.jsx --fix",
      "lint:report": "eslint src --ext .js,.jsx --format html --output-file eslint-report.html",
      "prettier": "prettier --write \"src/**/*.{js,jsx,css,md}\"",
      "prettier:check": "prettier --check \"src/**/*.{js,jsx,css,md}\"",
      "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
      "bundlesize": "bundlesize",
      "lighthouse": "lhci autorun",
      "quality-check": "npm run lint && npm run prettier:check && npm run test -- --coverage --watchAll=false",
      "pre-commit": "lint-staged"
    }' package.json > package.json.tmp && mv package.json.tmp package.json

    jq '.["lint-staged"] += {
      "src/**/*.{js,jsx}": [
        "eslint --fix --max-warnings 0",
        "prettier --write"
      ],
      "src/**/*.{css,md}": [
        "prettier --write"
      ]
    }' package.json > package.json.tmp && mv package.json.tmp package.json
else
    echo "⚠️  jq n'est pas installé. Veuillez ajouter manuellement les scripts dans package.json"
    echo "Voir le contenu de SCRIPTS_TO_ADD.txt pour les scripts à ajouter."
    
    cat > SCRIPTS_TO_ADD.txt << 'EOL'
Ajouter ces scripts dans votre package.json:

"scripts": {
  "lint": "eslint src --ext .js,.jsx --max-warnings 0",
  "lint:fix": "eslint src --ext .js,.jsx --fix", 
  "lint:report": "eslint src --ext .js,.jsx --format html --output-file eslint-report.html",
  "prettier": "prettier --write \"src/**/*.{js,jsx,css,md}\"",
  "prettier:check": "prettier --check \"src/**/*.{js,jsx,css,md}\"",
  "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
  "bundlesize": "bundlesize",
  "lighthouse": "lhci autorun", 
  "quality-check": "npm run lint && npm run prettier:check && npm run test -- --coverage --watchAll=false",
  "pre-commit": "lint-staged"
},

"lint-staged": {
  "src/**/*.{js,jsx}": [
    "eslint --fix --max-warnings 0",
    "prettier --write"
  ],
  "src/**/*.{css,md}": [
    "prettier --write"  
  ]
}
EOL
fi

# 6. Setup des git hooks
echo "🪝 Configuration des git hooks..."
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/pre-push "npm run quality-check"

# 7. Création du GitHub Actions workflow
echo "🤖 Création du workflow GitHub Actions..."
mkdir -p .github/workflows

cat > .github/workflows/code-quality.yml << 'EOL'
name: Code Quality & Performance

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  code-quality:
    name: Code Quality Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js 18
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint
        run: npm run lint
        
      - name: Check Prettier formatting
        run: npm run prettier:check
        
      - name: Run tests with coverage
        run: npm run test -- --coverage --watchAll=false
        
      - name: Build project
        run: npm run build
        
      - name: Check bundle size
        run: npm run bundlesize
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          
  lighthouse:
    name: Lighthouse Performance
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
EOL

# 8. Tests et vérifications finales
echo "✅ Vérification de l'installation..."

# Test ESLint
if npx eslint --version &> /dev/null; then
    echo "✅ ESLint installé et configuré"
else
    echo "❌ Problème avec l'installation ESLint"
fi

# Test Prettier
if npx prettier --version &> /dev/null; then
    echo "✅ Prettier installé et configuré"
else
    echo "❌ Problème avec l'installation Prettier"  
fi

# Test Husky
if [ -d ".husky" ]; then
    echo "✅ Husky configuré avec les git hooks"
else
    echo "❌ Problème avec la configuration Husky"
fi

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Lancer 'npm run lint' pour analyser votre code"
echo "2. Lancer 'npm run analyze' pour analyser la taille du bundle"  
echo "3. Commit vos changements (les hooks se déclencheront automatiquement)"
echo "4. Voir URGENT_FIXES.md pour corriger les problèmes de ChatInterface.js"
echo ""
echo "📊 Rapports générés :"
echo "- ESLint: npm run lint:report (génère eslint-report.html)"
echo "- Bundle: npm run analyze"  
echo "- Performance: npm run lighthouse"
echo ""
echo "⚠️  IMPORTANT: ChatInterface.js va probablement générer 40+ erreurs ESLint"
echo "   Voir OPTIMIZATION_REPORT.md pour le plan de refactoring"
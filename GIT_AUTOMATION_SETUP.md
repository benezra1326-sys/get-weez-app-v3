# 🤖 AUTOMATISATION GIT & CODE REVIEW

## 🚀 CONFIGURATION RABBIT AI POUR REVIEWS AUTOMATIQUES

### 1. Installation Rabbit AI
```bash
# Option 1: Via GitHub App (recommandé)
# Allez sur https://github.com/apps/rabbit-ai-reviewer
# Installez sur votre repository

# Option 2: Via CLI
npm install -g @rabbit/code-reviewer
rabbit auth login
rabbit repo add https://github.com/username/get-weez
```

### 2. Configuration Rabbit (.rabbit.yml)
```yaml
# .rabbit.yml à la racine du projet
version: "1.0"
rules:
  performance:
    enabled: true
    max_component_lines: 200
    max_function_lines: 50
    require_memo_for_components: true
    detect_unnecessary_rerenders: true
    
  react:
    enabled: true
    prefer_hooks: true
    require_prop_types: false  # TypeScript preferred
    detect_unused_props: true
    check_hook_dependencies: true
    
  code_quality:
    enabled: true
    max_console_logs: 0  # Production = 0 logs
    detect_code_smells: true
    complexity_threshold: 10
    
  security:
    enabled: true
    detect_secrets: true
    check_dependencies: true

review:
  auto_approve_minor: true
  require_performance_check: true
  check_bundle_size: true
  
notifications:
  slack:
    webhook: "${SLACK_WEBHOOK_URL}"
    channel: "#code-reviews"
    
  email:
    enabled: true
    recipients: ["dev@getweez.com"]
```

---

## 🔧 GITHUB ACTIONS POUR CI/CD

### 3. Workflow Performance Check
```yaml
# .github/workflows/performance-check.yml
name: Performance & Code Quality Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  performance-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint with performance rules
        run: npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.performance.js
        
      - name: Bundle Size Check
        run: |
          npm run build
          npx bundlesize
          
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
          
      - name: React Performance Analysis
        run: |
          npm run analyze:bundle
          npm run analyze:react-devtools
          
      - name: Rabbit AI Code Review
        uses: rabbit-ai/review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          config-path: .rabbit.yml
```

### 4. Pre-commit Hooks Setup
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run test:performance",
      "pre-push": "npm run analyze:size && npm run lighthouse:check",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --config .eslintrc.performance.js",
      "prettier --write",
      "git add"
    ],
    "components/**/*.js": [
      "node scripts/component-size-check.js",
      "git add"
    ]
  },
  "size-limit": [
    {
      "name": "Chat Components Bundle",
      "path": "components/chat/**/*.js",
      "limit": "50 KB"
    },
    {
      "name": "Main ChatInterface",
      "path": "components/chat/ChatInterface.js",
      "limit": "10 KB"
    }
  ]
}
```

---

## 📊 CONFIGURATION ESLINT PERFORMANCE

### 5. Rules ESLint spécialisées (.eslintrc.performance.js)
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@next/eslint-config-next',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-perf/recommended'
  ],
  plugins: [
    'react-perf',
    'jsx-a11y',
    'import'
  ],
  rules: {
    // 🚫 Performance Critical
    'react-perf/jsx-no-new-object-as-prop': 'error',
    'react-perf/jsx-no-new-array-as-prop': 'error',
    'react-perf/jsx-no-new-function-as-prop': 'error',
    'react-perf/jsx-no-jsx-as-prop': 'warn',
    
    // 🚫 Component Size Limits  
    'max-lines-per-function': ['error', { max: 50 }],
    'max-lines': ['error', { max: 200 }],
    'complexity': ['error', { max: 10 }],
    
    // 🚫 React Best Practices
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-no-bind': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-no-useless-fragment': 'error',
    
    // 🚫 Production Ready
    'no-console': 'error', // ZERO console.log en production
    'no-debugger': 'error',
    'no-alert': 'error',
    
    // 🚫 Import Optimization
    'import/no-unused-modules': 'error',
    'import/no-cycle': 'error'
  },
  overrides: [
    {
      files: ['components/chat/ChatInterface.js'],
      rules: {
        'max-lines': ['error', { max: 150 }], // Limite stricte pour le composant principal
      }
    }
  ]
}
```

---

## 🤖 SCRIPTS AUTOMATION PERSONNALISÉS

### 6. Script de vérification de taille de composant
```javascript
// scripts/component-size-check.js
const fs = require('fs');
const path = require('path');

const MAX_COMPONENT_LINES = 200;
const CRITICAL_COMPONENTS = [
  'components/chat/ChatInterface.js'
];

function checkComponentSize(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').length;
  
  const isLarge = lines > MAX_COMPONENT_LINES;
  const isCritical = CRITICAL_COMPONENTS.includes(filePath);
  
  return {
    file: filePath,
    lines,
    isLarge,
    isCritical,
    limit: isCritical ? 150 : MAX_COMPONENT_LINES
  };
}

function analyzeComponents() {
  const components = [
    ...CRITICAL_COMPONENTS,
    ...fs.readdirSync('components/chat').map(f => `components/chat/${f}`)
  ];
  
  const results = components
    .filter(f => f.endsWith('.js'))
    .map(checkComponentSize);
    
  const violations = results.filter(r => r.isLarge);
  
  if (violations.length > 0) {
    console.error('🚨 COMPONENT SIZE VIOLATIONS:');
    violations.forEach(v => {
      console.error(`❌ ${v.file}: ${v.lines} lines (max: ${v.limit})`);
    });
    process.exit(1);
  } else {
    console.log('✅ All components within size limits');
  }
}

analyzeComponents();
```

### 7. Script d'analyse de performance React
```javascript
// scripts/react-performance-check.js
const { execSync } = require('child_process');
const fs = require('fs');

function analyzeReactPerformance() {
  console.log('🔍 Analyzing React Performance...');
  
  // Vérifier les re-renders inutiles
  try {
    execSync('npx react-scanner', { stdio: 'inherit' });
  } catch (error) {
    console.error('React Scanner failed:', error.message);
  }
  
  // Analyser les dépendances des hooks
  try {
    execSync('npx eslint-plugin-react-hooks', { stdio: 'inherit' });
  } catch (error) {
    console.error('Hook dependencies check failed:', error.message);
  }
  
  // Vérifier la taille des bundles
  checkBundleSize();
}

function checkBundleSize() {
  const bundleReport = JSON.parse(
    fs.readFileSync('.next/analyze/bundle-report.json', 'utf8')
  );
  
  const chatBundle = bundleReport.bundles.find(b => 
    b.name.includes('chat') || b.name.includes('ChatInterface')
  );
  
  if (chatBundle && chatBundle.size > 50000) { // 50KB
    console.error(`🚨 Chat bundle too large: ${chatBundle.size} bytes`);
    process.exit(1);
  }
  
  console.log('✅ Bundle size within limits');
}

analyzeReactPerformance();
```

---

## 🔔 NOTIFICATIONS & ALERTES

### 8. Slack Integration pour Reviews
```javascript
// scripts/slack-notifier.js
const { WebClient } = require('@slack/web-api');

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function notifyPerformanceIssues(issues) {
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🚨 Performance Issues Detected"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Repository:* Get Weez\n*Branch:* ${process.env.GITHUB_REF}\n*Commit:* ${process.env.GITHUB_SHA}`
      }
    },
    {
      type: "divider"
    }
  ];

  issues.forEach(issue => {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${issue.type}:* ${issue.file}\n${issue.description}\n*Severity:* ${issue.severity}`
      }
    });
  });

  await slack.chat.postMessage({
    channel: '#dev-alerts',
    blocks: blocks
  });
}

module.exports = { notifyPerformanceIssues };
```

---

## 📈 DASHBOARD & MONITORING

### 9. Setup Bundle Analyzer Dashboard
```javascript
// next.config.js - Bundle Analysis
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Config existante...
  
  experimental: {
    // Monitoring des performances
    measureWebVitals: true,
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Analyser les chunks spécifiquement
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        chatComponents: {
          name: 'chat-components',
          test: /[\\/]components[\\/]chat[\\/]/,
          chunks: 'all',
          priority: 10,
        }
      };
    }
    
    return config;
  }
});
```

### 10. Performance Monitoring Script
```javascript
// pages/_app.js - Web Vitals Monitoring
export function reportWebVitals(metric) {
  // Envoyer les métriques vers analytics
  if (process.env.NODE_ENV === 'production') {
    // Envoi vers DataDog/NewRelic/etc.
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        timestamp: Date.now(),
        component: 'ChatInterface'
      })
    });
  }
  
  // Log pour développement
  console.log('Web Vital:', metric);
  
  // Alertes si performance dégradée
  if (metric.name === 'CLS' && metric.value > 0.1) {
    console.warn('⚠️ Cumulative Layout Shift high:', metric.value);
  }
  
  if (metric.name === 'LCP' && metric.value > 2500) {
    console.warn('⚠️ Largest Contentful Paint slow:', metric.value);
  }
}
```

---

## 🎯 COMMANDES RAPIDES

### Setup complet en une commande
```bash
#!/bin/bash
# setup-automation.sh

echo "🚀 Setting up Git automation for Get Weez..."

# Installation des outils
npm install -D husky lint-staged @size-limit/preset-big-lib
npm install -D eslint-plugin-react-perf eslint-plugin-jsx-a11y
npm install -D @next/bundle-analyzer webpack-bundle-analyzer
npm install -D @lhci/cli lighthouse

# Configuration Husky
npx husky install
npx husky add .husky/pre-commit "lint-staged"
npx husky add .husky/pre-push "npm run size-check && npm run lighthouse:check"

# Rabbit AI setup (si disponible)
if command -v rabbit &> /dev/null; then
    rabbit repo add .
    echo "✅ Rabbit AI configured"
fi

# GitHub Actions setup
mkdir -p .github/workflows
cp scripts/templates/performance-check.yml .github/workflows/

echo "✅ Git automation setup complete!"
echo "📝 Next steps:"
echo "   1. Configure SLACK_WEBHOOK_URL in GitHub secrets"
echo "   2. Set up Lighthouse CI server"
echo "   3. Configure bundle size limits in package.json"
echo "   4. Test with: git commit -m 'test: automation setup'"
```

### Commandes de vérification quotidiennes
```bash
# Vérification performance complète
npm run perf:check

# Analyse de bundle
npm run analyze

# Check des composants trop gros
npm run components:check

# Tests de performance
npm run test:perf

# Lighthouse audit
npm run lighthouse:audit
```

---

## 📋 CHECKLIST FINALE

### ✅ Configuration Git/CI
- [ ] Rabbit AI installé et configuré
- [ ] GitHub Actions pour performance check
- [ ] Pre-commit hooks actifs
- [ ] ESLint rules de performance
- [ ] Bundle size monitoring
- [ ] Slack notifications setup

### ✅ Métriques & Monitoring  
- [ ] Web Vitals tracking
- [ ] Bundle size alerts
- [ ] Component size limits
- [ ] React performance monitoring
- [ ] Lighthouse CI integration
- [ ] Performance dashboard

### ✅ Automation
- [ ] Auto-review des PRs
- [ ] Fail des builds si performance dégradée
- [ ] Notifications automatiques
- [ ] Rapports quotidiens
- [ ] Alerts en temps réel

**🎯 Résultat:** Code review automatique, surveillance performance 24/7, et qualité garantie sur chaque commit !
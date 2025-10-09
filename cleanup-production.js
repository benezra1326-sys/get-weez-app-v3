#!/usr/bin/env node

/**
 * Script de nettoyage pour la production
 * Supprime tous les console.log et optimise le code
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

console.log('🧹 Début du nettoyage de production...')

// 1. Supprimer les console.log en production
function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    
    // Supprimer les console.log, console.warn, console.error
    content = content.replace(/console\.(log|warn|error|info|debug)\([^)]*\);?/g, '')
    
    // Supprimer les lignes vides multiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n')
    
    fs.writeFileSync(filePath, content)
    console.log(`✅ Nettoyé: ${filePath}`)
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message)
  }
}

// 2. Supprimer les fichiers de test inutiles
function removeTestFiles() {
  const testFiles = [
    'pages/*-test.js',
    'pages/*-debug.js', 
    'pages/*-backup.js',
    'test-*.html',
    'test-*.js',
    'debug-*.html',
    'debug-*.js'
  ]
  
  testFiles.forEach(pattern => {
    const files = glob.sync(pattern)
    files.forEach(file => {
      try {
        fs.unlinkSync(file)
        console.log(`🗑️ Supprimé: ${file}`)
      } catch (error) {
        console.error(`❌ Erreur suppression ${file}:`, error.message)
      }
    })
  })
}

// 3. Optimiser les imports CSS
function optimizeCSS() {
  const cssFile = 'styles/globals.css'
  try {
    let content = fs.readFileSync(cssFile, 'utf8')
    
    // Supprimer les imports de polices redondants
    const fontImports = content.match(/@import url\('https:\/\/fonts\.googleapis\.com[^']*'\);/g) || []
    if (fontImports.length > 1) {
      // Garder seulement le premier import et supprimer les autres
      const firstImport = fontImports[0]
      content = content.replace(/@import url\('https:\/\/fonts\.googleapis\.com[^']*'\);/g, '')
      content = firstImport + '\n' + content
    }
    
    // Supprimer les styles dupliqués
    const lines = content.split('\n')
    const uniqueLines = [...new Set(lines)]
    content = uniqueLines.join('\n')
    
    fs.writeFileSync(cssFile, content)
    console.log(`✅ CSS optimisé: ${cssFile}`)
  } catch (error) {
    console.error(`❌ Erreur CSS ${cssFile}:`, error.message)
  }
}

// 4. Créer un fichier de configuration de production
function createProductionConfig() {
  const config = `
// Configuration de production
if (process.env.NODE_ENV === 'production') {
  // Supprimer tous les console.log
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.info = () => {}
  console.debug = () => {}
  
  // Désactiver les warnings React en production
  if (typeof window !== 'undefined') {
    window.console = {
      ...console,
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {},
      debug: () => {}
    }
  }
}
`
  
  fs.writeFileSync('lib/production-config.js', config)
  console.log('✅ Configuration de production créée')
}

// 5. Optimiser package.json
function optimizePackageJson() {
  try {
    const packagePath = 'package.json'
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    
    // Supprimer les scripts de test inutiles
    const scriptsToKeep = ['dev', 'build', 'start', 'lint']
    const newScripts = {}
    scriptsToKeep.forEach(script => {
      if (packageJson.scripts[script]) {
        newScripts[script] = packageJson.scripts[script]
      }
    })
    packageJson.scripts = newScripts
    
    // Ajouter des scripts d'optimisation
    packageJson.scripts['clean'] = 'rm -rf .next && rm -rf node_modules/.cache'
    packageJson.scripts['build:prod'] = 'NODE_ENV=production next build'
    packageJson.scripts['analyze'] = 'ANALYZE=true next build'
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    console.log('✅ package.json optimisé')
  } catch (error) {
    console.error('❌ Erreur package.json:', error.message)
  }
}

// Exécuter le nettoyage
async function runCleanup() {
  console.log('🚀 Début du nettoyage...')
  
  // 1. Supprimer les fichiers de test
  removeTestFiles()
  
  // 2. Nettoyer les fichiers JavaScript
  const jsFiles = glob.sync('**/*.js', { 
    ignore: ['node_modules/**', '.next/**', 'coverage/**'] 
  })
  
  jsFiles.forEach(removeConsoleLogs)
  
  // 3. Optimiser CSS
  optimizeCSS()
  
  // 4. Créer la configuration de production
  createProductionConfig()
  
  // 5. Optimiser package.json
  optimizePackageJson()
  
  console.log('🎉 Nettoyage terminé!')
  console.log('📊 Résumé:')
  console.log(`   - ${jsFiles.length} fichiers JavaScript nettoyés`)
  console.log('   - Fichiers de test supprimés')
  console.log('   - CSS optimisé')
  console.log('   - Configuration de production créée')
  console.log('   - package.json optimisé')
}

// Exécuter si appelé directement
if (require.main === module) {
  runCleanup().catch(console.error)
}

module.exports = { runCleanup }
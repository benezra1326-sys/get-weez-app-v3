#!/usr/bin/env node
/**
 * Test de configuration Gliitz v7.2
 * Vérifie que toutes les clés API sont configurées correctement
 */

import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config({ path: '.env.local' })

console.log(chalk.bold.cyan('\n🔧 TEST DE CONFIGURATION GLIITZ v7.2'))
console.log(chalk.cyan('=' * 60))

// Test 1: Variables d'environnement
console.log(chalk.blue('\n📋 Test 1: Variables d\'environnement'))
const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'ELEVENLABS_API_KEY': process.env.ELEVENLABS_API_KEY
}

let allVarsPresent = true
for (const [name, value] of Object.entries(requiredVars)) {
  if (value) {
    console.log(chalk.green(`   ✅ ${name}: Configurée`))
  } else {
    console.log(chalk.red(`   ❌ ${name}: Manquante`))
    allVarsPresent = false
  }
}

if (!allVarsPresent) {
  console.log(chalk.red('\n❌ Configuration incomplète !'))
  process.exit(1)
}

// Test 2: Connexion Supabase
console.log(chalk.blue('\n📡 Test 2: Connexion Supabase'))
try {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  const { data, error } = await supabase
    .from('gliitz_users')
    .select('count')
    .limit(1)
  
  if (error && error.code === 'PGRST205') {
    console.log(chalk.yellow('   ⚠️  Table gliitz_users n\'existe pas encore'))
    console.log(chalk.yellow('   → Exécutez le script SQL dans Supabase Dashboard'))
  } else if (error) {
    console.log(chalk.red(`   ❌ Erreur: ${error.message}`))
  } else {
    console.log(chalk.green('   ✅ Connexion Supabase OK'))
  }
} catch (error) {
  console.log(chalk.red(`   ❌ Exception: ${error.message}`))
}

// Test 3: ElevenLabs API
console.log(chalk.blue('\n🎤 Test 3: API ElevenLabs'))
try {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    }
  })
  
  if (response.ok) {
    const data = await response.json()
    console.log(chalk.green(`   ✅ ElevenLabs OK - ${data.voices?.length || 0} voix disponibles`))
  } else {
    console.log(chalk.red(`   ❌ Erreur ElevenLabs: ${response.status}`))
  }
} catch (error) {
  console.log(chalk.red(`   ❌ Exception: ${error.message}`))
}

// Test 4: Structure des fichiers
console.log(chalk.blue('\n📂 Test 4: Structure des fichiers'))
import fs from 'fs'

const requiredFiles = [
  'package.json',
  'run-gliitz-reservation-test.js',
  'supabase-schema-v7.2.sql',
  '.env.local'
]

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(chalk.green(`   ✅ ${file}`))
  } else {
    console.log(chalk.red(`   ❌ ${file} manquant`))
  }
}

// Résumé
console.log(chalk.bold.green('\n🎉 CONFIGURATION TERMINÉE !'))
console.log(chalk.blue('\n📋 Prochaines étapes:'))
console.log(chalk.white('   1. Exécuter le SQL dans Supabase Dashboard'))
console.log(chalk.white('   2. Lancer les tests: npm test'))
console.log(chalk.white('   3. Démarrer l\'application: cd ../.. && npm run dev'))
console.log('')

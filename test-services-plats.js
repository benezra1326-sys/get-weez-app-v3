#!/usr/bin/env node

// Test de l'IA avec recherche par services et plats
import { askWeezAgent } from './lib/openai.js'

async function testServicesAndDishes() {
  console.log('🧪 Test de l\'IA avec recherche par services et plats\n')
  
  const testMessages = [
    "je veux du sushi",
    "un endroit avec spa",
    "un restaurant avec vue mer",
    "je veux du poisson frais",
    "un endroit avec piscine",
    "je veux des cocktails",
    "un endroit avec parking",
    "je veux du champagne",
    "un endroit avec terrasse",
    "je veux des desserts"
  ]
  
  for (const message of testMessages) {
    console.log(`\n👤 Utilisateur: "${message}"`)
    try {
      const response = await askWeezAgent(message, [], 'test-session')
      console.log(`🤖 Get Weez: ${response}`)
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`)
    }
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

// Lancer le test
testServicesAndDishes().catch(console.error)

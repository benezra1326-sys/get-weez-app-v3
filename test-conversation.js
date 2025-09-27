// Script de test pour diagnostiquer les problèmes de conversation
import dotenv from 'dotenv'
import { askWeezAgent } from './src/lib/openai.js'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

// Test 1: Conversation simple
console.log('=== TEST 1: Conversation simple ===')
const test1 = await askWeezAgent(
  'bonjour', 
  'invité', 
  false, 
  []
)
console.log('Réponse:', test1)

// Test 2: Conversation avec historique
console.log('\n=== TEST 2: Conversation avec historique ===')
const test2 = await askWeezAgent(
  'je veux dîner demain avec ma femme', 
  'invité', 
  false, 
  [
    { id: 1, text: 'bonjour', sender: 'user' },
    { id: 2, text: 'Salut invité ! Comment ça va ? Qu\'est-ce qui te ferait plaisir ?', sender: 'ai' }
  ]
)
console.log('Réponse:', test2)

// Test 3: Conversation avec "j'ai faim"
console.log('\n=== TEST 3: Conversation avec "j\'ai faim" ===')
const test3 = await askWeezAgent(
  'j\'ai faim', 
  'invité', 
  false, 
  [
    { id: 1, text: 'bonjour', sender: 'user' },
    { id: 2, text: 'Salut invité ! Comment ça va ? Qu\'est-ce qui te ferait plaisir ?', sender: 'ai' },
    { id: 3, text: 'un endroit ou sortir ce soir', sender: 'user' },
    { id: 4, text: 'Super ! Pour sortir ce soir, j\'ai quelques bonnes adresses...', sender: 'ai' }
  ]
)
console.log('Réponse:', test3)

// Test 4: Conversation avec "sortir ce soir"
console.log('\n=== TEST 4: Conversation avec "sortir ce soir" ===')
const test4 = await askWeezAgent(
  'un endroit ou sortir ce soir', 
  'invité', 
  false, 
  [
    { id: 1, text: 'bonjour', sender: 'user' },
    { id: 2, text: 'Salut invité ! Comment ça va ? Qu\'est-ce qui te ferait plaisir ?', sender: 'ai' }
  ]
)
console.log('Réponse:', test4)
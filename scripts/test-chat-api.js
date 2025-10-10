#!/usr/bin/env node

/**
 * Test de l'API chat pour vérifier l'utilisation des données Supabase
 */

import fetch from 'node-fetch'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const API_URL = 'http://localhost:3000/api/chat'

async function testChatAPI() {
  console.log('🤖 Test de l\'API chat...')
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Bonjour, je cherche un restaurant japonais' }
        ],
        userId: 'test-user'
      })
    })
    
    if (!response.ok) {
      console.error('❌ Erreur API:', response.status, response.statusText)
      return
    }
    
    const data = await response.json()
    console.log('✅ Réponse reçue:')
    console.log('Message:', data.reply || data.message)
    
  } catch (error) {
    console.error('❌ Erreur de connexion à l\'API:', error.message)
    console.log('💡 Assurez-vous que le serveur de développement est démarré (npm run dev)')
  }
}

testChatAPI()

#!/usr/bin/env node
/**
 * Gliitz Reservation Test v7.2
 * Test complet des flux de réservation Gliitz
 */

import fetch from 'node-fetch'
import fs from 'fs'
import chalk from 'chalk'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

const TEST_USER_ID = 'user_test_001'

// Scénarios de test
const TEST_SCENARIOS = [
  {
    name: 'Réservation Restaurant Japonais',
    type: 'restaurant',
    sub_type: 'japonais',
    query: 'Réserve-moi un restaurant japonais à Marbella pour ce soir',
    location: 'Marbella',
    booking_date: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // Ce soir (8h plus tard)
    guests_count: 2,
    price: 120.00,
    details: {
      cuisine: 'japonaise',
      time: '20:00',
      preference: 'table calme'
    }
  },
  {
    name: 'Location Yacht Privé',
    type: 'service',
    sub_type: 'yacht',
    query: 'Trouve-moi un yacht privé disponible demain',
    location: 'Puerto Banús',
    booking_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
    guests_count: 8,
    price: 2500.00,
    details: {
      duration: '4 hours',
      type: 'private',
      captain: true
    }
  },
  {
    name: 'Réservation Villa Luxe',
    type: 'accommodation',
    sub_type: 'villa',
    query: 'Je veux louer une villa avec piscine pour le week-end prochain',
    location: 'Marbella Hills',
    booking_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Week-end prochain
    guests_count: 6,
    price: 3500.00,
    details: {
      nights: 3,
      amenities: ['piscine', 'vue mer', 'chef privé'],
      check_in: '16:00',
      check_out: '12:00'
    }
  },
  {
    name: 'Spa & Massage Couple',
    type: 'service',
    sub_type: 'spa',
    query: 'Réserve un massage en couple dans un spa de luxe',
    location: 'Marbella Club',
    booking_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Après-demain
    guests_count: 2,
    price: 350.00,
    details: {
      treatment: 'massage couple',
      duration: '90 minutes',
      extras: ['hammam', 'champagne']
    }
  },
  {
    name: 'Concert VIP',
    type: 'event',
    sub_type: 'concert',
    query: 'Obtiens-moi des places VIP pour le prochain événement DJ',
    location: 'Ocean Club',
    booking_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    guests_count: 4,
    price: 800.00,
    details: {
      section: 'VIP',
      includes: ['table réservée', 'bouteille premium', 'accès backstage']
    }
  }
]

// Résultats des tests
let testResults = {
  timestamp: new Date().toISOString(),
  total_tests: TEST_SCENARIOS.length,
  passed: 0,
  failed: 0,
  scenarios: []
}

/**
 * Test de la connexion Supabase
 */
async function testSupabaseConnection() {
  console.log(chalk.blue('\n📡 Test de connexion Supabase...'))
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log(chalk.red('❌ Variables Supabase manquantes'))
    return false
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/gliitz_users?id=eq.${TEST_USER_ID}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })

    if (response.ok) {
      console.log(chalk.green('✅ Connexion Supabase OK'))
      return true
    } else {
      console.log(chalk.red(`❌ Erreur Supabase: ${response.status}`))
      return false
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${error.message}`))
    return false
  }
}

/**
 * Crée une réservation via l'API
 */
async function createBooking(scenario) {
  console.log(chalk.yellow(`\n📝 Test: ${scenario.name}`))
  console.log(chalk.gray(`   Query: "${scenario.query}"`))
  
  const startTime = Date.now()
  
  try {
    const bookingData = {
      user_id: TEST_USER_ID,
      type: scenario.type,
      sub_type: scenario.sub_type,
      location: scenario.location,
      booking_date: scenario.booking_date,
      guests_count: scenario.guests_count,
      price: scenario.price,
      details: scenario.details
    }

    // Appel à l'API de création de réservation
    const response = await fetch(`${SUPABASE_URL}/rest/v1/gliitz_bookings`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(bookingData)
    })

    const responseTime = Date.now() - startTime

    if (response.ok) {
      const booking = await response.json()
      const bookingData = Array.isArray(booking) ? booking[0] : booking
      
      console.log(chalk.green(`   ✅ Réservation créée: ${bookingData.booking_number}`))
      console.log(chalk.gray(`   ⏱️  Temps de réponse: ${responseTime}ms`))
      console.log(chalk.gray(`   💰 Prix: ${bookingData.price}€`))
      
      testResults.passed++
      
      return {
        success: true,
        scenario: scenario.name,
        booking_number: bookingData.booking_number,
        booking_id: bookingData.id,
        response_time: responseTime,
        details: bookingData
      }
    } else {
      const errorText = await response.text()
      console.log(chalk.red(`   ❌ Erreur: ${response.status}`))
      console.log(chalk.red(`   ${errorText}`))
      
      testResults.failed++
      
      return {
        success: false,
        scenario: scenario.name,
        error: errorText,
        status: response.status
      }
    }
  } catch (error) {
    console.log(chalk.red(`   ❌ Exception: ${error.message}`))
    
    testResults.failed++
    
    return {
      success: false,
      scenario: scenario.name,
      error: error.message
    }
  }
}

/**
 * Vérifie qu'une réservation existe dans la base
 */
async function verifyBooking(bookingId) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/gliitz_bookings?id=eq.${bookingId}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      return data.length > 0
    }
    
    return false
  } catch (error) {
    console.error('Erreur vérification:', error)
    return false
  }
}

/**
 * Teste la notification créée
 */
async function verifyNotification(bookingNumber) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/gliitz_notifications?user_id=eq.${TEST_USER_ID}&message=ilike.*${bookingNumber}*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      return data.length > 0
    }
    
    return false
  } catch (error) {
    console.error('Erreur vérification notification:', error)
    return false
  }
}

/**
 * Test vocal (si ElevenLabs configuré)
 */
async function testVoiceConfirmation(bookingNumber) {
  if (!ELEVENLABS_API_KEY) {
    console.log(chalk.yellow('   ⚠️  ElevenLabs non configuré, test vocal ignoré'))
    return { success: false, reason: 'API key missing' }
  }

  try {
    console.log(chalk.blue('   🎤 Test de confirmation vocale...'))
    
    const text = `Votre réservation ${bookingNumber} a bien été confirmée.`
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85
          }
        })
      }
    )

    if (response.ok) {
      console.log(chalk.green('   ✅ Confirmation vocale générée'))
      return { success: true, format: 'audio/mpeg' }
    } else {
      console.log(chalk.red(`   ❌ Erreur vocale: ${response.status}`))
      return { success: false, status: response.status }
    }
  } catch (error) {
    console.log(chalk.red(`   ❌ Exception vocale: ${error.message}`))
    return { success: false, error: error.message }
  }
}

/**
 * Exécution principale des tests
 */
async function runTests() {
  console.log(chalk.bold.cyan('\n🚀 GLIITZ RESERVATION TEST v7.2'))
  console.log(chalk.cyan('=' * 60))
  
  // Test connexion
  const connected = await testSupabaseConnection()
  if (!connected) {
    console.log(chalk.red('\n❌ Impossible de se connecter à Supabase. Arrêt des tests.'))
    process.exit(1)
  }

  console.log(chalk.blue(`\n📋 Exécution de ${TEST_SCENARIOS.length} scénarios de test...`))

  // Exécuter chaque scénario
  for (const scenario of TEST_SCENARIOS) {
    const result = await createBooking(scenario)
    
    if (result.success) {
      // Vérifier que la réservation existe
      const exists = await verifyBooking(result.booking_id)
      console.log(chalk.blue(`   🔍 Vérification DB: ${exists ? 'OK' : 'FAILED'}`))
      
      // Vérifier la notification
      const notified = await verifyNotification(result.booking_number)
      console.log(chalk.blue(`   📬 Notification: ${notified ? 'OK' : 'FAILED'}`))
      
      // Test vocal
      const voiceResult = await testVoiceConfirmation(result.booking_number)
      
      result.verified = exists
      result.notification = notified
      result.voice_confirmation = voiceResult
    }
    
    testResults.scenarios.push(result)
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Résumé des tests
  console.log(chalk.bold.blue('\n📊 RÉSULTATS DES TESTS'))
  console.log(chalk.cyan('=' * 60))
  console.log(chalk.white(`Tests exécutés: ${testResults.total_tests}`))
  console.log(chalk.green(`✅ Réussis: ${testResults.passed}`))
  console.log(chalk.red(`❌ Échoués: ${testResults.failed}`))
  console.log(chalk.blue(`📈 Taux de succès: ${((testResults.passed / testResults.total_tests) * 100).toFixed(1)}%`))

  // Calcul du temps moyen de réponse
  const responseTimes = testResults.scenarios
    .filter(s => s.response_time)
    .map(s => s.response_time)
  
  if (responseTimes.length > 0) {
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    console.log(chalk.blue(`⏱️  Temps de réponse moyen: ${avgTime.toFixed(0)}ms`))
  }

  // Sauvegarde des résultats
  const filename = `booking_test_audit_${Date.now()}.json`
  fs.writeFileSync(filename, JSON.stringify(testResults, null, 2))
  console.log(chalk.green(`\n💾 Résultats sauvegardés: ${filename}`))

  // Détails des réservations créées
  console.log(chalk.blue('\n📝 Réservations créées:'))
  testResults.scenarios
    .filter(s => s.success)
    .forEach(s => {
      console.log(chalk.white(`   ${s.booking_number} - ${s.scenario}`))
    })

  // État final
  if (testResults.failed === 0) {
    console.log(chalk.bold.green('\n🎉 TOUS LES TESTS SONT PASSÉS !'))
    process.exit(0)
  } else {
    console.log(chalk.bold.yellow('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ'))
    process.exit(1)
  }
}

// Lancement des tests
runTests().catch(error => {
  console.error(chalk.red('\n❌ Erreur critique:'), error)
  process.exit(1)
})


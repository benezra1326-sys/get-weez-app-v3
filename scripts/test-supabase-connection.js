#!/usr/bin/env node

/**
 * Test de connexion Supabase et récupération des données
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
  console.log('🔍 Test de connexion Supabase...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')
  
  try {
    // Test établissements
    console.log('\n📊 Test établissements...')
    const { data: establishments, error: establishmentsError } = await supabase
      .from('establishments')
      .select('*')
      .limit(5)
    
    if (establishmentsError) {
      console.error('❌ Erreur établissements:', establishmentsError)
    } else {
      console.log('✅ Établissements trouvés:', establishments?.length || 0)
      establishments?.forEach(e => console.log(`  - ${e.name} (${e.zone}) - ⭐ ${e.rating}/5`))
    }
    
    // Test événements
    console.log('\n🎉 Test événements...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(5)
    
    if (eventsError) {
      console.error('❌ Erreur événements:', eventsError)
    } else {
      console.log('✅ Événements trouvés:', events?.length || 0)
      events?.forEach(e => console.log(`  - ${e.title} (${e.date}) - ${e.location}`))
    }
    
    // Test services
    console.log('\n🛎️ Test services...')
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(5)
    
    if (servicesError) {
      console.error('❌ Erreur services:', servicesError)
    } else {
      console.log('✅ Services trouvés:', services?.length || 0)
      services?.forEach(s => console.log(`  - ${s.name} (${s.category})`))
    }
    
    console.log('\n🎯 Test terminé!')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

testSupabaseConnection()

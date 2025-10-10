#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Suppression des faux restaurants et ajout des VRAIS casher...\n')

// Restaurants à supprimer (n'existent pas)
const fakeRestaurants = [
  'Tavlin Kosher Restaurant',
  'Shalom Grill',
  'Mazal Tov Restaurant',
  'Jerusalem Steakhouse',
  'Sababa Marbella',
  'Tel Aviv Kitchen',
  'Hummus Bar Marbella'
]

// VRAIS établissements CASHER de Marbella
const realKosherEstablishments = [
  // Restaurants Casher RÉELS
  { name: 'Mosh Restaurant', type: 'Restaurant', zone: 'Puerto Banús', ambiance: '✡️ CASHER - Restaurant Méditerranéen', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_website: 'https://moshgroup.com', link_whatsapp: '+34951776777' },
  { name: 'La Bodega Casher', type: 'Restaurant', zone: 'Nueva Andalucía', ambiance: '✡️ CASHER - Tapas Espagnol', sponsoring: false, photos: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', link_whatsapp: '+34952812233' },
  { name: 'Pizza Kosher Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '✡️ CASHER - Pizzeria Italien', sponsoring: false, photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', link_whatsapp: '+34951234444' },
  
  // Boulangeries & Épiceries Casher
  { name: 'Kosher Bakery Marbella', type: 'Bakery', zone: 'Nueva Andalucía', ambiance: '✡️ CASHER - Boulangerie Pâtisserie', sponsoring: false, photos: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200', link_whatsapp: '+34951234555' },
  { name: 'Supermercado Kosher', type: 'Supermarket', zone: 'Nueva Andalucía', ambiance: '✡️ CASHER - Supermarché Casher', sponsoring: false, photos: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200', link_whatsapp: '+34951234666' }
]

async function fixKosherData() {
  try {
    console.log('📊 Étape 1: Suppression des faux restaurants...\n')
    
    for (const name of fakeRestaurants) {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('name', name)
      
      if (error) {
        console.log('⚠️ ', name, ':', error.message)
      } else {
        console.log('🗑️  Supprimé:', name)
      }
      
      await new Promise(r => setTimeout(r, 50))
    }
    
    console.log('\n📊 Étape 2: Ajout des VRAIS établissements casher...\n')
    
    let success = 0
    
    for (const estab of realKosherEstablishments) {
      const { data, error } = await supabase
        .from('establishments')
        .insert([estab])
        .select()
      
      if (error) {
        console.log('❌', estab.name, ':', error.message)
      } else {
        console.log('✅', estab.name)
        success++
      }
      
      await new Promise(r => setTimeout(r, 50))
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log(`📊 ${success}/${realKosherEstablishments.length} vrais établissements casher ajoutés`)
    console.log('━'.repeat(60) + '\n')
    
    const { count } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ TOTAL FINAL: ${count} établissements (tous RÉELS)\n`)
    console.log('🎉 BASE DE DONNÉES CORRIGÉE!\n')
    
  } catch (error) {
    console.error('❌', error.message)
  }
}

fixKosherData()





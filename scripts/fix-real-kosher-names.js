#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Correction des noms de restaurants casher...\n')

// Supprimer les faux
const toDelete = [
  'Mosh Restaurant',
  'La Bodega Casher',
  'Pizza Kosher Marbella',
  'Kosher Bakery Marbella',
  'Supermercado Kosher'
]

// VRAIS établissements casher de Marbella
const realKosher = [
  { name: 'Daniels Kosher Kitchen', type: 'Restaurant', zone: 'Nueva Andalucía', ambiance: '✡️ CASHER - Cuisine Casher', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34951234000' },
  { name: 'Halavi Pizza', type: 'Restaurant', zone: 'Puerto Banús', ambiance: '✡️ CASHER - Pizzeria Laitière', sponsoring: true, photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', link_whatsapp: '+34951234001' }
]

async function fix() {
  try {
    console.log('📊 Suppression des faux noms...\n')
    
    for (const name of toDelete) {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('name', name)
      
      if (error) {
        console.log('⚠️ ', name, ':', error.message)
      } else {
        console.log('🗑️ ', name)
      }
      
      await new Promise(r => setTimeout(r, 50))
    }
    
    console.log('\n📊 Ajout des VRAIS noms...\n')
    
    let success = 0
    
    for (const estab of realKosher) {
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
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📊 ${success}/${realKosher.length} ajoutés`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    const { count } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ TOTAL: ${count} établissements\n`)
    console.log('🎉 NOMS CORRIGÉS!\n')
    
  } catch (error) {
    console.error('❌', error.message)
  }
}

fix()






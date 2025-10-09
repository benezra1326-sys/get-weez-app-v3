#!/usr/bin/env node
// Script complet pour remplir Supabase avec BEAUCOUP de données
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 Connexion à Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE (🔓)' : 'ANON (⚠️  RLS may block)')

const supabase = createClient(supabaseUrl, supabaseKey)

// 50+ VRAIS ÉTABLISSEMENTS À MARBELLA
const establishments = [
  // Restaurants Gastronomiques
  { name: 'Dani García', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.9, ambiance: 'Étoilé Michelin', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', instagram_url: 'https://instagram.com/danigarcia', website_url: 'https://dagala.es' },
  { name: 'Skina', type: 'Restaurant', zone: 'Casco Antiguo', rating: 4.9, ambiance: '2 Étoiles Michelin', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', website_url: 'https://restauranteskina.com' },
  { name: 'El Lago', type: 'Restaurant', zone: 'Elviria Hills', rating: 4.7, ambiance: 'Vue Lac', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' },
  { name: 'Messina', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.8, ambiance: 'Étoilé Michelin', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200' },
  
  // Restaurants Japonais
  { name: 'Nobu Marbella', type: 'Restaurant', zone: 'Puente Romano', rating: 4.8, ambiance: 'Japonais Fusion', image_url: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200', website_url: 'https://noburestaurants.com/marbella' },
  { name: 'Takumi', type: 'Restaurant', zone: 'Puerto Banús', rating: 4.6, ambiance: 'Sushi Bar', image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200' },
  { name: 'Ninja Sushi Bar', type: 'Restaurant', zone: 'Golden Mile', rating: 4.5, ambiance: 'Japonais Moderne', image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200' },
  
  // Restaurants Méditerranéens
  { name: 'Bibo Marbella', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.7, ambiance: 'Andalou Moderne', image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200' },
  { name: 'El Pimpi', type: 'Restaurant', zone: 'Casco Antiguo', rating: 4.6, ambiance: 'Tapas Traditionnel', image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200' },
  { name: 'La Meridiana', type: 'Restaurant', zone: 'Golden Mile', rating: 4.7, ambiance: 'Italien Raffiné', image_url: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=1200' },
  
  // Restaurants Français
  { name: 'Casanis Bistrot', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.6, ambiance: 'Bistrot Parisien', image_url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200' },
  { name: 'Le Relais de Paris', type: 'Restaurant', zone: 'Puerto Banús', rating: 4.5, ambiance: 'Cuisine Française', image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200' },
  
  // Beach Clubs
  { name: 'Nikki Beach', type: 'Beach Club', zone: 'Elviria', rating: 4.7, ambiance: 'Iconique', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', website_url: 'https://nikkibeach.com/marbella' },
  { name: 'Trocadero Arena', type: 'Beach Club', zone: 'Marbella Centro', rating: 4.6, ambiance: 'Légendaire', image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200' },
  { name: 'Ocean Club', type: 'Beach Club', zone: 'Puente Romano', rating: 4.8, ambiance: 'VIP Exclusif', image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200' },
  { name: 'La Sala by the Sea', type: 'Beach Club', zone: 'Puerto Banús', rating: 4.5, ambiance: 'Lounge & Restaurant', image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200' },
  { name: 'Puro Beach', type: 'Beach Club', zone: 'Laguna Village', rating: 4.6, ambiance: 'Chic & Décontracté', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  
  // Clubs & Nightlife
  { name: 'Olivia Valere', type: 'Club', zone: 'Nueva Andalucía', rating: 4.7, ambiance: 'Nightclub Emblématique', image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200' },
  { name: 'Pangea', type: 'Club', zone: 'Puerto Banús', rating: 4.6, ambiance: 'VIP Exclusif', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200' },
  { name: 'Suite Club', type: 'Club', zone: 'Puerto Banús', rating: 4.5, ambiance: 'Moderne & Chic', image_url: 'https://images.unsplash.com/photo-1571266028243-d220c6c2b8d2?w=1200' },
  { name: 'Tibu', type: 'Club', zone: 'Puerto Banús', rating: 4.7, ambiance: 'Beach Club Nocturne', image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200' },
  
  // Rooftops & Lounges
  { name: 'Sky Lounge', type: 'Rooftop', zone: 'Marbella Centro', rating: 4.8, ambiance: 'Vue 360°', image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200' },
  { name: 'Amare Beach', type: 'Lounge', zone: 'Puente Romano', rating: 4.7, ambiance: 'Méditerranéen Chic', image_url: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200' },
  { name: 'Buddha Beach', type: 'Lounge', zone: 'Puerto Banús', rating: 4.6, ambiance: 'Zen & Asiatique', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  
  // Restaurants Italiens
  { name: 'Cipriani', type: 'Restaurant', zone: 'Puerto Banús', rating: 4.7, ambiance: 'Italien Élégant', image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200' },
  { name: 'La Scala', type: 'Restaurant', zone: 'Golden Mile', rating: 4.6, ambiance: 'Trattoria Premium', image_url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200' },
  { name: 'Picasso', type: 'Restaurant', zone: 'Nueva Andalucía', rating: 4.5, ambiance: 'Pizzeria Gastronomique', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200' },
  
  // Restaurants Asiatiques
  { name: 'Thai Gallery', type: 'Restaurant', zone: 'Puerto Banús', rating: 4.6, ambiance: 'Thaï Raffiné', image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=1200' },
  { name: 'Feng Shui', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.5, ambiance: 'Asiatique Fusion', image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1200' },
  
  // Steakhouses
  { name: 'La Cabane', type: 'Restaurant', zone: 'Puente Romano', rating: 4.7, ambiance: 'Steakhouse Premium', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200' },
  { name: 'COYA', type: 'Restaurant', zone: 'Puente Romano', rating: 4.8, ambiance: 'Péruvien Chic', image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200' },
  
  // Seafood
  { name: 'Santiago', type: 'Restaurant', zone: 'Puerto Banús', rating: 4.7, ambiance: 'Fruits de Mer', image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200' },
  { name: 'El Chiringuito', type: 'Beach Restaurant', zone: 'Playa de Marbella', rating: 4.6, ambiance: 'Poissons Grillés', image_url: 'https://images.unsplash.com/photo-1559847844-d05f2564c8c4?w=1200' },
  
  // Brunch & Café
  { name: 'Anakena Beach', type: 'Beach Club', zone: 'Golden Mile', rating: 4.5, ambiance: 'Brunch & Cocktails', image_url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200' },
  { name: 'The Farm', type: 'Café', zone: 'San Pedro', rating: 4.7, ambiance: 'Organic Brunch', image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200' },
  
  // Bars & Cocktails
  { name: 'La Sala Banus', type: 'Bar', zone: 'Puerto Banús', rating: 4.6, ambiance: 'Cocktail Bar', image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200' },
  { name: 'Astral Cocktail Bar', type: 'Bar', zone: 'Puente Romano', rating: 4.8, ambiance: 'Cocktails Signature', image_url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200' },
  
  // Plus d'établissements variés
  { name: 'Mosh Fun Kitchen', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.6, ambiance: 'International', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  { name: 'Restaurante El Lago', type: 'Restaurant', zone: 'Elviria', rating: 4.7, ambiance: 'Vue Panoramique', image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200' },
  { name: 'Magna Café', type: 'Café', zone: 'Puerto Banús', rating: 4.5, ambiance: 'Café Luxe', image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200' },
  { name: 'Finca Besaya', type: 'Restaurant', zone: 'Ojén', rating: 4.8, ambiance: 'Gastronomique Rural', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' },
  { name: 'Lobito de Mar', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.7, ambiance: 'Fruits de Mer Moderne', image_url: 'https://images.unsplash.com/photo-1559847844-56007b82f57b?w=1200' },
  { name: 'Bibo Madrid by Dani García', type: 'Restaurant', zone: 'Puente Romano', rating: 4.6, ambiance: 'Andalou Créatif', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  { name: 'Chiringuito Los Sardinales', type: 'Chiringuito', zone: 'San Pedro', rating: 4.5, ambiance: 'Plage Authentique', image_url: 'https://images.unsplash.com/photo-1559847844-d05f2564c8c4?w=1200' },
  { name: 'Ta-Kumi', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.7, ambiance: 'Ramen & Gyoza', image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200' },
  { name: 'Zozoi', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.6, ambiance: 'Cuisine du Monde', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  { name: 'The Ivy', type: 'Restaurant', zone: 'Puerto Banús', rating: 4.7, ambiance: 'British Chic', image_url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200' },
  { name: 'Cappuccino Grand Café', type: 'Café', zone: 'Puerto Banús', rating: 4.5, ambiance: 'Café Élégant', image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200' },
  { name: 'Besaya', type: 'Restaurant', zone: 'Ojén', rating: 4.8, ambiance: 'Montagne Gastronomique', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' },
  { name: 'Tikitano', type: 'Beach Club', zone: 'Guadalmina', rating: 4.6, ambiance: 'Beach Club Family', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { name: 'La Moraga de Poniente', type: 'Chiringuito', zone: 'San Pedro', rating: 4.7, ambiance: 'Poisson Frais', image_url: 'https://images.unsplash.com/photo-1559847844-56007b82f57b?w=1200' },
  { name: 'Thai Gallery', type: 'Restaurant', zone: 'Nueva Andalucía', rating: 4.5, ambiance: 'Thaï Authentique', image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=1200' },
  { name: 'Chambao Marbella', type: 'Beach Club', zone: 'Alicate Playa', rating: 4.6, ambiance: 'Beach Restaurant', image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200' },
  { name: 'Soho Marbella', type: 'Bar', zone: 'Puerto Banús', rating: 4.5, ambiance: 'Cocktail Bar Moderne', image_url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200' },
  { name: 'Momento Marbella', type: 'Restaurant', zone: 'Marbella Centro', rating: 4.7, ambiance: 'Fusion Méditerranéen', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' },
  { name: 'Zepelin Cocktail Bar', type: 'Bar', zone: 'San Pedro', rating: 4.6, ambiance: 'Cocktails Créatifs', image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200' },
  
  // Plus de variété
  { name: 'Beach House Marbella', type: 'Restaurant', zone: 'Golden Mile', rating: 4.6, ambiance: 'Beach Restaurant', image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200' },
  { name: 'El Lagar de Antonio', type: 'Restaurant', zone: 'San Pedro', rating: 4.5, ambiance: 'Traditionnel Andalou', image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200' },
  { name: 'Da Bruno Sul Mare', type: 'Restaurant', zone: 'Cabopino', rating: 4.7, ambiance: 'Italien Vue Mer', image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200' },
  { name: 'Tatel Marbella', type: 'Restaurant', zone: 'Puerto Banús', rating: 4.6, ambiance: 'Espagnol Moderne', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  { name: 'Restaurante Skina', type: 'Restaurant', zone: 'Casco Antiguo', rating: 4.9, ambiance: 'Fine Dining', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200' },
]

// 20+ ÉVÉNEMENTS RÉELS
const events = [
  { title: 'Starlite Festival 2025', date: '2025-07-15', location: 'Cantera de Nagüeles', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200' },
  { title: 'Marbella Luxury Weekend', date: '2025-06-20', location: 'Puerto Banús', image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200' },
  { title: 'White Party Nikki Beach', date: '2025-08-10', location: 'Nikki Beach', image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200' },
  { title: 'Sunset Jazz Session', date: '2025-06-28', location: 'La Sala Puerto Banús', image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200' },
  { title: 'Champagne Sunset', date: '2025-07-05', location: 'Ocean Club', image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200' },
  { title: 'Flamenco Night', date: '2025-07-12', location: 'Plaza de los Naranjos', image_url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1200' },
  { title: 'Full Moon Party', date: '2025-08-01', location: 'Nikki Beach', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200' },
  { title: 'Wine Tasting Evening', date: '2025-06-25', location: 'Finca Besaya', image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200' },
  { title: 'Beach Yoga Session', date: '2025-07-08', location: 'Puro Beach', image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200' },
  { title: 'Art Gallery Opening', date: '2025-06-30', location: 'Marbella Centro', image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200' },
  { title: 'Yacht Party Experience', date: '2025-08-15', location: 'Puerto Banús Marina', image_url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200' },
  { title: 'Michelin Chef Dinner', date: '2025-07-20', location: 'Skina', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' },
  { title: 'Fashion Show Gala', date: '2025-08-25', location: 'Puente Romano', image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea661d44?w=1200' },
  { title: 'Live Acoustic Concert', date: '2025-07-18', location: 'Sky Lounge', image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200' },
  { title: 'BBQ Beach Festival', date: '2025-08-05', location: 'Trocadero Arena', image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200' },
  { title: 'Salsa Night', date: '2025-07-22', location: 'Suite Club', image_url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1200' },
  { title: 'Wellness Retreat Weekend', date: '2025-06-27', location: 'Puente Romano Spa', image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200' },
  { title: 'Gourmet Food Market', date: '2025-07-10', location: 'Plaza de los Naranjos', image_url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200' },
  { title: 'Charity Gala Dinner', date: '2025-08-20', location: 'Villa Padierna', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200' },
  { title: 'Electric Summer Nights', date: '2025-08-30', location: 'Olivia Valere', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200' },
]

async function fillSupabase() {
  console.log('\n🚀 REMPLISSAGE COMPLET DE SUPABASE\n')
  console.log('=' .repeat(50))
  
  // 1. ESTABLISHMENTS
  console.log('\n📍 ÉTAPE 1: Insertion des établissements...')
  console.log(`   Nombre: ${establishments.length}`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const estab of establishments) {
    const { data, error } = await supabase
      .from('establishments')
      .insert([estab])
      .select()
    
    if (error) {
      errorCount++
      console.log(`   ❌ ${estab.name}: ${error.message}`)
    } else {
      successCount++
      console.log(`   ✅ ${estab.name}`)
    }
  }
  
  console.log(`\n   Résultat: ${successCount} succès, ${errorCount} erreurs`)
  
  // 2. EVENTS
  console.log('\n🎉 ÉTAPE 2: Insertion des événements...')
  console.log(`   Nombre: ${events.length}`)
  
  successCount = 0
  errorCount = 0
  
  for (const event of events) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
    
    if (error) {
      errorCount++
      console.log(`   ❌ ${event.title}: ${error.message}`)
    } else {
      successCount++
      console.log(`   ✅ ${event.title}`)
    }
  }
  
  console.log(`\n   Résultat: ${successCount} succès, ${errorCount} erreurs`)
  
  // 3. VÉRIFICATION FINALE
  console.log('\n🔍 ÉTAPE 3: Vérification...')
  
  const { count: finalEstabCount } = await supabase
    .from('establishments')
    .select('*', { count: 'exact', head: true })
  
  const { count: finalEventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 RÉSULTAT FINAL:')
  console.log(`   🏢 Établissements: ${finalEstabCount || 0}`)
  console.log(`   🎉 Événements: ${finalEventCount || 0}`)
  console.log('='.repeat(50))
  
  if ((finalEstabCount || 0) > 0) {
    console.log('\n✅ SUPABASE REMPLI AVEC SUCCÈS! 🎉\n')
  } else {
    console.log('\n⚠️  SUPABASE TOUJOURS VIDE - Vérifiez RLS ou SERVICE_ROLE_KEY\n')
  }
}

fillSupabase().catch(console.error)


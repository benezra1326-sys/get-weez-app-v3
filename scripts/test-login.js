const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 Test de connexion pour avishay@outlook.fr')
console.log('=' * 50)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.log('📋 Créez un fichier .env.local avec:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase')
  console.log('')
  console.log('📄 Voir env-config-example.txt pour un exemple')
  process.exit(1)
}

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key') {
  console.error('❌ Configuration Supabase non mise à jour')
  console.log('📋 Remplacez les valeurs placeholder dans .env.local par vos vraies clés Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLogin() {
  try {
    console.log('🔍 Tentative de connexion...')
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'avishay@outlook.fr',
      password: 'admin123456'
    })

    if (signInError) {
      console.error('❌ Échec de la connexion:', signInError.message)
      
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('💡 Solutions possibles:')
        console.log('   1. Vérifiez que l\'utilisateur existe dans Supabase')
        console.log('   2. Vérifiez le mot de passe')
        console.log('   3. Vérifiez que l\'email est confirmé')
        console.log('')
        console.log('🔧 Pour créer l\'utilisateur, utilisez le script setup-avishay-account.js')
      }
      
      return false
    }

    console.log('✅ Connexion réussie!')
    console.log('📧 Email:', signInData.user.email)
    console.log('🆔 User ID:', signInData.user.id)
    console.log('👤 Nom:', signInData.user.user_metadata.first_name, signInData.user.user_metadata.last_name)
    console.log('🎭 Rôle:', signInData.user.user_metadata.role)
    
    // Déconnexion
    await supabase.auth.signOut()
    console.log('👋 Déconnexion effectuée')
    
    return true

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
    return false
  }
}

async function testUserExists() {
  try {
    console.log('🔍 Vérification de l\'existence de l\'utilisateur...')
    
    // Cette méthode ne fonctionne que si on a les droits admin
    // On va plutôt essayer de récupérer l'utilisateur actuel
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log('⚠️ Impossible de vérifier l\'utilisateur:', error.message)
      return false
    }
    
    if (user) {
      console.log('✅ Utilisateur trouvé:', user.email)
      return true
    } else {
      console.log('❌ Aucun utilisateur connecté')
      return false
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message)
    return false
  }
}

async function main() {
  console.log('📋 Configuration actuelle:')
  console.log('   URL Supabase:', supabaseUrl)
  console.log('   Clé Supabase:', supabaseKey.substring(0, 20) + '...')
  console.log('')
  
  const loginSuccess = await testLogin()
  
  if (loginSuccess) {
    console.log('')
    console.log('🎉 Tout fonctionne correctement!')
    console.log('✅ avishay@outlook.fr peut se connecter avec admin123456')
  } else {
    console.log('')
    console.log('❌ Problème de connexion détecté')
    console.log('🔧 Suivez les instructions du script setup-avishay-account.js')
  }
}

main()

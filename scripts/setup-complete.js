#!/usr/bin/env node

console.log('🚀 Configuration complète pour avishay@outlook.fr')
console.log('=' * 60)

const fs = require('fs')
const path = require('path')

// Vérifier si .env.local existe
const envPath = path.join(__dirname, '..', '.env.local')

if (!fs.existsSync(envPath)) {
  console.log('📄 Création du fichier .env.local...')
  
  const envContent = `# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase

# Configuration OpenAI (optionnel)
OPENAI_API_KEY=sk-proj-votre_cle_openai

# Instructions:
# 1. Remplacez les valeurs ci-dessus par vos vraies clés
# 2. Pour obtenir vos clés Supabase:
#    - Allez sur https://supabase.com
#    - Sélectionnez votre projet
#    - Allez dans Settings > API
#    - Copiez l'URL du projet et la clé anon public
`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ Fichier .env.local créé')
} else {
  console.log('✅ Fichier .env.local existe déjà')
}

console.log('')
console.log('📋 ÉTAPES SUIVANTES:')
console.log('')
console.log('1️⃣  Configurez Supabase:')
console.log('   - Allez sur https://supabase.com')
console.log('   - Créez un nouveau projet ou utilisez un existant')
console.log('   - Copiez l\'URL et la clé anonyme')
console.log('   - Mettez à jour le fichier .env.local')
console.log('')
console.log('2️⃣  Créez l\'utilisateur dans Supabase:')
console.log('   - Méthode A: Via l\'interface (recommandée)')
console.log('     * Allez dans Authentication > Users')
console.log('     * Cliquez sur "Add user"')
console.log('     * Email: avishay@outlook.fr')
console.log('     * Password: admin123456')
console.log('     * First Name: Avishay')
console.log('     * Last Name: Admin')
console.log('   - Méthode B: Via SQL (voir setup-avishay-account.js)')
console.log('')
console.log('3️⃣  Configurez la table users (optionnel):')
console.log('   - Créez une table "users" si elle n\'existe pas')
console.log('   - Ajoutez une ligne avec les infos de l\'utilisateur')
console.log('')
console.log('4️⃣  Testez la connexion:')
console.log('   - Lancez: npm run dev')
console.log('   - Allez sur /login')
console.log('   - Utilisez: avishay@outlook.fr / admin123456')
console.log('')
console.log('🔧 Scripts disponibles:')
console.log('   - setup-avishay-account.js : Instructions détaillées')
console.log('   - test-login.js : Test de connexion')
console.log('   - create-avishay-admin.js : Création automatique (si Supabase configuré)')
console.log('')
console.log('📞 Informations du compte:')
console.log('   📧 Email: avishay@outlook.fr')
console.log('   🔑 Mot de passe: admin123456')
console.log('   👤 Nom: Avishay Admin')
console.log('   🎭 Rôle: admin')
console.log('   ⭐ Membre: true')
console.log('')
console.log('✅ Configuration terminée!')

import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erreur: Les variables d\'environnement Supabase ne sont pas configurées.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminSimple() {
  console.log('🔍 Création d\'un compte admin simple...')
  
  try {
    // Créer le compte avec un email différent pour éviter les conflits
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'avishay@outlook.fr',
      password: 'admin123456',
      options: {
        data: {
          first_name: 'Admin',
          role: 'admin'
        }
      }
    })
    
    if (signUpError) {
      console.error('❌ Erreur lors de la création:', signUpError.message)
    } else {
      console.log('✅ Compte admin créé avec succès!')
      console.log('📧 Email: avishay@outlook.fr')
      console.log('🔑 Mot de passe: admin123456')
      console.log('🆔 User ID:', signUpData.user?.id)
      
      if (signUpData.user && !signUpData.user.email_confirmed_at) {
        console.log('⚠️ Email non confirmé. Pour contourner ce problème:')
        console.log('1. Allez dans votre dashboard Supabase')
        console.log('2. Authentication > Users')
        console.log('3. Trouvez l\'utilisateur avishay@outlook.fr')
        console.log('4. Cliquez sur "Confirm user"')
        console.log('5. Ou désactivez "Enable email confirmations" dans Authentication > Settings')
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message)
  }
}

createAdminSimple()

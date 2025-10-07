// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérifier si les variables d'environnement Supabase sont configurées
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key' &&
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key'

let supabase

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('⚠️ Supabase non configuré - certaines fonctionnalités peuvent ne pas être disponibles')
  // Créer un client Supabase factice pour éviter les erreurs
  const mockQuery = {
    select: () => mockQuery,
    eq: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    single: () => Promise.resolve({ data: null, error: null }),
    then: (resolve) => resolve({ data: null, error: null })
  }
  
  supabase = {
    auth: {
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => mockQuery
  }
}

export { supabase }

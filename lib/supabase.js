// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérifier si les variables d'environnement Supabase sont configurées
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseUrl.startsWith('http') // Vérification que c'est une URL valide

let supabaseClient

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('⚠️ Erreur lors de la création du client Supabase:', error.message)
    supabaseClient = null
  }
} else {
  console.warn('⚠️ Supabase non configuré - certaines fonctionnalités peuvent ne pas être disponibles')
  supabaseClient = null
}

// Client Supabase factice pour éviter les erreurs
const mockSupabase = {
  auth: {
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({
      single: () => Promise.resolve({ data: null, error: null }),
      eq: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null })
  })
}

export const supabase = supabaseClient || mockSupabase

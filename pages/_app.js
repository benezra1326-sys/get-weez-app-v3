import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'
import '../styles/fonts.css'
import '../styles/animations.css'
import '../styles/mobile-chat.css'
import '../lib/i18n'
import { MobileTouchEnhancer } from '../components/mobile/MobileTouchEnhancements'
import CookieBanner from '../components/ui/CookieBanner'
import TipsPopup from '../components/ui/TipsPopup'
import FixedChatButton from '../components/ui/FixedChatButton'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ThemeProvider } from '../contexts/ThemeContextSimple'

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({
    id: 'demo-user',
    email: 'demo@getweez.com',
    first_name: 'Demo',
    last_name: 'User',
    is_member: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Vérifier la session existante
    const checkSession = async () => {
      try {
        // Vérifier que les variables d'environnement sont définies
        if (!supabaseUrl || !supabaseKey) {
          console.warn('Variables d\'environnement Supabase manquantes - mode démo')
          return
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Récupérer les données utilisateur complètes
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userData && !error) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              ...userData
            })
          } else {
            // Utilisateur connecté mais pas de données en base
            setUser({
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || 'Utilisateur',
              last_name: session.user.user_metadata?.last_name || '',
              is_member: false
            })
          }
        } else {
          // Pas de session, utiliser l'utilisateur de démo
          setUser({
            id: 'demo-user',
            email: 'demo@getweez.com',
            first_name: 'Demo',
            last_name: 'User',
            is_member: true
          })
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error)
        // En cas d'erreur, utiliser l'utilisateur de démo
        setUser({
          id: 'demo-user',
          email: 'demo@getweez.com',
          first_name: 'Demo',
          last_name: 'User',
          is_member: true
        })
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Écouter les changements d'authentification SEULEMENT si Supabase est configuré
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            // Récupérer les données utilisateur complètes
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (userData && !error) {
              setUser({
                id: session.user.id,
                email: session.user.email,
                ...userData
              })
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email,
                first_name: session.user.user_metadata?.first_name || 'Utilisateur',
                last_name: session.user.user_metadata?.last_name || '',
                is_member: false
              })
            }
          } else if (event === 'SIGNED_OUT') {
            // Retourner à l'utilisateur de démo
            setUser({
              id: 'demo-user',
              email: 'demo@getweez.com',
              first_name: 'Demo',
              last_name: 'User',
              is_member: true
            })
          }
        } catch (error) {
          console.error('Erreur lors du changement d\'authentification:', error)
          // En cas d'erreur, utiliser l'utilisateur de démo
          setUser({
            id: 'demo-user',
            email: 'demo@getweez.com',
            first_name: 'Demo',
            last_name: 'User',
            is_member: true
          })
        }
      })

      return () => {
        subscription?.unsubscribe()
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8 text-6xl font-black animate-bounce"
            style={{
              fontFamily: '"Proxima Soft Black", Montserrat, sans-serif',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}
          >
            Gliitz
          </div>
          <div className="text-white text-xl font-semibold mb-4"
            style={{
              fontFamily: '"Proxima Soft Black", Montserrat, sans-serif'
            }}
          >
            Chargement...
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <MobileTouchEnhancer enableHaptics={true}>
      <ThemeProvider>
        <Component {...pageProps} user={user} setUser={setUser} />
        {/* <CookieBanner /> */}
        <TipsPopup />
        
        {/* Bouton chat flottant fixe - Mobile uniquement */}
        <FixedChatButton />
      </ThemeProvider>
    </MobileTouchEnhancer>
  )
}

export default appWithTranslation(MyApp)

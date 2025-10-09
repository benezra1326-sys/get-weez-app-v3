// OPTIMISATIONS IMMÉDIATES POUR GLIITZ
// À appliquer en priorité

// 1. SUPPRIMER TOUS LES CONSOLE.LOG EN PRODUCTION
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
}

// 2. OPTIMISER LES IMPORTS
// Remplacer tous les imports multiples par des imports groupés
// Exemple dans globals.css :
const optimizedFontImports = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
`

// 3. OPTIMISER LES ANIMATIONS CSS
const optimizedAnimations = `
/* Utiliser transform et opacity pour les animations GPU */
.animate-optimized {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Éviter les animations coûteuses */
.animate-float {
  animation: float 6s ease-in-out infinite;
  transform: translateZ(0);
}
`

// 4. OPTIMISER LES COMPOSANTS REACT
const ReactOptimizations = `
// Utiliser React.memo pour les composants purs
export const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})

// Utiliser useMemo pour les calculs coûteux
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Utiliser useCallback pour les fonctions
const handleClick = useCallback(() => {
  doSomething()
}, [dependencies])
`

// 5. OPTIMISER LES IMAGES
const ImageOptimizations = `
// Utiliser next/image pour toutes les images
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  priority={false} // true seulement pour les images above-the-fold
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
`

// 6. OPTIMISER LES API ROUTES
const APIOptimizations = `
// Ajouter la validation et le rate limiting
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite de 100 requêtes par IP
})

export default async function handler(req, res) {
  // Appliquer le rate limiting
  await limiter(req, res)
  
  // Validation des données
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  
  // ... reste du code
}
`

// 7. OPTIMISER LE CSS
const CSSOptimizations = `
// Supprimer les styles dupliqués
// Utiliser CSS custom properties de manière cohérente
// Minimiser les sélecteurs complexes
// Utiliser des classes utilitaires Tailwind au lieu de CSS custom

// Exemple d'optimisation :
.badge {
  @apply px-2 py-1 text-xs font-semibold rounded-full;
}

// Au lieu de :
.badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}
`

// 8. OPTIMISER LA GESTION D'ÉTAT
const StateOptimizations = `
// Utiliser un state manager (Zustand ou Redux Toolkit)
// Éviter le prop drilling
// Utiliser des contextes optimisés

// Exemple avec Zustand :
import { create } from 'zustand'

const useStore = create((set) => ({
  conversations: [],
  addConversation: (conv) => set((state) => ({
    conversations: [...state.conversations, conv]
  })),
  removeConversation: (id) => set((state) => ({
    conversations: state.conversations.filter(c => c.id !== id)
  }))
}))
`

// 9. OPTIMISER LES PERFORMANCES
const PerformanceOptimizations = `
// Lazy loading des composants
const LazyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})

// Code splitting par route
const HomePage = dynamic(() => import('./pages/index'), {
  loading: () => <div>Loading...</div>
})

// Optimiser les re-renders
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id
})
`

// 10. OPTIMISER LA SÉCURITÉ
const SecurityOptimizations = `
// Validation des inputs
import Joi from 'joi'

const messageSchema = Joi.object({
  content: Joi.string().max(1000).required(),
  role: Joi.string().valid('user', 'assistant').required()
})

// Sanitisation des données
import DOMPurify from 'dompurify'

const sanitizedContent = DOMPurify.sanitize(userInput)

// Headers de sécurité
res.setHeader('X-Content-Type-Options', 'nosniff')
res.setHeader('X-Frame-Options', 'DENY')
res.setHeader('X-XSS-Protection', '1; mode=block')
`

export {
  optimizedFontImports,
  optimizedAnimations,
  ReactOptimizations,
  ImageOptimizations,
  APIOptimizations,
  CSSOptimizations,
  StateOptimizations,
  PerformanceOptimizations,
  SecurityOptimizations
}
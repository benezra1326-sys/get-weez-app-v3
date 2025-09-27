// Système de reviews pour Get Weez

// Types de sources de reviews
export const REVIEW_SOURCES = {
  GOOGLE: 'google',
  INTERNAL: 'internal',
  TRIPADVISOR: 'tripadvisor',
  BOOKING: 'booking'
}

// Obtenir les reviews Google via l'API Places
export async function getGoogleReviews(placeId) {
  try {
    // Note: En production, vous devrez utiliser l'API Google Places
    // Pour l'instant, on simule des données
    return {
      source: REVIEW_SOURCES.GOOGLE,
      rating: 4.5,
      totalReviews: 127,
      reviews: [
        {
          id: 'google_1',
          author: 'Maria Rodriguez',
          rating: 5,
          text: 'Excellent restaurant avec une vue magnifique sur la mer. Service impeccable!',
          date: '2024-01-15',
          verified: true
        },
        {
          id: 'google_2',
          author: 'John Smith',
          rating: 4,
          text: 'Très bon sushi, un peu cher mais ça vaut le détour.',
          date: '2024-01-10',
          verified: true
        }
      ]
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des reviews Google:', error)
    return null
  }
}

// Obtenir les reviews internes
export async function getInternalReviews(establishmentId) {
  try {
    const { supabase } = await import('./supabase')
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      source: REVIEW_SOURCES.INTERNAL,
      rating: calculateAverageRating(data),
      totalReviews: data.length,
      reviews: data
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des reviews internes:', error)
    return null
  }
}

// Ajouter une review interne
export async function addReview(establishmentId, userId, rating, text, photos = []) {
  try {
    const { supabase } = await import('./supabase')
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        establishment_id: establishmentId,
        user_id: userId,
        rating,
        text,
        photos,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la review:', error)
    throw error
  }
}

// Calculer la moyenne des notes
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

// Obtenir les statistiques de reviews
export function getReviewStats(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      average: 0,
      total: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let total = 0
  let sum = 0

  reviews.forEach(review => {
    distribution[review.rating]++
    total++
    sum += review.rating
  })

  return {
    average: Math.round((sum / total) * 10) / 10,
    total,
    distribution
  }
}

// Filtrer les reviews par note
export function filterReviewsByRating(reviews, minRating) {
  return reviews.filter(review => review.rating >= minRating)
}

// Trier les reviews
export function sortReviews(reviews, sortBy = 'newest') {
  const sorted = [...reviews]
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date || a.created_at) - new Date(b.date || b.created_at))
    case 'highest':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'lowest':
      return sorted.sort((a, b) => a.rating - b.rating)
    default:
      return sorted
  }
}

// Formater la date des reviews
export function formatReviewDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Générer les étoiles pour l'affichage
export function generateStars(rating, maxStars = 5) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push('★')
  }
  
  if (hasHalfStar) {
    stars.push('☆')
  }
  
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) {
    stars.push('☆')
  }

  return stars
}

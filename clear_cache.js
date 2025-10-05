// Script pour forcer le rechargement du cache
console.log('🔄 Nettoyage du cache...')

// Vider le localStorage
if (typeof window !== 'undefined') {
  localStorage.clear()
  console.log('✅ localStorage vidé')
}

// Forcer le rechargement de la page
if (typeof window !== 'undefined') {
  window.location.reload(true)
  console.log('✅ Page rechargée')
}

console.log('🎯 Cache nettoyé ! Les styles devraient maintenant s\'appliquer correctement.')

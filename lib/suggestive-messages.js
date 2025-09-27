// 💬 MESSAGES SUGGESTIFS POUR LES UTILISATEURS
// Objectif : Aider les utilisateurs avec des exemples de messages

export const suggestiveMessages = {
  // Messages pour la plage
  beach: [
    "🏖️ Où aller à la plage pour 2 ?",
    "🏖️ Plage romantique pour demain",
    "🏖️ Meilleure plage à Marbella pour un couple",
    "🏖️ Plage VIP avec transats de luxe",
    "🏖️ Plage privée pour 2 personnes",
    "🏖️ Nikki Beach ou Puente Romano ?",
    "🏖️ Plage avec restaurant en bord de mer",
    "🏖️ Plage pour un moment romantique"
  ],

  // Messages pour les restaurants
  restaurant: [
    "🍽️ Je veux un dîner romantique en bord de mer",
    "🍽️ Restaurant avec vue mer pour ce soir",
    "🍽️ Réserve-moi une table demain soir",
    "🍽️ Meilleur restaurant romantique à Marbella",
    "🍽️ Dîner en couple avec vue coucher de soleil",
    "🍽️ Restaurant italien avec terrasse mer",
    "🍽️ Table VIP pour 2 personnes",
    "🍽️ Restaurant japonais de luxe"
  ],

  // Messages pour les yachts
  yacht: [
    "⛵ Yacht pour une journée en mer",
    "⛵ Croisière privée pour 2 personnes",
    "⛵ Yacht avec DJ et bar",
    "⛵ Yacht de luxe pour ce weekend",
    "⛵ Croisière romantique au coucher du soleil",
    "⛵ Yacht avec équipage privé",
    "⛵ Navigation vers les îles",
    "⛵ Yacht avec spa et jacuzzi"
  ],

  // Messages pour les événements
  events: [
    "🎉 Organiser un EVG à Marbella",
    "🎉 Villa pour 12 personnes ce weekend",
    "🎉 Événement d'entreprise VIP",
    "🎉 Anniversaire surprise en bord de mer",
    "🎉 Mariage privé sur la plage",
    "🎉 Soirée entre amis avec yacht",
    "🎉 Événement avec DJ et bar",
    "🎉 Célébration avec vue panoramique"
  ],

  // Messages pour les activités
  activities: [
    "🏌️ Golf VIP avec vue mer",
    "🏌️ Tennis privé avec coach",
    "🏌️ Spa de luxe pour 2",
    "🏌️ Shopping dans les boutiques de luxe",
    "🏌️ Visite culturelle de Marbella",
    "🏌️ Randonnée dans les montagnes",
    "🏌️ Cours de cuisine méditerranéenne",
    "🏌️ Dégustation de vins espagnols"
  ],

  // Messages généraux
  general: [
    "✨ Que faire de romantique à Marbella ?",
    "✨ Programme parfait pour un couple",
    "✨ Expérience VIP à Marbella",
    "✨ Activités exclusives pour demain",
    "✨ Que recommandes-tu pour ce soir ?",
    "✨ Programme sur mesure pour 2",
    "✨ Expérience inoubliable à Marbella",
    "✨ Que faire de spécial ce weekend ?"
  ]
}

// Fonction pour obtenir un message aléatoire par catégorie
export function getRandomSuggestiveMessage(category = 'general') {
  const messages = suggestiveMessages[category] || suggestiveMessages.general
  return messages[Math.floor(Math.random() * messages.length)]
}

// Fonction pour obtenir tous les messages d'une catégorie
export function getSuggestiveMessages(category) {
  return suggestiveMessages[category] || suggestiveMessages.general
}

// Fonction pour obtenir un message cyclique (pour l'animation)
export function getCyclicSuggestiveMessage(category = 'general', index = 0) {
  const messages = suggestiveMessages[category] || suggestiveMessages.general
  return messages[index % messages.length]
}

// Configuration des animations
export const animationConfig = {
  duration: 3000, // 3 secondes d'affichage
  fadeIn: 500,    // 0.5 seconde pour apparaître
  fadeOut: 500,   // 0.5 seconde pour disparaître
  interval: 4000  // 4 secondes entre chaque message
}

// Messages par défaut pour l'interface
export const defaultSuggestiveMessages = [
  "🏖️ Où aller à la plage pour 2 ?",
  "🍽️ Je veux un dîner romantique en bord de mer",
  "⛵ Yacht pour une journée en mer",
  "🎉 Organiser un EVG à Marbella",
  "✨ Que faire de romantique à Marbella ?"
]

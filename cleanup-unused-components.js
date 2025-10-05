#!/usr/bin/env node

/**
 * Script de nettoyage des composants chat non utilisés
 * Ce script supprime les anciens composants qui causent des conflits
 */

const fs = require('fs')
const path = require('path')

// Composants à supprimer (non utilisés dans la nouvelle architecture)
const componentsToRemove = [
  'components/chat/ChatInterface.js',
  'components/chat/GetWeezChatV2.js', 
  'components/chat/SimpleMobileChat.js',
  'components/chat/ChatInterfaceSimple.js',
  'components/chat/ChatGPTMobileInterface.js',
  'components/chat/ChatInterfaceMinimal.js',
  'components/chat/ChatInterfaceFixed.js',
  'components/chat/MobileChatOptimized.js',
  'components/chat/SidebarChat.js',
  'components/chat/ChatArea.js',
  'components/chat/ConversationSidebar.js',
  'components/chat/SuggestionsSidebar.js',
  'components/chat/MobileChatInterface.js',
  'components/chat/SuggestiveMessages.js',
  'components/chat/VoiceDictationButton.js',
  'components/chat/ChatInput.js',
  'components/chat/MobileChatOverlay.js'
]

// Hooks à supprimer
const hooksToRemove = [
  'hooks/useConversations.js',
  'hooks/useConversationsBackup.js',
  'hooks/useConversationsSimplest.js',
  'hooks/useConversationsSimple.js',
  'hooks/useChatState.js'
]

// Composants UI à supprimer
const uiComponentsToRemove = [
  'components/ui/MessageBubble.js',
  'components/ui/ChatButton.js',
  'components/ui/SuggestionCard.js',
  'components/ui/BrandCarousel.js'
]

// Pages de test à supprimer
const testPagesToRemove = [
  'pages/test-mobile-chat.js',
  'pages/force-button-test.js',
  'pages/input-comparison.js',
  'pages/send-button-test.js',
  'pages/mobile-chat-test.js',
  'pages/mobile-keyboard-test.js'
]

// Fonction pour supprimer un fichier
function removeFile(filePath) {
  const fullPath = path.join(__dirname, filePath)
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath)
      console.log(`✅ Supprimé: ${filePath}`)
      return true
    } catch (error) {
      console.log(`❌ Erreur suppression ${filePath}:`, error.message)
      return false
    }
  } else {
    console.log(`⚠️ Fichier non trouvé: ${filePath}`)
    return false
  }
}

// Fonction pour supprimer un dossier s'il est vide
function removeEmptyDir(dirPath) {
  const fullPath = path.join(__dirname, dirPath)
  
  if (fs.existsSync(fullPath)) {
    try {
      const files = fs.readdirSync(fullPath)
      if (files.length === 0) {
        fs.rmdirSync(fullPath)
        console.log(`✅ Dossier vide supprimé: ${dirPath}`)
      } else {
        console.log(`⚠️ Dossier non vide, conservé: ${dirPath}`)
      }
    } catch (error) {
      console.log(`❌ Erreur suppression dossier ${dirPath}:`, error.message)
    }
  }
}

console.log('🧹 NETTOYAGE DES COMPOSANTS NON UTILISÉS')
console.log('==========================================')

let removedCount = 0

// Supprimer les composants chat
console.log('\n📁 Suppression des composants chat...')
componentsToRemove.forEach(file => {
  if (removeFile(file)) removedCount++
})

// Supprimer les hooks
console.log('\n🔧 Suppression des hooks...')
hooksToRemove.forEach(file => {
  if (removeFile(file)) removedCount++
})

// Supprimer les composants UI
console.log('\n🎨 Suppression des composants UI...')
uiComponentsToRemove.forEach(file => {
  if (removeFile(file)) removedCount++
})

// Supprimer les pages de test
console.log('\n🧪 Suppression des pages de test...')
testPagesToRemove.forEach(file => {
  if (removeFile(file)) removedCount++
})

// Nettoyer les dossiers vides
console.log('\n📂 Nettoyage des dossiers vides...')
removeEmptyDir('components/chat')
removeEmptyDir('components/ui')
removeEmptyDir('hooks')

console.log('\n✨ NETTOYAGE TERMINÉ')
console.log(`📊 ${removedCount} fichiers supprimés`)
console.log('\n🎯 Architecture propre mise en place:')
console.log('   - ChatMain.js (composant principal)')
console.log('   - useConversationsClean.js (hook optimisé)')
console.log('   - Mobile/Desktop gérés proprement')
console.log('\n🚀 Le chat devrait maintenant fonctionner sans conflits!')

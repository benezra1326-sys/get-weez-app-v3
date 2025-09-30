import React, { memo } from 'react'
import { MessageCircle } from 'lucide-react'

/**
 * Composant optimisé pour l'écran d'accueil du chat
 * Séparé pour améliorer la maintenabilité
 */
const WelcomeScreen = memo(({ 
  isDarkMode, 
  establishmentName, 
  onFocusInput 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-4 lg:py-8">
      {/* Version mobile - design plus engageant */}
      <div 
        className="lg:hidden relative overflow-hidden rounded-2xl border border-purple-500/30 p-4 mb-4 w-full max-w-sm cursor-pointer transition-all duration-300 hover:scale-105"
        style={{ borderColor: '#3B82F6' }}
        onClick={onFocusInput}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-white/20 backdrop-blur-sm mx-auto shadow-xl">
            <MessageCircle size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-white">
            Votre IA Concierge
          </h3>
          <p className="text-purple-100 text-sm px-2 leading-relaxed">
            Demandez-moi n'importe quoi sur Marbella !
          </p>
          <div className="mt-3 flex items-center justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
      
      {/* Version desktop */}
      <div className="hidden lg:block relative overflow-hidden rounded-3xl border border-purple-500/30 p-6 lg:p-8 mb-4 lg:mb-6 w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        <div className="relative">
          <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm mx-auto shadow-2xl">
            <MessageCircle size={48} className="text-white" />
          </div>
          <h3 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-4 text-white">
            Bienvenue sur Get Weez
          </h3>
          <p className="text-purple-100 text-sm lg:text-lg px-2 lg:px-4 leading-relaxed">
            Votre concierge IA personnel pour Marbella
          </p>
          <div className="mt-4 lg:mt-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
      
      {/* Notification de réservation si applicable */}
      {establishmentName && (
        <ReservationNotification establishmentName={establishmentName} />
      )}
      
      <p className="text-xs lg:text-base text-gray-400 px-4 lg:px-6">
        <span className="lg:hidden">Tapez votre message ci-dessous</span>
        <span className="hidden lg:inline">Commencez à taper votre message ci-dessous pour commencer une conversation</span>
      </p>
    </div>
  )
})

/**
 * Composant pour afficher la notification de réservation
 */
const ReservationNotification = memo(({ establishmentName }) => (
  <div className="lg:hidden bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 mb-4 mx-2">
    <div className="flex items-center space-x-2">
      <span className="text-white text-lg">🍽️</span>
      <div>
        <p className="text-white font-medium text-sm">Demande de réservation</p>
        <p className="text-green-100 text-xs">Pour {establishmentName}</p>
      </div>
    </div>
  </div>
))

WelcomeScreen.displayName = 'WelcomeScreen'
ReservationNotification.displayName = 'ReservationNotification'

export default WelcomeScreen
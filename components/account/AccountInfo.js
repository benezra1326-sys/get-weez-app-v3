import { Crown, Lock, Settings, Bell, LogOut, ChevronDown } from 'lucide-react'

export default function AccountInfo({ user, onBecomeMember, onReserve }) {
  return (
    <div 
      className="relative card-premium p-8 animate-fade-in animate-hover-lift"
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)'
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">
            {user?.first_name?.charAt(0) || 'U'}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {user?.first_name || 'Utilisateur'}
        </h3>
        <p className="text-gray-400">{user?.email || 'Non connecté'}</p>
      </div>

      {/* Statut */}
      <div className={`rounded-xl p-4 mb-6 border-l-4 ${
        user?.is_member ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-500 bg-gray-500/10'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 font-medium">Statut du compte</span>
          <span className={`font-bold ${
            user?.is_member ? 'text-yellow-400' : 'text-gray-400'
          }`}>
            {user?.is_member ? 'Membre Actif' : 'Invité'}
          </span>
        </div>
        {user?.is_member && (
          <div className="text-sm text-gray-400">
            Abonnement {user.subscription_type === 'annual' ? 'annuel' : 'mensuel'} • 
            Valide jusqu'au {user.subscription_end_date}
          </div>
        )}
        {!user?.is_member && (
          <div className="text-sm text-gray-400">
            Accès limité aux fonctionnalités de base
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button 
          onClick={onBecomeMember}
          className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg font-medium"
        >
          <Crown size={20} className="mr-3" />
          {user?.is_member ? 'Gérer mon abonnement' : 'Devenir membre'}
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-center p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors">
            <div className="flex items-center">
              <Bell size={18} className="text-gray-400 mr-2" />
              <span className="text-white text-sm font-medium">Notifications</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors">
            <div className="flex items-center">
              <Settings size={18} className="text-gray-400 mr-2" />
              <span className="text-white text-sm font-medium">Paramètres</span>
            </div>
          </div>
        </div>
        
        <button className="w-full flex items-center justify-center p-3 bg-red-500/20 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors">
          <LogOut size={18} className="text-red-400 mr-2" />
          <span className="text-red-400 font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  )
}
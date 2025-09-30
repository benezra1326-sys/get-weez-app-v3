import { Crown, Lock, Settings, Bell, LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/router'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function AccountInfo({ user, onBecomeMember, onReserve }) {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  return (
    <div 
      className={`relative p-8 rounded-2xl shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border border-gray-200/50 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold text-center flex items-center justify-center w-full h-full">
            {user?.first_name?.charAt(0)?.toUpperCase() || 'D'}
          </span>
        </div>
        <h3 className={`text-2xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {user?.first_name || 'DEMO'}
        </h3>
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email || 'demo@getweez.com'}</p>
      </div>

      {/* Statut */}
      <div className={`rounded-xl p-4 mb-6 border-l-4 ${
        user?.is_member ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-500 bg-gray-500/10'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut du compte</span>
          <span className={`font-bold ${
            user?.is_member ? 'text-yellow-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
          }`}>
            {user?.is_member ? 'Membre Actif' : 'Invité'}
          </span>
        </div>
        {user?.is_member && (
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Abonnement {user.subscription_type === 'annual' ? 'annuel' : 'mensuel'} • 
            Valide jusqu'au {user.subscription_end_date}
          </div>
        )}
        {!user?.is_member && (
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Accès limité aux fonctionnalités de base
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button 
          onClick={() => router.push('/subscriptions')}
          className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg font-medium"
        >
          <Crown size={20} className="mr-3" />
          {user?.is_member ? 'Gérer mon abonnement' : 'Devenir membre'}
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <div className={`flex items-center justify-center p-3 rounded-xl transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
          }`}>
            <div className="flex items-center">
              <Bell size={18} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</span>
            </div>
          </div>
          
          <div className={`flex items-center justify-center p-3 rounded-xl transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
          }`}>
            <div className="flex items-center">
              <Settings size={18} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Paramètres</span>
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
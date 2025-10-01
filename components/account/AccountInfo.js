import { Crown, Lock, Settings, Bell, LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/router'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function AccountInfo({ user, onBecomeMember, onReserve }) {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  return (
    <div 
      className="relative rounded-3xl shadow-2xl transition-all duration-300 h-full flex flex-col"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
        backdropFilter: 'blur(20px) saturate(150%)',
        border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)'}`,
        boxShadow: isDarkMode 
          ? '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        padding: '2rem',
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', // Cohérent avec Get Weez
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
          }}
        >
          <span 
            className="text-white font-bold"
            style={{
              fontSize: '2rem',
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontFamily: 'Blanka, sans-serif', // Cohérent avec le logo
              letterSpacing: '0.05em'
            }}
          >
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
      <div className="space-y-4 mt-auto">
        <button 
          onClick={() => router.push('/subscriptions')}
          className="w-full flex items-center justify-center p-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Crown size={22} className="mr-3" />
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
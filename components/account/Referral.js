import { useState } from 'react'
import { Users, Share2, Gift, Copy, Check, UserPlus, Trophy, Star } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function Referral({ user }) {
  const { isDarkMode } = useTheme()
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Code de parrainage simulé
  const referralCode = user?.referral_code || 'GETWEEZ2024'
  const referralLink = `https://getweez.com/invite/${referralCode}`
  
  // Statistiques de parrainage simulées
  const referralStats = {
    totalInvites: 12,
    successfulReferrals: 8,
    totalEarnings: 160, // en euros
    pendingRewards: 40
  }

  // Amis parrainés simulés
  const referredFriends = [
    { name: 'Marie D.', joinedAt: '2024-10-15', status: 'active', reward: 20 },
    { name: 'Thomas L.', joinedAt: '2024-10-12', status: 'active', reward: 20 },
    { name: 'Sophie M.', joinedAt: '2024-10-08', status: 'pending', reward: 0 },
    { name: 'Lucas R.', joinedAt: '2024-10-05', status: 'active', reward: 20 }
  ]

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoins-moi sur Get Weez !',
          text: 'Découvre les meilleurs établissements de Marbella avec ton IA concierge personnel. Utilise mon code de parrainage pour obtenir 20€ de réduction !',
          url: referralLink
        })
      } catch (err) {
        console.error('Erreur lors du partage:', err)
      }
    } else {
      copyReferralLink()
    }
  }

  return (
    <div 
      className="rounded-2xl p-6 border backdrop-blur-md"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <div 
          className="p-3 rounded-xl mr-4"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}
        >
          <Users size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Inviter des amis
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Parrainez vos amis et gagnez ensemble
          </p>
        </div>
      </div>

      {/* Statistiques de parrainage */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          className="p-4 rounded-xl text-center"
          style={{
            background: isDarkMode 
              ? 'rgba(59, 130, 246, 0.1)'
              : 'rgba(59, 130, 246, 0.05)',
            border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
          }}
        >
          <UserPlus size={20} className="text-blue-500 mx-auto mb-2" />
          <div 
            className="text-lg font-bold"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {referralStats.totalInvites}
          </div>
          <div 
            className="text-xs"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Invitations
          </div>
        </div>

        <div 
          className="p-4 rounded-xl text-center"
          style={{
            background: isDarkMode 
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(16, 185, 129, 0.05)',
            border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`
          }}
        >
          <Trophy size={20} className="text-green-500 mx-auto mb-2" />
          <div 
            className="text-lg font-bold"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {referralStats.successfulReferrals}
          </div>
          <div 
            className="text-xs"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Réussies
          </div>
        </div>

        <div 
          className="p-4 rounded-xl text-center"
          style={{
            background: isDarkMode 
              ? 'rgba(245, 158, 11, 0.1)'
              : 'rgba(245, 158, 11, 0.05)',
            border: `1px solid ${isDarkMode ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)'}`
          }}
        >
          <Gift size={20} className="text-yellow-500 mx-auto mb-2" />
          <div 
            className="text-lg font-bold"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {referralStats.totalEarnings}€
          </div>
          <div 
            className="text-xs"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Gagnés
          </div>
        </div>

        <div 
          className="p-4 rounded-xl text-center"
          style={{
            background: isDarkMode 
              ? 'rgba(139, 92, 246, 0.1)'
              : 'rgba(139, 92, 246, 0.05)',
            border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`
          }}
        >
          <Star size={20} className="text-purple-500 mx-auto mb-2" />
          <div 
            className="text-lg font-bold"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {referralStats.pendingRewards}€
          </div>
          <div 
            className="text-xs"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            En attente
          </div>
        </div>
      </div>

      {/* Code et lien de parrainage */}
      <div 
        className="p-4 rounded-xl mb-6"
        style={{
          background: isDarkMode 
            ? 'rgba(55, 65, 81, 0.5)'
            : 'rgba(255, 255, 255, 0.8)',
          border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'}`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
        >
          Votre code de parrainage
        </h3>
        
        <div className="space-y-3">
          {/* Code de parrainage */}
          <div className="flex items-center space-x-3">
            <div 
              className="flex-1 p-3 rounded-lg font-mono text-center text-lg font-bold"
              style={{
                background: isDarkMode 
                  ? 'rgba(17, 24, 39, 0.8)'
                  : 'rgba(248, 250, 252, 0.8)',
                color: isDarkMode ? '#FFFFFF' : '#1F2937',
                border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'}`,
              }}
            >
              {referralCode}
            </div>
            <button
              onClick={copyReferralCode}
              className="p-3 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              {copiedCode ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>

          {/* Boutons de partage */}
          <div className="flex space-x-3">
            <button
              onClick={copyReferralLink}
              className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: isDarkMode 
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'rgba(59, 130, 246, 0.1)',
                color: '#3B82F6',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              {copiedLink ? <Check size={18} /> : <Copy size={18} />}
              <span>{copiedLink ? 'Copié!' : 'Copier le lien'}</span>
            </button>
            
            <button
              onClick={shareReferralLink}
              className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Share2 size={18} />
              <span>Partager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment ça marche */}
      <div 
        className="p-4 rounded-xl mb-6"
        style={{
          background: isDarkMode 
            ? 'rgba(16, 185, 129, 0.1)'
            : 'rgba(16, 185, 129, 0.05)',
          border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
        }}
      >
        <h3 
          className="text-lg font-semibold mb-3 text-green-600"
        >
          Comment ça marche ?
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">1</div>
            <span 
              className="text-sm"
              style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
            >
              Partagez votre code avec vos amis
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">2</div>
            <span 
              className="text-sm"
              style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
            >
              Ils s'inscrivent et obtiennent 20€ de réduction
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">3</div>
            <span 
              className="text-sm"
              style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
            >
              Vous recevez 20€ de crédit après leur première réservation
            </span>
          </div>
        </div>
      </div>

      {/* Amis parrainés */}
      <div>
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
        >
          Amis parrainés ({referredFriends.length})
        </h3>
        
        <div className="space-y-3">
          {referredFriends.map((friend, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background: isDarkMode 
                  ? 'rgba(55, 65, 81, 0.3)'
                  : 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
              }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    background: friend.status === 'active' 
                      ? 'linear-gradient(135deg, #10B981, #059669)'
                      : 'linear-gradient(135deg, #F59E0B, #D97706)'
                  }}
                >
                  {friend.name.charAt(0)}
                </div>
                <div>
                  <div 
                    className="font-semibold text-sm"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                  >
                    {friend.name}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  >
                    Inscrit le {new Date(friend.joinedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div 
                  className={`text-xs px-2 py-1 rounded-full ${
                    friend.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {friend.status === 'active' ? 'Actif' : 'En attente'}
                </div>
                {friend.reward > 0 && (
                  <div 
                    className="text-sm font-bold mt-1"
                    style={{ color: '#10B981' }}
                  >
                    +{friend.reward}€
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

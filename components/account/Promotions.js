import { useState } from 'react'
import { Gift, Percent, Clock, Star, Copy, Check } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function Promotions({ user }) {
  const { isDarkMode } = useTheme()
  const [copiedCode, setCopiedCode] = useState('')

  // Données de promotions simulées
  const activePromotions = [
    {
      id: 1,
      title: "Première réservation",
      description: "20% de réduction sur votre première réservation",
      code: "WELCOME20",
      discount: "20%",
      expiresAt: "2024-12-31",
      type: "first_booking",
      icon: <Star size={24} className="text-yellow-500" />
    },
    {
      id: 2,
      title: "Weekend spécial",
      description: "15% de réduction pour les réservations du weekend",
      code: "WEEKEND15",
      discount: "15%",
      expiresAt: "2024-11-30",
      type: "weekend",
      icon: <Gift size={24} className="text-purple-500" />
    },
    {
      id: 3,
      title: "Membre VIP",
      description: "10% de réduction permanente pour les membres",
      code: "VIP10",
      discount: "10%",
      expiresAt: "Permanent",
      type: "member",
      icon: <Percent size={24} className="text-blue-500" />
    }
  ]

  const usedPromotions = [
    {
      id: 4,
      title: "Bienvenue été",
      description: "25% de réduction utilisée le 15/10/2024",
      code: "SUMMER25",
      discount: "25%",
      usedAt: "2024-10-15",
      type: "seasonal"
    }
  ]

  const copyPromoCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(''), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
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
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
          }}
        >
          <Gift size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Mes Promotions
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Codes promo et offres spéciales
          </p>
        </div>
      </div>

      {/* Promotions actives */}
      <div className="mb-6">
        <h3 
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
        >
          <Clock size={18} className="mr-2 text-green-500" />
          Promotions actives
        </h3>
        
        <div className="space-y-3">
          {activePromotions.map((promo) => (
            <div 
              key={promo.id}
              className="p-4 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                background: isDarkMode 
                  ? 'rgba(55, 65, 81, 0.5)'
                  : 'rgba(255, 255, 255, 0.8)',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {promo.icon}
                  <div className="flex-1">
                    <h4 
                      className="font-semibold text-sm mb-1"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                    >
                      {promo.title}
                    </h4>
                    <p 
                      className="text-xs mb-2"
                      style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                    >
                      {promo.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div 
                        className="px-2 py-1 rounded-lg text-xs font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: 'white'
                        }}
                      >
                        {promo.discount}
                      </div>
                      <span 
                        className="text-xs"
                        style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                      >
                        Expire: {promo.expiresAt}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => copyPromoCode(promo.code)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                      : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check size={14} />
                      <span>Copié!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>{promo.code}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotions utilisées */}
      <div>
        <h3 
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
        >
          <Check size={18} className="mr-2 text-gray-500" />
          Promotions utilisées
        </h3>
        
        <div className="space-y-3">
          {usedPromotions.map((promo) => (
            <div 
              key={promo.id}
              className="p-4 rounded-xl border opacity-60"
              style={{
                background: isDarkMode 
                  ? 'rgba(55, 65, 81, 0.3)'
                  : 'rgba(255, 255, 255, 0.5)',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.3)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 
                    className="font-semibold text-sm mb-1"
                    style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                  >
                    {promo.title}
                  </h4>
                  <p 
                    className="text-xs"
                    style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  >
                    {promo.description}
                  </p>
                </div>
                <div 
                  className="px-2 py-1 rounded-lg text-xs font-bold"
                  style={{
                    background: isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(156, 163, 175, 0.5)',
                    color: isDarkMode ? '#D1D5DB' : '#6B7280'
                  }}
                >
                  {promo.code}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

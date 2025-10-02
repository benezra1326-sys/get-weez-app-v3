import { useState } from 'react'
import { CreditCard, DollarSign, History, Crown, Plus, Check, Trash2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function PaymentSettings({ user }) {
  const { isDarkMode } = useTheme()
  const [selectedCard, setSelectedCard] = useState('card1')

  // Données simulées
  const paymentMethods = [
    {
      id: 'card1',
      type: 'visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 'card2', 
      type: 'mastercard',
      last4: '8888',
      expiry: '08/26',
      isDefault: false
    }
  ]

  const transactions = [
    {
      id: 1,
      date: '2024-10-20',
      description: 'Réservation La Sala Beach',
      amount: -85.00,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-10-18', 
      description: 'Crédit parrainage',
      amount: +20.00,
      status: 'completed'
    }
  ]

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
            background: 'linear-gradient(135deg, #10B981, #059669)',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}
        >
          <CreditCard size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Compte & Paiement
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Gérer vos moyens de paiement et abonnement
          </p>
        </div>
      </div>

      {/* Moyens de paiement */}
      <div className="mb-6">
        <h3 
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
        >
          <CreditCard size={18} className="mr-2 text-blue-500" />
          Moyens de paiement
        </h3>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div 
              key={method.id}
              className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
                selectedCard === method.id ? 'scale-105' : ''
              }`}
              style={{
                background: selectedCard === method.id
                  ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                  : isDarkMode 
                    ? 'rgba(55, 65, 81, 0.5)'
                    : 'rgba(255, 255, 255, 0.8)',
                borderColor: selectedCard === method.id
                  ? 'rgba(59, 130, 246, 0.5)'
                  : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
                color: selectedCard === method.id
                  ? 'white'
                  : isDarkMode ? '#FFFFFF' : '#1F2937',
                boxShadow: selectedCard === method.id
                  ? '0 4px 15px rgba(59, 130, 246, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {method.type === 'visa' ? '💳' : '💳'}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      •••• •••• •••• {method.last4}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ 
                        color: selectedCard === method.id 
                          ? 'rgba(255, 255, 255, 0.8)' 
                          : isDarkMode ? '#9CA3AF' : '#6B7280' 
                      }}
                    >
                      Expire {method.expiry}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {method.isDefault && (
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: selectedCard === method.id 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : 'linear-gradient(135deg, #10B981, #059669)',
                        color: selectedCard === method.id ? 'white' : 'white'
                      }}
                    >
                      Par défaut
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedCard(method.id)}
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    {selectedCard === method.id ? (
                      <Check size={16} />
                    ) : (
                      <div className="w-4 h-4 border-2 rounded border-current" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Ajouter une carte */}
          <button
            className="w-full p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105"
            style={{
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)',
              color: isDarkMode ? '#9CA3AF' : '#6B7280'
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span className="font-medium">Ajouter une carte</span>
            </div>
          </button>
        </div>
      </div>

      {/* Historique des transactions */}
      <div className="mb-6">
        <h3 
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
        >
          <History size={18} className="mr-2 text-green-500" />
          Historique des transactions
        </h3>
        
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="p-3 rounded-xl border"
              style={{
                background: isDarkMode 
                  ? 'rgba(55, 65, 81, 0.3)'
                  : 'rgba(255, 255, 255, 0.5)',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.3)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div 
                    className="font-semibold text-sm"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                  >
                    {transaction.description}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  >
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div 
                  className={`font-bold text-sm ${
                    transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}€
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Abonnement */}
      <div 
        className="p-4 rounded-xl border"
        style={{
          background: isDarkMode 
            ? 'rgba(139, 92, 246, 0.1)'
            : 'rgba(139, 92, 246, 0.05)',
          borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown size={20} className="text-purple-500" />
            <div>
              <div 
                className="font-semibold text-sm"
                style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
              >
                Abonnement Premium
              </div>
              <div 
                className="text-xs"
                style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
              >
                Accès illimité aux services
              </div>
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            Gérer
          </button>
        </div>
      </div>
    </div>
  )
}

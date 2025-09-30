import { useState } from 'react'
import { useRouter } from 'next/router'
import { Crown, Check, Star, Zap, Shield, Clock, Users, Sparkles } from 'lucide-react'

export default function SubscriptionPlans({ user, onSubscribe, isDarkMode }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' or 'annual'
  const router = useRouter()

  const plans = {
    monthly: [
      {
        id: 'basic',
        name: 'Get Weez Basic',
        price: '39',
        originalPrice: null,
        period: 'mois',
        description: 'Parfait pour découvrir nos services',
        features: [
          'Accès aux établissements partenaires',
          'Réservations en ligne',
          'Support client standard',
          'Notifications par email'
        ],
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
        borderColor: 'border-blue-500/30',
        popular: false
      },
      {
        id: 'premium',
        name: 'Get Weez Premium',
        price: '79',
        originalPrice: '99',
        period: 'mois',
        description: 'Le choix des utilisateurs exigeants',
        features: [
          'Tout de Basic',
          'Réservations prioritaires',
          'Support client premium 24/7',
          'Accès aux événements exclusifs',
          'Concierge personnel',
          'Remises jusqu\'à 30%'
        ],
        icon: Crown,
        color: 'from-purple-500 to-pink-500',
        borderColor: 'border-purple-500/30',
        popular: true
      },
      {
        id: 'vip',
        name: 'Get Weez VIP',
        price: '199',
        originalPrice: '249',
        period: 'mois',
        description: 'L\'expérience ultime du luxe',
        features: [
          'Tout de Premium',
          'Accès VIP exclusif',
          'Concierge dédié 24/7',
          'Événements privés',
          'Transport privé inclus',
          'Accès aux villas de luxe',
          'Service de sécurité personnel'
        ],
        icon: Star,
        color: 'from-amber-500 to-orange-500',
        borderColor: 'border-amber-500/30',
        popular: false
      }
    ],
    annual: [
      {
        id: 'basic',
        name: 'Get Weez Basic',
        price: '327',
        originalPrice: '468',
        period: 'an',
        description: 'Parfait pour découvrir nos services',
        features: [
          'Accès aux établissements partenaires',
          'Réservations en ligne',
          'Support client standard',
          'Notifications par email'
        ],
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
        borderColor: 'border-blue-500/30',
        popular: false
      },
      {
        id: 'premium',
        name: 'Get Weez Premium',
        price: '663',
        originalPrice: '948',
        period: 'an',
        description: 'Le choix des utilisateurs exigeants',
        features: [
          'Tout de Basic',
          'Réservations prioritaires',
          'Support client premium 24/7',
          'Accès aux événements exclusifs',
          'Concierge personnel',
          'Remises jusqu\'à 30%'
        ],
        icon: Crown,
        color: 'from-purple-500 to-pink-500',
        borderColor: 'border-purple-500/30',
        popular: true
      },
      {
        id: 'vip',
        name: 'Get Weez VIP',
        price: '1671',
        originalPrice: '2388',
        period: 'an',
        description: 'L\'expérience ultime du luxe',
        features: [
          'Tout de Premium',
          'Accès VIP exclusif',
          'Concierge dédié 24/7',
          'Événements privés',
          'Transport privé inclus',
          'Accès aux villas de luxe',
          'Service de sécurité personnel'
        ],
        icon: Star,
        color: 'from-amber-500 to-orange-500',
        borderColor: 'border-amber-500/30',
        popular: false
      }
    ]
  }

  const currentPlans = plans[billingCycle]

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen py-12`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl lg:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Choisissez votre 
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"> abonnement</span>
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto mb-8`}>
            Accédez à l'excellence avec nos plans premium. Des services de luxe adaptés à vos besoins.
          </p>
          
          {/* Toggle Billing */}
          <div className="flex items-center justify-center mb-12">
            <span className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mensuel</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`mx-4 relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                billingCycle === 'annual' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Annuel 
              <span className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-2 py-1 rounded-full">
                -30%
              </span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {currentPlans.map((plan) => {
            const IconComponent = plan.icon
            const isSelected = selectedPlan === plan.id
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                  plan.popular 
                    ? 'ring-2 ring-purple-500/50 shadow-2xl scale-105' 
                    : 'hover:scale-105 hover:shadow-xl'
                } ${
                  isSelected 
                    ? `ring-2 ring-purple-500 shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}` 
                    : isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      <Star size={16} className="inline mr-1" />
                      Plus populaire
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    <IconComponent size={32} className="text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {plan.price}€
                      </span>
                      <span className={`text-lg ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        /{plan.period}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <div className="mt-2">
                        <span className={`text-lg line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {plan.originalPrice}€
                        </span>
                        <span className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-2 py-1 rounded-full">
                          Économisez {Math.round((1 - parseInt(plan.price) / parseInt(plan.originalPrice)) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    // Rediriger vers la page de checkout
                    router.push(`/checkout?plan=${plan.id}&cycle=${billingCycle}`)
                  }}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                      : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl`
                  }`}
                >
                  {user?.is_member ? 'Changer de plan' : 'Commencer maintenant'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className={`text-2xl lg:text-3xl font-bold text-center mb-12 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Pourquoi choisir Get&nbsp;Weez&nbsp;?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Réservations instantanées
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Accédez aux meilleurs établissements en quelques clics
              </p>
            </div>

            <div className={`text-center p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Sécurité garantie
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Vos données et paiements sont protégés par les meilleures technologies
              </p>
            </div>

            <div className={`text-center p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Expérience premium
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Découvrez le luxe à la française avec nos services exclusifs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

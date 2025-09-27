import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Phone, MessageCircle, ArrowLeft } from 'lucide-react'

export default function PhoneAuth({ onSuccess, onError, onBack }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [loading, setLoading] = useState(false)

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          channel: 'sms'
        }
      })

      if (error) {
        onError(error.message)
      } else {
        setStep('otp')
        onSuccess('Code SMS envoyé !')
      }
    } catch (error) {
      onError('Erreur lors de l\'envoi du SMS')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms'
      })

      if (error) {
        onError(error.message)
      } else {
        onSuccess('Connexion réussie !')
      }
    } catch (error) {
      onError('Code incorrect')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid var(--color-border)'
            }}
          >
            <MessageCircle size={32} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Vérification SMS
          </h3>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Entrez le code reçu au {phone}
          </p>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Code de vérification
            </label>
            <div className="relative">
              <MessageCircle 
                size={20} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                style={{ color: 'var(--color-text-muted)' }}
              />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-premium w-full pl-12 pr-4 py-3"
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="btn-secondary flex-1 flex items-center justify-center animate-hover-lift"
            >
              <ArrowLeft size={18} className="mr-2" />
              Retour
            </button>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className={`btn-premium flex-1 ${loading || otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : 'animate-hover-lift'}`}
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid var(--color-border)'
            }}
          >
            <Phone size={32} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Connexion par SMS
          </h3>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Entrez votre numéro de téléphone
          </p>
        </div>

      <form onSubmit={handlePhoneSubmit} className="space-y-4">
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Numéro de téléphone
          </label>
          <div className="relative">
            <Phone 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2" 
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-premium w-full pl-12 pr-4 py-3"
              placeholder="+33 6 12 34 56 78"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full btn-premium ${loading ? 'opacity-50 cursor-not-allowed' : 'animate-hover-lift'}`}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer le code SMS'}
        </button>
      </form>
    </div>
  )
}

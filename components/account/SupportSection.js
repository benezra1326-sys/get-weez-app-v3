import { useState } from 'react'
import { HelpCircle, MessageCircle, FileText, Phone, Mail, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import Link from 'next/link'

export default function SupportSection({ user }) {
  const { isDarkMode } = useTheme()
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Tickets de support - vide par défaut
  const supportTickets = []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setSupportForm({ subject: '', message: '', priority: 'medium' })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={16} className="text-yellow-500" />
      case 'in_progress':
        return <Clock size={16} className="text-blue-500" />
      case 'resolved':
        return <CheckCircle size={16} className="text-green-500" />
      default:
        return <AlertCircle size={16} className="text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Ouvert'
      case 'in_progress':
        return 'En cours'
      case 'resolved':
        return 'Résolu'
      default:
        return 'Inconnu'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <HelpCircle size={24} className="mr-3 text-purple-500" />
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Support & Assistance
        </h2>
      </div>

      {/* Actions rapides */}
      <div className={`rounded-2xl p-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/50 border border-gray-700/50' 
          : 'bg-white border border-gray-200/50 shadow-xl'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Besoin d'aide ?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/aide" className={`flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
          }`}>
            <FileText size={18} className="mr-2" />
            Centre d'aide
          </Link>
          <a 
            href="mailto:support@getweez.com" 
            className={`flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
            }`}
          >
            <Mail size={18} className="mr-2" />
            Email support
          </a>
        </div>
      </div>

      {/* Tickets existants */}
      {supportTickets.length > 0 && (
        <div className={`rounded-2xl p-6 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 border border-gray-700/50' 
            : 'bg-white border border-gray-200/50 shadow-xl'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Mes tickets de support
          </h3>
          <div className="space-y-3">
            {supportTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600/50' 
                    : 'bg-gray-50 border-gray-200/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(ticket.status)}
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {ticket.subject}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {ticket.id} • {ticket.lastUpdate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority === 'high' ? 'Urgent' : 
                     ticket.priority === 'medium' ? 'Normal' : 'Faible'}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getStatusText(ticket.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire de nouveau ticket */}
      <div className={`rounded-2xl p-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/50 border border-gray-700/50' 
          : 'bg-white border border-gray-200/50 shadow-xl'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Nouveau ticket de support
        </h3>
        
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
            <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ticket envoyé avec succès !
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Nous vous répondrons dans les plus brefs délais.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className={`mt-4 py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
              }`}
            >
              Nouveau ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Sujet
              </label>
              <input
                type="text"
                value={supportForm.subject}
                onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Décrivez brièvement votre problème..."
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 text-white border-gray-600/50 focus:border-purple-500/50' 
                    : 'bg-white text-gray-900 border-gray-200 focus:border-purple-500/50'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Priorité
              </label>
              <select
                value={supportForm.priority}
                onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 text-white border-gray-600/50 focus:border-purple-500/50' 
                    : 'bg-white text-gray-900 border-gray-200 focus:border-purple-500/50'
                }`}
              >
                <option value="low">Faible</option>
                <option value="medium">Normale</option>
                <option value="high">Urgente</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Message détaillé
              </label>
              <textarea
                value={supportForm.message}
                onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Décrivez votre problème en détail..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border resize-none transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 text-white border-gray-600/50 focus:border-purple-500/50' 
                    : 'bg-white text-gray-900 border-gray-200 focus:border-purple-500/50'
                }`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center py-3 px-6 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Clock size={18} className="mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Envoyer le ticket
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Contact direct */}
      <div className={`rounded-2xl p-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/50 border border-gray-700/50' 
          : 'bg-white border border-gray-200/50 shadow-xl'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Contact direct
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone size={20} className="text-purple-500" />
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Téléphone
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                +34 952 123 456
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-purple-500" />
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Email
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                support@getweez.com
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MessageCircle size={20} className="text-purple-500" />
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Chat en direct
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Disponible 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

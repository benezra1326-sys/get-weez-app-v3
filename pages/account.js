import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { User, Calendar, Heart, Bell, Settings, TrendingUp, MapPin, Clock } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function AccountPage({ user, setUser }) {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadDashboard()
  }, [user])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/dashboard/${user.id}`)
      const data = await response.json()

      if (data.success) {
        setDashboard(data.dashboard)
      } else {
        setError('Erreur de chargement du dashboard')
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
      setError('Impossible de charger vos données')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      confirmed: isDarkMode ? '#4ADE80' : '#22C55E',
      pending: isDarkMode ? '#FBBF24' : '#F59E0B',
      cancelled: isDarkMode ? '#EF4444' : '#DC2626',
      completed: isDarkMode ? '#C0C0C0' : '#9CA3AF'
    }
    return colors[status] || (isDarkMode ? '#C0C0C0' : '#6B7280')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ background: isDarkMode ? '#0B0B0C' : '#FFFFFF' }}>
        <V3Sidebar 
          user={user} 
          setUser={setUser} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ borderColor: isDarkMode ? '#C0C0C0' : '#0B0B0C' }}
            />
            <p className="mt-4" style={{ color: isDarkMode ? '#E5E5E5' : '#0B0B0C' }}>
              Chargement de votre compte...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="flex min-h-screen" style={{ background: isDarkMode ? '#0B0B0C' : '#FFFFFF' }}>
        <V3Sidebar 
          user={user} 
          setUser={setUser} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p style={{ color: isDarkMode ? '#EF4444' : '#DC2626' }}>{error}</p>
            <button
              onClick={loadDashboard}
              className="mt-4 px-6 py-2 rounded-full"
              style={{
                background: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                color: isDarkMode ? '#0B0B0C' : '#FFFFFF'
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: isDarkMode ? '#0B0B0C' : '#FFFFFF' }}>
      <V3Sidebar 
        user={user} 
        setUser={setUser} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-2" style={{ 
            color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Bonjour, {dashboard.user.full_name || 'Utilisateur'} ✨
          </h1>
          <p style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.6)' : 'rgba(11, 11, 12, 0.6)' }}>
            Bienvenue dans votre espace personnel Gliitz
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<Calendar size={24} />}
            label="Réservations"
            value={dashboard.stats.bookings.total}
            subtext={`${dashboard.stats.bookings.confirmed} confirmées`}
            isDarkMode={isDarkMode}
          />
          <StatsCard
            icon={<Clock size={24} />}
            label="En attente"
            value={dashboard.stats.bookings.pending}
            subtext="À confirmer"
            isDarkMode={isDarkMode}
          />
          <StatsCard
            icon={<Heart size={24} />}
            label="Favoris"
            value={dashboard.stats.favoritesCount}
            subtext="Établissements aimés"
            isDarkMode={isDarkMode}
          />
          <StatsCard
            icon={<Bell size={24} />}
            label="Notifications"
            value={dashboard.stats.unreadNotifications}
            subtext="Non lues"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-light mb-4" style={{ 
            color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Vos dernières réservations
          </h2>
          
          {dashboard.recentBookings.length === 0 ? (
            <div 
              className="p-8 rounded-3xl text-center"
              style={{
                background: isDarkMode ? 'rgba(192, 192, 192, 0.05)' : 'rgba(11, 11, 12, 0.03)',
                border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.1)'}`
              }}
            >
              <p style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.6)' : 'rgba(11, 11, 12, 0.6)' }}>
                Vous n'avez pas encore de réservations
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-3 rounded-full"
                style={{
                  background: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                  color: isDarkMode ? '#0B0B0C' : '#FFFFFF',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Faire une réservation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dashboard.recentBookings.map((booking, index) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isDarkMode={isDarkMode}
                  delay={index * 0.1}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Preferences */}
        {dashboard.preferences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-light mb-4" style={{ 
              color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Vos préférences
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {dashboard.preferences.map((pref, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 rounded-full"
                  style={{
                    background: isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.05)',
                    border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(11, 11, 12, 0.1)'}`,
                    color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {pref.preference_value}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-light mb-4" style={{ 
            color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Actions rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              icon={<Calendar size={20} />}
              label="Nouvelle réservation"
              onClick={() => router.push('/')}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Settings size={20} />}
              label="Paramètres"
              onClick={() => router.push('/settings')}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<TrendingUp size={20} />}
              label="Voir mes statistiques"
              onClick={() => {}}
              isDarkMode={isDarkMode}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Composants auxiliaires
function StatsCard({ icon, label, value, subtext, isDarkMode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-3xl"
      style={{
        background: isDarkMode ? 'rgba(192, 192, 192, 0.05)' : 'rgba(11, 11, 12, 0.03)',
        border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.1)'}`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center gap-3 mb-2" style={{ color: isDarkMode ? '#C0C0C0' : '#0B0B0C' }}>
        {icon}
        <span className="text-sm opacity-70">{label}</span>
      </div>
      <div className="text-3xl font-bold mb-1" style={{ 
        color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
        fontFamily: 'Poppins, sans-serif'
      }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.5)' : 'rgba(11, 11, 12, 0.5)' }}>
        {subtext}
      </div>
    </motion.div>
  )
}

function BookingCard({ booking, isDarkMode, delay, getStatusColor, formatDate }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-3xl cursor-pointer"
      style={{
        background: isDarkMode ? 'rgba(192, 192, 192, 0.05)' : 'rgba(11, 11, 12, 0.03)',
        border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.1)'}`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-sm opacity-70 mb-1" style={{ color: isDarkMode ? '#C0C0C0' : '#6B7280' }}>
            {booking.booking_number}
          </div>
          <div className="text-xl font-semibold" style={{ 
            color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
            {booking.sub_type && ` - ${booking.sub_type}`}
          </div>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-sm"
          style={{
            background: getStatusColor(booking.status),
            color: '#FFFFFF'
          }}
        >
          {booking.status}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm" style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.7)' : 'rgba(11, 11, 12, 0.7)' }}>
          <MapPin size={16} />
          {booking.location}
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.7)' : 'rgba(11, 11, 12, 0.7)' }}>
          <Calendar size={16} />
          {formatDate(booking.booking_date)}
        </div>
      </div>

      {booking.price && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.1)' }}>
          <div className="text-2xl font-bold" style={{ color: isDarkMode ? '#C0C0C0' : '#0B0B0C' }}>
            {booking.price}€
          </div>
        </div>
      )}
    </motion.div>
  )
}

function ActionButton({ icon, label, onClick, isDarkMode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="p-4 rounded-2xl flex items-center gap-3"
      style={{
        background: isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.05)',
        border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(11, 11, 12, 0.1)'}`,
        color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  )
}
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, User, DollarSign, CheckCircle, XCircle, AlertCircle, MessageSquare, Sparkles } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function BookingsPage({ user, setUser }) {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'confirmed', 'pending', 'cancelled', 'completed'
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadBookings()
  }, [user])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings/user/${user.id}`)
      const data = await response.json()

      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Erreur chargement réservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} />
      case 'pending':
        return <AlertCircle size={20} />
      case 'cancelled':
        return <XCircle size={20} />
      case 'completed':
        return <CheckCircle size={20} />
      default:
        return <Clock size={20} />
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBookingTypeEmoji = (type) => {
    const emojis = {
      restaurant: '🍽️',
      event: '🎉',
      service: '🧾',
      accommodation: '🏨',
      yacht: '⛵',
      spa: '🧖',
      villa: '🏡'
    }
    return emojis[type] || '📅'
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
              Chargement de vos réservations...
            </p>
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
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ 
            color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Mes Réservations 📅
          </h1>
          <p style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.6)' : 'rgba(11, 11, 12, 0.6)' }}>
            {bookings.length} réservation{bookings.length !== 1 ? 's' : ''} au total
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((filterOption) => (
            <motion.button
              key={filterOption}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterOption)}
              className="px-4 py-2 rounded-full"
              style={{
                background: filter === filterOption 
                  ? (isDarkMode ? '#C0C0C0' : '#0B0B0C')
                  : (isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.05)'),
                color: filter === filterOption 
                  ? (isDarkMode ? '#0B0B0C' : '#FFFFFF')
                  : (isDarkMode ? '#E5E5E5' : '#0B0B0C'),
                border: `1px solid ${filter === filterOption 
                  ? 'transparent'
                  : (isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(11, 11, 12, 0.1)')}`,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {filterOption === 'all' ? 'Toutes' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* New Booking Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="mb-8 px-6 py-3 rounded-full flex items-center gap-2"
          style={{
            background: isDarkMode ? '#C0C0C0' : '#0B0B0C',
            color: isDarkMode ? '#0B0B0C' : '#FFFFFF',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(192, 192, 192, 0.3)'
              : '0 4px 20px rgba(11, 11, 12, 0.2)'
          }}
        >
          <Sparkles size={20} />
          Nouvelle Réservation
        </motion.button>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 rounded-3xl text-center"
            style={{
              background: isDarkMode ? 'rgba(192, 192, 192, 0.05)' : 'rgba(11, 11, 12, 0.03)',
              border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.1)'}`
            }}
          >
            <Calendar size={64} className="mx-auto mb-4" style={{ 
              color: isDarkMode ? 'rgba(229, 229, 229, 0.3)' : 'rgba(11, 11, 12, 0.3)' 
            }} />
            <p className="text-xl mb-2" style={{ color: isDarkMode ? '#E5E5E5' : '#0B0B0C' }}>
              Aucune réservation {filter !== 'all' && `(${filter})`}
            </p>
            <p style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.6)' : 'rgba(11, 11, 12, 0.6)' }}>
              Commencez votre expérience Gliitz dès maintenant
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                index={index}
                isDarkMode={isDarkMode}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                getBookingTypeEmoji={getBookingTypeEmoji}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            isDarkMode={isDarkMode}
            onClose={() => setSelectedBooking(null)}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            getBookingTypeEmoji={getBookingTypeEmoji}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Composant BookingCard
function BookingCard({ booking, index, isDarkMode, getStatusIcon, getStatusColor, formatDate, getBookingTypeEmoji, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="p-6 rounded-3xl cursor-pointer"
      style={{
        background: isDarkMode ? 'rgba(192, 192, 192, 0.05)' : 'rgba(11, 11, 12, 0.03)',
        border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.1)'}`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {getBookingTypeEmoji(booking.sub_type || booking.type)}
          </div>
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
        </div>
        <div 
          className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
          style={{
            background: getStatusColor(booking.status),
            color: '#FFFFFF'
          }}
        >
          {getStatusIcon(booking.status)}
          {booking.status}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.7)' : 'rgba(11, 11, 12, 0.7)' }}>
          <MapPin size={16} />
          {booking.location}
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.7)' : 'rgba(11, 11, 12, 0.7)' }}>
          <Calendar size={16} />
          {formatDate(booking.booking_date)}
        </div>
        {booking.guests_count && (
          <div className="flex items-center gap-2 text-sm" style={{ color: isDarkMode ? 'rgba(229, 229, 229, 0.7)' : 'rgba(11, 11, 12, 0.7)' }}>
            <User size={16} />
            {booking.guests_count} personne{booking.guests_count !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {booking.price && (
        <div className="pt-4 border-t" style={{ borderColor: isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.1)' }}>
          <div className="flex items-center gap-2 text-2xl font-bold" style={{ color: isDarkMode ? '#C0C0C0' : '#0B0B0C' }}>
            <DollarSign size={20} />
            {booking.price}€
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Composant BookingDetailsModal
function BookingDetailsModal({ booking, isDarkMode, onClose, formatDate, getStatusColor, getStatusIcon, getBookingTypeEmoji }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-3xl"
        style={{
          background: isDarkMode ? '#0B0B0C' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(11, 11, 12, 0.2)'}`,
          boxShadow: isDarkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.5)'
            : '0 20px 60px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              {getBookingTypeEmoji(booking.sub_type || booking.type)}
            </div>
            <div>
              <div className="text-sm opacity-70 mb-1" style={{ color: isDarkMode ? '#C0C0C0' : '#6B7280' }}>
                {booking.booking_number}
              </div>
              <h2 className="text-2xl font-semibold" style={{ 
                color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                fontFamily: 'Poppins, sans-serif'
              }}>
                {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                {booking.sub_type && ` - ${booking.sub_type}`}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full"
            style={{
              background: isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(11, 11, 12, 0.05)'
            }}
          >
            <XCircle size={24} style={{ color: isDarkMode ? '#E5E5E5' : '#0B0B0C' }} />
          </button>
        </div>

        <div className="space-y-4">
          <DetailRow 
            icon={<CheckCircle size={20} />}
            label="Statut"
            value={booking.status}
            valueStyle={{ color: getStatusColor(booking.status) }}
            isDarkMode={isDarkMode}
          />
          <DetailRow 
            icon={<Calendar size={20} />}
            label="Date"
            value={formatDate(booking.booking_date)}
            isDarkMode={isDarkMode}
          />
          <DetailRow 
            icon={<MapPin size={20} />}
            label="Lieu"
            value={booking.location}
            isDarkMode={isDarkMode}
          />
          {booking.guests_count && (
            <DetailRow 
              icon={<User size={20} />}
              label="Invités"
              value={`${booking.guests_count} personne${booking.guests_count !== 1 ? 's' : ''}`}
              isDarkMode={isDarkMode}
            />
          )}
          {booking.price && (
            <DetailRow 
              icon={<DollarSign size={20} />}
              label="Prix"
              value={`${booking.price}€`}
              isDarkMode={isDarkMode}
            />
          )}
          {booking.special_requests && (
            <DetailRow 
              icon={<MessageSquare size={20} />}
              label="Demandes spéciales"
              value={booking.special_requests}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        {booking.status === 'completed' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-6 py-3 rounded-full"
            style={{
              background: isDarkMode ? '#C0C0C0' : '#0B0B0C',
              color: isDarkMode ? '#0B0B0C' : '#FFFFFF',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Laisser un avis
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

function DetailRow({ icon, label, value, valueStyle, isDarkMode }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{ color: isDarkMode ? '#C0C0C0' : '#6B7280' }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm opacity-70 mb-1" style={{ color: isDarkMode ? '#C0C0C0' : '#6B7280' }}>
          {label}
        </div>
        <div className="text-lg" style={{ 
          color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
          ...valueStyle
        }}>
          {value}
        </div>
      </div>
    </div>
  )
}



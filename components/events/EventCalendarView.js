import { useState } from 'react'
import { Lock, Crown, User, MapPin, Calendar, Clock, Users, Euro, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function EventCalendarView({ events, user, onBecomeMember }) {
  const { isDarkMode } = useTheme()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  if (!user?.is_member) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-2xl p-8 text-center transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50' 
            : 'bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-xl'
        }`}>
          <Lock className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={48} />
          <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Accès réservé aux membres</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rejoignez Get Weez pour accéder à nos événements exclusifs à Marbella</p>
          <div className="space-y-3 max-w-sm mx-auto">
            <Link href="/register">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Crown size={16} className="mr-2" />
                Devenir membre
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full bg-transparent border-2 border-purple-500 text-purple-400 py-3 px-6 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center justify-center">
                <User size={16} className="mr-2" />
                Accès membre
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Grouper les événements par date
  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.date).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {})

  // Générer le calendrier
  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const calendar = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      calendar.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return calendar
  }

  const calendar = generateCalendar()
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const hasEventsOnDate = (date) => {
    return events.some(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  return (
    <>
      <style jsx>{`
        .calendar-day {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
        }
        
        .calendar-day:hover {
          background: ${isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'};
          transform: scale(1.05) translateY(-2px);
          box-shadow: ${isDarkMode 
            ? '0 8px 25px rgba(139, 92, 246, 0.3)' 
            : '0 8px 25px rgba(139, 92, 246, 0.15)'};
        }
        
        .calendar-day.has-events {
          background: ${isDarkMode 
            ? 'rgba(139, 92, 246, 0.2)' 
            : 'rgba(139, 92, 246, 0.12)'};
          border: 1px solid ${isDarkMode 
            ? 'rgba(139, 92, 246, 0.5)' 
            : 'rgba(139, 92, 246, 0.3)'};
          box-shadow: ${isDarkMode 
            ? '0 4px 15px rgba(139, 92, 246, 0.2)' 
            : '0 4px 15px rgba(139, 92, 246, 0.1)'};
        }
        
        .calendar-day.selected {
          background: linear-gradient(135deg, #8B5CF6, #3B82F6);
          color: white;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          transform: scale(1.1);
        }
        
        .calendar-day.today {
          background: ${isDarkMode 
            ? 'rgba(245, 158, 11, 0.2)' 
            : 'rgba(245, 158, 11, 0.15)'};
          border: 1px solid ${isDarkMode 
            ? 'rgba(245, 158, 11, 0.5)' 
            : 'rgba(245, 158, 11, 0.4)'};
          box-shadow: ${isDarkMode 
            ? '0 4px 15px rgba(245, 158, 11, 0.2)' 
            : '0 4px 15px rgba(245, 158, 11, 0.1)'};
        }

        .calendar-container {
          backdrop-filter: blur(20px);
          background: ${isDarkMode 
            ? 'rgba(31, 41, 55, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)'};
          border: 1px solid ${isDarkMode 
            ? 'rgba(75, 85, 99, 0.3)' 
            : 'rgba(209, 213, 219, 0.4)'};
          box-shadow: ${isDarkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.3)' 
            : '0 20px 60px rgba(0, 0, 0, 0.1)'};
        }

        .events-sidebar {
          backdrop-filter: blur(20px);
          background: ${isDarkMode 
            ? 'rgba(31, 41, 55, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)'};
          border: 1px solid ${isDarkMode 
            ? 'rgba(75, 85, 99, 0.3)' 
            : 'rgba(209, 213, 219, 0.4)'};
          box-shadow: ${isDarkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.3)' 
            : '0 20px 60px rgba(0, 0, 0, 0.1)'};
          height: fit-content;
          min-height: 600px;
        }

        .calendar-grid {
          border: 1px solid ${isDarkMode 
            ? 'rgba(75, 85, 99, 0.3)' 
            : 'rgba(209, 213, 219, 0.3)'};
          border-radius: 12px;
          overflow: hidden;
        }

        .calendar-day-with-image {
          position: relative;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .calendar-day-with-image::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${isDarkMode 
            ? 'rgba(0, 0, 0, 0.5)' 
            : 'rgba(0, 0, 0, 0.3)'};
          z-index: 1;
        }

        .calendar-day-content {
          position: relative;
          z-index: 2;
        }

        .event-card-upcoming {
          backdrop-filter: blur(10px);
          background: ${isDarkMode 
            ? 'rgba(31, 41, 55, 0.9)' 
            : 'rgba(255, 255, 255, 0.95)'};
          border: 1px solid ${isDarkMode 
            ? 'rgba(75, 85, 99, 0.3)' 
            : 'rgba(209, 213, 219, 0.3)'};
          box-shadow: ${isDarkMode 
            ? '0 12px 32px rgba(0, 0, 0, 0.3)' 
            : '0 12px 32px rgba(0, 0, 0, 0.1)'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .event-card-upcoming:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: ${isDarkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.4)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15)'};
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <div className="lg:col-span-2">
            <div className="calendar-container rounded-3xl p-8 transition-all duration-300">
              {/* Header du calendrier */}
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg shadow-gray-700/30' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg shadow-gray-200/50 border border-gray-200'
                    }`}
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg shadow-gray-700/30' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg shadow-gray-200/50 border border-gray-200'
                    }`}
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
              
              {/* Grille du calendrier */}
              <div className="calendar-grid">
                <div className="grid grid-cols-7">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <div key={day} className={`p-4 text-center text-sm font-semibold border-b ${
                      isDarkMode 
                        ? 'text-gray-400 border-gray-700/50' 
                        : 'text-gray-600 border-gray-200/50'
                    }`}>
                    {day}
                  </div>
                ))}
              </div>
              
                <div className="grid grid-cols-7">
                {calendar.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                  const hasEvents = hasEventsOnDate(date)
                    const dayEvents = getEventsForDate(date)
                    const eventImage = dayEvents.length > 0 ? dayEvents[0].image_url : null
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                        className={`calendar-day relative h-20 text-sm font-medium transition-all duration-300 border-r border-b ${
                          isDarkMode 
                            ? 'border-gray-700/30 hover:border-gray-600/50' 
                            : 'border-gray-200/30 hover:border-gray-300/50'
                        } ${
                          hasEvents ? 'calendar-day-with-image' : ''
                        } ${
                          isCurrentMonth 
                            ? (isDarkMode ? 'text-white' : 'text-gray-900') 
                            : (isDarkMode ? 'text-gray-600' : 'text-gray-400')
                      } ${
                        isToday ? 'today' : ''
                      } ${
                        isSelected ? 'selected' : ''
                      } ${
                        hasEvents ? 'has-events' : ''
                      }`}
                        style={{
                          backgroundImage: eventImage ? `url(${eventImage})` : 'none'
                        }}
                    >
                        <div className="calendar-day-content flex flex-col items-center justify-center h-full">
                          <span className="text-lg font-bold mb-1 drop-shadow-lg">{date.getDate()}</span>
                        {hasEvents && (
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mb-1 shadow-lg"></div>
                              <span className="text-xs font-semibold text-white drop-shadow-lg">
                                {dayEvents.length}
                              </span>
                            </div>
                        )}
                      </div>
                    </button>
                  )
                })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Liste des événements */}
          <div className="lg:col-span-1">
            <div className="events-sidebar rounded-3xl p-6 transition-all duration-300">
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedDate ? 
                  `📅 Événements du ${selectedDate.toLocaleDateString('fr-FR')}` : 
                  '🎉 Événements à venir'
                }
              </h3>
              
              <div className="space-y-6 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
                {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 8)).map(event => {
                  const eventDate = new Date(event.date)
                  const typeColors = {
                    party: '#EC4899',
                    gastronomy: '#EF4444',
                    wellness: '#10B981',
                    show: '#8B5CF6',
                    experience: '#F59E0B',
                    cultural: '#0EA5E9',
                    workshop: '#06B6D4',
                    sport: '#10B981',
                    music: '#8B5CF6',
                    fashion: '#EC4899',
                    festival: '#F59E0B',
                    gala: '#6D28D9',
                    gaming: '#EF4444',
                    competition: '#06B6D4',
                    environmental: '#10B981',
                    market: '#F59E0B'
                  }
                  
                  return (
                    <div 
                      key={event.id}
                      className="event-card-upcoming rounded-2xl overflow-hidden cursor-pointer"
                    >
                      {/* Image de l'événement */}
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={event.image_url} 
                          alt={event.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div 
                          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                          style={{ backgroundColor: typeColors[event.type] }}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="font-bold text-white text-sm drop-shadow-lg line-clamp-2">
                            {event.name}
                          </h4>
                        </div>
                      </div>
                      
                      {/* Contenu de la carte */}
                      <div className="p-4">
                        <div className={`space-y-2 text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex items-center">
                            <Calendar size={12} className="mr-2 flex-shrink-0" />
                          <span>{eventDate.toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock size={12} className="mr-2 flex-shrink-0" />
                          <span>{eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin size={12} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                              <Euro size={12} className="mr-2 flex-shrink-0" />
                              <span className="font-bold text-lg" style={{ color: typeColors[event.type] }}>
                                {event.price}€
                              </span>
                          </div>
                          <div className="flex items-center">
                              <Users size={12} className="mr-2 flex-shrink-0" />
                              <span>{event.capacity} places</span>
                          </div>
                        </div>
                      </div>
                      
                        {/* Bouton élégant */}
                      <button 
                          className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
                        style={{ 
                            background: `linear-gradient(135deg, ${typeColors[event.type]}, ${typeColors[event.type]}CC)`
                        }}
                      >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10">🎟️ RÉSERVER MAINTENANT</span>
                      </button>
                      </div>
                    </div>
                  )
                })}
                
                {(!selectedDate ? events.slice(0, 8) : getEventsForDate(selectedDate)).length === 0 && (
                  <div className="text-center py-8">
                    <Calendar size={32} className={`mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedDate ? 'Aucun événement ce jour' : 'Aucun événement à venir'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
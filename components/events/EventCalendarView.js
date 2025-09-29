import { useState } from 'react'
import { Lock, Crown, User, MapPin, Calendar, Clock, Users, Euro, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function EventCalendarView({ events, user, onBecomeMember }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  if (!user?.is_member) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 text-center">
          <Lock className="mx-auto text-gray-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Accès réservé aux membres</h2>
          <p className="text-gray-400 mb-6">Rejoignez Get Weez pour accéder à nos événements exclusifs à Marbella</p>
          <div className="space-y-3 max-w-sm mx-auto">
            <Link href="/register">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center">
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
          transition: all 0.2s ease;
        }
        
        .calendar-day:hover {
          background: rgba(139, 92, 246, 0.1);
          transform: scale(1.05);
        }
        
        .calendar-day.has-events {
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.5);
        }
        
        .calendar-day.selected {
          background: linear-gradient(135deg, #8B5CF6, #3B82F6);
          color: white;
        }
        
        .calendar-day.today {
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.5);
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
              {/* Header du calendrier */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              
              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendar.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                  const hasEvents = hasEventsOnDate(date)
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`calendar-day p-2 h-12 rounded-lg text-sm transition-all duration-200 ${
                        isCurrentMonth ? 'text-white' : 'text-gray-500'
                      } ${
                        isToday ? 'today' : ''
                      } ${
                        isSelected ? 'selected' : ''
                      } ${
                        hasEvents ? 'has-events' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {hasEvents && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full ml-1"></div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Liste des événements */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">
                {selectedDate ? 
                  `Événements du ${selectedDate.toLocaleDateString('fr-FR')}` : 
                  'Événements à venir'
                }
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 5)).map(event => {
                  const eventDate = new Date(event.date)
                  const typeColors = {
                    party: '#EC4899',
                    gastronomy: '#EF4444',
                    wellness: '#10B981',
                    show: '#8B5CF6',
                    experience: '#F59E0B',
                    cultural: '#0EA5E9',
                    workshop: '#06B6D4'
                  }
                  
                  return (
                    <div 
                      key={event.id}
                      className="p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: typeColors[event.type] + '40',
                        borderLeftColor: typeColors[event.type]
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold text-sm">{event.name}</h4>
                        <div 
                          className="px-2 py-1 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: typeColors[event.type] }}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          <span>{eventDate.toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          <span>{eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={12} className="mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Euro size={12} className="mr-1" />
                            <span>{event.price}</span>
                          </div>
                          <div className="flex items-center">
                            <Users size={12} className="mr-1" />
                            <span>{event.capacity}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="w-full mt-3 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105"
                        style={{ 
                          background: typeColors[event.type] + '20',
                          color: typeColors[event.type],
                          border: `1px solid ${typeColors[event.type]}40`
                        }}
                      >
                        Réserver
                      </button>
                    </div>
                  )
                })}
                
                {(!selectedDate ? events.slice(0, 5) : getEventsForDate(selectedDate)).length === 0 && (
                  <div className="text-center py-8">
                    <Calendar size={32} className="mx-auto text-gray-500 mb-2" />
                    <p className="text-gray-400 text-sm">
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
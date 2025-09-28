import { useState } from 'react'
import Head from 'next/head'
import { MessageCircle, Mic, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Bonjour ! Que puis-je faire pour vous aujourd\'hui ?',
      avatar: 'W'
    },
    {
      id: 2,
      sender: 'ai',
      text: 'Quels sont les événements à venir ce week-end ?'
    }
  ])

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: input,
      avatar: 'U'
    }
    
    setMessages([...messages, newMessage])
    setInput('')
    
    // Simulation réponse IA
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Parfait ! Je vais vous organiser cette expérience à Marbella. Laissez-moi vous proposer les meilleures options...'
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Head>
        <title>Get Weez - Conciergerie Premium Marbella</title>
        <meta name="description" content="Votre assistant personnel avec IA pour organiser votre expérience à Marbella" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <span className="text-white font-bold text-xl">Get Weez</span>
                </div>
                
                <nav className="hidden md:flex space-x-6">
                  <a href="/establishments" className="text-gray-300 hover:text-white transition-colors">Établissements</a>
                  <a href="/events" className="text-gray-300 hover:text-white transition-colors">Événements</a>
                  <a href="/account" className="text-gray-300 hover:text-white transition-colors">Compte</a>
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                <button className="text-gray-300 hover:text-white transition-colors">
                  <span className="text-sm">Français</span>
                </button>
                <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                  Connexion
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Inscription
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chat Section - Centre */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Votre assistant personnel avec IA
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Demandez une expérience à Marbella, et laissez-moi tout organiser pour vous
                  </p>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        {message.sender === 'user' && message.avatar && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mb-2">
                            {message.avatar}
                          </div>
                        )}
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleSend}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                  >
                    <Mic className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-6">
                  <div className="text-gray-400 text-sm mb-3">
                    Commencez une conversation avec Get Weez
                  </div>
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Demandez une expérience à Marbella
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Right */}
            <div className="space-y-6">
              {/* Événements à venir */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Événements à venir</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🏖️</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Beach Party</p>
                        <p className="text-gray-400 text-sm">21 juin - 16h</p>
                      </div>
                    </div>
                    <button className="text-purple-400 text-sm hover:text-purple-300">
                      En savoir plus
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🎷</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Soirée Jazz</p>
                        <p className="text-gray-400 text-sm">26 juin - 22h</p>
                      </div>
                    </div>
                    <button className="text-purple-400 text-sm hover:text-purple-300">
                      En savoir plus
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🍽️</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Dîner Gastronomique</p>
                        <p className="text-gray-400 text-sm">25 juin - 20h</p>
                      </div>
                    </div>
                    <button className="text-purple-400 text-sm hover:text-purple-300">
                      En savoir plus
                    </button>
                  </div>
                </div>
              </div>

              {/* Établissements recommandés */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Établissements recommandés</h2>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                      Sponsorisé
                    </div>
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">Le Club Marin</h3>
                        <p className="text-gray-400 text-sm">28 juin</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                        Réserver
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">La Table de Pierre</h3>
                        <p className="text-gray-400 text-sm">10 juin</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                        Réserver
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">Vista Bar</h3>
                        <p className="text-gray-400 text-sm">25 juin</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import RichMessage from './RichMessage'

export default function ReactiveMessage({ 
  message, 
  isUser, 
  isPlaying = false,
  onPlayVoice 
}) {
  const { isDarkMode } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 50 : -50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <motion.div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser ? 'rounded-br-md' : 'rounded-bl-md'
        } relative group`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #A7C7C5, #9DB4C0)'
            : isDarkMode
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.6)',
          color: isUser ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#0B0B0C'),
          border: isUser
            ? 'none'
            : isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.15)'
              : '1px solid rgba(192, 192, 192, 0.3)',
          backdropFilter: isUser ? 'none' : 'blur(10px)',
          fontFamily: 'Poppins, sans-serif',
          boxShadow: isUser
            ? '0 4px 20px rgba(167, 199, 197, 0.3)'
            : isDarkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.5)'
              : '0 4px 20px rgba(192, 192, 192, 0.2)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Reactive Halo Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isPlaying
              ? [
                  `0 0 20px ${isDarkMode ? 'rgba(192, 192, 192, 0.4)' : 'rgba(167, 199, 197, 0.4)'},
                   0 0 40px ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(167, 199, 197, 0.3)'},
                   0 0 60px ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(167, 199, 197, 0.2)'}`,
                  `0 0 30px ${isDarkMode ? 'rgba(192, 192, 192, 0.6)' : 'rgba(167, 199, 197, 0.6)'},
                   0 0 60px ${isDarkMode ? 'rgba(192, 192, 192, 0.4)' : 'rgba(167, 199, 197, 0.4)'},
                   0 0 90px ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(167, 199, 197, 0.3)'}`,
                  `0 0 20px ${isDarkMode ? 'rgba(192, 192, 192, 0.4)' : 'rgba(167, 199, 197, 0.4)'},
                   0 0 40px ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(167, 199, 197, 0.3)'},
                   0 0 60px ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(167, 199, 197, 0.2)'}`
                ]
              : isHovered && !isUser
                ? `0 0 15px ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(167, 199, 197, 0.3)'},
                   0 0 30px ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(167, 199, 197, 0.2)'}`
                : 'none'
          }}
          transition={{
            duration: isPlaying ? 1.5 : 0.3,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
          animate={{ opacity: isHovered && !isUser ? 0.1 : 0 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${
              isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(167, 199, 197, 0.3)'
            }, transparent)`
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Message Content */}
        <div className="relative z-10">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <RichMessage content={message.content} isDarkMode={isDarkMode} />
          )}
        </div>

        {/* Voice Play Button for AI messages */}
        {!isUser && onPlayVoice && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPlayVoice}
            className="absolute top-2 right-2 p-2 rounded-full transition-all"
            style={{
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
              border: `1px solid ${isDarkMode 
                ? 'rgba(192, 192, 192, 0.2)' 
                : 'rgba(192, 192, 192, 0.3)'}`,
              color: isDarkMode ? '#C0C0C0' : '#0B0B0C'
            }}
          >
            {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>
        )}

        {/* Timestamp */}
        <p 
          className="text-xs mt-2 opacity-60"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {message.timestamp?.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </motion.div>
    </motion.div>
  )
}


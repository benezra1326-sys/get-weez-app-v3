import { useState } from 'react'
import { useRouter } from 'next/router'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
]

export default function LanguageSelector() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0]

  const handleLanguageChange = (locale) => {
    router.push(router.asPath, router.asPath, { locale })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-800/50 transition-colors"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <Globe size={16} />
        <span className="text-sm font-medium">{currentLanguage.flag} {currentLanguage.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-lg border border-gray-700 z-50">
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-800/50 transition-colors ${
                  router.locale === language.code ? 'bg-gray-800/30' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {language.name}
                </span>
                {router.locale === language.code && (
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

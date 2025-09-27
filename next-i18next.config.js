module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es', 'it', 'de', 'pt', 'ru', 'ar', 'zh', 'ja'],
    localeDetection: false,
  },
  fallbackLng: 'fr',
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}

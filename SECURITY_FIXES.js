// 🔒 CORRECTIONS SÉCURITÉ

// 1. Validation des entrées utilisateur
const validateInput = (input) => {
  if (typeof input !== 'string') return false;
  if (input.length > 1000) return false;
  // Échapper les caractères spéciaux
  return input.replace(/[<>]/g, '');
};

// 2. Headers de sécurité
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

// 3. Rate limiting pour les API
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par IP
  message: 'Trop de requêtes, réessayez plus tard'
});

// 4. Validation des données API
const validateApiInput = (req, res, next) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message invalide' });
  }
  
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message trop long' });
  }
  
  next();
};

// 5. Variables d'environnement sécurisées
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Variable d'environnement manquante: ${envVar}`);
  }
});

// 6. Sanitisation des données
const DOMPurify = require('isomorphic-dompurify');

const sanitizeHtml = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};
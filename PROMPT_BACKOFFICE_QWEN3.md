# PROMPT DÉTAILLÉ POUR BACKOFFICE GET WEEZ - QWEN3

## CONTEXTE DE L'APPLICATION

Tu vas créer un système de backoffice administratif complet pour **GET WEEZ**, une application de conciergerie premium basée à Marbella, Espagne. L'application existe déjà et voici son architecture actuelle :

### STACK TECHNIQUE EXISTANT
- **Frontend**: Next.js 14 avec React 18
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Styling**: TailwindCSS + CSS personnalisé
- **Internationalisation**: next-i18next (FR, EN, ES, IT, AR, DE, JA, PT, RU, ZH)
- **Déploiement**: Vercel
- **IA**: OpenAI GPT (chat de conciergerie)

### ARCHITECTURE ACTUELLE DE L'APPLICATION

#### Pages existantes :
- `/` - Page d'accueil avec chat IA de conciergerie
- `/establishments` - Liste des restaurants et établissements
- `/events` - Calendrier des événements
- `/services` - Services de conciergerie
- `/subscriptions` - Plans d'abonnement (Invité, Premium, VIP)
- `/account` - Compte utilisateur
- `/login` & `/register` - Authentification

#### Base de données Supabase existante :

**Table `users`** (système d'auth existant) :
```sql
id (UUID, PK)
email (VARCHAR)
first_name (VARCHAR)
last_name (VARCHAR)
role (VARCHAR) -- 'admin' pour les administrateurs
is_member (BOOLEAN)
phone (VARCHAR)
subscription_type (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Table `establishments`** :
```sql
id (SERIAL, PK)
name (VARCHAR, 255)
type (VARCHAR, 50) -- 'Restaurant', 'Club', 'Bar', etc.
category (VARCHAR, 50) -- 'Japonais', 'Italien', 'Méditerranéen', etc.
description (TEXT)
address (VARCHAR)
phone (VARCHAR)
whatsapp (VARCHAR)
website (VARCHAR)
instagram (VARCHAR)
rating (DECIMAL 2,1)
price_range (VARCHAR) -- '€€', '€€€', '€€€€', etc.
specialties (JSONB) -- Array de spécialités
dishes (JSONB) -- Array de plats avec prix
menu (JSONB) -- Structure de menu complète
services (JSONB) -- Services offerts
ambiance (VARCHAR)
capacity (INTEGER)
sponsored (BOOLEAN)
opening_hours (VARCHAR)
features (JSONB) -- Equipements/services
coordinates (JSONB) -- {lat, lng}
zone (VARCHAR) -- 'Golden Mile', 'Puerto Banús', etc.
image_url (VARCHAR, 500)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Table `events`** :
```sql
id (SERIAL, PK)
name (VARCHAR, 255)
type (VARCHAR, 50) -- 'Soirée plage', 'Concert', 'Festival', etc.
description (TEXT)
date (TIMESTAMP)
time (VARCHAR)
location (VARCHAR)
establishment_id (INTEGER, FK)
price (DECIMAL 10,2)
capacity (INTEGER)
category (VARCHAR, 50) -- 'Musique', 'Gastronomie', etc.
dress_code (VARCHAR)
age_restriction (VARCHAR)
includes (JSONB) -- Ce qui est inclus
dj (VARCHAR)
music_style (VARCHAR)
image_url (VARCHAR, 500)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Table `abonnements`** :
```sql
id (UUID, PK)
nom (VARCHAR, 100)
description (TEXT)
prix_mensuel (DECIMAL 10,2)
prix_annuel (DECIMAL 10,2)
avantages (JSONB)
actif (BOOLEAN)
ordre_affichage (INTEGER)
couleur (VARCHAR, 7) -- Couleur hexadécimale
icone (VARCHAR, 50) -- Nom de l'icône Lucide
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Services** (actuellement en données statiques, à migrer en DB) :
- Gastronomie (restaurants, chef privé, dégustation)
- Vie nocturne (clubs, DJ, événements)
- Luxe (yachts, villas, voitures, hélicoptère, jet privé)
- Bien-être (spa, massage, yoga, coach)
- Expériences (photo, vidéo, shopping, événements)
- Sports (golf, tennis, sports nautiques)
- Culture (musées, galeries)

### DONNÉES EXISTANTES
L'application contient déjà :
- **15 établissements** détaillés (Nobu Marbella, La Terraza del Mar, Ocean Club, etc.)
- **15 événements musicaux** (DJ sets, soirées thématiques)
- **45+ services** répartis en 7 catégories
- **3 plans d'abonnement** (Invité gratuit, Premium 39.99€/mois, VIP 99.99€/mois)
- **Système complet EVG/EVJF** avec villas, activités, packages

## MISSION : CRÉER LE BACKOFFICE ADMINISTRATIF COMPLET

Tu dois créer un backoffice administratif moderne, intuitif et complet qui permet de gérer entièrement l'application Get Weez. Voici les spécifications détaillées :

## 1. ARCHITECTURE DU BACKOFFICE

### Structure des routes :
```
/admin/
├── dashboard/          # Tableau de bord principal
├── users/             # Gestion des utilisateurs
├── establishments/    # Gestion des établissements
├── events/           # Gestion des événements
├── services/         # Gestion des services
├── subscriptions/    # Gestion des abonnements
├── orders/           # Gestion des commandes/réservations
├── analytics/        # Statistiques et analytics
├── content/          # Gestion du contenu
├── settings/         # Paramètres système
└── profile/          # Profil administrateur
```

### Authentification et rôles :
- **Super Admin** : Accès total, gestion des admins
- **Admin** : Gestion du contenu et des utilisateurs
- **Editor** : Modification du contenu uniquement
- **Viewer** : Lecture seule

## 2. DASHBOARD PRINCIPAL (/admin/dashboard)

### Métriques en temps réel :
```jsx
// Structure des widgets de dashboard
const dashboardMetrics = {
  overview: {
    totalUsers: { current: 0, growth: '+0%', period: 'ce mois' },
    totalRevenue: { current: '0€', growth: '+0%', period: 'ce mois' },
    totalBookings: { current: 0, growth: '+0%', period: 'ce mois' },
    activeSubscriptions: { current: 0, growth: '+0%', period: 'ce mois' }
  },
  charts: {
    revenueChart: [], // Données pour graphique des revenus
    userGrowth: [],   // Croissance utilisateurs
    bookingsByCategory: [], // Réservations par catégorie
    popularEstablishments: [] // Établissements populaires
  },
  recentActivity: [], // Activités récentes
  topPerformers: []   // Meilleurs établissements/services
}
```

### Graphiques et visualisations :
- **Revenus mensuels** (graphique linéaire)
- **Nouvelles inscriptions** (graphique en aires)
- **Répartition des abonnements** (camembert)
- **Réservations par établissement** (barres horizontales)
- **Carte thermique des zones populaires** (Marbella)
- **Évolution du taux de conversion** (ligne + aire)

### Alertes et notifications :
- Nouvelles réservations
- Commentaires négatifs (< 3 étoiles)
- Erreurs système
- Seuils de revenus atteints
- Maintenance requise

## 3. GESTION DES UTILISATEURS (/admin/users)

### Liste des utilisateurs avec filtres avancés :
```jsx
const userFilters = {
  role: ['all', 'user', 'admin', 'editor', 'viewer'],
  subscription: ['invité', 'premium', 'vip'],
  status: ['active', 'inactive', 'banned'],
  registrationDate: { from: null, to: null },
  lastActivity: { from: null, to: null },
  searchTerm: ''
}
```

### Fonctionnalités utilisateurs :
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Changement de rôle** avec confirmation
- **Gestion des abonnements** : upgrade/downgrade
- **Historique des actions** utilisateur
- **Suspension/réactivation** de comptes
- **Export des données** (CSV, Excel, PDF)
- **Import en masse** via CSV
- **Envoi d'emails groupés** ou individuels
- **Statistiques utilisateur** détaillées

### Profil utilisateur détaillé :
- Informations personnelles
- Historique des réservations
- Transactions financières
- Préférences et favoris
- Journal d'activité
- Communications (emails envoyés/reçus)

## 4. GESTION DES ÉTABLISSEMENTS (/admin/establishments)

### Interface de gestion complète :
```jsx
const establishmentForm = {
  basicInfo: {
    name: '',
    type: '', // Restaurant, Club, Bar, Café
    category: '', // Japonais, Italien, etc.
    description: '',
    shortDescription: ''
  },
  location: {
    address: '',
    zone: '', // Golden Mile, Puerto Banús, Centre-ville
    coordinates: { lat: null, lng: null },
    mapIntegration: true
  },
  contact: {
    phone: '',
    whatsapp: '',
    website: '',
    email: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      tiktok: ''
    }
  },
  details: {
    rating: 0,
    priceRange: '', // €, €€, €€€, €€€€, €€€€€
    capacity: 0,
    openingHours: {}, // Structure par jour
    features: [], // Terrasse, Vue mer, Parking, etc.
    ambiance: [], // Romantique, Familial, etc.
    dresscode: ''
  },
  menu: {
    categories: [], // Entrées, Plats, Desserts
    specialties: [],
    allergens: []
  },
  media: {
    mainImage: '',
    gallery: [],
    videos: [],
    virtualTour: ''
  },
  business: {
    sponsored: false,
    featured: false,
    commissionRate: 0,
    partnershipLevel: '', // Bronze, Silver, Gold, Platinum
    contractExpiry: null
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    slug: ''
  }
}
```

### Fonctionnalités avancées :
- **Éditeur de menu visuel** avec glisser-déposer
- **Gestion des images** avec redimensionnement automatique
- **Géolocalisation** avec carte interactive
- **Système de notation** et commentaires
- **Gestion des promotions** et offres spéciales
- **Calendrier de disponibilité**
- **Analytics par établissement**
- **Export/Import** des données
- **Templates d'établissements** pour création rapide

## 5. GESTION DES ÉVÉNEMENTS (/admin/events)

### Calendrier événementiel avancé :
```jsx
const eventForm = {
  basicInfo: {
    name: '',
    type: '', // Concert, Soirée, Festival, etc.
    category: '', // Musique, Gastronomie, Sport, etc.
    description: '',
    shortDescription: ''
  },
  scheduling: {
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    timezone: 'Europe/Madrid',
    recurring: {
      enabled: false,
      frequency: '', // daily, weekly, monthly
      interval: 1,
      endType: '', // never, date, count
      endValue: null
    }
  },
  venue: {
    establishmentId: null,
    customLocation: '',
    capacity: 0,
    seatingPlan: null
  },
  ticketing: {
    ticketTypes: [
      {
        name: '', // Standard, VIP, Early Bird
        price: 0,
        quantity: 0,
        description: '',
        perks: []
      }
    ],
    salesStart: null,
    salesEnd: null,
    maxPerPerson: 0
  },
  content: {
    lineup: [], // Artistes, DJ, speakers
    program: [], // Programme détaillé
    includes: [], // Ce qui est inclus
    restrictions: {
      ageMin: null,
      dresscode: '',
      prohibitedItems: []
    }
  },
  marketing: {
    featured: false,
    promoted: false,
    tags: [],
    targetAudience: [],
    promotionalCode: ''
  }
}
```

### Vue calendrier avec :
- **Vue mensuelle/hebdomadaire/journalière**
- **Glisser-déposer** pour reprogrammer
- **Filtres multicritères**
- **Gestion des conflits** de programmation
- **Système de réservation** intégré
- **Notifications automatiques**

## 6. GESTION DES SERVICES (/admin/services)

### Catalogue de services structuré :
```jsx
const serviceCategories = {
  gastronomie: {
    name: 'Gastronomie',
    services: [
      {
        id: 1,
        name: '',
        description: '',
        category: 'gastronomie',
        subcategory: '', // restaurant, chef, dégustation
        pricing: {
          type: '', // fixe, par_heure, sur_devis
          basePrice: 0,
          currency: 'EUR',
          priceModifiers: [] // weekend, saison haute, etc.
        },
        availability: {
          schedule: {},
          advanceBooking: 24, // heures
          maxCapacity: 0
        },
        requirements: {
          minimumAge: null,
          specialRequirements: [],
          cancellationPolicy: ''
        },
        providers: [
          {
            name: '',
            contact: '',
            rating: 0,
            commission: 0
          }
        ]
      }
    ]
  }
  // Répéter pour chaque catégorie
}
```

### Fonctionnalités services :
- **Constructeur de packages** multi-services
- **Gestion des partenaires** et prestataires
- **Système de commissions** automatisé
- **Calendrier de disponibilité** par service
- **Gestion des prix saisonniers**
- **Templates de services** réutilisables
- **Workflow d'approbation** pour nouveaux services

## 7. GESTION DES ABONNEMENTS (/admin/subscriptions)

### Système d'abonnement complet :
```jsx
const subscriptionManagement = {
  plans: {
    create: true,
    edit: true,
    archive: true,
    pricing: {
      monthly: 0,
      annual: 0,
      discounts: [],
      promotions: []
    },
    features: {
      recommendations: 0, // -1 = illimité
      reservations: true,
      exclusiveEvents: true,
      prioritySupport: true,
      personalConcierge: true,
      partnerDiscounts: true
    },
    limits: {
      monthlyBookings: 0,
      conciergeHours: 0,
      premiumEvents: 0
    }
  },
  subscribers: {
    list: [],
    analytics: {},
    churnRate: 0,
    ltv: 0, // Lifetime value
    cohortAnalysis: []
  },
  billing: {
    invoices: [],
    disputes: [],
    refunds: [],
    dunning: [] // Relance automatique
  }
}
```

### Analytics d'abonnements :
- **MRR/ARR** (Monthly/Annual Recurring Revenue)
- **Taux de conversion** par plan
- **Analyse de cohortes**
- **Prédiction de churn**
- **Lifetime Value**
- **Metrics d'engagement** par plan

## 8. GESTION DES COMMANDES/RÉSERVATIONS (/admin/orders)

### Interface de gestion des réservations :
```jsx
const orderManagement = {
  orderStates: [
    'pending',     // En attente
    'confirmed',   // Confirmée
    'preparing',   // En préparation
    'ready',       // Prête
    'completed',   // Terminée
    'cancelled',   // Annulée
    'refunded'     // Remboursée
  ],
  filters: {
    status: 'all',
    dateRange: { from: null, to: null },
    establishment: 'all',
    service: 'all',
    paymentStatus: 'all',
    amount: { min: 0, max: null }
  },
  actions: {
    bulkUpdate: true,
    exportOrders: true,
    sendNotifications: true,
    processRefunds: true
  }
}
```

### Workflow de traitement :
- **États personnalisables** selon le type de service
- **Notifications automatiques** client/prestataire
- **Gestion des paiements** et remboursements
- **Système de commentaires** internes
- **Escalation automatique** si retard
- **Integration calendrier** prestataires

## 9. ANALYTICS ET RAPPORTS (/admin/analytics)

### Tableaux de bord analytiques :
```jsx
const analyticsModules = {
  revenue: {
    charts: ['monthly', 'quarterly', 'annual'],
    breakdowns: ['byService', 'byEstablishment', 'byUser'],
    predictions: true,
    goals: true
  },
  users: {
    acquisition: {
      channels: [], // organic, paid, referral
      costs: {},
      conversion: {}
    },
    retention: {
      cohorts: [],
      churn: {},
      engagement: {}
    },
    segmentation: {
      demographics: {},
      behavior: {},
      preferences: {}
    }
  },
  performance: {
    establishments: {
      ranking: [],
      reviews: {},
      bookings: {}
    },
    services: {
      popularity: [],
      profitability: [],
      seasonal: {}
    },
    events: {
      attendance: [],
      satisfaction: {},
      repeat: {}
    }
  }
}
```

### Rapports exportables :
- **Rapport mensuel** automatisé
- **Analyse de performance** par établissement
- **ROI par canal marketing**
- **Satisfaction client** avec NPS
- **Rapport financier** détaillé
- **Benchmarking concurrentiel**

## 10. GESTION DU CONTENU (/admin/content)

### CMS intégré :
```jsx
const contentManagement = {
  pages: {
    home: { editable: true, sections: [] },
    about: { editable: true, sections: [] },
    contact: { editable: true, sections: [] },
    legal: { editable: true, sections: [] }
  },
  blog: {
    posts: [],
    categories: [],
    tags: [],
    seo: true,
    scheduling: true
  },
  media: {
    library: [],
    folders: [],
    optimizations: true,
    cdn: true
  },
  translations: {
    keys: {},
    languages: ['fr', 'en', 'es', 'it', 'ar', 'de', 'ja', 'pt', 'ru', 'zh'],
    missing: [],
    autoTranslate: false
  }
}
```

### Fonctionnalités éditoriales :
- **Éditeur WYSIWYG** avancé
- **Gestion multilingue** avec traduction
- **Système de révisions** et versions
- **Publication programmée**
- **SEO automatisé** avec suggestions
- **Templates** réutilisables

## 11. PARAMÈTRES SYSTÈME (/admin/settings)

### Configuration globale :
```jsx
const systemSettings = {
  general: {
    siteName: 'Get Weez',
    tagline: 'Your IA Concierge',
    timezone: 'Europe/Madrid',
    currency: 'EUR',
    language: 'fr',
    maintenance: false
  },
  integrations: {
    openai: {
      enabled: true,
      apiKey: '',
      model: 'gpt-4',
      maxTokens: 4096
    },
    stripe: {
      enabled: true,
      publicKey: '',
      secretKey: '',
      webhookSecret: ''
    },
    google: {
      analytics: '',
      maps: '',
      places: ''
    },
    social: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  },
  notifications: {
    email: {
      smtp: {},
      templates: {},
      schedules: []
    },
    push: {
      enabled: true,
      provider: 'firebase',
      config: {}
    },
    sms: {
      enabled: false,
      provider: 'twilio',
      config: {}
    }
  },
  security: {
    twoFactor: true,
    passwordPolicy: {},
    sessionTimeout: 3600,
    allowedIPs: [],
    backups: {
      enabled: true,
      frequency: 'daily',
      retention: 30
    }
  }
}
```

## 12. SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES

### Frontend Requirements :
```jsx
// Structure des composants React
const adminComponents = {
  layout: {
    'AdminLayout.jsx': 'Layout principal avec sidebar',
    'Sidebar.jsx': 'Navigation latérale',
    'TopBar.jsx': 'Barre supérieure',
    'Breadcrumb.jsx': 'Fil d'Ariane'
  },
  common: {
    'DataTable.jsx': 'Table avec tri/filtrage/pagination',
    'FormBuilder.jsx': 'Constructeur de formulaires',
    'Modal.jsx': 'Modales réutilisables',
    'Chart.jsx': 'Composants graphiques',
    'DatePicker.jsx': 'Sélecteur de dates',
    'ImageUploader.jsx': 'Upload d\'images',
    'RichTextEditor.jsx': 'Éditeur de texte riche'
  },
  specific: {
    'Dashboard.jsx': 'Tableau de bord',
    'UserTable.jsx': 'Gestion utilisateurs',
    'EstablishmentForm.jsx': 'Formulaire établissement',
    'EventCalendar.jsx': 'Calendrier événements',
    'OrderTracking.jsx': 'Suivi commandes',
    'AnalyticsPanel.jsx': 'Panneaux analytiques'
  }
}
```

### Base de données - Tables supplémentaires à créer :
```sql
-- Table des logs d'administration
CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id VARCHAR(50),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  service_type VARCHAR(50), -- 'establishment', 'event', 'service'
  service_id INTEGER,
  booking_date TIMESTAMP WITH TIME ZONE,
  booking_details JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  commission DECIMAL(5,2),
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paiements
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  provider_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des avis/commentaires
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  service_type VARCHAR(50),
  service_id INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  reply_from_business TEXT,
  reply_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paramètres système
CREATE TABLE system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### APIs à développer :
```javascript
// Structure des endpoints API
const adminAPIs = {
  // Authentication
  'POST /api/admin/auth/login': 'Connexion admin',
  'POST /api/admin/auth/logout': 'Déconnexion admin',
  'GET /api/admin/auth/profile': 'Profil admin',
  
  // Dashboard
  'GET /api/admin/dashboard/metrics': 'Métriques du dashboard',
  'GET /api/admin/dashboard/charts': 'Données des graphiques',
  'GET /api/admin/dashboard/activity': 'Activité récente',
  
  // Users
  'GET /api/admin/users': 'Liste des utilisateurs',
  'GET /api/admin/users/:id': 'Détail utilisateur',
  'PUT /api/admin/users/:id': 'Modifier utilisateur',
  'DELETE /api/admin/users/:id': 'Supprimer utilisateur',
  'POST /api/admin/users/bulk': 'Actions en masse',
  'GET /api/admin/users/export': 'Export utilisateurs',
  
  // Establishments
  'GET /api/admin/establishments': 'Liste des établissements',
  'POST /api/admin/establishments': 'Créer établissement',
  'GET /api/admin/establishments/:id': 'Détail établissement',
  'PUT /api/admin/establishments/:id': 'Modifier établissement',
  'DELETE /api/admin/establishments/:id': 'Supprimer établissement',
  'POST /api/admin/establishments/:id/images': 'Upload images',
  
  // Events
  'GET /api/admin/events': 'Liste des événements',
  'POST /api/admin/events': 'Créer événement',
  'PUT /api/admin/events/:id': 'Modifier événement',
  'DELETE /api/admin/events/:id': 'Supprimer événement',
  'POST /api/admin/events/bulk': 'Actions en masse événements',
  
  // Analytics
  'GET /api/admin/analytics/revenue': 'Analytics revenus',
  'GET /api/admin/analytics/users': 'Analytics utilisateurs',
  'GET /api/admin/analytics/bookings': 'Analytics réservations',
  'GET /api/admin/analytics/performance': 'Analytics performance',
  
  // Reports
  'POST /api/admin/reports/generate': 'Générer rapport',
  'GET /api/admin/reports/:id/download': 'Télécharger rapport'
}
```

## 13. DESIGN ET UX

### Design System :
```scss
// Palette de couleurs admin
$admin-colors: (
  primary: #8B5CF6,     // Violet Get Weez
  secondary: #3B82F6,   // Bleu
  success: #10B981,     // Vert
  warning: #F59E0B,     // Orange
  error: #EF4444,       // Rouge
  dark: #1F2937,        // Gris foncé
  light: #F9FAFB,       // Gris clair
  muted: #6B7280        // Gris moyen
);

// Typographie
$font-sizes: (
  xs: 0.75rem,
  sm: 0.875rem,
  base: 1rem,
  lg: 1.125rem,
  xl: 1.25rem,
  2xl: 1.5rem,
  3xl: 1.875rem,
  4xl: 2.25rem
);

// Espacements
$spacing: (
  0: 0,
  1: 0.25rem,
  2: 0.5rem,
  3: 0.75rem,
  4: 1rem,
  6: 1.5rem,
  8: 2rem,
  12: 3rem,
  16: 4rem
);
```

### Layout responsive :
- **Desktop** : Sidebar fixe + contenu principal
- **Tablet** : Sidebar collapsible
- **Mobile** : Bottom navigation + drawer menu

### Thème sombre/clair :
- Support complet du mode sombre
- Persistance de la préférence
- Transition fluide entre thèmes

## 14. SÉCURITÉ

### Authentification & Autorisation :
```javascript
const securityFeatures = {
  authentication: {
    twoFactor: true,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true
    }
  },
  authorization: {
    roleBasedAccess: true,
    permissionGranularity: 'action-level',
    resourceOwnership: true,
    auditLog: true
  },
  dataProtection: {
    encryption: 'AES-256',
    tokenExpiry: 3600,
    refreshTokens: true,
    csrfProtection: true,
    xssProtection: true,
    sqlInjectionProtection: true
  }
}
```

### Audit et logging :
- **Action logging** : Toutes les actions admin
- **Access logging** : Connexions et tentatives
- **Data changes** : Avant/après modifications
- **Security events** : Tentatives malveillantes
- **Performance monitoring** : Métriques système

## 15. PERFORMANCES ET OPTIMISATIONS

### Frontend :
```javascript
const performanceOptimizations = {
  codesplitting: {
    routeLevel: true,
    componentLevel: true,
    vendorSplitting: true
  },
  caching: {
    staticAssets: '1y',
    apiResponses: '5m',
    images: '6m',
    serviceWorker: true
  },
  loading: {
    lazyLoading: true,
    infiniteScroll: true,
    skeletonScreens: true,
    progressIndicators: true
  },
  optimization: {
    imageOptimization: true,
    minification: true,
    gzipCompression: true,
    treeshaking: true
  }
}
```

### Backend :
- **Query optimization** avec indexes
- **Caching** Redis pour données fréquentes  
- **Rate limiting** par utilisateur/IP
- **Connection pooling** base de données
- **CDN** pour assets statiques

## 16. TESTS ET QUALITÉ

### Tests à implémenter :
```javascript
const testStrategy = {
  unit: {
    components: 'Jest + Testing Library',
    utilities: 'Jest',
    coverage: '90%+'
  },
  integration: {
    api: 'Supertest',
    database: 'Jest + Supabase test',
    services: 'Mock services'
  },
  e2e: {
    tool: 'Playwright',
    scenarios: [
      'Login flow',
      'CRUD operations',
      'Dashboard navigation',
      'Bulk actions',
      'Report generation'
    ]
  }
}
```

### Assurance qualité :
- **Linting** : ESLint + Prettier
- **Type checking** : TypeScript
- **Accessibility** : WCAG 2.1 AA
- **Performance** : Lighthouse CI
- **Security** : OWASP guidelines

## 17. DÉPLOIEMENT ET DEVOPS

### Infrastructure :
```yaml
# Structure de déploiement
deployment:
  staging:
    url: 'https://admin-staging.getweez.com'
    database: 'supabase-staging'
    cdn: 'cloudfront-staging'
  
  production:
    url: 'https://admin.getweez.com'
    database: 'supabase-prod'
    cdn: 'cloudfront-prod'
    monitoring: 'datadog'
    alerts: 'pagerduty'
```

### CI/CD Pipeline :
- **Tests** automatisés sur PR
- **Build** et optimisation
- **Security scanning**
- **Déploiement automatique** staging
- **Manual approval** pour production
- **Rollback** automatique si erreur

## 18. DOCUMENTATION

### Documentation à créer :
```markdown
/docs/
├── installation.md      # Guide d'installation
├── configuration.md     # Configuration système
├── user-guide.md       # Guide utilisateur admin
├── api-reference.md    # Documentation API
├── components.md       # Documentation composants
├── security.md         # Guide sécurité
├── troubleshooting.md  # Dépannage
└── changelog.md        # Historique des versions
```

## 19. PLANNING ET LIVRABLES

### Phase 1 - Fondations (Sprint 1-2) :
- Authentification et autorisation
- Layout et navigation
- Dashboard de base
- Gestion utilisateurs simple

### Phase 2 - Gestion contenu (Sprint 3-4) :
- CRUD établissements complet
- Gestion événements avec calendrier
- Upload et gestion média
- Système de notifications

### Phase 3 - Analytics & Avancé (Sprint 5-6) :
- Dashboard analytics complet
- Rapports et exports
- Gestion abonnements
- Workflow réservations

### Phase 4 - Finitions & Optimisations (Sprint 7-8) :
- Tests complets
- Optimisations performances
- Documentation
- Formation utilisateurs

## 20. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES

### Workflow de réservation :
```javascript
const bookingWorkflow = {
  steps: [
    {
      name: 'Demande initiale',
      status: 'pending',
      actions: ['confirm', 'modify', 'cancel'],
      notifications: ['client', 'admin'],
      sla: 2 // heures
    },
    {
      name: 'Confirmation',
      status: 'confirmed',
      actions: ['prepare', 'cancel'],
      notifications: ['client', 'provider'],
      sla: 24
    },
    {
      name: 'Préparation',
      status: 'preparing',
      actions: ['ready', 'delay', 'problem'],
      notifications: ['admin'],
      sla: null
    },
    {
      name: 'Service rendu',
      status: 'completed',
      actions: ['review', 'complaint'],
      notifications: ['client'],
      followUp: 24
    }
  ]
}
```

### Système de commissions :
```javascript
const commissionSystem = {
  tiers: {
    bronze: { rate: 0.10, minVolume: 0 },
    silver: { rate: 0.15, minVolume: 10000 },
    gold: { rate: 0.20, minVolume: 50000 },
    platinum: { rate: 0.25, minVolume: 100000 }
  },
  calculation: {
    base: 'net_amount',
    timing: 'monthly',
    payment: 'automatic',
    currency: 'EUR'
  },
  reporting: {
    statement: 'monthly',
    dashboard: 'real_time',
    forecasting: true
  }
}
```

---

## CONSIGNES SPÉCIALES POUR QWEN3

### Style de code :
- Utilise **TypeScript** pour tout le code
- **Composants fonctionnels** React avec hooks
- **CSS Modules** ou **Styled Components**
- **Code splitting** par route et composant
- **Error boundaries** pour la stabilité
- **Performance optimization** avec React.memo, useMemo, useCallback

### Structure des fichiers :
```
src/admin/
├── components/
│   ├── common/
│   ├── layout/
│   └── pages/
├── hooks/
├── services/
├── utils/
├── types/
├── constants/
├── styles/
└── __tests__/
```

### Patterns à respecter :
- **Container/Presentation** components
- **Custom hooks** pour la logique métier
- **Context API** pour l'état global
- **React Query** pour data fetching
- **Form validation** avec Formik/React Hook Form
- **Error handling** centralisé
- **Loading states** systématiques

### Responsive design :
- **Mobile-first** approach
- **Breakpoints** : 320px, 768px, 1024px, 1440px
- **Touch-friendly** sur mobile/tablet
- **Keyboard navigation** complète
- **Screen reader** compatible

### Accessibilité :
- **ARIA labels** sur tous les composants interactifs
- **Focus management** dans les modales
- **Color contrast** conforme WCAG 2.1
- **Semantic HTML** systématique
- **Alt text** sur toutes les images

### Performance :
- **Lazy loading** des routes et composants lourds
- **Virtualization** pour les listes longues
- **Debouncing** sur les recherches
- **Caching** intelligent des requêtes API
- **Bundle size** monitoring

Crée ce backoffice en respectant scrupuleusement ces spécifications. Le résultat doit être un système d'administration moderne, robuste et évolutif qui permet de gérer entièrement l'application Get Weez avec une excellente expérience utilisateur.

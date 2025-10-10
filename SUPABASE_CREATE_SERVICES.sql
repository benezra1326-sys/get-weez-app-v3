-- Créer la table services
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  category TEXT,
  description TEXT,
  price TEXT,
  image_url TEXT,
  contact TEXT,
  sponsoring BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Désactiver RLS pour accès public
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_services_type ON services(type);
CREATE INDEX IF NOT EXISTS idx_services_sponsoring ON services(sponsoring);





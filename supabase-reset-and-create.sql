-- SCRIPT DE RESET ET CRÉATION COMPLÈTE SUPABASE
-- À exécuter dans Supabase SQL Editor

-- 1. SUPPRIMER LES ANCIENNES TABLES
DROP TABLE IF EXISTS establishments CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- 2. CRÉER LA TABLE ESTABLISHMENTS
CREATE TABLE establishments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  zone VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 0.0,
  ambiance VARCHAR(100),
  image_url VARCHAR(500),
  instagram_url VARCHAR(500),
  website_url VARCHAR(500),
  sponsored BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRÉER LA TABLE EVENTS
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  description TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  image_url VARCHAR(500),
  price VARCHAR(100),
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRÉER LA TABLE SERVICES
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  icon VARCHAR(50),
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INDEX POUR PERFORMANCE
CREATE INDEX idx_establishments_type ON establishments(type);
CREATE INDEX idx_establishments_zone ON establishments(zone);
CREATE INDEX idx_establishments_rating ON establishments(rating);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_services_category ON services(category);

-- 6. DÉSACTIVER RLS (pour permettre les insertions)
ALTER TABLE establishments DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- 7. CRÉER POLICIES DE LECTURE PUBLIQUE
CREATE POLICY "Enable read access for all users" ON establishments FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON services FOR SELECT USING (true);

-- MESSAGE FINAL
SELECT '✅ Tables créées avec succès! Vous pouvez maintenant exécuter le script fill-supabase-complete.js' as message;


-- ═══════════════════════════════════════════════════════════
-- SCHEMA COMPLET GLIITZ - À EXÉCUTER DANS SUPABASE SQL EDITOR
-- ═══════════════════════════════════════════════════════════

-- 1. TABLE ESTABLISHMENTS (Restaurants, Hotels, Clubs, etc.)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS establishments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  zone TEXT,
  ambiance TEXT,
  sponsoring BOOLEAN DEFAULT false,
  photos TEXT,
  link_whatsapp TEXT,
  link_website TEXT
);

-- Désactiver RLS pour accès public
ALTER TABLE establishments DISABLE ROW LEVEL SECURITY;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_establishments_type ON establishments(type);
CREATE INDEX IF NOT EXISTS idx_establishments_zone ON establishments(zone);
CREATE INDEX IF NOT EXISTS idx_establishments_sponsoring ON establishments(sponsoring);


-- 2. TABLE EVENTS (Événements, Soirées, Festivals)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  location TEXT,
  price NUMERIC,
  description TEXT,
  image_url TEXT,
  category TEXT,
  sponsoring BOOLEAN DEFAULT false
);

ALTER TABLE events DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);


-- 3. TABLE SERVICES (Chauffeur, Yacht, Chef, etc.)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  description TEXT,
  price TEXT,
  image_url TEXT,
  contact TEXT,
  sponsoring BOOLEAN DEFAULT false
);

ALTER TABLE services DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_services_type ON services(type);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);


-- 4. TABLE USERS (Utilisateurs et Préférences)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  is_member BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS activé pour users (sécurité)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);


-- 5. TABLE CONVERSATIONS (Historique Chat)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
ON conversations FOR UPDATE
USING (auth.uid() = user_id);


-- 6. TABLE FAVORITES (Établissements favoris)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  establishment_id INTEGER REFERENCES establishments(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, establishment_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete favorites"
ON favorites FOR DELETE
USING (auth.uid() = user_id);


-- 7. TABLE RESERVATIONS (Réservations)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  establishment_id INTEGER REFERENCES establishments(id),
  event_id INTEGER REFERENCES events(id),
  service_id INTEGER REFERENCES services(id),
  date TIMESTAMP NOT NULL,
  guests INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reservations"
ON reservations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations"
ON reservations FOR INSERT
WITH CHECK (auth.uid() = user_id);


-- 8. TABLE REVIEWS (Avis utilisateurs)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  establishment_id INTEGER REFERENCES establishments(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are public"
ON reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════
-- VÉRIFICATION
-- ═══════════════════════════════════════════════════════════

-- Afficher toutes les tables créées
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ✅ Après avoir exécuté ce SQL, lancez:
-- node scripts/fill-all-data.js





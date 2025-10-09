-- SQL À EXÉCUTER DANS SUPABASE POUR AJOUTER LES COLONNES MANQUANTES
-- Copiez-collez dans SQL Editor et cliquez "Run"

-- 1. MODIFIER LA TABLE ESTABLISHMENTS
ALTER TABLE establishments 
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS zone VARCHAR(100),
  ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS ambiance VARCHAR(100),
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS website_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500);

-- 2. S'ASSURER QUE ID EST EN SERIAL (auto-increment)
ALTER TABLE establishments ALTER COLUMN id SET DEFAULT nextval('establishments_id_seq');

-- 3. CRÉER LA SÉQUENCE SI ELLE N'EXISTE PAS
CREATE SEQUENCE IF NOT EXISTS establishments_id_seq;
ALTER SEQUENCE establishments_id_seq OWNED BY establishments.id;
SELECT setval('establishments_id_seq', COALESCE((SELECT MAX(id) FROM establishments), 0) + 1, false);

-- 4. PAREIL POUR EVENTS
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS price VARCHAR(100),
  ADD COLUMN IF NOT EXISTS capacity INTEGER;

ALTER TABLE events ALTER COLUMN id SET DEFAULT nextval('events_id_seq');
CREATE SEQUENCE IF NOT EXISTS events_id_seq;
ALTER SEQUENCE events_id_seq OWNED BY events.id;
SELECT setval('events_id_seq', COALESCE((SELECT MAX(id) FROM events), 0) + 1, false);

-- 5. VÉRIFICATION
SELECT 'Colonnes establishments:', string_agg(column_name, ', ') 
FROM information_schema.columns 
WHERE table_name = 'establishments';

SELECT 'Colonnes events:', string_agg(column_name, ', ') 
FROM information_schema.columns 
WHERE table_name = 'events';

SELECT '✅ Colonnes ajoutées! Vous pouvez maintenant exécuter fill-supabase-complete.js' as message;


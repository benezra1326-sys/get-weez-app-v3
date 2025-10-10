-- SQL à exécuter dans Supabase pour ajouter les colonnes Google Places
-- Dashboard > SQL Editor > New Query > Coller ce code > Run

-- Ajouter les colonnes pour establishments
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS rating NUMERIC;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS reviews_count INTEGER;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS price_level TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS opening_hours TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS menu_url TEXT;

-- Vérifier les colonnes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'establishments'
ORDER BY ordinal_position;




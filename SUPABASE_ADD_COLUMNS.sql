-- Ajouter les colonnes manquantes à establishments

ALTER TABLE establishments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS rating NUMERIC;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS reviews_count INTEGER;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS price_level TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS menu_url TEXT;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS opening_hours TEXT;






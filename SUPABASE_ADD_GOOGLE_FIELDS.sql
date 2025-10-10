-- Ajout des champs Google Places manquants à la table establishments

ALTER TABLE public.establishments 
ADD COLUMN IF NOT EXISTS serves_breakfast BOOLEAN DEFAULT false;

ALTER TABLE public.establishments 
ADD COLUMN IF NOT EXISTS serves_brunch BOOLEAN DEFAULT false;

ALTER TABLE public.establishments 
ADD COLUMN IF NOT EXISTS serves_lunch BOOLEAN DEFAULT false;

ALTER TABLE public.establishments 
ADD COLUMN IF NOT EXISTS serves_dinner BOOLEAN DEFAULT true;

ALTER TABLE public.establishments 
ADD COLUMN IF NOT EXISTS primary_type TEXT DEFAULT 'restaurant';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Colonnes Google Places ajoutées avec succès!';
    RAISE NOTICE 'Colonnes: serves_breakfast, serves_brunch, serves_lunch, serves_dinner, primary_type';
END $$;

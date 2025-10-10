-- ⚠️ COPIEZ CE SQL ET EXÉCUTEZ-LE DANS SUPABASE SQL EDITOR ⚠️
-- Sans cela, impossible d'insérer des données !

-- 1. Créer la séquence pour AUTO_INCREMENT
CREATE SEQUENCE IF NOT EXISTS establishments_id_seq;

-- 2. Lier la séquence à la colonne id
ALTER TABLE establishments 
ALTER COLUMN id SET DEFAULT nextval('establishments_id_seq');

-- 3. Attribuer la propriété de la séquence à la table
ALTER SEQUENCE establishments_id_seq OWNED BY establishments.id;

-- 4. Réinitialiser la séquence
SELECT setval('establishments_id_seq', 1, false);

-- 5. Vérification (doit afficher "nextval")
SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'establishments' AND column_name = 'id';

-- ✅ Si vous voyez "nextval('establishments_id_seq'::regclass)" c'est BON!






-- SQL pour configurer la table events
-- Dashboard > SQL Editor > New Query > Coller ce code > Run

-- 1. Configurer l'auto-increment pour id
CREATE SEQUENCE IF NOT EXISTS events_id_seq;
ALTER TABLE events ALTER COLUMN id SET DEFAULT nextval('events_id_seq');
ALTER SEQUENCE events_id_seq OWNED BY events.id;
SELECT setval('events_id_seq', COALESCE((SELECT MAX(id) FROM events), 0) + 1, false);

-- 2. S'assurer que RLS est désactivé (ou créer une policy publique)
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- 3. Vérifier la structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'events'
ORDER BY ordinal_position;



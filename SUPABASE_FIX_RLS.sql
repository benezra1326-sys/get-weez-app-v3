-- ⚠️ IMPORTANT: PERMISSIONS SUPABASE
-- Les données ne sont pas accessibles publiquement car RLS est activé

-- SOLUTION: Permettre la lecture publique des établissements

-- 1. Créer une politique de lecture publique pour establishments
CREATE POLICY "Lecture publique établissements"
ON establishments
FOR SELECT
USING (true);

-- 2. Pareil pour events si nécessaire
CREATE POLICY "Lecture publique événements"
ON events
FOR SELECT
USING (true);

-- 3. Vérifier que RLS est activé (sinon l'activer)
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ✅ Après avoir exécuté ce SQL, les données seront accessibles publiquement en lecture seule





# ⚠️ INSTRUCTIONS URGENTES - Supabase

## 🔴 Problème Actuel

**Supabase n'a PAS les bonnes colonnes !**

La table `establishments` existe mais lui manque :
- ❌ `description`
- ❌ `location`  
- ❌ `zone`
- ❌ `rating`
- ❌ `ambiance`
- ❌ `image_url`
- ❌ `website_url`
- ❌ `instagram_url`

**C'est pour ça que les scripts échouent et que vous voyez toujours les mêmes données (statiques).**

---

## ✅ SOLUTION EN 2 MINUTES

### ÉTAPE 1 : Ouvrez Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet Gliitz
3. Cliquez sur **"SQL Editor"** (menu gauche)
4. Cliquez sur **"New Query"**

### ÉTAPE 2 : Copiez-Collez ce SQL

```sql
-- AJOUTER LES COLONNES MANQUANTES
ALTER TABLE establishments 
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS zone VARCHAR(100),
  ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS ambiance VARCHAR(100),
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS website_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500);

-- CONFIGURER L'AUTO-INCREMENT
CREATE SEQUENCE IF NOT EXISTS establishments_id_seq;
ALTER TABLE establishments ALTER COLUMN id SET DEFAULT nextval('establishments_id_seq');
ALTER SEQUENCE establishments_id_seq OWNED BY establishments.id;
SELECT setval('establishments_id_seq', COALESCE((SELECT MAX(id) FROM establishments), 0) + 1, false);

-- PAREIL POUR EVENTS
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS price VARCHAR(100),
  ADD COLUMN IF NOT EXISTS capacity INTEGER;

CREATE SEQUENCE IF NOT EXISTS events_id_seq;
ALTER TABLE events ALTER COLUMN id SET DEFAULT nextval('events_id_seq');
ALTER SEQUENCE events_id_seq OWNED BY events.id;
SELECT setval('events_id_seq', COALESCE((SELECT MAX(id) FROM events), 0) + 1, false);

SELECT '✅ Colonnes ajoutées!' as message;
```

### ÉTAPE 3 : Cliquez "RUN"

### ÉTAPE 4 : Exécutez le Script

Dites-moi quand c'est fait, et j'exécuterai :
```bash
node scripts/insert-establishments-auto.js
```

---

## 📊 Ce qui se passera après

Une fois les colonnes ajoutées :
- ✅ 10+ établissements insérés
- ✅ L'IA les utilisera immédiatement
- ✅ Les popups fonctionneront au clic
- ✅ Images affichées
- ✅ Plus de données statiques !

---

## 🆘 OU Solution Alternative

**Donnez-moi accès à votre Supabase SQL Editor** et je le fais pour vous en 30 secondes !

---

**Dites-moi quand le SQL est exécuté et je remplis tout !** 🚀


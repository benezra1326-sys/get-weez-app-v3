# 🔴 SUPABASE - PROBLÈME ET SOLUTION FINALE

## ❌ Le Problème

La colonne `id` dans votre table `establishments` n'est PAS en AUTO_INCREMENT.

**Résultat :** Impossible d'insérer des données sans spécifier manuellement les IDs.

---

## ✅ LA SOLUTION (Copier-Coller ce SQL)

### Ouvrez Supabase SQL Editor et exécutez :

```sql
-- 1. CONFIGURER L'AUTO-INCREMENT POUR ESTABLISHMENTS
CREATE SEQUENCE IF NOT EXISTS establishments_id_seq;
ALTER TABLE establishments ALTER COLUMN id SET DEFAULT nextval('establishments_id_seq');
ALTER SEQUENCE establishments_id_seq OWNED BY establishments.id;
SELECT setval('establishments_id_seq', 1, false);

-- 2. PAREIL POUR EVENTS
CREATE SEQUENCE IF NOT EXISTS events_id_seq;
ALTER TABLE events ALTER COLUMN id SET DEFAULT nextval('events_id_seq');
ALTER SEQUENCE events_id_seq OWNED BY events.id;
SELECT setval('events_id_seq', 1, false);

-- 3. VÉRIFICATION
SELECT 'id' as column_name, 
       column_default 
FROM information_schema.columns 
WHERE table_name = 'establishments' AND column_name = 'id';
```

**Si vous voyez `nextval('establishments_id_seq')` → C'est bon ! ✅**

---

## 🚀 Après l'Exécution du SQL

Exécutez ce script dans votre terminal :

```bash
node scripts/insert-many-establishments.js
```

**Résultat attendu :**
```
✅ Nikki Beach Marbella (ID: 1)
✅ Dani García (ID: 2)
✅ Nobu Marbella (ID: 3)
...
🎉 TOTAL: 20 établissements
```

---

## 📞 Besoin d'Aide ?

Si ça ne marche toujours pas après avoir exécuté le SQL :

**Envoyez-moi une capture d'écran de :**
1. Supabase → Table Editor → establishments (pour voir les colonnes)
2. Le résultat du SQL ci-dessus

Et je trouverai la solution exacte !

---

**Status :** ⏳ Attend exécution SQL dans Supabase


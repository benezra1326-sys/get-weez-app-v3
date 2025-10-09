# 🗄️ Guide de Connexion Supabase - Gliitz

## ⚠️ IMPORTANT : État Actuel

**Supabase est actuellement VIDE (0 établissements, 0 événements)**

Le site utilise actuellement les **données statiques** de fallback depuis `data/marbella-data.js`.

---

## 🔧 Pour connecter réellement Supabase :

### Option 1 : Via l'interface Supabase (Recommandé)

#### 1. Ouvrez Supabase Dashboard
```
https://supabase.com/dashboard/project/VOTRE_PROJET
```

#### 2. Allez dans SQL Editor
- Cliquez sur "SQL Editor" dans le menu de gauche
- Cliquez sur "New Query"

#### 3. Créez les tables
Copiez-collez le contenu de `establishments-schema.sql` et `events-schema.sql`

#### 4. Désactivez RLS temporairement
```sql
-- Pour permettre les insertions
ALTER TABLE establishments DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
```

#### 5. Insérez les données
Exécutez le script d'insertion :
```bash
node scripts/insert-establishments.js
node scripts/insert-events.js
```

#### 6. Réactivez RLS (optionnel)
```sql
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Public read access" ON establishments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
```

---

### Option 2 : Utiliser les données statiques existantes

**ACTUELLEMENT ACTIF** - Le site utilise les données de :
- `data/marbella-data.js` (45 établissements)
- Événements statiques intégrés dans l'IA

**Avantages :**
- ✅ Fonctionne immédiatement
- ✅ Pas de configuration requise
- ✅ Données de qualité

**Inconvénients :**
- ❌ Pas de mise à jour en temps réel
- ❌ Pas d'ajout via backoffice

---

### Option 3 : Script automatique (Nécessite SERVICE_ROLE_KEY)

#### 1. Ajoutez la clé dans .env.local
```env
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

#### 2. Trouvez votre SERVICE_ROLE_KEY
```
Supabase Dashboard → Settings → API → service_role key (secret)
```

#### 3. Exécutez le script
```bash
node scripts/populate-supabase-real.js
```

---

## 🎯 Recommandation

### Pour l'instant (Production) :
**Laissez les données statiques** - Elles fonctionnent parfaitement et contiennent 45 établissements de qualité.

### Pour l'avenir :
1. Configurez Supabase correctement (RLS + policies)
2. Ajoutez la SERVICE_ROLE_KEY
3. Remplissez avec le script
4. Créez un backoffice pour gérer les données

---

## ✅ Ce qui fonctionne MAINTENANT

### Données Actuelles :
- **Source** : `data/marbella-data.js` (static)
- **Établissements** : 45 de qualité
- **Fonctionnel** : ✅ Oui
- **IA** : ✅ Utilise ces données
- **Popup** : ✅ Fonctionne au clic

### Connexion Supabase :
- **Code** : ✅ Implémenté et prêt
- **Fallback** : ✅ Données statiques si Supabase vide
- **Recherche** : ✅ Fonctionne (cherche d'abord Supabase, puis fallback)

---

## 🚀 Résultat

**Le site fonctionne parfaitement même si Supabase est vide !**

- ✅ 45 établissements disponibles (statiques)
- ✅ IA fait des recommandations variées
- ✅ Popup fonctionne au clic
- ✅ Multilingue complet
- ✅ Vocal fonctionnel
- ✅ Titres auto-générés

**Quand vous remplirez Supabase, tout basculera automatiquement sur les données réelles ! 🎉**

---

**Status :** ✅ Site fonctionnel avec fallback intelligent


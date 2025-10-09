# 🗄️ Guide Complet Supabase - Remplissage des Données

## 📋 Situation Actuelle

**Supabase est vide (0 établissements, 0 événements)**

Le site fonctionne avec un **fallback intelligent** sur les données statiques de `data/marbella-data.js` (45 établissements).

---

## 🚀 Pour Remplir Supabase en 3 Étapes

### ÉTAPE 1 : Créer les Tables

1. **Allez sur Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/VOTRE_PROJET
   ```

2. **Cliquez sur "SQL Editor"** (menu gauche)

3. **Cliquez sur "New Query"**

4. **Copiez-collez le contenu de** `supabase-reset-and-create.sql`

5. **Cliquez sur "Run"**

✅ Les tables seront créées avec le bon schéma !

---

### ÉTAPE 2 : Remplir avec des Données

**Vous avez 2 options :**

#### Option A : Script Automatique (Recommandé)

```bash
# Assurez-vous d'avoir la SERVICE_ROLE_KEY dans .env.local
node scripts/fill-supabase-complete.js
```

Ce script insère :
- **50+ établissements réels** (restaurants, clubs, beach clubs, etc.)
- **20+ événements** (festivals, soirées, concerts, etc.)
- **Images** depuis Unsplash

#### Option B : Manuel via Scripts Existants

```bash
node scripts/insert-establishments.js
node scripts/insert-events.js
```

---

### ÉTAPE 3 : Vérifier

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
  const { count: estabCount } = await supabase.from('establishments').select('*', { count: 'exact', head: true });
  const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
  console.log('Établissements:', estabCount);
  console.log('Événements:', eventCount);
})();
"
```

---

## 🔑 Service Role Key (Nécessaire)

### Où la trouver ?

1. Supabase Dashboard → **Settings** → **API**
2. Section "**Project API keys**"
3. Copiez la clé `service_role` (secret)

### Ajoutez dans `.env.local`

```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...votre_cle_ici
```

⚠️ **ATTENTION** : Cette clé est secrète ! Ne la commitez jamais !

---

## 📊 Données Incluses

### Établissements (50+)
- **Restaurants Étoilés** : Dani García, Skina, Messina
- **Japonais** : Nobu, Takumi, Ninja Sushi Bar
- **Beach Clubs** : Nikki Beach, Ocean Club, Trocadero Arena
- **Clubs** : Olivia Valere, Pangea, Suite Club
- **Lounges** : Sky Lounge, Buddha Beach, Amare Beach
- **Et bien plus...**

### Événements (20+)
- Starlite Festival
- White Party Nikki Beach
- Sunset Jazz Sessions
- Wellness Retreats
- Fashion Shows
- Live Concerts
- Beach Festivals
- **Et plus...**

---

## ✨ Ce qui Se Passe Après

Une fois Supabase rempli :

1. **L'IA utilisera les données Supabase** automatiquement
2. **Les popups afficheront** les vraies fiches produits
3. **Les images** s'afficheront sur les bannières
4. **Mises à jour en temps réel** possibles
5. **Backoffice** pour gérer les données

---

## 🔧 Troubleshooting

### "RLS policy violation"
**Solution** : Le SQL dans `supabase-reset-and-create.sql` désactive déjà RLS

### "Column not found"
**Solution** : Exécutez d'abord `supabase-reset-and-create.sql` pour créer les bonnes colonnes

### Script bloqué
**Solution** : Vérifiez que SUPABASE_SERVICE_ROLE_KEY est dans `.env.local`

---

## 📂 Fichiers Créés

1. `supabase-reset-and-create.sql` - Création tables
2. `scripts/fill-supabase-complete.js` - Remplissage automatique
3. `lib/supabaseData.js` - Connexion et requêtes
4. `SUPABASE_SETUP_COMPLETE.md` - Ce guide

---

## ✅ Résumé

| Étape | Fichier | Action |
|-------|---------|--------|
| 1 | `supabase-reset-and-create.sql` | Exécuter dans SQL Editor |
| 2 | `scripts/fill-supabase-complete.js` | `node scripts/fill-supabase-complete.js` |
| 3 | Vérification | Script de vérification ci-dessus |

**Temps estimé :** 5 minutes

**Une fois fait :** Le site utilisera automatiquement les données Supabase ! 🎉

---

**Status :** ✅ Code prêt, attend clé SERVICE_ROLE et exécution SQL


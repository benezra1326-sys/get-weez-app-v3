# 🚀 Guide de Déploiement - Gliitz v7.2

## 📋 Checklist Complète

### ✅ Étape 1: Prérequis
- [ ] Node.js 18.0.0+ installé
- [ ] Compte Supabase créé
- [ ] Projet Supabase configuré
- [ ] Clé API ElevenLabs (optionnel)

### ✅ Étape 2: Configuration Base de Données
1. **Ouvrir Supabase Dashboard**
   - Aller sur https://supabase.com/dashboard
   - Sélectionner votre projet

2. **Exécuter le Schema SQL**
   - Cliquer sur "SQL Editor" dans le menu
   - Cliquer sur "New Query"
   - Copier-coller le contenu de `supabase-schema-v7.2.sql`
   - Cliquer sur "Run"

3. **Vérifier la Création**
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'gliitz%';
   ```
   Doit retourner:
   - gliitz_users
   - gliitz_bookings
   - gliitz_user_preferences
   - gliitz_user_events
   - gliitz_feedback
   - gliitz_notifications
   - gliitz_user_favorites
   - gliitz_user_activity

### ✅ Étape 3: Configuration Next.js

1. **Créer/Mettre à jour `.env.local`**
   ```bash
   cd /Users/avishay/Downloads/get\ weez
   nano .env.local
   ```

2. **Ajouter les variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ELEVENLABS_API_KEY=your-elevenlabs-key
   ```

3. **Sauvegarder et quitter**
   - Ctrl+X
   - Y
   - Enter

### ✅ Étape 4: Installation des Dépendances

```bash
cd /Users/avishay/Downloads/get\ weez/scripts/gliitz-v7.2
npm install
```

### ✅ Étape 5: Tests du Système

1. **Test de Connexion Supabase**
   ```bash
   node -e "
   import('@supabase/supabase-js').then(({ createClient }) => {
     const supabase = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
     );
     console.log('✅ Supabase connecté');
   });
   "
   ```

2. **Test des Réservations**
   ```bash
   npm test
   ```
   Devrait créer 5 réservations de test et afficher:
   - ✅ 5/5 tests réussis
   - Numéros de réservation générés
   - Temps de réponse moyen
   - Rapport sauvegardé

3. **Test du Module Vocal (si ElevenLabs configuré)**
   ```bash
   node -e "
   import('./lib/elevenlabs-voice.js').then(module => {
     module.testVoiceModule();
   });
   "
   ```

### ✅ Étape 6: Vérification Frontend

1. **Lancer le serveur de développement**
   ```bash
   cd /Users/avishay/Downloads/get\ weez
   npm run dev
   ```

2. **Tester les pages**
   - [ ] http://localhost:3000/account - Dashboard utilisateur
   - [ ] http://localhost:3000/bookings - Liste réservations
   - [ ] http://localhost:3000/ - Chat avec réservations

3. **Vérifier les fonctionnalités**
   - [ ] Dashboard charge les données
   - [ ] Réservations s'affichent
   - [ ] Filtres fonctionnent
   - [ ] Modal de détails s'ouvre
   - [ ] Statistiques sont correctes

### ✅ Étape 7: Test de Réservation Réelle

1. **Via le Chat**
   - Ouvrir http://localhost:3000
   - Se connecter avec `user_test_001`
   - Envoyer: "Réserve-moi un restaurant japonais pour ce soir"

2. **Vérifications**
   - [ ] Message de confirmation affiché
   - [ ] Numéro de réservation généré
   - [ ] Visible dans /bookings
   - [ ] Notification créée
   - [ ] Stats dashboard mises à jour

3. **Vérifier dans Supabase**
   ```sql
   SELECT * FROM gliitz_bookings ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM gliitz_notifications ORDER BY created_at DESC LIMIT 1;
   ```

## 🎯 Points de Vérification Critiques

### Base de Données
- [x] Toutes les tables créées
- [x] Fonctions SQL opérationnelles
- [x] Triggers configurés
- [x] Index créés
- [x] RLS désactivé
- [x] Données de test insérées

### API Routes
- [x] `/api/users/[user_id]` - Fonctionnel
- [x] `/api/bookings/user/[user_id]` - Fonctionnel
- [x] `/api/bookings/new` - Fonctionnel
- [x] `/api/dashboard/[user_id]` - Fonctionnel

### Pages Frontend
- [x] `/account` - Créée et fonctionnelle
- [x] `/bookings` - Créée et fonctionnelle
- [x] Components mis à jour

### Modules Backend
- [x] `lib/booking-engine.js` - Créé
- [x] `lib/elevenlabs-voice.js` - Créé
- [x] Intégration avec chat

## 🔧 Dépannage

### Erreur: "Could not find table"
**Solution**: Exécuter à nouveau le SQL schema dans Supabase

### Erreur: "Variables manquantes"
**Solution**: Vérifier `.env.local` et redémarrer le serveur

### Erreur: "ElevenLabs API"
**Solution**: Module vocal est optionnel, les réservations fonctionnent sans

### Page Dashboard vide
**Solution**: 
1. Vérifier que l'utilisateur existe dans `gliitz_users`
2. Vérifier les permissions Supabase
3. Consulter la console du navigateur pour les erreurs

### Réservations ne s'affichent pas
**Solution**:
1. Vérifier que `user_id` correspond
2. Exécuter: `SELECT * FROM gliitz_bookings WHERE user_id = 'user_test_001';`
3. Vérifier RLS désactivé

## 📊 Indicateurs de Succès

### Déploiement Réussi Si:
- ✅ Dashboard charge en < 1s
- ✅ Réservations créées en < 500ms
- ✅ Notifications générées automatiquement
- ✅ Stats en temps réel
- ✅ Interface responsive
- ✅ Aucune erreur console
- ✅ Tests passent à 100%

## 🎉 Déploiement Terminé !

Une fois tous les tests validés:
1. Commit les changements
2. Push vers le repository
3. Déployer sur Vercel/Netlify
4. Configurer les variables d'environnement
5. Vérifier en production

## 📞 Support

En cas de problème:
1. Vérifier les logs Supabase
2. Consulter la console navigateur
3. Exécuter les tests de diagnostic
4. Vérifier les permissions API

---

**Gliitz v7.2** - *Système complet et opérationnel* 🚀✨


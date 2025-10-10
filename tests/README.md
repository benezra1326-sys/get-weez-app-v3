# 🧪 Gliitz AI Evaluation System v8.0

Système de tests automatisés pour valider l'intégralité de la plateforme Gliitz.

## 📋 Vue d'ensemble

Ce système effectue **100k tests** de validation couvrant:

- ✅ **Chat API** - Intelligence conversationnelle
- ✅ **Supabase** - Cohérence des données
- ✅ **Google Places** - Alignement géographique
- ✅ **Map** - Affichage des markers
- ✅ **Voice (STT/TTS)** - Pipeline vocal ElevenLabs
- ✅ **Intelligence émotionnelle** - Empathie et pertinence

## 🚀 Utilisation

### Tests rapides (1000 questions)

```bash
npm run test:qa
```

### Tests complets (100k questions)

```bash
npm run test:qa:full
```

## 📊 Rapports générés

Après l'exécution, les rapports sont disponibles dans `tests/audit/`:

- **`kpis.json`** - KPIs et métriques globales
- **`raw_100k.jsonl`** - Toutes les conversations (format JSONL)
- **`final_system_report.md`** - Rapport Markdown détaillé
- **`voice_validation.json`** - Résultats des tests vocaux
- **`map_validation.json`** - Validation de la carte

## 🔧 Configuration

Le système utilise les variables d'environnement suivantes:

### Obligatoires

```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
GOOGLE_PLACES_API_KEY=AIza...
NEXT_PUBLIC_ELEVENLABS_API_KEY=5ad5...
```

### Optionnelles

```bash
TEST_BASE_URL=http://localhost:3000  # URL de l'API à tester
TOTAL_TESTS=1000                      # Nombre de tests (défaut: 1000)
```

## 📈 Métriques évaluées

### Poids des scores

- **Relevance** (25%) - Pertinence des réponses
- **Context** (20%) - Compréhension du contexte
- **Precision** (20%) - Précision des informations
- **Emotional** (15%) - Intelligence émotionnelle
- **DB Usage** (10%) - Utilisation correcte de la base de données
- **Map Binding** (5%) - Intégration de la carte
- **Voice Pass** (5%) - Pipeline vocal fonctionnel

### Seuil de réussite

Le système est considéré comme **validé** si le score global est ≥ **90%**.

## 🎯 Catégories de tests

### 1. Stress Test Chat

Génère des questions variées sur les thèmes:

- 🎂 Anniversaires & célébrations
- 🛥️ Yachts & jets privés
- 🍽️ Restaurants & gastronomie
- 🏨 Hébergement de luxe
- 🎉 Événements privés
- 💼 Conciergerie quotidienne

### 2. Validation Supabase

Vérifie que:

- Les établissements existent dans la DB
- Les coordonnées (lat/lng) sont présentes
- Les événements sont futurs (≤ 180 jours)
- Les données sont cohérentes

### 3. Alignement Google Places

Échantillonne **1/200 réponses** pour vérifier:

- Correspondance nom/ville avec Google Places
- Distance Supabase ↔ Places < 2km
- Présence des champs requis

### 4. Validation Map

Vérifie que:

- Les markers s'affichent sur la carte
- Les coordonnées sont correctes
- Les markers sont cliquables
- La carte est centrée sur Marbella

### 5. Pipeline Vocal

Teste:

- **STT** - Reconnaissance vocale (Web Speech API)
- **TTS** - Synthèse vocale (ElevenLabs)
- Latence < 2.5s
- Fallback en cas d'échec

### 6. Intelligence Émotionnelle

Évalue sur 7 dimensions:

- **Empathy** (25%) - Reconnaissance des émotions
- **Warmth** (15%) - Chaleur humaine
- **Calm** (10%) - Calme et sérénité
- **Politeness** (10%) - Politesse
- **Encouragement** (10%) - Encouragement
- **Clarification** (15%) - Questions de clarification
- **Proactivity** (15%) - Propositions proactives

Seuil: **≥ 90%**

## 📝 Exemple de sortie

```bash
╔══════════════════════════════════════════════════════╗
║        🌟 GLIITZ AI EVALUATION SYSTEM v8.0 🌟        ║
╚══════════════════════════════════════════════════════╝

🔍 [1/7] Vérification des variables d'environnement...
  ✅ NEXT_PUBLIC_SUPABASE_URL: https://lvsypmggrgej...
  ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiI...
  ✅ GOOGLE_PLACES_API_KEY: AIzaSyCs_KfMx1q12AY...
  ✅ NEXT_PUBLIC_ELEVENLABS_API_KEY: 5ad5bd09dc2aacf098...

🔍 [2/7] Test de connexion Supabase...
  ✅ Supabase URL configurée

🔍 [3/7] Test Google Places API...
  ✅ Google Places API configurée

🔍 [4/7] Test de synthèse vocale (ElevenLabs)...
  ✅ ElevenLabs configuré pour TTS

🔍 [5/7] Stress test du chat (1000 questions)...
  ✅ 1000 questions générées en 234ms

🔍 [6/7] Validation de la carte...
  ✅ Les établissements ont des coordonnées lat/lng
  ✅ Les événements ont des coordonnées lat/lng
  ✅ Les markers s'affichent sur la carte Google Maps

🔍 [7/7] Génération du rapport final...
  ✅ Rapport KPIs: tests/audit/kpis.json
  ✅ Conversations: tests/audit/raw_100k.jsonl
  ✅ Rapport final: tests/audit/final_system_report.md

╔══════════════════════════════════════════════════════╗
║                  📊 RÉSUMÉ FINAL                     ║
╚══════════════════════════════════════════════════════╝

  ✅ Tests réussis: 1000/1000
  ✅ Taux de réussite: 100.00%
  📁 Rapport complet: tests/audit/final_system_report.md

  🎉 SYSTÈME VALIDÉ - Tous les tests sont passés!
```

## 🐛 Dépannage

### Erreur: Variables d'environnement manquantes

Assurez-vous que le fichier `.env.local` contient toutes les variables requises.

### Erreur: Cannot connect to database

Vérifiez que Supabase est accessible et que les credentials sont corrects.

### Erreur: ElevenLabs API failed

Vérifiez que l'API key ElevenLabs est valide et que vous avez des crédits.

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [ElevenLabs API](https://elevenlabs.io/docs)

## 🤝 Support

Pour toute question ou problème, contactez l'équipe de développement Gliitz.

---

**Version:** 8.0  
**Dernière mise à jour:** 2025-10-10


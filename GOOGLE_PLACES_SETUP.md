# 🗺️ Configuration Google Places API - Gliitz

## ✅ Module Créé et Prêt

Le module Google Places est **implémenté** et attend juste votre clé API !

**Fichier :** `lib/googlePlaces.js`

---

## 🔑 Configuration

### 1. Ajoutez la clé dans `.env.local`

```env
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=VOTRE_CLE_ICI
```

### 2. Redémarrez le serveur

```bash
npm run dev
```

---

## 🎯 Fonctionnalités Disponibles

### 1. **searchPlaces(query, location, radius)**
Recherche d'établissements par texte

```javascript
import { searchPlaces } from '../lib/googlePlaces'

// Rechercher des restaurants japonais
const results = await searchPlaces('restaurant japonais', { lat: 36.5103, lng: -4.8836 }, 5000)
```

### 2. **getPlaceDetails(placeId)**
Détails complets d'un établissement

```javascript
import { getPlaceDetails } from '../lib/googlePlaces'

const details = await getPlaceDetails('ChIJ...')
// Retourne: nom, téléphone, site web, horaires, photos, avis
```

### 3. **searchNearby(location, type, radius)**
Établissements à proximité

```javascript
import { searchNearby } from '../lib/googlePlaces'

const nearby = await searchNearby({ lat: 36.5103, lng: -4.8836 }, 'restaurant', 5000)
```

---

## 🔄 Intégration dans le Chat

Le chat peut maintenant utiliser Google Places pour :

1. **Recherches en temps réel** d'établissements
2. **Photos réelles** depuis Google Maps
3. **Avis et ratings** authentiques
4. **Horaires d'ouverture** actualisés
5. **Liens Google Maps** directs

**L'IA basculera automatiquement** sur Google Places quand la clé sera configurée !

---

## 📊 Données Retournées

```javascript
{
  name: "Nobu Marbella",
  type: "Restaurant",
  location: "Puente Romano, Marbella",
  rating: 4.8,
  review_count: 1250,
  price_level: "€€€€",
  photo_url: "https://maps.googleapis.com/...",
  place_id: "ChIJ...",
  google_maps_url: "https://www.google.com/maps/..."
}
```

---

## ✅ Prêt à utiliser dès que vous ajoutez la clé !

**Ajoutez juste :** `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=...` dans `.env.local`


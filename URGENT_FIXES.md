# 🚨 CORRECTIONS URGENTES À FAIRE

## 1. BOUTON CHAT FLOTTANT - PAS VISIBLE
**Problème:** Le bouton ne s'affiche pas dans le DOM
**Cause possible:** 
- useTheme() bloque le rendu
- router.pathname condition incorrecte
- Z-index trop bas

**Solution:** Simplifier le composant, z-index 99999, forcer le rendu

## 2. DÉCALAGE MOBILE VERS LA GAUCHE
**Problème:** overflow-x pas bien géré
**Solution:** 
- width: 100vw sur body
- overflow-x: hidden partout
- max-width: 100% sur toutes les sections

## 3. À FAIRE AUSSI:
- Menu mobile design Gliitz
- Images Hero selon prompt
- OpenAI connexion chat
- Animations "Pourquoi Gliitz"

## JE CORRIGE MAINTENANT !


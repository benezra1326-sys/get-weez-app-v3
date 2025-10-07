# 🎨 Gestion des Designs - Structure des Versions

## 📋 Structure des Branches et Tags

### 🏷️ **Tag v1**
- **VERSION 1 - DESIGN ORIGINAL**
- Design stable avec chat mobile et boutons flottants
- ⭐ Version de référence sauvegardée
- Tag créé le: 7 Octobre 2025

### 🔵 **main**
- Branche principale de production
- Contient actuellement la v1

### 🟢 **design-original-backup**
- Branche de backup pointant vers la v1
- ⚠️ **NE PAS MODIFIER CETTE BRANCHE** - Elle sert uniquement de référence

### 🚀 **v2** (branche actuelle)
- **NOUVELLE VERSION EN DÉVELOPPEMENT**
- Branche de travail pour le nouveau design (v2)
- C'est ici que tous les nouveaux changements de design seront effectués
- Point de départ: identique à la v1

---

## 🔄 Comment Utiliser les Branches

### Pour travailler sur la V2 (nouveau design)
```bash
git checkout v2
```
Vous êtes actuellement sur cette branche ✅

### Pour revenir temporairement à la V1 (design original)
```bash
# Via le tag
git checkout v1

# Via la branche de backup
git checkout design-original-backup

# Via main (si v1 est mergée)
git checkout main
```

### Pour comparer v1 et v2
```bash
# Voir les différences entre v1 et v2
git diff v1 v2

# Voir les différences pour un fichier spécifique
git diff v1 v2 -- styles/globals.css
```

### Pour récupérer un élément de la v1
```bash
# Si vous voulez récupérer un élément de la v1 dans la v2
git checkout v1 -- chemin/vers/fichier.css
```

---

## 📦 Fichiers Principaux du Design

Les fichiers suivants contiennent l'essentiel du design actuel :

### 🎨 **Styles**
- `styles/globals.css` - Styles globaux principaux
- `styles/mobile.css` - Styles mobile
- `styles/mobile-chat.css` - Styles du chat mobile
- `styles/desktop.css` - Styles desktop
- `styles/fonts.css` - Polices
- `styles/animations.css` - Animations

### 🧩 **Composants UI**
- `components/ui/` - Tous les composants d'interface
- `components/layout/` - Composants de layout
- `components/mobile/` - Composants mobile spécifiques

### ⚙️ **Configuration**
- `contexts/ThemeContext.js` - Contexte de thème
- `tailwind.config.js` - Configuration Tailwind
- `next.config.js` - Configuration Next.js

---

## 💡 Recommandations

1. **Toujours committer sur `v2`** pendant le développement du nouveau design
2. **Ne jamais modifier `design-original-backup`** ni le **tag `v1`** - c'est votre filet de sécurité
3. **Faire des commits réguliers** sur `v2` pour pouvoir revenir en arrière si besoin
4. **Tester régulièrement** le nouveau design avant de merger sur `main`

---

## 🚀 Une fois la V2 validée

Quand la v2 est prête et testée :

```bash
# Merger la v2 dans main
git checkout main
git merge v2

# Créer le tag v2
git tag -a v2 -m "v2 - Nouveau design"

# Pousser sur le remote
git push origin main
git push origin --tags
```

---

## 📝 État Actuel

- ✅ **v1 sauvegardée** - Tag créé + branche `design-original-backup`
- ✅ **Branche v2 créée** - Prête pour le développement
- 🎯 **En cours** : Développement de la v2

**Date de création v1**: 7 Octobre 2025
**v1 contient**: Chat mobile, boutons flottants, optimisations diverses
**v2 commence**: À partir de la v1 comme base


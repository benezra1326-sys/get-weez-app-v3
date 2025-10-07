# 🎨 Gestion des Designs - Structure des Branches

## 📋 Structure des Branches

### 🔵 **main**
- Branche principale de production
- Contient le design original stable (dernier commit avant refonte)

### 🟢 **design-original-backup**
- **BACKUP DU DESIGN ORIGINAL**
- Point de sauvegarde avant la refonte du design
- Commit: "Backup: Design original avant refonte - état stable avec chat mobile et boutons"
- ⚠️ **NE PAS MODIFIER CETTE BRANCHE** - Elle sert uniquement de référence

### 🟡 **new-design** (branche actuelle)
- Branche de travail pour le nouveau design
- C'est ici que tous les nouveaux changements de design seront effectués
- Point de départ: identique au design original

---

## 🔄 Comment Utiliser les Branches

### Pour travailler sur le NOUVEAU design (par défaut)
```bash
git checkout new-design
```
Vous êtes actuellement sur cette branche ✅

### Pour revenir temporairement au DESIGN ORIGINAL (consultation)
```bash
git checkout design-original-backup
# ou
git checkout main
```

### Pour comparer les deux designs
```bash
# Voir les différences entre l'original et le nouveau
git diff design-original-backup new-design

# Voir les différences pour un fichier spécifique
git diff design-original-backup new-design -- styles/globals.css
```

### Pour récupérer un fichier du design original
```bash
# Si vous voulez récupérer un élément du design original
git checkout design-original-backup -- chemin/vers/fichier.css
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

1. **Toujours committer sur `new-design`** pendant le développement du nouveau design
2. **Ne jamais modifier `design-original-backup`** - c'est votre filet de sécurité
3. **Faire des commits réguliers** sur `new-design` pour pouvoir revenir en arrière si besoin
4. **Tester régulièrement** le nouveau design avant de merger sur `main`

---

## 🚀 Une fois le nouveau design validé

Quand le nouveau design est prêt et testé :

```bash
# Merger le nouveau design dans main
git checkout main
git merge new-design

# Pousser sur le remote
git push origin main

# Optionnel: pousser aussi le backup
git push origin design-original-backup
```

---

## 📝 État Actuel

- ✅ **Design original sauvegardé** sur `design-original-backup`
- ✅ **Branche de travail créée** : `new-design`
- 🎯 **Prêt pour la refonte du design**

**Date de backup**: 7 Octobre 2025
**Derniers changements sauvegardés**: Chat mobile, boutons flottants, optimisations diverses


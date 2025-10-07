# 🎨 Guide Rapide de Stylisation Gliitz

## Transformations à Appliquer

### Pages Événements & Services

**Remplacer partout :**

```javascript
// AVANT (violet/bleu)
background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)'
boxShadow: '0 12px 48px rgba(168, 85, 247, 0.4)'

// APRÈS (argenté Gliitz)
background: 'var(--gradient-silver)'
boxShadow: 'var(--shadow-glow-strong)'
```

```javascript
// AVANT
backgroundColor: isDarkMode ? '#0a0a0f' : '#f9fafb'

// APRÈS
backgroundColor: isDarkMode ? 'var(--gliitz-black)' : 'var(--gliitz-gray-light)'
```

```javascript
// AVANT
className="text-white"
color: '#ffffff'

// APRÈS (sur fond argenté)
color: 'var(--gliitz-black)'
style={{ fontFamily: 'var(--font-family-display)' }}
```

```javascript
// AVANT (filtres/cards)
background: isDarkMode 
  ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95)...)'
  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95)...)'

// APRÈS
className="glass"
backdropFilter: 'var(--glass-backdrop)'
borderColor: 'var(--glass-border)'
```

### Boutons

```javascript
// AVANT
className="bg-purple-600 hover:bg-purple-700"

// APRÈS
className="btn-silver halo"
```

### Cartes

```javascript
// AVANT
className="bg-white dark:bg-gray-800 rounded-xl"

// APRÈS
className="card-silver hover-lift"
```

### Titres

```javascript
// AVANT
<h1 className="text-3xl font-bold">Titre</h1>

// APRÈS
<h1 
  className="text-3xl font-bold"
  style={{ 
    fontFamily: 'var(--font-family-display)',
    color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
  }}
>
  Titre
</h1>
```

### Textes

```javascript
// AVANT
<p className="text-gray-700">Texte</p>

// APRÈS
<p style={{ 
  fontFamily: 'var(--font-family-primary)',
  color: 'var(--color-text-secondary)'
}}>
  Texte
</p>
```

---

## Pages Auth (Login/Register)

```javascript
// Conteneur principal
<div className="glass card-silver max-w-md mx-auto p-8">

// Input
<input className="input-glass w-full" />

// Bouton principal
<button className="btn-silver w-full halo">Se connecter</button>

// Bouton secondaire
<button className="btn-silver-outline w-full">S'inscrire</button>

// Liens
<a className="text-silver hover:underline">Mot de passe oublié ?</a>
```

---

## Page Mon Profil

```javascript
// Onglets
<button className={`
  ${active ? 'btn-silver' : 'btn-ghost'}
`}>
  Profil
</button>

// Carte de section
<div className="card-silver p-6 mb-4">
  <h3 style={{ 
    fontFamily: 'var(--font-family-display)',
    color: 'var(--gliitz-silver)'
  }}>
    Informations
  </h3>
</div>

// Photo de profil
<div className="img-silver-frame w-24 h-24 rounded-full overflow-hidden">
  <img src={user.avatar} alt="Profile" />
</div>
```

---

## Composant Chat IA

```javascript
// Bulle Gliitz
<div className="bubble-gliitz">
  Message de l'IA
</div>

// Bulle utilisateur
<div className="bubble-user ml-auto">
  Message utilisateur
</div>

// Input de saisie
<div className="glass p-4">
  <input 
    className="input-glass w-full" 
    placeholder="Posez votre question..."
  />
  <button className="btn-silver halo">
    <Send size={20} />
  </button>
</div>

// Indicateur de saisie
<div className="text-silver text-sm italic">
  Gliitz est en train d'écrire...
</div>
```

---

## Footer Universel

```javascript
<footer style={{ 
  background: 'var(--gliitz-black)',
  color: 'var(--gliitz-silver)',
  padding: '4rem 1rem'
}}>
  <div className="container mx-auto">
    <h2 
      className="text-4xl font-bold metallic text-center mb-4"
      style={{ fontFamily: 'var(--font-family-display)' }}
    >
      Gliitz
    </h2>
    
    <p 
      className="text-center mb-8"
      style={{ fontFamily: 'var(--font-family-primary)' }}
    >
      Powered by AI ✨
    </p>
    
    {/* Grille Contact/Services/Localisation */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      {/* ... */}
    </div>
    
    <div 
      className="text-center mt-8 pt-8"
      style={{ borderTop: '1px solid var(--gliitz-silver-dark)' }}
    >
      <p style={{ color: 'var(--gliitz-silver-light)' }}>
        © 2025 Gliitz. Powered by AI Gliitz ✨
      </p>
    </div>
  </div>
</footer>
```

---

## Classes CSS Gliitz - Référence Rapide

| Classe | Utilisation |
|--------|-------------|
| `.glass` | Glassmorphism de base |
| `.glass-dark` | Glassmorphism mode sombre |
| `.glass-strong` | Glassmorphism plus opaque |
| `.card-silver` | Carte argentée avec hover |
| `.btn-silver` | Bouton argenté principal |
| `.btn-silver-outline` | Bouton argenté outline |
| `.btn-ghost` | Bouton transparent |
| `.halo` | Effet de halo au hover |
| `.halo-strong` | Halo plus fort |
| `.section-light` | Section fond clair |
| `.section-dark` | Section fond sombre |
| `.section-glass` | Section glassmorphism |
| `.input-glass` | Input en verre dépoli |
| `.bubble-gliitz` | Bulle de chat IA |
| `.bubble-user` | Bulle de chat utilisateur |
| `.text-silver` | Texte couleur argent |
| `.text-gradient` | Texte avec dégradé |
| `.metallic` | Effet métallique animé |
| `.shimmer` | Effet de brillance |
| `.fade-in` | Animation fade in |
| `.hover-lift` | Élévation au hover |
| `.hover-glow` | Lumière au hover |
| `.shadow-glow` | Ombre lumineuse |
| `.shadow-glow-strong` | Ombre lumineuse forte |
| `.img-silver-frame` | Cadre argenté pour images |
| `.badge-silver` | Badge argenté |

---

## Variables CSS - Référence Rapide

```css
/* Couleurs */
var(--gliitz-silver)        /* #C0C0C0 */
var(--gliitz-white)         /* #FFFFFF */
var(--gliitz-black)         /* #0B0B0C */
var(--gliitz-gray-light)    /* #F8F8F8 */
var(--gliitz-silver-light)  /* #E8E8E8 */
var(--gliitz-silver-dark)   /* #A0A0A0 */

/* Dégradés */
var(--gradient-silver)
var(--gradient-silver-glow)

/* Ombres */
var(--shadow-soft)
var(--shadow-medium)
var(--shadow-strong)
var(--shadow-glow)
var(--shadow-glow-strong)

/* Glassmorphism */
var(--glass-bg)
var(--glass-border)
var(--glass-backdrop)

/* Polices */
var(--font-family-display)  /* Playfair Display */
var(--font-family-primary)  /* Poppins */

/* Espacements */
var(--spacing-xs) /* 0.5rem */
var(--spacing-sm) /* 1rem */
var(--spacing-md) /* 1.5rem */
var(--spacing-lg) /* 2rem */
var(--spacing-xl) /* 3rem */

/* Radius */
var(--radius-sm)  /* 8px */
var(--radius-md)  /* 12px */
var(--radius-lg)  /* 16px */
var(--radius-xl)  /* 24px */
```

---

## Checklist par Page

### ✅ Page Établissements
- [x] Bannière hero argentée
- [x] Filtres glassmorphism
- [x] Cartes argentées
- [x] Boutons argentés
- [x] Polices Gliitz

### ⏳ Page Événements
- [ ] Bannière hero argentée
- [ ] Cartes événements argentées
- [ ] Boutons "Réserver" argentés
- [ ] Calendrier glassmorphism
- [ ] Polices Gliitz

### ⏳ Page Services
- [ ] Bannière hero argentée
- [ ] Cartes services argentées
- [ ] Icônes argentées
- [ ] Boutons "Demander" argentés
- [ ] Polices Gliitz

### ⏸️ Page Login
- [ ] Formulaire glassmorphism
- [ ] Inputs glass
- [ ] Boutons argentés
- [ ] Liens argentés
- [ ] Polices Gliitz

### ⏸️ Page Register
- [ ] Formulaire glassmorphism
- [ ] Inputs glass
- [ ] Boutons argentés
- [ ] Polices Gliitz

### ⏸️ Page Mon Profil
- [ ] Onglets argentés
- [ ] Cartes glass
- [ ] Photo cadre argenté
- [ ] Inputs glass
- [ ] Toggle thème stylisé
- [ ] Polices Gliitz

### ⏸️ Composant Chat
- [ ] Bulles .bubble-gliitz
- [ ] Bulles .bubble-user
- [ ] Input glass
- [ ] Bouton envoi argenté
- [ ] Indicateur argenté
- [ ] Polices Gliitz

---

*Guide créé le 7 Octobre 2025*  
*Pour v2 Gliitz*


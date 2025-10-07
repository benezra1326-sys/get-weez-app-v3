# 🎨 GLIITZ V2 - Spécifications Finales EXACTES

## ✅ CE QUI EST FAIT

### Hero de la Page d'Accueil ✅
- ✅ Fond : Image rooftop avec overlay `rgba(0,0,0,0.25)`
- ✅ Titre : `Playfair Display, 600, #FFFFFF`
- ✅ Sous-titre : `Poppins, 400, #E0E0E0`
- ✅ Badge IA : `rgba(255,255,255,0.15)` avec blur(12px)
- ✅ Bouton CTA : `linear-gradient(135deg, #E0E0E0, #C0C0C0)` avec texte `#0B0B0C`
- ✅ Stats : Cartes glassmorphism `rgba(255,255,255,0.1)`

---

## 🎨 SPÉCIFICATIONS EXACTES À APPLIQUER PARTOUT

### PALETTE DE COULEURS

```css
/* Couleurs principales */
--primary: #C0C0C0              /* Argent */
--primary-gradient: linear-gradient(135deg, #E0E0E0, #C0C0C0)
--secondary: #FFFFFF            /* Blanc */
--accent: #F4F4F4               /* Gris très clair */

/* Backgrounds */
--bg-light: #FFFFFF             /* Fond clair */
--bg-dark: #0B0B0C              /* Fond sombre */

/* Texte */
--text-dark: #0B0B0C            /* Texte sur fond clair */
--text-light: #FFFFFF           /* Texte sur fond sombre */
--text-subtitle: #E0E0E0        /* Sous-titres */

/* Effets */
--border: rgba(255,255,255,0.25)
--glass-bg: rgba(255,255,255,0.15)
--halo: rgba(192,192,192,0.5)
--shadow: rgba(0,0,0,0.15)
```

### POLICES

```css
/* Titres (h1, h2, h3) */
font-family: 'Playfair Display, serif'
font-weight: 600
color: #0B0B0C (sur fond clair) ou #FFFFFF (sur fond sombre)
sizes: h1: 3rem, h2: 2rem, h3: 1.5rem

/* Corps de texte */
font-family: 'Poppins, sans-serif'
font-weight: 400
font-size: 1rem
color: #0B0B0C (sur fond clair) ou #E0E0E0 (sur fond sombre)
```

### EFFETS GLASS

```css
/* Glass de base */
background: rgba(255,255,255,0.15)
border: 1px solid rgba(255,255,255,0.25)
backdrop-filter: blur(12px)
box-shadow: 0 4px 20px rgba(0,0,0,0.1)
```

### BOUTONS

#### Bouton Primary (Argenté)
```css
background: linear-gradient(135deg, #E0E0E0, #C0C0C0)
color: #0B0B0C
border-radius: 12px
font-family: Poppins, sans-serif
font-weight: 500
padding: 12px 24px
transition: all 0.3s ease

/* Hover */
background: linear-gradient(135deg, #FFFFFF, #D0D0D0)
box-shadow: 0 0 10px rgba(192,192,192,0.5)
```

#### Bouton Secondary (Outline)
```css
background: transparent
border: 1px solid #C0C0C0
color: #C0C0C0

/* Hover */
background: rgba(255,255,255,0.1)
color: #FFFFFF
```

### CARTES

```css
/* Carte de base */
background: rgba(255,255,255,0.1)
border-radius: 20px
padding: 16px
box-shadow: 0 4px 20px rgba(0,0,0,0.1)
transition: all 0.3s ease

/* Hover */
transform: translateY(-4px)
box-shadow: 0 4px 20px rgba(192,192,192,0.4)
```

```css
/* Carte Glass */
background: rgba(255,255,255,0.15)
border: 1px solid rgba(255,255,255,0.25)
backdrop-filter: blur(12px)
```

### INPUTS

```css
background: rgba(255,255,255,0.1)
border: 1px solid rgba(255,255,255,0.25)
border-radius: 12px
padding: 12px 16px
color: #FFFFFF
font-family: Poppins, sans-serif

/* Focus */
border-color: #C0C0C0
box-shadow: 0 0 10px rgba(192,192,192,0.4)
```

---

## 📄 PAGES À CORRIGER

### ✅ index.js (Page d'Accueil)
**Hero déjà fait ✅ - Reste à faire :**

#### Section Suggestions Personnalisées
```jsx
// Titre de section
<h2 style={{
  fontFamily: 'Playfair Display, serif',
  fontWeight: 600,
  fontSize: '2rem',
  color: '#0B0B0C',  // ou #FFFFFF sur fond sombre
  marginBottom: '1rem'
}}>
  Nos recommandations personnalisées
</h2>

// Sous-titre
<p style={{
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 400,
  color: '#666666',
  fontSize: '1rem'
}}>
  Découvrez les meilleurs...
</p>

// Cartes d'établissement/événement
<div style={{
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '20px',
  padding: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease'
}}>
  {/* Contenu */}
</div>

// Bouton "Découvrir"
<button style={{
  background: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
  color: '#0B0B0C',
  borderRadius: '12px',
  padding: '12px 24px',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 500,
  border: 'none'
}}>
  Découvrir
</button>
```

#### Footer
```jsx
<footer style={{
  background: '#0B0B0C',
  color: '#C0C0C0',
  padding: '32px 0',
  textAlign: 'center'
}}>
  <h2 style={{
    fontFamily: 'Playfair Display, serif',
    fontWeight: 600,
    fontSize: '2rem',
    color: '#C0C0C0',
    marginBottom: '1rem'
  }}>
    Gliitz
  </h2>
  <p style={{
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    color: '#E0E0E0'
  }}>
    Powered by AI ✨
  </p>
</footer>
```

### ⏸️ establishments.js
**Remplacer :**
- Bannière violette → Gradient argenté `linear-gradient(135deg, #E0E0E0, #C0C0C0)`
- Texte blanc → `#0B0B0C` sur fond argenté
- Cartes → `rgba(255,255,255,0.1)` avec glassmorphism
- Boutons → Style argenté exact
- Filtres → Glassmorphism avec `rgba(255,255,255,0.15)`

### ⏸️ events.js
**Appliquer :**
- Hero avec fond sombre + overlay `rgba(0,0,0,0.25)`
- Cartes événements glassmorphism
- Boutons "Réserver" en argenté
- Titres en Playfair Display
- Corps en Poppins

### ⏸️ services.js
**Appliquer :**
- Hero argenté
- Cartes services glassmorphism
- Icônes avec fond `rgba(255,255,255,0.1)`
- Boutons "Demander" argentés
- Polices exactes

### ⏸️ login.js & register.js
```jsx
// Conteneur principal
<div style={{
  maxWidth: '400px',
  margin: '0 auto',
  padding: '32px',
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.25)',
  backdropFilter: 'blur(12px)',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
}}>
  
  {/* Titre */}
  <h1 style={{
    fontFamily: 'Playfair Display, serif',
    fontWeight: 600,
    fontSize: '2rem',
    color: '#0B0B0C',
    marginBottom: '1.5rem',
    textAlign: 'center'
  }}>
    Connexion
  </h1>
  
  {/* Input */}
  <input style={{
    width: '100%',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontFamily: 'Poppins, sans-serif',
    color: '#0B0B0C',
    marginBottom: '1rem'
  }} />
  
  {/* Bouton */}
  <button style={{
    width: '100%',
    background: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
    color: '#0B0B0C',
    borderRadius: '12px',
    padding: '14px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer'
  }}>
    Se connecter
  </button>
  
  {/* Lien */}
  <a style={{
    color: '#C0C0C0',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'block',
    marginTop: '1rem',
    textAlign: 'center'
  }}>
    Mot de passe oublié ?
  </a>
</div>
```

### ⏸️ account.js (Mon Profil)
```jsx
// Onglets
<button style={{
  background: isActive ? 'linear-gradient(135deg, #E0E0E0, #C0C0C0)' : 'transparent',
  color: isActive ? '#0B0B0C' : '#C0C0C0',
  border: '1px solid #C0C0C0',
  borderRadius: '12px',
  padding: '10px 20px',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 500
}}>
  Profil
</button>

// Cartes de section
<div style={{
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
}}>
  <h3 style={{
    fontFamily: 'Playfair Display, serif',
    fontWeight: 600,
    fontSize: '1.5rem',
    color: '#0B0B0C',
    marginBottom: '1rem'
  }}>
    Informations personnelles
  </h3>
</div>

// Photo de profil
<div style={{
  width: '96px',
  height: '96px',
  borderRadius: '50%',
  border: '3px solid #C0C0C0',
  boxShadow: '0 0 15px rgba(192,192,192,0.4)',
  overflow: 'hidden'
}}>
  <img src={avatar} alt="Profile" />
</div>
```

---

## 🎯 NAVBAR (HeaderGliitz.js)

```jsx
// Header
<header style={{
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(12px)',
  height: '72px',
  borderBottom: '1px solid rgba(255,255,255,0.25)'
}}>
  
  {/* Liens */}
  <a style={{
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    color: '#C0C0C0',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  }}>
    Accueil
  </a>
  
  {/* Hover */}
  onMouseEnter={(e) => {
    e.target.style.color = '#FFFFFF'
    e.target.style.textShadow = '0 0 10px rgba(192,192,192,0.6)'
  }}
  
  {/* Icône profil */}
  <div style={{
    color: '#C0C0C0',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }}>
    👤
  </div>
</header>
```

---

## 💬 CHAT IA (Composants Chat)

```jsx
// Bulle Gliitz (IA)
<div style={{
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.25)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px 16px 16px 4px',
  padding: '12px 16px',
  maxWidth: '80%',
  fontFamily: 'Poppins, sans-serif',
  color: '#0B0B0C'
}}>
  Message de l'IA
</div>

// Bulle utilisateur
<div style={{
  background: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
  borderRadius: '16px 16px 4px 16px',
  padding: '12px 16px',
  maxWidth: '80%',
  marginLeft: 'auto',
  fontFamily: 'Poppins, sans-serif',
  color: '#0B0B0C'
}}>
  Message utilisateur
</div>

// Input de chat
<div style={{
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '20px',
  padding: '12px',
  display: 'flex',
  gap: '12px',
  border: '1px solid rgba(255,255,255,0.25)'
}}>
  <input style={{
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#0B0B0C',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none'
  }} placeholder="Votre message..." />
  
  <button style={{
    background: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
    color: '#0B0B0C',
    border: 'none',
    borderRadius: '12px',
    padding: '8px 16px',
    cursor: 'pointer'
  }}>
    Envoyer
  </button>
</div>

// Indicateur "en train d'écrire"
<p style={{
  fontFamily: 'Poppins, sans-serif',
  fontSize: '14px',
  color: '#C0C0C0',
  fontStyle: 'italic'
}}>
  Gliitz est en train d'écrire...
</p>
```

---

## 🎨 BOUTON CHAT FLOTTANT

```jsx
<button style={{
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: '#C0C0C0',
  color: '#0B0B0C',
  fontSize: '24px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 0 20px rgba(192,192,192,0.6)',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}
onMouseEnter={(e) => {
  e.target.style.transform = 'scale(1.05)'
  e.target.style.boxShadow = '0 0 25px rgba(192,192,192,0.8)'
}}
onMouseLeave={(e) => {
  e.target.style.transform = 'scale(1)'
  e.target.style.boxShadow = '0 0 20px rgba(192,192,192,0.6)'
}}
>
  💬
</button>
```

---

## ✅ CHECKLIST FINALE

### Pages
- [x] index.js - Hero ✅
- [ ] index.js - Reste des sections
- [ ] establishments.js
- [ ] events.js
- [ ] services.js
- [ ] login.js
- [ ] register.js
- [ ] account.js

### Composants
- [ ] HeaderGliitz.js (navbar)
- [ ] Chat components
- [ ] EstablishmentCard
- [ ] EventCard
- [ ] ServiceCard
- [ ] Bouton flottant

### Globaux
- [ ] Footer partout

---

## 🚀 MÉTHODE RAPIDE

Pour chaque fichier :

1. **Chercher** tous les `className` avec couleurs (purple, violet, blue)
2. **Remplacer** par les styles inline avec couleurs exactes
3. **Chercher** tous les `fontFamily` et vérifier Playfair/Poppins
4. **Chercher** tous les `background:` et appliquer glassmorphism
5. **Chercher** tous les boutons et appliquer le style argenté
6. **Tester** en mode light et dark

---

*Spécifications finales - 7 Octobre 2025*
*Basé sur le JSON fourni par l'utilisateur*


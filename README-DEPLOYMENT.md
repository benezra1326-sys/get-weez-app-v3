# Déploiement Get Weez sur Vercel

## Variables d'environnement requises

### Obligatoire
- `OPENAI_API_KEY` : Votre clé API OpenAI

### Optionnel
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase (optionnel)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase (optionnel)

## Instructions de déploiement

1. **Connectez votre compte GitHub à Vercel**
2. **Importez ce repository**
3. **Configurez les variables d'environnement dans Vercel**
4. **Déployez**

## Configuration Vercel

### Variables d'environnement à ajouter dans Vercel :
```
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key
```

### Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: ./
- **Build Command**: npm run build
- **Output Directory**: .next

## Fonctionnalités

- ✅ Chat IA avec OpenAI
- ✅ Interface responsive mobile/desktop
- ✅ Multi-langue (FR/EN/ES/IT/DE/PT/RU/AR/ZH/JA)
- ✅ Système de fallback si OpenAI indisponible
- ✅ Design moderne avec Tailwind CSS
- ✅ Supabase optionnel (fonctionne sans)

## Support

L'application fonctionne même sans Supabase configuré grâce au système de fallback.

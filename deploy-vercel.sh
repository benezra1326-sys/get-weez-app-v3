#!/bin/bash

echo "🚀 Déploiement de Get Weez sur Vercel"
echo "======================================"

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé"
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    echo "Assurez-vous d'être dans le répertoire du projet"
    exit 1
fi

echo "✅ Vérification des fichiers..."
echo "📁 Répertoire: $(pwd)"
echo "📄 Package.json: $(cat package.json | grep '"name"')"

# Build de test
echo "🔨 Test de compilation..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Compilation réussie"
else
    echo "❌ Erreur de compilation"
    exit 1
fi

# Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "🎉 Déploiement terminé !"
echo "📝 N'oubliez pas de configurer les variables d'environnement dans Vercel :"
echo "   - OPENAI_API_KEY"
echo "   - NEXT_PUBLIC_SUPABASE_URL (optionnel)"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY (optionnel)"

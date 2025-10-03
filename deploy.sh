#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT GET WEEZ
# Objectif : Faciliter le déploiement de l'application

echo "🚀 DÉPLOIEMENT GET WEEZ"
echo "========================"

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Veuillez installer Git d'abord."
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm d'abord."
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi"
else
    echo "❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "🎯 ÉTAPES SUIVANTES POUR LE DÉPLOIEMENT :"
echo "=========================================="
echo ""
echo "1. 📁 Créer un repository GitHub :"
echo "   - Aller sur github.com"
echo "   - Créer un nouveau repository 'gliitz'"
echo "   - Copier l'URL du repository"
echo ""
echo "2. 🔗 Pousser le code vers GitHub :"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit'"
echo "   git branch -M main"
echo "   git remote add origin <URL_DU_REPOSITORY>"
echo "   git push -u origin fraime"
echo ""
echo "3. 🚀 Déployer sur Vercel :"
echo "   - Aller sur vercel.com"
echo "   - Se connecter avec GitHub"
echo "   - Cliquer sur 'New Project'"
echo "   - Sélectionner le repository 'gliitz'"
echo "   - Ajouter les variables d'environnement"
echo "   - Cliquer sur 'Deploy'"
echo ""
echo "4. 🔐 Variables d'environnement requises :"
echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
echo "   OPENAI_API_KEY=your_openai_api_key"
echo ""
echo "5. 🎉 Votre application sera accessible via un lien Vercel !"
echo ""
echo "📖 Guide complet : DEPLOYMENT_GUIDE.md"
echo "🎯 Support : Consultez le guide de déploiement pour plus de détails"

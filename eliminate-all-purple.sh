#!/bin/bash

echo "🎨 ÉLIMINATION TOTALE de TOUTES les couleurs violettes/bleues..."

# Remplacer toutes les box-shadow violettes par argentées
find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/rgba(168, 85, 247/rgba(192, 192, 192/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/rgba(139, 92, 246/rgba(192, 192, 192/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/rgba(59, 130, 246/rgba(192, 192, 192/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/rgba(245, 158, 11/rgba(192, 192, 192/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/rgba(37, 99, 235/rgba(192, 192, 192/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/rgba(29, 78, 216/rgba(160, 160, 160/g' {} +

# Remplacer les classes Tailwind
find . -type f \( -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/bg-purple-/bg-gray-/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/text-purple-/text-gray-/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/text-blue-/text-gray-/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/bg-blue-/bg-gray-/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/shadow-purple-/shadow-gray-/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/shadow-blue-/shadow-gray-/g' {} +

echo "✅ Élimination terminée !"
echo "🔍 Vérification finale..."
grep -r "rgba(168, 85, 247\|rgba(139, 92, 246\|rgba(59, 130, 246\|purple\|violet" --include="*.js" --include="*.jsx" --include="*.css" . 2>/dev/null | grep -v node_modules | grep -v .next | grep -v backup | wc -l


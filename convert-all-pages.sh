#!/bin/bash

echo "🎨 CONVERSION MASSIVE - Toutes les pages au design Gliitz..."

# Liste des fichiers à convertir
FILES=(
  "pages/events.js"
  "pages/services.js"
  "pages/login.js"
  "pages/register.js"
  "pages/establishments.js"
  "pages/event/[id].js"
  "pages/service/[id].js"
  "pages/establishment/[id].js"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Conversion: $file"
    
    # Remplacer couleurs de fond
    sed -i '' 's/#0a0a0f/#0B0B0C/g' "$file"
    sed -i '' 's/#f9fafb/#F8F8F8/g' "$file"
    
    # Remplacer toutes les classes Tailwind colorées
    sed -i '' 's/from-purple-/from-gray-/g' "$file"
    sed -i '' 's/to-purple-/to-gray-/g' "$file"
    sed -i '' 's/from-violet-/from-gray-/g' "$file"
    sed -i '' 's/to-violet-/to-gray-/g' "$file"
    sed -i '' 's/from-blue-/from-gray-/g' "$file"
    sed -i '' 's/to-blue-/to-gray-/g' "$file"
    sed -i '' 's/from-indigo-/from-gray-/g' "$file"
    sed -i '' 's/to-indigo-/to-gray-/g' "$file"
    
    # Remplacer text-purple, text-blue, etc.
    sed -i '' 's/text-purple-/text-gray-/g' "$file"
    sed -i '' 's/text-violet-/text-gray-/g' "$file"
    sed -i '' 's/text-blue-/text-gray-/g' "$file"
    sed -i '' 's/text-indigo-/text-gray-/g' "$file"
    
    # Remplacer bg-purple, bg-blue, etc.
    sed -i '' 's/bg-purple-/bg-gray-/g' "$file"
    sed -i '' 's/bg-violet-/bg-gray-/g' "$file"
    sed -i '' 's/bg-blue-/bg-gray-/g' "$file"
    sed -i '' 's/bg-indigo-/bg-gray-/g' "$file"
    
    # Remplacer border colors
    sed -i '' 's/border-purple-/border-gray-/g' "$file"
    sed -i '' 's/border-violet-/border-gray-/g' "$file"
    sed -i '' 's/border-blue-/border-gray-/g' "$file"
    
    echo "✅ $file converti"
  else
    echo "⚠️  $file n'existe pas"
  fi
done

echo ""
echo "🎉 CONVERSION TERMINÉE !"
echo "📊 Fichiers convertis: ${#FILES[@]}"


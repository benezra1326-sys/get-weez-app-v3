#!/bin/bash

# Script pour remplacer TOUTES les couleurs violet/bleu par argenté

echo "🎨 Remplacement de toutes les couleurs violet/bleu par argenté..."

# Gradient principal violet/bleu → argenté
find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #a855f7, #6366f1)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #8B5CF6, #3B82F6)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #F59E0B 100%)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #3B82F6, #1D4ED8)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #8B5CF6, #7C3AED)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

# Autres gradients
find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #a855f7 100%)/linear-gradient(135deg, #E5E5E5, #C0C0C0)/g' {} +

# Couleurs solides
find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/#8B5CF6/#C0C0C0/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/#3B82F6/#C0C0C0/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/#2563EB/#C0C0C0/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/#1D4ED8/#A0A0A0/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/#6366f1/#C0C0C0/g' {} +

find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  's/#a855f7/#C0C0C0/g' {} +

echo "✅ Remplacement terminé !"
echo "📊 Vérification..."
grep -r "#8B5CF6\|#3B82F6\|#a855f7\|#6366f1" --include="*.js" --include="*.jsx" . 2>/dev/null | grep -v node_modules | grep -v .next | wc -l


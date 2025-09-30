#!/usr/bin/env node

/**
 * Script d'analyse automatique du code pour Get Weez
 * Vérifie les problèmes de performance et qualité
 */

const fs = require('fs');
const path = require('path');

class CodeReviewer {
  constructor() {
    this.issues = [];
    this.rules = [
      this.checkFileSize,
      this.checkConsoleLog,
      this.checkInlineStyles,
      this.checkDuplicateCode,
      this.checkPerformancePatterns
    ];
  }

  // Vérifier la taille des fichiers
  checkFileSize(filePath, content) {
    const lines = content.split('\n').length;
    if (lines > 500) {
      return {
        type: 'ERROR',
        rule: 'MAX_FILE_SIZE',
        message: `Fichier trop gros: ${lines} lignes (max: 500)`,
        suggestion: 'Découper en composants plus petits'
      };
    }
    return null;
  }

  // Détecter les console.log
  checkConsoleLog(filePath, content) {
    const matches = content.match(/console\.(log|info|warn|error)/g);
    if (matches && matches.length > 0) {
      return {
        type: 'WARNING',
        rule: 'NO_CONSOLE',
        message: `${matches.length} console.log détectés`,
        suggestion: 'Utiliser un logger ou supprimer en production'
      };
    }
    return null;
  }

  // Détecter les styles inline excessifs
  checkInlineStyles(filePath, content) {
    const styleMatches = content.match(/style=\{[^}]+\}/g);
    if (styleMatches && styleMatches.length > 10) {
      return {
        type: 'ERROR',
        rule: 'EXCESSIVE_INLINE_STYLES',
        message: `${styleMatches.length} styles inline détectés`,
        suggestion: 'Extraire vers des classes CSS ou styled-components'
      };
    }
    return null;
  }

  // Détecter le code dupliqué
  checkDuplicateCode(filePath, content) {
    const lines = content.split('\n');
    const duplicates = this.findDuplicateBlocks(lines, 5); // Blocs de 5+ lignes
    
    if (duplicates.length > 0) {
      return {
        type: 'ERROR',
        rule: 'CODE_DUPLICATION',
        message: `${duplicates.length} blocs dupliqués trouvés`,
        suggestion: 'Extraire en composants réutilisables'
      };
    }
    return null;
  }

  // Vérifier les patterns de performance
  checkPerformancePatterns(filePath, content) {
    const issues = [];
    
    // Vérifier React.memo manquant sur gros composants
    if (content.includes('export default') && !content.includes('memo(')) {
      const lines = content.split('\n').length;
      if (lines > 100) {
        issues.push('Composant volumineux sans React.memo');
      }
    }

    // Vérifier useCallback/useMemo manquants
    const functionDefs = content.match(/const \w+ = \([^)]*\) => \{/g) || [];
    const useCallbacks = content.match(/useCallback/g) || [];
    
    if (functionDefs.length > 3 && useCallbacks.length === 0) {
      issues.push('Fonctions non mémoïsées détectées');
    }

    if (issues.length > 0) {
      return {
        type: 'WARNING',
        rule: 'PERFORMANCE_PATTERNS',
        message: issues.join(', '),
        suggestion: 'Ajouter React.memo, useCallback, useMemo'
      };
    }
    return null;
  }

  findDuplicateBlocks(lines, minLength) {
    const blocks = {};
    const duplicates = [];

    for (let i = 0; i <= lines.length - minLength; i++) {
      const block = lines.slice(i, i + minLength).join('\n').trim();
      if (block.length > 50) { // Ignorer les blocs trop courts
        if (blocks[block]) {
          duplicates.push({ line: i, block });
        } else {
          blocks[block] = i;
        }
      }
    }
    return duplicates;
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileIssues = [];

      for (const rule of this.rules) {
        const issue = rule.call(this, filePath, content);
        if (issue) {
          fileIssues.push({ ...issue, file: filePath });
        }
      }

      return fileIssues;
    } catch (error) {
      return [{
        type: 'ERROR',
        rule: 'FILE_READ_ERROR',
        message: `Erreur lecture: ${error.message}`,
        file: filePath
      }];
    }
  }

  analyzeProject(srcPath = './components') {
    const allIssues = [];
    
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
          const issues = this.analyzeFile(filePath);
          allIssues.push(...issues);
        }
      }
    };

    walkDir(srcPath);
    return allIssues;
  }

  generateReport(issues) {
    const errors = issues.filter(i => i.type === 'ERROR');
    const warnings = issues.filter(i => i.type === 'WARNING');

    console.log('\n🔍 RAPPORT D\'ANALYSE CODE REVIEW\n');
    console.log(`❌ Erreurs: ${errors.length}`);
    console.log(`⚠️  Avertissements: ${warnings.length}\n`);

    if (errors.length > 0) {
      console.log('🚨 ERREURS CRITIQUES:\n');
      errors.forEach((error, i) => {
        console.log(`${i + 1}. ${error.file}`);
        console.log(`   Règle: ${error.rule}`);
        console.log(`   Problème: ${error.message}`);
        console.log(`   Solution: ${error.suggestion}\n`);
      });
    }

    if (warnings.length > 0) {
      console.log('⚠️  AVERTISSEMENTS:\n');
      warnings.forEach((warning, i) => {
        console.log(`${i + 1}. ${warning.file}`);
        console.log(`   ${warning.message}\n`);
      });
    }

    // Score de qualité
    const score = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5));
    console.log(`📊 SCORE QUALITÉ: ${score}/100`);
    
    if (score < 70) {
      console.log('🔴 Qualité insuffisante - Refactoring nécessaire');
      process.exit(1);
    } else if (score < 85) {
      console.log('🟡 Qualité moyenne - Améliorations recommandées');
    } else {
      console.log('🟢 Bonne qualité de code');
    }

    return score;
  }
}

// Exécution
if (require.main === module) {
  const reviewer = new CodeReviewer();
  const issues = reviewer.analyzeProject();
  reviewer.generateReport(issues);
}

module.exports = CodeReviewer;
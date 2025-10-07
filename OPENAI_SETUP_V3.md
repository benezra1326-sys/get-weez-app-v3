# 🤖 Configuration OpenAI pour Gliitz V3

## Comment tester l'API OpenAI

### 1. Vérifier la clé API

Ouvrez `.env.local` et vérifiez :

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

### 2. Tester l'API

Créez un fichier de test :

```bash
node test-openai-v3.js
```

### 3. Script de test

Créez `test-openai-v3.js` :

```javascript
const { askWeezAgent } = require('./lib/openai')

async function test() {
  console.log('🧪 Test OpenAI API pour Gliitz V3...\n')
  
  try {
    const response = await askWeezAgent(
      'Bonjour, quels sont les meilleurs restaurants à Marbella ?',
      'Test User',
      true,
      ''
    )
    
    console.log('✅ Réponse reçue:')
    console.log(response)
    console.log('\n🎉 OpenAI fonctionne parfaitement !')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.log('\n⚠️ Vérifiez:')
    console.log('1. Que votre clé API est valide')
    console.log('2. Que vous avez des crédits OpenAI')
    console.log('3. Que le fichier .env.local existe')
  }
}

test()
```

### 4. Exécuter le test

```bash
cd "/Users/avishay/Downloads/get weez"
node test-openai-v3.js
```

---

## 🔧 Problèmes courants

### "API key not found"
- Vérifiez que `.env.local` existe
- Vérifiez le nom de la variable : `NEXT_PUBLIC_OPENAI_API_KEY`
- Redémarrez le serveur après modification

### "Insufficient credits"
- Votre compte OpenAI n'a plus de crédits
- Ajoutez des crédits sur https://platform.openai.com/billing

### "Rate limit exceeded"
- Vous avez dépassé la limite de requêtes
- Attendez quelques minutes
- Ou upgradez votre plan OpenAI

---

## 📝 Format des messages V3

L'API chat accepte maintenant le format complet :

```javascript
{
  messages: [
    { role: 'user', content: 'Bonjour' },
    { role: 'assistant', content: 'Bonjour ! Comment puis-je vous aider ?' },
    { role: 'user', content: 'Trouve-moi un restaurant' }
  ]
}
```

**Avantage** : Gliitz garde le contexte de toute la conversation !

---

## 🎭 Personnalisation

### Dans `lib/openai.js`

Vous pouvez modifier le comportement de Gliitz :

```javascript
// Température (créativité)
temperature: 0.7  // 0 = factuel, 1 = créatif

// Longueur réponse
max_tokens: 500  // Plus = réponses longues

// Personnalité
system: "Tu es Gliitz, un concierge de luxe élégant..."
```

---

## ✅ Test rapide dans le navigateur

1. Ouvrez http://localhost:3000
2. Tapez : "Bonjour Gliitz"
3. Cliquez Envoyer
4. Attendez la réponse

**Si ça marche** : ✅ OpenAI est bien configuré !  
**Si erreur** : ❌ Vérifiez la console (F12)

---

## 🔐 Sécurité

⚠️ **Ne JAMAIS** commit `.env.local` sur Git !

Le fichier `.gitignore` contient déjà :
```
.env*.local
```

Vos clés API restent privées ✅

---

**OpenAI + Gliitz = Magie ! 🪄**


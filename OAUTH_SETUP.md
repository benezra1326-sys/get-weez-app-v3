# Configuration OAuth pour Get Weez

## 🔧 Configuration des providers OAuth dans Supabase

Pour activer les connexions sociales, vous devez configurer les providers OAuth dans votre dashboard Supabase.

### 1. **Google OAuth**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ et l'API Google Identity
4. Créez des identifiants OAuth 2.0 :
   - Type : Application web
   - URI de redirection autorisés : `https://your-project.supabase.co/auth/v1/callback`
5. Copiez l'ID client et le secret client
6. Dans Supabase Dashboard > Authentication > Providers > Google :
   - Activez Google
   - Ajoutez l'ID client et le secret client

### 2. **Facebook OAuth**

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application
3. Ajoutez le produit "Facebook Login"
4. Configurez les URI de redirection :
   - URI de redirection OAuth valides : `https://your-project.supabase.co/auth/v1/callback`
5. Copiez l'ID de l'application et le secret de l'application
6. Dans Supabase Dashboard > Authentication > Providers > Facebook :
   - Activez Facebook
   - Ajoutez l'ID de l'application et le secret

### 3. **Instagram OAuth**

⚠️ **Note importante** : Instagram n'a pas de provider OAuth direct. Les options sont :
- Utiliser Facebook (Instagram est une propriété de Meta)
- Utiliser un provider personnalisé
- Créer un système d'authentification Instagram personnalisé

### 4. **TikTok OAuth**

⚠️ **Note importante** : TikTok n'est pas supporté nativement par Supabase Auth. Les options sont :
- Utiliser un provider personnalisé
- Intégrer l'API TikTok directement
- Créer un système d'authentification TikTok personnalisé

### 5. **Authentification par téléphone (SMS)**

1. Dans Supabase Dashboard > Authentication > Providers > Phone :
   - Activez Phone
2. Configurez un fournisseur SMS :
   - **Twilio** (recommandé)
   - **MessageBird**
   - **Vonage**
3. Ajoutez vos clés API dans les paramètres

## 🚀 Configuration des variables d'environnement

Ajoutez ces variables à votre `.env.local` :

```env
# Supabase (déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OAuth Providers (optionnel)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# SMS Provider (optionnel)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

## 📱 Fonctionnalités implémentées

### ✅ **Connexion par email/mot de passe**
- Formulaire classique avec validation
- Gestion des erreurs
- Interface responsive

### ✅ **Connexion par SMS**
- Envoi de code de vérification
- Interface en 2 étapes (numéro → code)
- Validation du code OTP

### ✅ **Connexion sociale**
- Google OAuth
- Facebook OAuth
- Interface unifiée pour tous les providers

### ✅ **Interface utilisateur**
- Design moderne avec glass morphism
- Onglets pour choisir la méthode d'authentification
- Animations et transitions fluides
- Responsive design

## 🔒 Sécurité

- Toutes les authentifications passent par Supabase Auth
- Gestion sécurisée des tokens
- Validation côté client et serveur
- Protection CSRF intégrée

## 🎨 Design

- Interface cohérente avec le reste de l'application
- Icônes Lucide React pour chaque provider
- Couleurs et gradients personnalisés
- Animations hover et transitions

## 📝 Notes importantes

1. **Instagram et TikTok** : Ces providers ne sont pas supportés nativement par Supabase. Il faudrait créer des intégrations personnalisées.

2. **SMS** : Nécessite un fournisseur SMS payant (Twilio, MessageBird, etc.)

3. **OAuth** : Chaque provider nécessite une configuration dans Supabase Dashboard

4. **Test** : Testez chaque méthode d'authentification avant la mise en production

## 🚀 Prochaines étapes

1. Configurez les providers OAuth dans Supabase
2. Testez chaque méthode d'authentification
3. Configurez un fournisseur SMS si nécessaire
4. Déployez en production avec les bonnes variables d'environnement

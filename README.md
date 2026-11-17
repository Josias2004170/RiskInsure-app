# RiskInsure - Plateforme de Gestion des Risques et Assurances

Application professionnelle de gestion des risques destinée aux cabinets de conseil, courtage et assurance.

## 🚀 Déploiement sur Render

### Prérequis
- Un compte GitHub gratuit
- Un compte Render gratuit (https://render.com)

### Étapes de déploiement

1. **Créer un dépôt GitHub**
   - Allez sur https://github.com/new
   - Créez un nouveau dépôt public
   - Nommez-le `riskinsure-app`
   - Ne cochez pas "Initialize with README"

2. **Pousser le code sur GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - RiskInsure Application"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/riskinsure-app.git
   git push -u origin main
   ```

3. **Configurer Render**
   - Connectez-vous sur https://render.com
   - Cliquez sur "New +"
   - Sélectionnez "Web Service"
   - Connectez votre compte GitHub
   - Sélectionnez le dépôt `riskinsure-app`
   - Render détectera automatiquement le fichier `render.yaml`
   - Cliquez sur "Create Web Service"

4. **Attendre le déploiement**
   - Render construira et déploiera automatiquement l'application
   - Le déploiement prend environ 2-3 minutes
   - Une fois terminé, vous aurez une URL publique comme `https://riskinsure-app.onrender.com`

## 🌐 Accès à l'application

Une fois déployée, l'application sera accessible via l'URL fournie par Render.

## 🔐 Connexion par défaut

- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin123`

## 📝 Données de démonstration

L'application inclut 4 entreprises de démonstration :
- Atlas BioPharm Solutions (Pharmaceutique)
- BTP Construction Pro (Construction)
- Université Casablanca (Éducation)
- Clinique Santé Plus (Santé)

## 🛠️ Développement local

```bash
npm install
npm run dev
```

L'application sera accessible sur http://localhost:3000

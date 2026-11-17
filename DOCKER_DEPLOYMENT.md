# Déploiement Docker - RiskInsure

Ce guide explique comment déployer l'application RiskInsure en utilisant Docker.

## Prérequis

- Docker installé sur votre machine
- Docker Compose installé (optionnel, mais recommandé)

## Instructions de déploiement

### Option 1: Utiliser Docker Compose (Recommandé)

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd riskinsure---plateforme-de-gestion-des-risques-et-assurances
   ```

2. **Construire et démarrer l'application**
   ```bash
   docker-compose up -d --build
   ```

3. **Accéder à l'application**
   - Ouvrez votre navigateur et allez sur: `http://localhost:3000`

4. **Voir les logs**
   ```bash
   docker-compose logs -f
   ```

5. **Arrêter l'application**
   ```bash
   docker-compose down
   ```

### Option 2: Utiliser Docker directement

1. **Construire l'image**
   ```bash
   docker build -t riskinsure-app .
   ```

2. **Démarrer le conteneur**
   ```bash
   docker run -d -p 3000:3000 --name riskinsure-app riskinsure-app
   ```

3. **Accéder à l'application**
   - Ouvrez votre navigateur et allez sur: `http://localhost:3000`

4. **Voir les logs**
   ```bash
   docker logs -f riskinsure-app
   ```

5. **Arrêter le conteneur**
   ```bash
   docker stop riskinsure-app
   docker rm riskinsure-app
   ```

## Déploiement sur un serveur distant

Pour déployer sur un serveur et partager l'accès avec d'autres personnes:

### 1. Préparer le serveur

Assurez-vous que Docker est installé sur votre serveur:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. Transférer les fichiers

Transférez les fichiers du projet sur le serveur (via SCP, FTP, ou Git):
```bash
scp -r . user@your-server:/path/to/app
```

### 3. Déployer sur le serveur

Connectez-vous au serveur et lancez:
```bash
cd /path/to/app
docker-compose up -d --build
```

### 4. Configurer le pare-feu

Assurez-vous que le port 3000 est ouvert:
```bash
sudo ufw allow 3000
```

### 5. Accéder depuis l'extérieur

Les utilisateurs pourront accéder à l'application via:
- `http://votre-serveur-ip:3000`
- `http://votre-domaine.com:3000` (si vous avez un domaine)

### 6. Utiliser un reverse proxy (Nginx) - Optionnel

Pour une configuration plus professionnelle avec HTTPS:

**Installer Nginx:**
```bash
sudo apt update
sudo apt install nginx
```

**Configurer Nginx** (`/etc/nginx/sites-available/riskinsure`):
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Activer la configuration:**
```bash
sudo ln -s /etc/nginx/sites-available/riskinsure /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Configurer HTTPS avec Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

## Dépannage

### Le conteneur ne démarre pas
```bash
docker-compose logs
```

### Erreur de port déjà utilisé
Changez le port dans `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Utilisez le port 8080 au lieu de 3000
```

### Reconstruire l'image
```bash
docker-compose down
docker-compose up -d --build
```

## Variables d'environnement

Vous pouvez ajouter des variables d'environnement dans `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - API_KEY=votre-cle-api
```

## Support

Pour toute question ou problème, contactez l'équipe de développement.

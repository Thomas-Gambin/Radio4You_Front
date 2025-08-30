# Radio4You — Frontend

## 🚀 Installation de projet
```bash
pnpm install
```
Télécharger le repo back et l'installer pour avoir acces à la BDD : https://github.com/Thomas-Gambin/Radio4You_Back

## ⚙️ Configuration (.env)
Créez un fichier **`.env`** à la racine du projet avec :
```ini
VITE_API_BASE_URL=http://localhost:XXXX
VITE_JAMENDO_CLIENT_ID=688388ee
```
Remplacez `XXXX` par le port de votre backend (ex. `8888`).

## ▶️ Lancer le projet
```bash
pnpm dev
```

## 🧭 Routes disponibles

| Route              | Description                              |
|--------------------|------------------------------------------|
| `/`                | Accueil.                                  |
| `/podcasts`        | Liste des podcasts.                       |
| `/podcasts/id`     | Détail du podcast.                        |
| `/articles`        | Liste des articles.                       |
| `/articles/id`     | Détail de l'article.                      |
| `/en-direct`       | Diffuse une radio en direct.              |
| `/a-propos`        | Page à propos.                            |
| `/devenir-sponsor` | Page de contact pour sponsor.             |
| `/mention-legale`  | Page des mentions légales.                |
| `/404`             | Page introuvable.                         |

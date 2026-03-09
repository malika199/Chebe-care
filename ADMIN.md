# Espace Admin – Site dynamique

Le projet est séparé en **deux applications** (deux dossiers, deux ports) :

| Dossier   | Rôle              | Port  | URL                    |
|----------|-------------------|-------|------------------------|
| **client/** | Site utilisateur   | 5173 | http://localhost:5173 |
| **admin/**  | Interface admin    | 5174 | http://localhost:5174 |
| **server/** | API + base de données | 3001 | http://localhost:3001 |

## Démarrer le projet

1. **API (obligatoire pour données dynamiques)**  
   ```bash
   cd server
   npm start
   ```
   → http://localhost:3001

2. **Site utilisateur**  
   ```bash
   cd client
   npm install
   npm run dev
   ```
   → http://localhost:5173

3. **Interface admin**  
   ```bash
   cd admin
   npm install
   npm run dev
   ```
   → http://localhost:5174

Depuis la racine : `npm run dev:client`, `npm run dev:admin`, `npm run dev:server` (après `npm install` dans client/ et admin/).

## Accéder à l’admin

- Ouvrir **http://localhost:5174** (application admin, port 5174).
- **Mot de passe par défaut :** `admin123`
- Pour le modifier : éditer `server/.env` et définir `ADMIN_PASSWORD=votre_mot_de_passe`.

## Fonctions admin

- **Modifier les prix** : sur chaque produit, bouton « Modifier le prix » (prix, ancien prix, réduction %).
- **Ajouter un produit** : bouton « + Ajouter un produit », puis formulaire (nom, description, prix, image, catégorie, points forts).
- **Supprimer un produit** : bouton « Supprimer » (avec confirmation).

## Base de données

- Fichier : **`server/data/products.json`**
- C’est un fichier JSON : la liste des produits est enregistrée dedans. Vous pouvez le sauvegarder, le versionner (git) ou le modifier à la main si besoin.
- Les images des produits sont des **chemins** (ex. `/images/huile-barbe.png`). Pour que ça s’affiche, il faut que les fichiers existent dans **`public/images/`**. Vous pouvez copier les images depuis `src/assets/images/` vers `public/images/` avec les mêmes noms.

## En production

- Héberger l’API (Node) quelque part et définir `VITE_API_URL` à l’adresse de cette API avant de faire `npm run build`.
- Ou servir le build (Vite) et l’API depuis le même serveur (ex. Express qui sert aussi les fichiers statiques du build).

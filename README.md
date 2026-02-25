# Ventre - Site e-commerce

Site de vente en ligne avec inscription/connexion et deux interfaces : **Client** (acheteurs) et **Vendeur** (gestion boutique).

## Fonctionnalités

### Authentification
- **Inscription** : choix du type de compte (Client ou Vendeur), nom/nom boutique, localisation, email, mot de passe
- **Connexion** : email + mot de passe
- **Profil** : modification du nom et de la localisation

### Interface Client
- Parcourir les produits, panier, commande
- Profil : nom, localisation
- Données pré-remplies au checkout si connecté
- Formulaire de paiement avec choix du mode de paiement

### Interface Vendeur (réservée aux comptes vendeur)
- Tableau de bord, gestion des produits, commandes
- Profil : nom de la boutique, localisation

## Structure

```
ventre e_com/
├── backend/          # API Node.js + Express
│   ├── server.js
│   ├── .env          # Variables d'environnement
│   └── data/
│       ├── users.json
│       ├── sessions.json
│       ├── products.json
│       └── orders.json
├── frontend/         # Application React (Vite)
│   ├── .env          # Variables d'environnement
│   └── src/
│       ├── auth/     # Login, Signup, Profile
│       ├── client/   # Interface client
│       ├── vendeur/  # Interface vendeur
│       └── context/  # AuthContext, CartContext
└── README.md
```

## Installation

### Backend

```
bash
cd backend
npm install
npm start
```

L'API sera disponible sur http://localhost:3001

### Frontend

```
bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur http://localhost:5173

## Variables d'environnement

### Backend (.env)

```
bash
PORT=3001
```

### Frontend (.env)

```
bash
VITE_API_URL=http://localhost:3001
```

Pour la production, remplacez `http://localhost:3001` par l'URL de votre API backend.

## Interfaces

### Client
- **Accueil** : Page d'accueil
- **Boutique** : Liste des produits, ajout au panier
- **Panier** : Gestion des quantités, suppression
- **Commander** : Formulaire de commande avec choix du mode de paiement (carte bancaire, PayPal, paiement à la livraison)

### Vendeur
- **Tableau de bord** : Statistiques (produits, commandes, CA)
- **Produits** : Ajout, modification, suppression de produits
- **Commandes** : Liste des commandes avec informations de paiement, mise à jour du statut

## Déploiement

### Backend (Production)

1. Installer les dépendances :
```
bash
cd backend
npm install
```

2. Configurer les variables d'environnement dans `.env` :
```
bash
PORT=3001
```

3. Démarrer le serveur :
```
bash
npm start
```

### Frontend (Production)

1. Configurer l'URL de l'API dans `.env` :
```
bash
VITE_API_URL=https://votre-api-production.com
```

2. Construire l'application :
```
bash
cd frontend
npm run build
```

3. Les fichiers dans `dist/` peuvent être hébergés sur n'importe quel serveur web (Vercel, Netlify, etc.)

## Données

Les produits et commandes sont stockés dans des fichiers JSON (`backend/data/`) pour simplifier le développement. Pour une utilisation en production, il faudrait connecter une base de données (PostgreSQL, MongoDB, etc.).

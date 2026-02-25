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

### Interface Vendeur (réservée aux comptes vendeur)
- Tableau de bord, gestion des produits, commandes
- Profil : nom de la boutique, localisation

## Structure

```
ventre e_com/
├── backend/          # API Node.js + Express
│   ├── server.js
│   └── data/
│       ├── users.json
│       ├── sessions.json
│       ├── products.json
│       └── orders.json
├── frontend/         # Application React (Vite)
│   └── src/
│       ├── auth/     # Login, Signup, Profile
│       ├── client/   # Interface client
│       ├── vendeur/  # Interface vendeur
│       └── context/  # AuthContext, CartContext
└── README.md
```

## Installation

### Backend

```bash
cd backend
npm install
npm start
```

L'API sera disponible sur http://localhost:3001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur http://localhost:5173

## Interfaces

### Client
- **Accueil** : Page d'accueil
- **Boutique** : Liste des produits, ajout au panier
- **Panier** : Gestion des quantités, suppression
- **Commander** : Formulaire de commande (nom, email, adresse)

### Vendeur
- **Tableau de bord** : Statistiques (produits, commandes, CA)
- **Produits** : Ajout, modification, suppression de produits
- **Commandes** : Liste des commandes, mise à jour du statut

## Données

Les produits et commandes sont stockés dans des fichiers JSON (`backend/data/`) pour simplifier le développement. Pour une utilisation en production, il faudrait connecter une base de données (PostgreSQL, MongoDB, etc.).

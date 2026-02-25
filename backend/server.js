import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dataPath = join(__dirname, 'data');

// Helper pour lire les données
function readJSON(filename) {
  try {
    const data = readFileSync(join(dataPath, filename), 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    if (filename === 'products.json' || filename === 'orders.json') return [];
    if (filename === 'users.json') return [];
    if (filename === 'sessions.json') return {};
    return [];
  }
}

// Helper pour écrire les données
function writeJSON(filename, data) {
  writeFileSync(join(dataPath, filename), JSON.stringify(data, null, 2));
}

// Hash du mot de passe
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verify;
}

// Middleware auth (optionnel)
function getAuthUser(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const sessions = readJSON('sessions.json');
  const userId = sessions[token];
  if (!userId) return null;
  const users = readJSON('users.json');
  return users.find(u => u.id === userId) || null;
}

// ========== ROUTES AUTH ==========

// Inscription
app.post('/api/auth/signup', (req, res) => {
  const users = readJSON('users.json');
  const { email, password, type, nom, localisation } = req.body;
  if (!email || !password || !type) {
    return res.status(400).json({ error: 'Email, mot de passe et type (vendeur/client) requis' });
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Cet email est déjà utilisé' });
  }
  const label = type === 'vendeur' ? 'Nom boutique' : 'Nom';
  if (!nom?.trim()) {
    return res.status(400).json({ error: `${label} requis` });
  }
  const user = {
    id: String(Date.now()),
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
    type,
    nom: nom.trim(),
    localisation: (localisation || '').trim(),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  writeJSON('users.json', users);

  const token = crypto.randomBytes(32).toString('hex');
  const sessions = readJSON('sessions.json');
  sessions[token] = user.id;
  writeJSON('sessions.json', sessions);

  const { passwordHash, ...safeUser } = user;
  res.status(201).json({ token, user: safeUser });
});

// Connexion
app.post('/api/auth/login', (req, res) => {
  const users = readJSON('users.json');
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  const sessions = readJSON('sessions.json');
  sessions[token] = user.id;
  writeJSON('sessions.json', sessions);

  const { passwordHash, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// Profil actuel
app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Non authentifié' });
  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

// Mettre à jour le profil (nom, localisation)
app.put('/api/auth/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Non authentifié' });
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === user.id);
  if (idx === -1) return res.status(404).json({ error: 'Utilisateur introuvable' });
  if (req.body.nom != null) users[idx].nom = String(req.body.nom).trim();
  if (req.body.localisation != null) users[idx].localisation = String(req.body.localisation).trim();
  writeJSON('users.json', users);
  const { passwordHash, ...safeUser } = users[idx];
  res.json(safeUser);
});

// Déconnexion (optionnel - invalide le token côté client uniquement)
app.post('/api/auth/logout', (req, res) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const sessions = readJSON('sessions.json');
    delete sessions[token];
    writeJSON('sessions.json', sessions);
  }
  res.json({ success: true });
});

// ========== ROUTES PRODUITS (Client + Vendeur) ==========

// Liste des produits (client)
app.get('/api/products', (req, res) => {
  const products = readJSON('products.json');
  res.json(products);
});

// Détail produit
app.get('/api/products/:id', (req, res) => {
  const products = readJSON('products.json');
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
  res.json(product);
});

// ========== ROUTES VENDEUR (Gestion produits) ==========

function requireVendeur(req, res, next) {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Connexion requise' });
  if (user.type !== 'vendeur') return res.status(403).json({ error: 'Accès réservé aux vendeurs' });
  req.user = user;
  next();
}

// Créer un produit
app.post('/api/vendeur/products', requireVendeur, (req, res) => {
  const products = readJSON('products.json');
  const newProduct = {
    id: String(Date.now()),
    name: req.body.name,
    description: req.body.description || '',
    price: parseFloat(req.body.price) || 0,
    stock: parseInt(req.body.stock) || 0,
    category: req.body.category || 'Général',
    image: req.body.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
  };
  products.push(newProduct);
  writeJSON('products.json', products);
  res.status(201).json(newProduct);
});

// Modifier un produit
app.put('/api/vendeur/products/:id', requireVendeur, (req, res) => {
  const products = readJSON('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Produit non trouvé' });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  writeJSON('products.json', products);
  res.json(products[idx]);
});

// Supprimer un produit
app.delete('/api/vendeur/products/:id', requireVendeur, (req, res) => {
  const products = readJSON('products.json');
  const filtered = products.filter(p => p.id !== req.params.id);
  if (filtered.length === products.length) return res.status(404).json({ error: 'Produit non trouvé' });
  writeJSON('products.json', filtered);
  res.json({ success: true });
});

// ========== ROUTES COMMANDES ==========

// Créer une commande (client)
app.post('/api/orders', (req, res) => {
  const orders = readJSON('orders.json');
  const products = readJSON('products.json');
  const clientUser = getAuthUser(req);
  let { items, clientName, address, email, paymentMethod, paymentDetails } = req.body;
  if (clientUser?.type === 'client') {
    clientName = clientName || clientUser.nom;
    email = email || clientUser.email;
    address = address || clientUser.localisation;
  }

  let total = 0;
  const orderItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Produit ${item.productId} introuvable`);
    const subtotal = product.price * item.quantity;
    total += subtotal;
    return { productId: product.id, name: product.name, quantity: item.quantity, price: product.price, subtotal };
  });

  const order = {
    id: String(Date.now()),
    items: orderItems,
    total: Math.round(total * 100) / 100,
    clientId: clientUser?.id || null,
    clientName: clientName || 'Client',
    address: address || '',
    email: email || '',
    paymentMethod: paymentMethod || 'card',
    paymentDetails: paymentDetails || {},
    paymentStatus: 'En attente',
    status: 'En attente',
    createdAt: new Date().toISOString()
  };

  // Mise à jour du stock
  items.forEach(item => {
    const p = products.find(pr => pr.id === item.productId);
    if (p) p.stock = Math.max(0, p.stock - item.quantity);
  });
  writeJSON('products.json', products);

  orders.push(order);
  writeJSON('orders.json', orders);
  res.status(201).json(order);
});

// Liste des commandes (vendeur)
app.get('/api/vendeur/orders', requireVendeur, (req, res) => {
  const orders = readJSON('orders.json');
  res.json(orders.reverse());
});

// Mettre à jour le statut d'une commande (vendeur)
app.put('/api/vendeur/orders/:id', requireVendeur, (req, res) => {
  const orders = readJSON('orders.json');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Commande non trouvée' });
  if (req.body.status) orders[idx].status = req.body.status;
  writeJSON('orders.json', orders);
  res.json(orders[idx]);
});

app.listen(PORT, () => {
  console.log(`API e-commerce démarrée sur http://localhost:${PORT}`);
});

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { withApiBase } from '../api'

export default function VendeurDashboard() {
  const { authFetch } = useAuth()
  const [stats, setStats] = useState({ products: 0, orders: 0, totalRevenue: 0 })

  useEffect(() => {
    Promise.all([
      fetch(withApiBase('/api/products')).then(r => r.json()),
      authFetch('/api/vendeur/orders').then(r => r.json())
    ]).then(([products, orders]) => {
      setStats({
        products: products.length,
        orders: orders.length,
        totalRevenue: orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)
      })
    })
  }, [authFetch])

  return (
    <div className="vendeur-dashboard">
      <h1>Tableau de bord</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Produits</h3>
          <p className="stat-value">{stats.products}</p>
          <Link to="/vendeur/products">Gérer</Link>
        </div>
        <div className="stat-card">
          <h3>Commandes</h3>
          <p className="stat-value">{stats.orders}</p>
          <Link to="/vendeur/orders">Voir</Link>
        </div>
        <div className="stat-card">
          <h3>Chiffre d'affaires</h3>
          <p className="stat-value">{stats.totalRevenue} €</p>
        </div>
      </div>
    </div>
  )
}

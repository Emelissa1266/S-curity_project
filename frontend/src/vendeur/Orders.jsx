import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function VendeurOrders() {
  const { authFetch } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    authFetch('/api/vendeur/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false) })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (orderId, status) => {
    const res = await authFetch(`/api/vendeur/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (res.ok) loadOrders()
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="vendeur-orders">
      <h1>Commandes</h1>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="empty-state">Aucune commande pour le moment.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">#{order.id}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className="status-select"
                >
                  <option>En attente</option>
                  <option>Confirmée</option>
                  <option>Expédiée</option>
                  <option>Livrée</option>
                </select>
              </div>
              <div className="order-client">
                <strong>{order.clientName}</strong> • {order.email}
              </div>
              {order.address && <p className="order-address">{order.address}</p>}
              <div className="order-items">
                {order.items?.map((item, i) => (
                  <div key={i} className="order-item">
                    {item.name} × {item.quantity} — {item.subtotal?.toFixed(2)} €
                  </div>
                ))}
              </div>
              <div className="order-total">Total : {order.total?.toFixed(2)} €</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Checkout.css'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, authFetch } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    clientName: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    if (user?.type === 'client') {
      setForm({
        clientName: user.nom || '',
        email: user.email || '',
        address: user.localisation || ''
      })
    }
  }, [user])

  if (cart.length === 0 && !success) {
    navigate('/cart')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
          ...form
        })
      })
      if (res.ok) {
        clearCart()
        setSuccess(true)
      }
    } catch (err) {
      alert('Erreur lors de la commande')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="checkout-success">
        <h2>Commande confirmée !</h2>
        <p>Merci pour votre commande. Vous recevrez un email de confirmation.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1>Commander</h1>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom</label>
          <input
            required
            value={form.clientName}
            onChange={e => setForm({ ...form, clientName: e.target.value })}
            placeholder="Votre nom"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="votre@email.com"
          />
        </div>
        <div className="form-group">
          <label>Adresse de livraison</label>
          <textarea
            required
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="Adresse complète"
            rows="3"
          />
        </div>
        <div className="checkout-total">
          <strong>Total : {cartTotal.toFixed(2)} €</strong>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Envoi...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  )
}

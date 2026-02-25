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
  const [paymentMethod, setPaymentMethod] = useState('card')
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
          ...form,
          paymentMethod: paymentMethod
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
        <div className="success-icon">✓</div>
        <h2>Commande confirmée !</h2>
        <p>Merci pour votre commande</p>
        <p className="order-note">Vous recevrez un email de confirmation sous peu.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-form-card">
        <h1>Finaliser ma commande</h1>
        
        <form className="checkout-form" onSubmit={handleSubmit}>
          {/* Contact Information */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">👤</span>
              Informations de contact
            </div>
            <div className="form-group">
              <label>Nom complet <span className="required">*</span></label>
              <input
                required
                value={form.clientName}
                onChange={e => setForm({ ...form, clientName: e.target.value })}
                placeholder="Votre nom et prénom"
              />
            </div>
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">📍</span>
              Adresse de livraison
            </div>
            <div className="form-group">
              <label>Adresse complète <span className="required">*</span></label>
              <textarea
                required
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Rue, ville, code postal..."
                rows="3"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">💳</span>
              Mode de paiement
            </div>
            <div className="payment-methods">
              <label 
                className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <div className="payment-radio"></div>
                <div className="payment-icon">💳</div>
                <div className="payment-info">
                  <h4>Carte bancaire</h4>
                  <p>Visa, Mastercard, CB</p>
                </div>
              </label>
              <label 
                className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="paypal" 
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <div className="payment-radio"></div>
                <div className="payment-icon">🅿️</div>
                <div className="payment-info">
                  <h4>PayPal</h4>
                  <p>Paiement rapide et sécurisé</p>
                </div>
              </label>
              <label 
                className={`payment-method ${paymentMethod === 'delivery' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('delivery')}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="delivery" 
                  checked={paymentMethod === 'delivery'}
                  onChange={() => setPaymentMethod('delivery')}
                />
                <div className="payment-radio"></div>
                <div className="payment-icon">💵</div>
                <div className="payment-info">
                  <h4>Paiement à la livraison</h4>
                  <p>Payez en espèces à la réception</p>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="checkout-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : `Confirmer - ${cartTotal.toFixed(2)} €`}
          </button>
          
          <div className="checkout-security">
            <span className="lock-icon">🔒</span>
            <span>Paiement sécurisé - Vos données sont protégées</span>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="checkout-summary">
        <h2>Résumé de la commande</h2>
        <div className="summary-items">
          {cart.map((item, index) => (
            <div key={index} className="summary-item">
              <div className="summary-item-image">
                {item.image ? <img src={item.image} alt={item.name} /> : '📦'}
              </div>
              <div className="summary-item-details">
                <div className="summary-item-title">{item.name}</div>
                <div className="summary-item-qty">Qté: {item.quantity}</div>
              </div>
              <div className="summary-item-price">
                {(item.price * item.quantity).toFixed(2)} €
              </div>
            </div>
          ))}
        </div>
        <div className="summary-totals">
          <div className="summary-row">
            <span>Sous-total</span>
            <span>{cartTotal.toFixed(2)} €</span>
          </div>
          <div className="summary-row">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{cartTotal.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  )
}

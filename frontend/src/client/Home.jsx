import { useState } from 'react'
import { Link } from 'react-router-dom'

const mockFlashDeals = [
  { id: 0, image: 'https://asmallworldvirtualshop.com/wp-content/uploads/2020/08/surprise-gift-box-575.jpg', name: 'prize of the month', price: 0, oldPrice: 599.99, discount: '-100%' },
  { id: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', name: 'Écouteurs sans fil', price: 12.99, oldPrice: 29.99, discount: '-57%' },
  { id: 2, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', name: 'Montre connectée sport', price: 19.9, oldPrice: 49.9, discount: '-60%' },
  { id: 3, image: 'https://reveil-educatif.fr/wp-content/uploads/2024/06/Lampe-reveil-educatif-1.jpg', name: 'Lampe LED décorative', price: 8.5, oldPrice: 19.9, discount: '-57%' },
  { id: 4, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6vEOiG2TQieBUNysy_F4j35E7XZvAPQvlfA&s', name: 'Sac à dos urbain', price: 15.0, oldPrice: 39.0, discount: '-62%' },
  { id: 5, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', name: 'Smartphone Android', price: 89.99, oldPrice: 149.99, discount: '-40%' },
  { id: 6, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop', name: 'Casque Bluetooth', price: 17.99, oldPrice: 39.99, discount: '-55%' },
  { id: 7, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop', name: 'Power Bank 20000mAh', price: 14.5, oldPrice: 34.9, discount: '-58%' },
  { id: 8, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop', name: 'Clavier Gamer RGB', price: 22.0, oldPrice: 59.0, discount: '-63%' },
  { id: 9, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop', name: 'Souris Gaming Pro', price: 9.99, oldPrice: 24.99, discount: '-60%' },
  { id: 10, image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&h=300&fit=crop', name: 'Mini Projecteur HD', price: 49.99, oldPrice: 119.99, discount: '-58%' },
  { id: 11, image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop', name: 'Chaise de Bureau Ergonomique', price: 74.9, oldPrice: 159.9, discount: '-53%' }
]

export default function Home() {
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState({
    fullName: '',
    email: '',
    address: '',
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })

  const openPaymentForDeal = (deal) => {
    setSelectedDeal(deal)
    setShowPayment(true)
  }

  const closePayment = () => {
    setShowPayment(false)
    setSelectedDeal(null)
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitPayment = (e) => {
    e.preventDefault()
    if (!selectedDeal) return

    const record = {
      dealId: selectedDeal.id,
      dealName: selectedDeal.name,
      amount: selectedDeal.price,
      method: paymentData.method,
      fullName: paymentData.fullName,
      email: paymentData.email,
      address: paymentData.address,
      cardLast4: paymentData.cardNumber.slice(-4),
      createdAt: new Date().toISOString()
    }

    try {
      const existing = JSON.parse(localStorage.getItem('payments') || '[]')
      existing.push(record)
      localStorage.setItem('payments', JSON.stringify(existing))
    } catch {
      // si localStorage indisponible, on ignore simplement
    }

    alert('Paiement simulé avec succès (données enregistrées localement).')
    closePayment()
  }

  return (
    <div className="home-page">
      <section className="home-hero-row">
        <aside className="home-categories">
          <h3>Catégories</h3>
          <ul>
            <li><Link to="/products?cat=electronique">Téléphones &amp; électronique</Link></li>
            <li><Link to="/products?cat=mode">Mode homme</Link></li>
            <li><Link to="/products?cat=mode-femme">Mode femme</Link></li>
            <li><Link to="/products?cat=maison">Maison &amp; cuisine</Link></li>
            <li><Link to="/products?cat=beaute">Beauté &amp; santé</Link></li>
            <li><Link to="/products?cat=sport">Sport &amp; loisirs</Link></li>
            <li><Link to="/products?cat=auto">Auto &amp; moto</Link></li>
          </ul>
        </aside>

        <div className="home-main-banner">
          <div className="banner-content">
            <p className="banner-tag">Offres du jour</p>
            <h1>
              Shopping en ligne,
              <br />
              petits prix tous les jours
            </h1>
            <p className="banner-subtitle">
              Des milliers de produits à découvrir, livraison partout.
            </p>
            <Link to="/products" className="btn btn-primary">
              Commencer à acheter
            </Link>
          </div>
        </div>

        <div className="home-side-banners">
          <div className="side-card">
            <h4>Coins des bons plans</h4>
            <p>-70% sur une sélection</p>
            <Link to="/products?section=flash">Voir les offres</Link>
          </div>
          <div className="side-card">
            <h4>Nouveaux arrivages</h4>
            <p>Produits tendance de la semaine</p>
            <Link to="/products?section=new">Découvrir</Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h2>Offres flash</h2>
          <Link to="/products?section=flash">Tout voir</Link>
        </div>
        <div className="flash-grid">
          {mockFlashDeals.map((item) => (
            <article
              key={item.id}
              className="flash-card"
              onClick={() => openPaymentForDeal(item)}
            >
              <div className="flash-image-placeholder">
                <img src={item.image} alt={item.name} />
              </div>
              <h3>{item.name}</h3>
              <div className="flash-prices">
                <span className="current-price">{item.price.toFixed(2)} €</span>
                <span className="old-price">{item.oldPrice.toFixed(2)} €</span>
              </div>
              <div className="flash-meta">
                <span className="discount-badge">{item.discount}</span>
                <span className="flash-stock">Stock limité</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h2>Pour vous</h2>
          <Link to="/products">Voir plus</Link>
        </div>
        <p className="home-section-text">
          Explorez la boutique pour trouver des produits adaptés à votre quotidien :
          mode, high-tech, maison, accessoires et bien plus encore.
        </p>
      </section>

      {showPayment && selectedDeal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Paiement de {selectedDeal.name}</h2>
            <p className="payment-amount">
              Montant à payer : <strong>{selectedDeal.price.toFixed(2)} €</strong>
            </p>
            <form onSubmit={handleSubmitPayment} className="payment-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    name="fullName"
                    value={paymentData.fullName}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Adresse de livraison</label>
                <input
                  type="text"
                  name="address"
                  value={paymentData.address}
                  onChange={handlePaymentChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Méthode de paiement</label>
                <select
                  name="method"
                  value={paymentData.method}
                  onChange={handlePaymentChange}
                >
                  <option value="card">Carte bancaire (Visa, Mastercard…)</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {paymentData.method === 'card' && (
                <>
                  <div className="form-field">
                    <label>Numéro de carte</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Expiration (MM/AA)</label>
                      <input
                        type="text"
                        name="expiry"
                        value={paymentData.expiry}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-sm" onClick={closePayment}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Payer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

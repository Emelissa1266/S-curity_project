import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  if (cartCount === 0) {
    return (
      <div className="cart-empty">
        <h2>Votre panier est vide</h2>
        <Link to="/products" className="btn btn-primary">Découvrir la boutique</Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Panier</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.price.toFixed(2)} €</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
              </div>
              <span className="cart-item-total">{(item.price * item.quantity).toFixed(2)} €</span>
              <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>×</button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Récapitulatif</h3>
          <p className="total">Total : <strong>{cartTotal.toFixed(2)} €</strong></p>
          <Link to="/checkout" className="btn btn-primary btn-block">Commander</Link>
        </aside>
      </div>
    </div>
  )
}

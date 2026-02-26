import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { withApiBase } from '../api'
import './Products.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetch(withApiBase('/api/products'))
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="products-page">
      <h1>Boutique</h1>
      <div className="products-grid">
        {products.map(product => (
          <article key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              {product.stock <= 0 && <span className="out-of-stock">Rupture</span>}
            </div>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">{product.price.toFixed(2)} €</span>
                <button
                  className="btn btn-sm"
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? 'Rupture' : 'Ajouter'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

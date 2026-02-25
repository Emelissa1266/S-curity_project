import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Bienvenue chez <span className="brand">Vendista</span></h1>
        <p>Découvrez notre sélection de produits soigneusement choisis pour vous.</p>
        <Link to="/products" className="btn btn-primary">Voir la boutique</Link>
      </section>
      <section className="features">
        <div className="feature">
          <span className="feature-icon"><img width="48" height="48" src="https://img.icons8.com/deco-color/48/delivery.png" alt="delivery"/></span>
          <h3>Livraison rapide</h3>
          <p>Expédition sous 24-48h</p>
        </div>
        <div className="feature">
          <span className="feature-icon"><img width="64" height="64" src="https://img.icons8.com/dusk/64/lock-2.png" alt="lock-2"/></span>
          <h3>Paiement sécurisé</h3>
          <p>Transactions protégées</p>
        </div>
        <div className="feature">
          <span className="feature-icon">↩️</span>
          <h3>Satisfait ou remboursé</h3>
          <p>Sous 30 jours</p>
        </div>
      </section>
    </div>
  )
}

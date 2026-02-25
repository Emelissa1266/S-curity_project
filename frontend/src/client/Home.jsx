import { Link } from 'react-router-dom'

const mockFlashDeals = [
  {id:0 ,image:'https://asmallworldvirtualshop.com/wp-content/uploads/2020/08/surprise-gift-box-575.jpg', name: 'prize of the month', price: 0, oldPrice: 599.99, discount: '-100%'},
  { id: 1 ,image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', name: 'Écouteurs sans fil', price: 12.99, oldPrice: 29.99, discount: '-57%' },
  { id: 2, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', name: 'Montre connectée sport', price: 19.9, oldPrice: 49.9, discount: '-60%' },
  { id: 3, image: 'https://reveil-educatif.fr/wp-content/uploads/2024/06/Lampe-reveil-educatif-1.jpg', name: 'Lampe LED décorative', price: 8.5, oldPrice: 19.9, discount: '-57%' },
  { id: 4, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6vEOiG2TQieBUNysy_F4j35E7XZvAPQvlfA&s', name: 'Sac à dos urbain', price: 15.0, oldPrice: 39.0, discount: '-62%' },
]

export default function Home() {
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
            <article key={item.id} className="flash-card">
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
    </div>
  )
}

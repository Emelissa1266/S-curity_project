import { Outlet, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logoo.png'

export default function ClientLayout() {
  const { cartCount } = useCart()
  const { user, logout } = useAuth()

  return (
    <div className="layout-client">
      <header className="header-client">
        <div className="header-top">
          <img src={logo} alt="Ventre" className="logo" />
          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const query = String(formData.get('q') || '').trim()
              if (query) {
                // Pour l’instant on redirige vers la boutique,
                // la recherche pourra être branchée plus tard côté produits.
                window.location.href = '/products'
              }
            }}
          >
            <input
              type="text"
              name="q"
              placeholder="Je cherche… (ex: téléphone, chaussures, accessoires)"
            />
            <button type="submit" className="btn btn-primary">
              Rechercher
            </button>
          </form>

          <div className="header-actions">
            <Link to="/cart" className="cart-link">
              <span className="cart-label">Panier</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
            <div className="header-auth">
              {user ? (
                <>
                  <Link to="/profile">Mon compte</Link>
                  <button className="btn btn-sm" onClick={logout}>Déconnexion</button>
                </>
              ) : (
                <>
                  <Link to="/login">Connexion</Link>
                  <Link to="/signup" className="btn btn-primary btn-sm">Inscription</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="header-bottom">
          <nav className="main-nav">
            <Link to="/">Accueil</Link>
            <Link to="/products">Tous les produits</Link>
            <Link to="/products?section=flash">Offres flash</Link>
            <Link to="/products?section=top">Top ventes</Link>
            <Link to="/products?section=new">Nouveautés</Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer-client">
        <p>© 2025 Ventre - Marketplace en ligne</p>
      </footer>
    </div>
  )
}

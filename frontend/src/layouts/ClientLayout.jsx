import { Outlet, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ClientLayout() {
  const { cartCount } = useCart()
  const { user, logout } = useAuth()

  return (
    <div className="layout-client">
      <header className="header-client">
        <Link to="/" className="logo">Ventre</Link>
        <nav>
          <Link to="/">Accueil</Link>
          <Link to="/products">Boutique</Link>
          <Link to="/cart" className="cart-link">
            Panier {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </nav>
        <div className="header-auth">
          {user ? (
            <>
              <Link to="/profile">Mon profil</Link>
              <button className="btn btn-sm" onClick={logout}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Inscription</Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer-client">
        <p>© 2025 Ventre - Boutique en ligne</p>
      </footer>
    </div>
  )
}

import { Outlet, Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function VendeurLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="layout-vendeur">
      <aside className="sidebar-vendeur">
        <h2 className="sidebar-logo">Ventre</h2>
        <p className="sidebar-subtitle">Espace vendeur</p>
        {user?.nom && <p className="sidebar-boutique">{user.nom}</p>}
        <nav>
          <NavLink to="/vendeur" end className={({ isActive }) => isActive ? 'active' : ''}>Tableau de bord</NavLink>
          <NavLink to="/vendeur/products" className={({ isActive }) => isActive ? 'active' : ''}>Produits</NavLink>
          <NavLink to="/vendeur/orders" className={({ isActive }) => isActive ? 'active' : ''}>Commandes</NavLink>
          <NavLink to="/vendeur/profile" className={({ isActive }) => isActive ? 'active' : ''}>Mon profil</NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-sm" onClick={logout}>Déconnexion</button>
          <Link to="/" className="back-store">← Retour à la boutique</Link>
        </div>
      </aside>
      <div className="vendeur-content">
        <Outlet />
      </div>
    </div>
  )
}

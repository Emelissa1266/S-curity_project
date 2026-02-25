import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedVendeur({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="loading">Chargement...</div>
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.type !== 'vendeur') return <Navigate to="/" replace />
  return children
}

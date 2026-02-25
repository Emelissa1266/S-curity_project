import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    type: 'client',
    nom: '',
    localisation: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    const label = form.type === 'vendeur' ? 'Nom de la boutique' : 'Votre nom'
    if (!form.nom.trim()) {
      setError(`${label} requis`)
      return
    }
    setLoading(true)
    try {
      await signup(form.email, form.password, form.type, form.nom, form.localisation)
      navigate(form.type === 'vendeur' ? '/vendeur' : '/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back">← Accueil</Link>
      <div className="auth-card auth-card-wide">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label>Type de compte</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="client">Client</option>
              <option value="vendeur">Vendeur</option>
            </select>
          </div>
          <div className="form-group">
            <label>{form.type === 'vendeur' ? 'Nom de la boutique' : 'Votre nom'}</label>
            <input
              value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              required
              placeholder={form.type === 'vendeur' ? 'Ma Boutique' : 'Jean Dupont'}
            />
          </div>
          <div className="form-group">
            <label>Localisation</label>
            <input
              value={form.localisation}
              onChange={e => setForm({ ...form, localisation: e.target.value })}
              placeholder="Paris, France"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              placeholder="votre@email.com"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label>Confirmer</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

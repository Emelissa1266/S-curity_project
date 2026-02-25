import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

export default function Profile() {
  const { user, updateProfile, loading } = useAuth()
  if (!loading && !user) return <Navigate to="/login" replace />
  const [form, setForm] = useState({
    nom: user?.nom || '',
    localisation: user?.localisation || ''
  })

  useEffect(() => {
    if (user) {
      setForm({ nom: user.nom || '', localisation: user.localisation || '' })
    }
  }, [user])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsSubmitting(true)
    try {
      await updateProfile(form.nom, form.localisation)
      setMessage('Profil mis à jour')
    } catch (err) {
      setMessage('Erreur: ' + err.message)
    }
    setIsSubmitting(false)
  }

  const label = user?.type === 'vendeur' ? 'Nom de la boutique' : 'Votre nom'

  return (
    <div className="profile-page">
      <h1>Mon profil</h1>
      <div className="profile-card">
        <div className="profile-info">
          <p><strong>Email :</strong> {user?.email}</p>
          <p><strong>Type :</strong> {user?.type === 'vendeur' ? 'Vendeur' : 'Client'}</p>
        </div>
        <form onSubmit={handleSubmit}>
          {message && <div className={`profile-msg ${message.includes('Erreur') ? 'error' : 'success'}`}>{message}</div>}
          <div className="form-group">
            <label>{label}</label>
            <input
              value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              required
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
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  )
}

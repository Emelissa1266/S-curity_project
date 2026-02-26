import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function VendeurProducts() {
  const { authFetch } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, product: null })
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', image: '' })

  const loadProducts = () => {
    fetch('${API_URL}/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const openAdd = () => {
    setForm({ name: '', description: '', price: '', stock: '', category: 'Général', image: '' })
    setModal({ open: true, product: null })
  }

  const openEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || 'Général',
      image: product.image || ''
    })
    setModal({ open: true, product })
  }

  const save = async (e) => {
    e.preventDefault()
    const url = modal.product ? `/api/vendeur/products/${modal.product.id}` : '/api/vendeur/products'
    const method = modal.product ? 'PUT' : 'POST'
    const body = modal.product ? form : form
    const res = await authFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      setModal({ open: false })
      loadProducts()
    }
  }

  const remove = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    const res = await authFetch(`/api/vendeur/products/${id}`, { method: 'DELETE' })
    if (res.ok) loadProducts()
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="vendeur-products">
      <div className="page-header">
        <h1>Gestion des produits</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Ajouter un produit</button>
      </div>
      <div className="products-table-wrap">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><img src={p.image} alt="" className="table-thumb" /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price?.toFixed(2)} €</td>
                <td>{p.stock}</td>
                <td>
                  <button className="btn btn-sm" onClick={() => openEdit(p)}>Modifier</button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(p.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ ...modal, open: false })}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal.product ? 'Modifier' : 'Nouveau produit'}</h2>
            <form onSubmit={save}>
              <div className="form-group">
                <label>Nom</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows="2" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Prix (€)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Catégorie</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="form-group">
                <label>URL image</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setModal({ ...modal, open: false })}>Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, loginAdmin, updateProduct, createProduct, deleteProduct } from '../api'
import './AdminPage.css'

const AdminPage = () => {
  const [token, setToken] = useState(() => window.sessionStorage.getItem('adminToken'))
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '0',
    image: '/images/placeholder.png',
    category: 'Cheveux',
    features: ''
  })

  useEffect(() => {
    if (token) {
      window.sessionStorage.setItem('adminToken', token)
      loadProducts()
    }
  }, [token])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      setMessage({ type: 'error', text: 'Impossible de charger les produits. Démarrez le serveur (npm run start dans server/).' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const t = await loginAdmin(password)
      setToken(t)
    } catch (e) {
      setLoginError(e.message || 'Mot de passe incorrect')
    }
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem('adminToken')
    setToken(null)
    setPassword('')
  }

  const handleUpdatePrice = async (product, newPrice, newOriginalPrice, newDiscount) => {
    setMessage({ type: '', text: '' })
    try {
      const updated = await updateProduct(
        product.id,
        {
          price: Number(newPrice),
          originalPrice: newOriginalPrice === '' ? null : Number(newOriginalPrice),
          discount: Number(newDiscount) || 0
        },
        token
      )
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditingId(null)
      setMessage({ type: 'success', text: 'Prix mis à jour.' })
    } catch (e) {
      setMessage({ type: 'error', text: e.message })
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    try {
      const features = newProduct.features
        ? newProduct.features.split('\n').map((f) => f.trim()).filter(Boolean)
        : []
      const created = await createProduct(
        {
          name: newProduct.name,
          description: newProduct.description,
          price: Number(newProduct.price) || 0,
          originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
          discount: Number(newProduct.discount) || 0,
          image: newProduct.image || '/images/placeholder.png',
          category: newProduct.category,
          features
        },
        token
      )
      setProducts((prev) => [...prev, created])
      setShowAddForm(false)
      setNewProduct({ name: '', description: '', price: '', originalPrice: '', discount: '0', image: '/images/placeholder.png', category: 'Cheveux', features: '' })
      setMessage({ type: 'success', text: 'Produit ajouté.' })
    } catch (e) {
      setMessage({ type: 'error', text: e.message })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    setMessage({ type: '', text: '' })
    try {
      await deleteProduct(id, token)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setMessage({ type: 'success', text: 'Produit supprimé.' })
    } catch (e) {
      setMessage({ type: 'error', text: e.message })
    }
  }

  if (!token) {
    return (
      <div className="admin-page">
        <div className="admin-login-card">
          <h1 className="admin-title">Administration</h1>
          <p className="admin-subtitle">Connectez-vous pour modifier les produits et les prix.</p>
          <form onSubmit={handleLogin} className="admin-login-form">
            <label>
              <span className="admin-label">Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="Mot de passe admin"
                autoFocus
              />
            </label>
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="admin-btn admin-btn-primary">Connexion</button>
          </form>
          <p className="admin-hint">Par défaut : admin123 (à modifier dans server/.env)</p>
          <Link to="/" className="admin-link">← Retour au site</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <h1 className="admin-title">Admin – Produits</h1>
          <div className="admin-header-actions">
            <Link to="/" className="admin-btn admin-btn-ghost">Voir le site</Link>
            <button type="button" onClick={handleLogout} className="admin-btn admin-btn-ghost">Déconnexion</button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {message.text && (
          <div className={'admin-message admin-message-' + message.type}>
            {message.text}
          </div>
        )}

        <div className="admin-toolbar">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => { setShowAddForm(!showAddForm); setMessage({ type: '', text: '' }); }}
          >
            {showAddForm ? 'Annuler' : '+ Ajouter un produit'}
          </button>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={loadProducts} disabled={loading}>
            Actualiser
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddProduct} className="admin-form admin-form-add">
            <h2>Nouveau produit</h2>
            <label>
              <span className="admin-label">Nom</span>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                className="admin-input"
                required
              />
            </label>
            <label>
              <span className="admin-label">Description</span>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                className="admin-input admin-textarea"
                rows={3}
              />
            </label>
            <div className="admin-form-row">
              <label>
                <span className="admin-label">Prix (€)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                  className="admin-input"
                  required
                />
              </label>
              <label>
                <span className="admin-label">Ancien prix (€)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct((p) => ({ ...p, originalPrice: e.target.value }))}
                  className="admin-input"
                />
              </label>
              <label>
                <span className="admin-label">Réduction (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProduct.discount}
                  onChange={(e) => setNewProduct((p) => ({ ...p, discount: e.target.value }))}
                  className="admin-input"
                />
              </label>
            </div>
            <label>
              <span className="admin-label">Image (URL ou /images/xxx.png)</span>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))}
                className="admin-input"
              />
            </label>
            <label>
              <span className="admin-label">Catégorie</span>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                className="admin-input"
              >
                <option value="Cheveux">Cheveux</option>
                <option value="Barbe">Barbe</option>
                <option value="Encens">Encens</option>
              </select>
            </label>
            <label>
              <span className="admin-label">Points forts (un par ligne)</span>
              <textarea
                value={newProduct.features}
                onChange={(e) => setNewProduct((p) => ({ ...p, features: e.target.value }))}
                className="admin-input admin-textarea"
                rows={4}
              />
            </label>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary">Créer le produit</button>
            </div>
          </form>
        )}

        {loading && products.length === 0 ? (
          <p className="admin-loading">Chargement des produits…</p>
        ) : (
          <div className="admin-products">
            {products.map((product) => (
              <article key={product.id} className="admin-product-card">
                <div className="admin-product-preview">
                  <img
                    src={product.image}
                    alt=""
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228720-195a112e97e3?w=200&h=200&fit=crop'; }}
                  />
                </div>
                <div className="admin-product-info">
                  <h3 className="admin-product-name">{product.name}</h3>
                  <p className="admin-product-category">{product.category}</p>
                  {editingId === product.id ? (
                    <EditPriceForm
                      product={product}
                      onSave={handleUpdatePrice}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <>
                      <p className="admin-product-price">
                        {product.price.toFixed(2)} €
                        {product.originalPrice != null && product.discount > 0 && (
                          <span className="admin-product-old"> {product.originalPrice.toFixed(2)} € (−{product.discount} %)</span>
                        )}
                      </p>
                      <div className="admin-product-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-small admin-btn-primary"
                          onClick={() => setEditingId(product.id)}
                        >
                          Modifier le prix
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-small admin-btn-danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function EditPriceForm({ product, onSave, onCancel }) {
  const [price, setPrice] = useState(String(product.price))
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice != null ? String(product.originalPrice) : '')
  const [discount, setDiscount] = useState(String(product.discount || 0))

  return (
    <form
      className="admin-edit-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSave(product, price, originalPrice, discount)
      }}
    >
      <label>
        <span>Prix (€)</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="admin-input admin-input-small"
          required
        />
      </label>
      <label>
        <span>Ancien prix (€)</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          className="admin-input admin-input-small"
        />
      </label>
      <label>
        <span>Réduction (%)</span>
        <input
          type="number"
          min="0"
          max="100"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="admin-input admin-input-small"
        />
      </label>
      <div className="admin-edit-actions">
        <button type="submit" className="admin-btn admin-btn-small admin-btn-primary">Enregistrer</button>
        <button type="button" className="admin-btn admin-btn-small admin-btn-ghost" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  )
}

export default AdminPage

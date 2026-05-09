import React, { useState, useEffect } from 'react'
import { getProducts, loginAdmin, updateProduct, createProduct, deleteProduct, uploadImage, getResults, createResult, updateResult, deleteResult, requestPasswordReset, resetPassword, getProductImageUrl, logoutAdmin, formatForgotPasswordApiError, getAdminSettings, getAdminMe } from '../api'
import logo from '../assets/images/logo.png'
import './AdminPage.css'

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'
const DEFAULT_WHATSAPP_PHONE = '+33758021464'

// Chemins /images/… = servis par l’API (getProductImageUrl préfixe l’URL en prod). Autres chemins relatifs = site client.
function getImageSrc(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/images/')) return getProductImageUrl(path)
  return CLIENT_URL + (path.startsWith('/') ? path : '/' + path)
}

const AdminPage = () => {
  const [token, setToken] = useState('admin-open-access')
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
    image: '/images/products/placeholder.png',
    category: 'Cheveux',
    features: '',
    usage: '',
    bienfaits: '',
    pourQui: '',
    isMostPopular: false
  })
  const [tab, setTab] = useState('products')
  const [resultsList, setResultsList] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [showAddResult, setShowAddResult] = useState(false)
  const [editingResultId, setEditingResultId] = useState(null)
  const [newResult, setNewResult] = useState({
    image: '/images/temoignages/placeholder.png',
    hairType: 'Cheveux',
    months: 3,
    result: '',
    detail: '',
    objectPosition: 'center'
  })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotResetToken, setForgotResetToken] = useState('')
  const [forgotStep, setForgotStep] = useState('request')
  const [forgotNewPassword, setForgotNewPassword] = useState('')
  const [forgotConfirm, setForgotConfirm] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [settingsWhatsappPhone, setSettingsWhatsappPhone] = useState(DEFAULT_WHATSAPP_PHONE)
  const [adminEmail, setAdminEmail] = useState('')
  const [settingsNotice, setSettingsNotice] = useState('')

  useEffect(() => {
    document.title = 'CHEBE CARE BY SS — Admin'
    return () => {
      document.title = 'CHEBE CARE BY SS'
    }
  }, [])

  useEffect(() => {
    loadProducts()
    loadAdminSettings()
    loadAdminIdentity()
  }, [])

  useEffect(() => {
    if (tab === 'results') loadResults()
  }, [tab])

  const loadResults = async () => {
    setLoadingResults(true)
    try {
      const data = await getResults()
      setResultsList(Array.isArray(data) ? data : [])
    } catch (e) {
      setMessage({ type: 'error', text: 'Impossible de charger les résultats.' })
    } finally {
      setLoadingResults(false)
    }
  }

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

  const loadAdminSettings = async () => {
    try {
      const data = await getAdminSettings()
      setSettingsWhatsappPhone(String(data?.whatsappPhone || DEFAULT_WHATSAPP_PHONE))
      setSettingsNotice('')
    } catch (e) {
      setSettingsWhatsappPhone(DEFAULT_WHATSAPP_PHONE)
      setSettingsNotice('')
    }
  }

  const loadAdminIdentity = async () => {
    try {
      const me = await getAdminMe()
      setAdminEmail(String(me?.email || ''))
    } catch {
      setAdminEmail('')
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
    logoutAdmin()
      .catch(() => null)
      .finally(() => {
        window.location.href = '/admin/login'
      })
  }

  const resetForgotForm = () => {
    setForgotStep('request')
    setForgotEmail('')
    setForgotResetToken('')
    setForgotNewPassword('')
    setForgotConfirm('')
    setForgotError('')
  }

  const handleRequestResetCode = async (e) => {
    e.preventDefault()
    setForgotError('')
    const email = forgotEmail.trim()
    if (!email) {
      setForgotError('Veuillez saisir votre email.')
      return
    }
    try {
      await requestPasswordReset(email)
      setForgotEmail(email)
      setForgotStep('confirm')
      setMessage({
        type: 'success',
        text: 'Un lien de réinitialisation a été envoyé par email (ou consultez les spams).',
      })
    } catch (err) {
      setForgotError(formatForgotPasswordApiError(err))
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotError('')
    if (forgotNewPassword !== forgotConfirm) {
      setForgotError('Les deux mots de passe ne correspondent pas.')
      return
    }
    if (forgotNewPassword.length < 8) {
      setForgotError('Le mot de passe doit faire au moins 8 caractères (exigence du serveur).')
      return
    }
    const rawToken = forgotResetToken.trim()
    if (!rawToken) {
      setForgotError('Collez le token présent dans le lien reçu par email (après token=…).')
      return
    }
    try {
      await resetPassword(rawToken, forgotNewPassword, forgotConfirm)
      setShowForgotPassword(false)
      resetForgotForm()
      setPassword('')
      setLoginError('')
      setMessage({ type: 'success', text: 'Mot de passe réinitialisé. Connectez-vous avec le nouveau mot de passe.' })
    } catch (err) {
      setForgotError(err.message || 'Erreur')
    }
  }

  const parseBienfaits = (str) => {
    if (!str || !str.trim()) return null
    const lines = str.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return null
    return lines.map((line) => {
      const i = line.indexOf('|')
      if (i >= 0) return { title: line.slice(0, i).trim(), text: line.slice(i + 1).trim() }
      return { title: line, text: '' }
    })
  }

  const parsePourQui = (str) => {
    if (!str || !str.trim()) return null
    return str.split('\n').map((l) => l.trim()).filter(Boolean)
  }

  const computeDiscountPercent = (original, price) => {
    const o = Number(original)
    const p = Number(price)
    if (!o || o <= 0 || p >= o) return 0
    return Math.round(((o - p) / o) * 100)
  }

  const handleUpdateProduct = async (productId, data) => {
    setMessage({ type: '', text: '' })
    try {
      const features = Array.isArray(data.features) ? data.features : (data.featuresStr ? data.featuresStr.split('\n').map((f) => f.trim()).filter(Boolean) : [])
      const bienfaits = data.bienfaitsStr !== undefined ? parseBienfaits(data.bienfaitsStr) : data.bienfaits
      const pourQui = data.pourQuiStr !== undefined ? parsePourQui(data.pourQuiStr) : data.pourQui
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price) || 0,
        originalPrice: data.originalPrice === '' ? null : Number(data.originalPrice),
        discount: Number(data.discount) || 0,
        image: data.image || '/images/products/placeholder.png',
        category: data.category,
        features,
        usage: data.usage || null,
        bienfaits: bienfaits && bienfaits.length > 0 ? bienfaits : null,
        pourQui: pourQui && pourQui.length > 0 ? pourQui : null,
        isMostPopular: Boolean(data.isMostPopular)
      }
      const updated = await updateProduct(productId, payload, token)
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditingId(null)
      setMessage({ type: 'success', text: 'Produit mis à jour.' })
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
      const bienfaits = parseBienfaits(newProduct.bienfaits)
      const pourQui = parsePourQui(newProduct.pourQui)
      const created = await createProduct(
        {
          name: newProduct.name,
          description: newProduct.description,
          price: Number(newProduct.price) || 0,
          originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
          discount: Number(newProduct.discount) || 0,
          image: newProduct.image || '/images/products/placeholder.png',
          category: newProduct.category,
          features,
          usage: newProduct.usage || null,
          bienfaits,
          pourQui,
          isMostPopular: Boolean(newProduct.isMostPopular)
        },
        token
      )
      setProducts((prev) => [...prev, created])
      setShowAddForm(false)
      setNewProduct({ name: '', description: '', price: '', originalPrice: '', discount: '0', image: '/images/products/placeholder.png', category: 'Cheveux', features: '', usage: '', bienfaits: '', pourQui: '', isMostPopular: false })
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

  const handleAddResult = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    try {
      const monthsVal = Number(newResult.months) || 3
      const created = await createResult({
        image: newResult.image || '/images/temoignages/placeholder.png',
        hairType: newResult.hairType,
        duration: `${monthsVal} mois`,
        months: monthsVal,
        result: newResult.result,
        detail: newResult.detail,
        objectPosition: newResult.objectPosition || 'center'
      }, token)
      setResultsList((prev) => [...prev, created])
      setShowAddResult(false)
      setNewResult({ image: '/images/temoignages/placeholder.png', hairType: 'Cheveux', months: 3, result: '', detail: '', objectPosition: 'center' })
      setMessage({ type: 'success', text: 'Résultat ajouté.' })
    } catch (e) {
      setMessage({ type: 'error', text: e.message })
    }
  }

  const handleUpdateResult = async (item, data) => {
    setMessage({ type: '', text: '' })
    try {
      const updated = await updateResult(item.id, data, token)
      setResultsList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      setEditingResultId(null)
      setMessage({ type: 'success', text: 'Résultat mis à jour.' })
    } catch (e) {
      setMessage({ type: 'error', text: e.message })
    }
  }

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Supprimer ce résultat ?')) return
    setMessage({ type: '', text: '' })
    try {
      await deleteResult(id, token)
      setResultsList((prev) => prev.filter((r) => r.id !== id))
      setMessage({ type: 'success', text: 'Résultat supprimé.' })
    } catch (e) {
      setMessage({ type: 'error', text: e.message })
    }
  }

  if (!token) {
    return (
      <div className="admin-page admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-card-header">
            <span className="admin-login-icon" aria-hidden>🔐</span>
            <h1 className="admin-login-title">Administration</h1>
            <p className="admin-login-subtitle">
              {showForgotPassword ? 'Réinitialiser le mot de passe via le lien reçu par email.' : 'Connectez-vous pour modifier les produits et les prix.'}
            </p>
          </div>
          {showForgotPassword ? (
            forgotStep === 'request' ? (
              <form onSubmit={handleRequestResetCode} className="admin-login-form">
                <label>
                  <span className="admin-label">Email admin</span>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="admin-input"
                    placeholder="admin@monsite.com"
                    autoFocus
                    required
                  />
                </label>
                {forgotError && <p className="admin-error">{forgotError}</p>}
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-login">Envoyer le lien</button>
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-block" onClick={() => { setShowForgotPassword(false); resetForgotForm() }}>
                  ← Retour à la connexion
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="admin-login-form">
                <label>
                  <span className="admin-label">Email admin</span>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="admin-input"
                    placeholder="admin@monsite.com"
                    required
                  />
                </label>
                <label>
                  <span className="admin-label">Token du lien (collez tout le jeton après token=)</span>
                  <input
                    type="text"
                    value={forgotResetToken}
                    onChange={(e) => setForgotResetToken(e.target.value)}
                    className="admin-input"
                    placeholder="Longue chaîne hexadécimale du mail"
                    autoFocus
                    required
                  />
                </label>
                <label>
                  <span className="admin-label">Nouveau mot de passe</span>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="admin-input"
                    placeholder="Au moins 8 caractères"
                    required
                  />
                </label>
                <label>
                  <span className="admin-label">Confirmer le mot de passe</span>
                  <input
                    type="password"
                    value={forgotConfirm}
                    onChange={(e) => setForgotConfirm(e.target.value)}
                    className="admin-input"
                    placeholder="Répétez le mot de passe"
                    required
                  />
                </label>
                {forgotError && <p className="admin-error">{forgotError}</p>}
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-login">Réinitialiser le mot de passe</button>
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-block" onClick={() => setForgotStep('request')}>
                  ← Changer d'email
                </button>
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-block" onClick={() => { setShowForgotPassword(false); resetForgotForm() }}>
                  ← Retour à la connexion
                </button>
              </form>
            )
          ) : (
            <>
              <form onSubmit={handleLogin} className="admin-login-form">
                <label>
                  <span className="admin-label">Mot de passe</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input admin-input-login"
                    placeholder="Mot de passe admin"
                    autoFocus
                  />
                </label>
                {loginError && <p className="admin-error">{loginError}</p>}
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-login">Connexion</button>
              </form>
              <p className="admin-hint admin-hint-box">Par défaut : admin123 (à modifier dans server/.env)</p>
              <div className="admin-login-links">
                <button type="button" className="admin-link admin-link-button" onClick={() => setShowForgotPassword(true)}>
                  Mot de passe oublié ?
                </button>
                <a href={CLIENT_URL} className="admin-link">← Retour au site</a>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-header-title">
            <img src={logo} alt="Logo SS Hair & Beard" className="admin-logo" />
            <h1 className="admin-title">Admin</h1>
          </div>
          <nav className="admin-tabs">
            <button type="button" className={'admin-tab ' + (tab === 'products' ? 'active' : '')} onClick={() => setTab('products')}>Produits</button>
            <button type="button" className={'admin-tab ' + (tab === 'results' ? 'active' : '')} onClick={() => setTab('results')}>Résultats</button>
            <button type="button" className={'admin-tab ' + (tab === 'settings' ? 'active' : '')} onClick={() => setTab('settings')}>Mes coordonnées</button>
          </nav>
          <div className="admin-header-actions">
            <a href={CLIENT_URL} className="admin-btn admin-btn-ghost">Voir le site</a>
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

        {tab === 'results' ? (
          <>
            <div className="admin-toolbar">
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => { setShowAddResult(!showAddResult); setMessage({ type: '', text: '' }); }}>
                {showAddResult ? 'Annuler' : '+ Ajouter un résultat'}
              </button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={loadResults} disabled={loadingResults}>Actualiser</button>
            </div>
            {showAddResult && (
              <form onSubmit={handleAddResult} className="admin-form">
                <h2>Nouveau résultat</h2>
                <label>
                  <span className="admin-label">Image</span>
                  <div className="admin-image-field">
                    <input type="text" value={newResult.image} onChange={(e) => setNewResult((r) => ({ ...r, image: e.target.value }))} className="admin-input" />
                    <label className="admin-btn admin-btn-ghost admin-btn-browse">
                      Parcourir…
                      <input type="file" accept="image/*" hidden onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file || !token) return
                        try {
                          const pathUrl = await uploadImage(file, token, { folder: 'temoignages' })
                          setNewResult((r) => ({ ...r, image: pathUrl }))
                          setMessage({ type: 'success', text: 'Image envoyée.' })
                        } catch (err) { setMessage({ type: 'error', text: err.message }) }
                        e.target.value = ''
                      }} />
                    </label>
                  </div>
                </label>
                <label><span className="admin-label">Titre résultat</span><input type="text" value={newResult.result} onChange={(e) => setNewResult((r) => ({ ...r, result: e.target.value }))} className="admin-input" required /></label>
                <label><span className="admin-label">Détail</span><textarea value={newResult.detail} onChange={(e) => setNewResult((r) => ({ ...r, detail: e.target.value }))} className="admin-input admin-textarea" rows={4} /></label>
                <div className="admin-form-row">
                  <label><span className="admin-label">Type cheveux</span>
                    <select value={newResult.hairType} onChange={(e) => setNewResult((r) => ({ ...r, hairType: e.target.value }))} className="admin-input">
                      <option value="Cheveux">Cheveux</option><option value="Poils & barbe">Poils & barbe</option><option value="Crépus">Crépus</option><option value="Bouclés">Bouclés</option><option value="Lisses">Lisses</option>
                    </select>
                  </label>
                  <label><span className="admin-label">Durée en mois</span><input type="number" min="1" value={newResult.months} onChange={(e) => setNewResult((r) => ({ ...r, months: e.target.value }))} className="admin-input" placeholder="Ex. 3" /></label>
                </div>
                <div className="admin-form-actions"><button type="submit" className="admin-btn admin-btn-primary">Créer</button></div>
              </form>
            )}
            {loadingResults && resultsList.length === 0 ? <p className="admin-loading">Chargement…</p> : (
              <div className="admin-products">
                {resultsList.map((item) => (
                  <article key={item.id} className="admin-product-card">
                    <div className="admin-product-preview">
                      <img src={getImageSrc(item.image)} alt="" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228720-195a112e97e3?w=200&h=200&fit=crop'; }} />
                    </div>
                    <div className="admin-product-info">
                      <h3 className="admin-product-name">{item.result}</h3>
                      <p className="admin-product-category">{item.hairType} · {item.duration}</p>
                      {editingResultId === item.id ? (
                        <EditResultForm item={item} onSave={(data) => handleUpdateResult(item, data)} onCancel={() => setEditingResultId(null)} />
                      ) : (
                        <>
                          <p className="admin-product-price">{item.detail}</p>
                          <div className="admin-product-actions">
                            <button type="button" className="admin-btn admin-btn-small admin-btn-primary" onClick={() => setEditingResultId(item.id)}>Modifier</button>
                            <button type="button" className="admin-btn admin-btn-small admin-btn-danger" onClick={() => handleDeleteResult(item.id)}>Supprimer</button>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : tab === 'settings' ? (
        <>
        <section className="admin-form admin-form-add">
          <h2>Mes coordonnées</h2>
          {settingsNotice ? (
            <p className="admin-product-category">{settingsNotice}</p>
          ) : null}
          <div className="admin-form-row">
            <label>
              <span className="admin-label">Email administrateur</span>
              <input type="text" value={adminEmail || '—'} readOnly className="admin-input" />
            </label>
            <label>
              <span className="admin-label">Numéro WhatsApp (commande)</span>
              <input type="text" value={settingsWhatsappPhone || '—'} readOnly className="admin-input" />
            </label>
          </div>
        </section>
        </>
        ) : (
        <>
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
                  onChange={(e) => {
                    const value = e.target.value
                    setNewProduct((p) => {
                      const discount = computeDiscountPercent(p.originalPrice, value)
                      return {
                        ...p,
                        price: value,
                        discount: discount > 0 ? String(discount) : p.discount
                      }
                    })
                  }}
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
                  onChange={(e) => {
                    const value = e.target.value
                    setNewProduct((p) => {
                      const discount = computeDiscountPercent(value, p.price)
                      return {
                        ...p,
                        originalPrice: value,
                        discount: discount > 0 ? String(discount) : p.discount
                      }
                    })
                  }}
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
              <span className="admin-label">Image</span>
              <div className="admin-image-field">
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))}
                  className="admin-input"
                  placeholder="URL ou parcourir pour envoyer un fichier"
                />
                <label className="admin-btn admin-btn-ghost admin-btn-browse">
                  Parcourir…
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file || !token) return
                      try {
                        const pathUrl = await uploadImage(file, token)
                        setNewProduct((p) => ({ ...p, image: pathUrl }))
                        setMessage({ type: 'success', text: 'Image envoyée.' })
                      } catch (err) {
                        setMessage({ type: 'error', text: err.message })
                      }
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
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
            <label>
              <span className="admin-label">Bienfaits (un par ligne : Titre | Description)</span>
              <textarea
                value={newProduct.bienfaits}
                onChange={(e) => setNewProduct((p) => ({ ...p, bienfaits: e.target.value }))}
                className="admin-input admin-textarea"
                rows={4}
                placeholder="Réduit la casse | Le chébé aide à maintenir l'hydratation…"
              />
            </label>
            <label>
              <span className="admin-label">Pour qui (un par ligne)</span>
              <textarea
                value={newProduct.pourQui}
                onChange={(e) => setNewProduct((p) => ({ ...p, pourQui: e.target.value }))}
                className="admin-input admin-textarea"
                rows={3}
                placeholder="Cheveux cassants&#10;Cheveux secs ou déshydratés"
              />
            </label>
            <label>
              <span className="admin-label">Mode d'emploi</span>
              <textarea
                value={newProduct.usage}
                onChange={(e) => setNewProduct((p) => ({ ...p, usage: e.target.value }))}
                className="admin-input admin-textarea"
                rows={4}
              />
            </label>
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={newProduct.isMostPopular}
                onChange={(e) => setNewProduct((p) => ({ ...p, isMostPopular: e.target.checked }))}
                className="admin-checkbox"
              />
              <span>Le produit le plus apprécié</span>
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
                    src={getImageSrc(product.image)}
                    alt=""
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228720-195a112e97e3?w=200&h=200&fit=crop'; }}
                  />
                </div>
                <div className="admin-product-info">
                  <h3 className="admin-product-name">{product.name}</h3>
                  <p className="admin-product-category">{product.category}</p>
                  {editingId === product.id ? (
                    <EditProductForm
                      product={product}
                      onSave={(data) => handleUpdateProduct(product.id, data)}
                      onCancel={() => setEditingId(null)}
                      onUploadImage={async (file) => {
                        try {
                          const pathUrl = await uploadImage(file, token)
                          setMessage({ type: 'success', text: 'Image envoyée.' })
                          return pathUrl
                        } catch (err) {
                          setMessage({ type: 'error', text: err.message })
                          return null
                        }
                      }}
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
                          Modifier
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
        </>
        )}
      </main>
    </div>
  )
}

function EditResultForm({ item, onSave, onCancel }) {
  const [result, setResult] = useState(item.result)
  const [detail, setDetail] = useState(item.detail || '')
  const [hairType, setHairType] = useState(item.hairType)
  const [durationMonths, setDurationMonths] = useState(typeof item.months === 'number' ? item.months : parseInt(item.duration, 10) || 3)
  return (
    <form className="admin-edit-form admin-edit-form-result" onSubmit={(e) => {
      e.preventDefault()
      onSave({ result, detail, hairType, duration: `${durationMonths} mois`, months: durationMonths })
    }}>
      <label><span>Titre</span><input type="text" value={result} onChange={(e) => setResult(e.target.value)} className="admin-input" required /></label>
      <label><span>Détail</span><textarea value={detail} onChange={(e) => setDetail(e.target.value)} className="admin-input admin-textarea" rows={3} /></label>
      <label><span>Type</span><select value={hairType} onChange={(e) => setHairType(e.target.value)} className="admin-input">
        <option value="Cheveux">Cheveux</option><option value="Poils & barbe">Poils & barbe</option><option value="Crépus">Crépus</option><option value="Bouclés">Bouclés</option><option value="Lisses">Lisses</option>
      </select></label>
      <label><span>Durée en mois</span><input type="number" min="1" value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value) || 1)} className="admin-input" /></label>
      <div className="admin-edit-actions">
        <button type="submit" className="admin-btn admin-btn-small admin-btn-primary">Enregistrer</button>
        <button type="button" className="admin-btn admin-btn-small admin-btn-ghost" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  )
}

function EditProductForm({ product, onSave, onCancel, onUploadImage }) {
  const [name, setName] = useState(product.name || '')
  const [description, setDescription] = useState(product.description || '')
  const [price, setPrice] = useState(String(product.price))
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice != null ? String(product.originalPrice) : '')
  const [discount, setDiscount] = useState(String(product.discount || 0))
  const [image, setImage] = useState(product.image || '')
  const [category, setCategory] = useState(product.category || 'Cheveux')
  const [featuresStr, setFeaturesStr] = useState(Array.isArray(product.features) ? product.features.join('\n') : '')
  const [usage, setUsage] = useState(product.usage || '')
  const [bienfaitsStr, setBienfaitsStr] = useState(
    product.bienfaits && product.bienfaits.length
      ? product.bienfaits.map((b) => (b.title && b.text ? `${b.title} | ${b.text}` : b.title || b.text || '')).join('\n')
      : ''
  )
  const [pourQuiStr, setPourQuiStr] = useState(Array.isArray(product.pourQui) ? product.pourQui.join('\n') : '')
  const [isMostPopular, setIsMostPopular] = useState(product.isMostPopular || false)

  return (
    <form
      className="admin-edit-form admin-edit-form-full admin-edit-form-product"
      onSubmit={(e) => {
        e.preventDefault()
        onSave({
          name,
          description,
          price,
          originalPrice,
          discount,
          image,
          category,
          featuresStr,
          usage,
          bienfaitsStr,
          pourQuiStr,
          isMostPopular
        })
      }}
    >
      <section className="admin-form-section">
        <h4 className="admin-form-section-title">Informations générales</h4>
        <label><span>Nom</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" required /></label>
        <label><span>Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input admin-textarea" rows={3} placeholder="Description du produit…" /></label>
      </section>

      <section className="admin-form-section">
        <h4 className="admin-form-section-title">Prix</h4>
        <div className="admin-form-row admin-form-row-pricing">
          <label><span>Prix (€)</span><input type="number" step="0.01" min="0" value={price} onChange={(e) => {
            const value = e.target.value
            setPrice(value)
            const discount = computeDiscountPercent(originalPrice, value)
            if (discount > 0) setDiscount(String(discount))
          }} className="admin-input" required /></label>
          <label><span>Ancien prix (€)</span><input type="number" step="0.01" min="0" value={originalPrice} onChange={(e) => {
            const value = e.target.value
            setOriginalPrice(value)
            const discount = computeDiscountPercent(value, price)
            if (discount > 0) setDiscount(String(discount))
          }} className="admin-input" /></label>
          <label><span>Réduction (%)</span><input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} className="admin-input" /></label>
        </div>
      </section>

      <section className="admin-form-section">
        <h4 className="admin-form-section-title">Image & catégorie</h4>
        <label><span>Image</span>
          <div className="admin-image-field">
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="admin-input" placeholder="Parcourir pour envoyer une image" />
            <label className="admin-btn admin-btn-ghost admin-btn-browse">
              Parcourir…
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file || !onUploadImage) return
                  const pathUrl = await onUploadImage(file)
                  if (pathUrl) setImage(pathUrl)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
        </label>
        <label><span>Catégorie</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
            <option value="Cheveux">Cheveux</option><option value="Barbe">Barbe</option><option value="Encens">Encens</option>
          </select>
        </label>
      </section>

      <section className="admin-form-section">
        <h4 className="admin-form-section-title">Contenu</h4>
        <label><span>Points forts (un par ligne)</span><textarea value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} className="admin-input admin-textarea" rows={4} placeholder="Un point fort par ligne" /></label>
        <label><span>Bienfaits (Titre | Description, un par ligne)</span><textarea value={bienfaitsStr} onChange={(e) => setBienfaitsStr(e.target.value)} className="admin-input admin-textarea" rows={4} placeholder="Titre | Description" /></label>
        <label><span>Pour qui (un par ligne)</span><textarea value={pourQuiStr} onChange={(e) => setPourQuiStr(e.target.value)} className="admin-input admin-textarea" rows={2} placeholder="Ex. Cheveux secs, Barbes…" /></label>
        <label><span>Mode d'emploi</span><textarea value={usage} onChange={(e) => setUsage(e.target.value)} className="admin-input admin-textarea" rows={4} placeholder="Instructions d'utilisation…" /></label>
      </section>

      <section className="admin-form-section">
        <label className="admin-checkbox-label">
          <input
            type="checkbox"
            checked={isMostPopular}
            onChange={(e) => setIsMostPopular(e.target.checked)}
            className="admin-checkbox"
          />
          <span>Le produit le plus apprécié</span>
        </label>
      </section>

      <div className="admin-edit-actions admin-edit-actions-footer">
        <button type="submit" className="admin-btn admin-btn-primary">Enregistrer</button>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  )
}

export default AdminPage

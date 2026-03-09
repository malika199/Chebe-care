// En dev avec proxy Vite : '' pour utiliser /api via le proxy. Sinon mettre VITE_API_URL (ex. http://localhost:3001)
const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function getProducts() {
  const res = await fetch(`${API_BASE}/api/products`)
  if (!res.ok) throw new Error('Erreur chargement produits')
  return res.json()
}

export async function getProduct(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`)
  if (!res.ok) throw new Error('Produit introuvable')
  return res.json()
}

export async function loginAdmin(password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur connexion')
  return data.token
}

export async function updateProduct(id, data, token) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur mise à jour')
  }
  return res.json()
}

export async function createProduct(data, token) {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur création')
  }
  return res.json()
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur suppression')
  }
  return res.json()
}

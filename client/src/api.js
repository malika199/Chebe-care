// En dev avec proxy Vite : laisse VITE_API_URL vide → /api et /images passent par le proxy.
// En production : VITE_API_URL au moment du build (ex. https://api.tondomaine.com), OU balise
// <meta name="api-base-url" content="https://api.tondomaine.com" /> dans index.html (sans slash final).

function normalizeApiBase(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return ''
  return s.replace(/\/+$/, '')
}

const ENV_API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL)

let warnedMissingApi = false

export function getApiBase() {
  if (ENV_API_BASE) return ENV_API_BASE
  if (typeof document !== 'undefined') {
    const el = document.querySelector('meta[name="api-base-url"]')
    const fromMeta = normalizeApiBase(el?.getAttribute('content') ?? '')
    if (fromMeta) return fromMeta
  }
  if (import.meta.env.PROD && !warnedMissingApi) {
    warnedMissingApi = true
    console.warn(
      '[CHEBE CARE] Aucune URL d’API : les images et l’API ne chargeront pas. ' +
        'Définis VITE_API_URL avant `npm run build`, ou ajoute dans <head> : ' +
        '<meta name="api-base-url" content="https://ton-api.com" />'
    )
  }
  return ''
}

/** URL d’image produit ou résultat (chemins /images/products/… et /images/temoignages/… servis par l’API). */
export function getProductImageUrl(image) {
  if (!image) return ''
  if (typeof image !== 'string') return image
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  const base = getApiBase()
  const path = image.startsWith('/') ? image : `/${image}`
  return base ? `${base}${path}` : path
}

export async function getProducts() {
  const base = getApiBase()
  const res = await fetch(`${base}/api/products`)
  if (!res.ok) throw new Error('Erreur chargement produits')
  return res.json()
}

export async function getProduct(id) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/products/${id}`)
  if (!res.ok) throw new Error('Produit introuvable')
  return res.json()
}

export async function getResults() {
  const base = getApiBase()
  const res = await fetch(`${base}/api/results`)
  if (!res.ok) throw new Error('Erreur chargement résultats')
  return res.json()
}

export async function loginAdmin(password) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur connexion')
  return data.token
}

export async function updateProduct(id, data, token) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/products/${id}`, {
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
  const base = getApiBase()
  const res = await fetch(`${base}/api/products`, {
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
  const base = getApiBase()
  const res = await fetch(`${base}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur suppression')
  }
  return res.json()
}

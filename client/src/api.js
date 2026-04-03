// Résolution de l’URL de l’API (données + images) :
// 1) VITE_API_URL au build
// 2) <meta name="api-base-url" content="https://..." /> dans index.html
// 3) GET /api/public-base (même origine) — utile si seul /api/* est proxifié vers le serveur

function normalizeApiBase(raw) {
  let s = String(raw ?? '').trim().replace(/\/+$/, '')
  if (!s) return ''
  // Erreurs fréquentes : …/api, …/images, …/images/products — la base doit être la racine du serveur uniquement.
  if (/\/api$/i.test(s)) s = s.replace(/\/api$/i, '').replace(/\/+$/, '')
  s = s.replace(/\/images(\/(products|temoignages))?$/i, '').replace(/\/+$/, '')
  return s
}

/** Chemin relatif attendu : /images/products/fichier.ext ou /images/temoignages/fichier.ext */
function isValidRelativeImagePath(p) {
  const x = p.startsWith('/') ? p : `/${p}`
  return /^\/images\/(products|temoignages)\/[^/]+/.test(x)
}

const ENV_API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL)

function readMetaApiBase() {
  if (typeof document === 'undefined') return ''
  const el = document.querySelector('meta[name="api-base-url"]')
  return normalizeApiBase(el?.getAttribute('content') ?? '')
}

/** null = init pas encore fait ; string (peut être '') après initApiBase() */
let resolvedBase = null
let warnedMissingApi = false

/** Défini après la première réponse API qui expose X-Asset-Base-Url (prioritaire sur getApiBase pour les images). */
let assetBaseFromApi = ''

function applyAssetBaseFromResponse(res) {
  try {
    const h = res.headers.get('x-asset-base-url')
    const n = normalizeApiBase(h || '')
    if (!n || n === assetBaseFromApi) return
    assetBaseFromApi = n
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('chebe-asset-base'))
    }
  } catch {
    /* ignore */
  }
}

export async function initApiBase() {
  if (resolvedBase !== null) return

  if (ENV_API_BASE) {
    resolvedBase = ENV_API_BASE
    return
  }

  const fromMeta = readMetaApiBase()
  if (fromMeta) {
    resolvedBase = fromMeta
    return
  }

  try {
    const r = await fetch('/api/public-base')
    if (!r.ok) throw new Error('public-base not ok')
    const j = await r.json()
    resolvedBase = normalizeApiBase(j.baseUrl ?? '')
  } catch {
    resolvedBase = ''
  }

  if (import.meta.env.PROD && !resolvedBase && !warnedMissingApi) {
    warnedMissingApi = true
    console.warn(
      '[CHEBE CARE] Impossible de résoudre l’URL des images. ' +
        'Définis VITE_API_URL au build, ou <meta name="api-base-url" />, ' +
        'ou proxifie aussi /images/* vers l’API, ou PUBLIC_BASE_URL sur le serveur.'
    )
  }
}

export function getApiBase() {
  if (resolvedBase !== null) return resolvedBase
  return ENV_API_BASE || readMetaApiBase()
}

/** URL d’image produit ou résultat (chemins /images/products/… et /images/temoignages/…). */
export function getProductImageUrl(image) {
  if (!image) return ''
  if (typeof image !== 'string') return image
  if (image.startsWith('http://') || image.startsWith('https://')) {
    try {
      const u = new URL(image)
      if (!/^\/images\/(products|temoignages)\/[^/]+/.test(u.pathname)) return ''
      return image
    } catch {
      return ''
    }
  }
  const path = image.startsWith('/') ? image : `/${image}`
  if (!isValidRelativeImagePath(path)) return ''
  const base = assetBaseFromApi || getApiBase()
  return base ? `${base}${path}` : path
}

export async function getProducts() {
  const base = getApiBase()
  const res = await fetch(`${base}/api/products`)
  applyAssetBaseFromResponse(res)
  if (!res.ok) throw new Error('Erreur chargement produits')
  return res.json()
}

export async function getProduct(id) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/products/${id}`)
  applyAssetBaseFromResponse(res)
  if (!res.ok) throw new Error('Produit introuvable')
  return res.json()
}

export async function getResults() {
  const base = getApiBase()
  const res = await fetch(`${base}/api/results`)
  applyAssetBaseFromResponse(res)
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

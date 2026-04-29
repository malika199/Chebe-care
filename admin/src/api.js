function normalizeApiBase(raw) {
  let s = String(raw ?? '').trim().replace(/\/+$/, '')
  if (!s) return ''
  if (/\/api$/i.test(s)) s = s.replace(/\/api$/i, '').replace(/\/+$/, '')
  s = s.replace(/\/images(\/(products|temoignages))?$/i, '').replace(/\/+$/, '')
  return s
}

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

let resolvedBase = null
let warnedMissingApi = false

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
      '[Admin CHEBE CARE] URL API / images non résolue. Définis VITE_API_URL, ou <meta name="api-base-url" />, ou PUBLIC_BASE_URL sur le serveur.'
    )
  }
}

export function getApiBase() {
  if (resolvedBase !== null) return resolvedBase
  return ENV_API_BASE || readMetaApiBase()
}

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

async function parseApiResponse(res) {
  const raw = await res.text()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return { error: raw }
  }
}

function withJsonHeaders(extra = {}) {
  return { 'Content-Type': 'application/json', ...extra }
}

async function apiFetch(url, options = {}) {
  return fetch(url, { credentials: 'include', ...options })
}

export async function getProducts() {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/products`)
  applyAssetBaseFromResponse(res)
  if (!res.ok) throw new Error('Erreur chargement produits')
  return res.json()
}

export async function loginAdmin(email, password) {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/admin/login`, {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ email, password })
  })
  const data = await parseApiResponse(res)
  if (!res.ok) throw new Error(data.error || 'Erreur connexion')
  return data
}

export async function logoutAdmin() {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/admin/logout`, {
    method: 'POST',
    headers: withJsonHeaders()
  })
  const data = await parseApiResponse(res)
  if (!res.ok) throw new Error(data.error || 'Erreur déconnexion')
  return data
}

export async function getAdminMe() {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/admin/me`)
  const data = await parseApiResponse(res)
  if (!res.ok) throw new Error(data.error || 'Session invalide')
  return data
}

export async function changePassword(currentPassword, newPassword, confirmPassword) {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/admin/change-password`, {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
  })
  const data = await parseApiResponse(res)
  if (!res.ok) throw new Error(data.error || 'Erreur')
  return data
}

export async function forgotPassword(email) {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/admin/forgot-password`, {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ email })
  })
  const data = await parseApiResponse(res)
  if (!res.ok) throw new Error(data.error || 'Erreur')
  return data
}

export async function requestPasswordReset(email) {
  return forgotPassword(email)
}

export async function resetPassword(token, newPassword, confirmPassword) {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/admin/reset-password`, {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ token, newPassword, confirmPassword })
  })
  const data = await parseApiResponse(res)
  if (!res.ok) throw new Error(data.error || 'Erreur')
  return data
}

export async function updateProduct(id, data, token) {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/products/${id}`, {
    method: 'PUT',
    headers: withJsonHeaders(),
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
  const res = await apiFetch(`${base}/api/products`, {
    method: 'POST',
    headers: withJsonHeaders(),
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
  const res = await apiFetch(`${base}/api/products/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur suppression')
  }
  return res.json()
}

export async function uploadImage(file, token, { folder = 'products' } = {}) {
  const base = getApiBase()
  const formData = new FormData()
  formData.append('image', file)
  const query = folder === 'temoignages' ? '?folder=temoignages' : ''
  const res = await apiFetch(`${base}/api/upload${query}`, {
    method: 'POST',
    body: formData
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur upload')
  }
  const data = await res.json()
  return data.path
}

export async function getResults() {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/results`)
  applyAssetBaseFromResponse(res)
  if (!res.ok) throw new Error('Erreur chargement résultats')
  return res.json()
}

export async function createResult(data, token) {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/results`, {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur création')
  }
  return res.json()
}

export async function updateResult(id, data, token) {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/results/${id}`, {
    method: 'PUT',
    headers: withJsonHeaders(),
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur mise à jour')
  }
  return res.json()
}

export async function deleteResult(id, token) {
  const base = getApiBase()
  const res = await apiFetch(`${base}/api/results/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur suppression')
  }
  return res.json()
}

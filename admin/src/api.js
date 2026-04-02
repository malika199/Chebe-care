function normalizeApiBase(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return ''
  return s.replace(/\/+$/, '')
}

const ENV_API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL)

function readMetaApiBase() {
  if (typeof document === 'undefined') return ''
  const el = document.querySelector('meta[name="api-base-url"]')
  return normalizeApiBase(el?.getAttribute('content') ?? '')
}

let resolvedBase = null
let warnedMissingApi = false

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
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  const base = getApiBase()
  const path = image.startsWith('/') ? image : `/${image}`
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

export async function getProducts() {
  const base = getApiBase()
  const res = await fetch(`${base}/api/products`)
  if (!res.ok) throw new Error('Erreur chargement produits')
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

export async function changePassword(currentPassword, newPassword, token) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/admin/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur')
  return data.token
}

export async function requestPasswordReset(email) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/admin/request-password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  const data = await parseApiResponse(res)
  if (!res.ok) throw new Error(data.error || 'Erreur')
  return data
}

export async function forgotPassword(email, resetCode, newPassword) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/admin/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, resetCode, newPassword })
  })
  const data = await parseApiResponse(res)
  if (!res.ok) throw new Error(data.error || 'Erreur')
  return data
}

export async function getRecoveryCode(token) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/admin/recovery-code`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Impossible de récupérer le code')
  return res.json()
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

export async function uploadImage(file, token, { folder = 'products' } = {}) {
  const base = getApiBase()
  const formData = new FormData()
  formData.append('image', file)
  const query = folder === 'temoignages' ? '?folder=temoignages' : ''
  const res = await fetch(`${base}/api/upload${query}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
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
  const res = await fetch(`${base}/api/results`)
  if (!res.ok) throw new Error('Erreur chargement résultats')
  return res.json()
}

export async function createResult(data, token) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/results`, {
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

export async function updateResult(id, data, token) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/results/${id}`, {
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

export async function deleteResult(id, token) {
  const base = getApiBase()
  const res = await fetch(`${base}/api/results/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur suppression')
  }
  return res.json()
}

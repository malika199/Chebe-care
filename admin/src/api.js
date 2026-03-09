const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function getProducts() {
  const res = await fetch(`${API_BASE}/api/products`)
  if (!res.ok) throw new Error('Erreur chargement produits')
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

export async function changePassword(currentPassword, newPassword, token) {
  const res = await fetch(`${API_BASE}/api/admin/change-password`, {
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

export async function forgotPassword(recoveryCode, newPassword) {
  const res = await fetch(`${API_BASE}/api/admin/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recoveryCode, newPassword })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur')
  return data
}

export async function getRecoveryCode(token) {
  const res = await fetch(`${API_BASE}/api/admin/recovery-code`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Impossible de récupérer le code')
  return res.json()
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

export async function uploadImage(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`${API_BASE}/api/upload`, {
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
  const res = await fetch(`${API_BASE}/api/results`)
  if (!res.ok) throw new Error('Erreur chargement résultats')
  return res.json()
}

export async function createResult(data, token) {
  const res = await fetch(`${API_BASE}/api/results`, {
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
  const res = await fetch(`${API_BASE}/api/results/${id}`, {
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
  const res = await fetch(`${API_BASE}/api/results/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Erreur suppression')
  }
  return res.json()
}
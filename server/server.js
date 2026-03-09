import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'products.json')
const RESULTS_FILE = path.join(DATA_DIR, 'results.json')
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json')
const PUBLIC_DIR = path.join(__dirname, 'public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')
const PORT = process.env.PORT || 3001
const ADMIN_PASSWORD_ENV = process.env.ADMIN_PASSWORD || 'admin123'

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')
    const name = base ? `${base}-${Date.now()}${ext}` : `upload-${Date.now()}${ext}`
    cb(null, name)
  }
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5 Mo

const app = express()
app.use(cors())
app.use(express.json())
app.use('/images', express.static(IMAGES_DIR))

function readProducts() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8')
}

function nextId(products) {
  const ids = products.map((p) => p.id)
  return ids.length ? Math.max(...ids) + 1 : 1
}

/** Calcule le pourcentage de réduction à partir du prix ancien et du prix actuel. */
function computeDiscountPercent(originalPrice, price) {
  if (originalPrice == null || originalPrice <= 0 || price >= originalPrice) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

/** Enrichit un produit avec un discount calculé si prix ancien > prix nouveau. */
function enrichProductWithDiscount(product) {
  const p = { ...product }
  const computed = computeDiscountPercent(p.originalPrice, p.price)
  if (computed > 0) p.discount = computed
  return p
}

function readResults() {
  try {
    const raw = fs.readFileSync(RESULTS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function writeResults(results) {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2), 'utf-8')
}

function nextResultId(results) {
  const ids = results.map((r) => r.id)
  return ids.length ? Math.max(...ids) + 1 : 1
}

// ——— Admin (mot de passe stocké dans data/admin.json, sinon .env) ———
function generateRecoveryCode() {
  return crypto.randomBytes(6).toString('hex')
}

function readAdminConfig() {
  try {
    const raw = fs.readFileSync(ADMIN_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function writeAdminConfig(config) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(config, null, 2), 'utf-8')
}

function getAdminPassword() {
  const config = readAdminConfig()
  return config?.password ?? ADMIN_PASSWORD_ENV
}

function ensureAdminFile() {
  if (readAdminConfig()) return
  const recoveryCode = generateRecoveryCode()
  writeAdminConfig({
    password: ADMIN_PASSWORD_ENV,
    recoveryCode
  })
  console.log('Fichier admin créé. Code de récupération (à sauvegarder) :', recoveryCode)
}

// Vérifier que l'admin est connecté (token = mot de passe actuel)
function adminAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-admin-token']
  if (token !== getAdminPassword()) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  next()
}

// ——— Routes publiques ———
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts().map(enrichProductWithDiscount)
    res.json(products)
  } catch (e) {
    res.status(500).json({ error: 'Erreur lecture produits' })
  }
})

app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProducts()
    const id = Number(req.params.id)
    const product = products.find((p) => p.id === id)
    if (!product) return res.status(404).json({ error: 'Produit introuvable' })
    res.json(enrichProductWithDiscount(product))
  } catch (e) {
    res.status(500).json({ error: 'Erreur lecture produit' })
  }
})

// ——— Routes admin (protégées) ———
app.post('/api/upload', adminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier envoyé' })
    const pathUrl = '/images/' + req.file.filename
    res.json({ path: pathUrl })
  } catch (e) {
    res.status(500).json({ error: 'Erreur upload' })
  }
})

ensureAdminFile()

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {}
  const currentPassword = getAdminPassword()
  if (password === currentPassword) {
    res.json({ token: currentPassword, ok: true })
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' })
  }
})

app.post('/api/admin/change-password', adminAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {}
    const config = readAdminConfig()
    if (!config) return res.status(500).json({ error: 'Configuration admin introuvable' })
    if (currentPassword !== config.password) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' })
    }
    if (!newPassword || String(newPassword).length < 4) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 4 caractères' })
    }
    config.password = newPassword
    writeAdminConfig(config)
    res.json({ token: newPassword, ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors du changement de mot de passe' })
  }
})

app.post('/api/admin/forgot-password', (req, res) => {
  try {
    const { recoveryCode, newPassword } = req.body || {}
    const config = readAdminConfig()
    if (!config || !config.recoveryCode) {
      return res.status(400).json({ error: 'Réinitialisation non disponible. Utilisez ADMIN_PASSWORD dans server/.env.' })
    }
    if (String(recoveryCode).trim().toLowerCase() !== String(config.recoveryCode).trim().toLowerCase()) {
      return res.status(401).json({ error: 'Code de récupération incorrect' })
    }
    if (!newPassword || String(newPassword).length < 4) {
      return res.status(400).json({ error: 'Le mot de passe doit faire au moins 4 caractères' })
    }
    config.password = newPassword
    config.recoveryCode = generateRecoveryCode()
    writeAdminConfig(config)
    res.json({ ok: true, message: 'Mot de passe réinitialisé. Connectez-vous avec le nouveau mot de passe.' })
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors de la réinitialisation' })
  }
})

app.get('/api/admin/recovery-code', adminAuth, (req, res) => {
  try {
    const config = readAdminConfig()
    if (!config?.recoveryCode) return res.status(404).json({ error: 'Aucun code de récupération' })
    res.json({ recoveryCode: config.recoveryCode })
  } catch (e) {
    res.status(500).json({ error: 'Erreur' })
  }
})

app.put('/api/products/:id', adminAuth, (req, res) => {
  try {
    const products = readProducts()
    const id = Number(req.params.id)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return res.status(404).json({ error: 'Produit introuvable' })
    const updated = { ...products[index], ...req.body, id }
    const computedDiscount = computeDiscountPercent(updated.originalPrice, updated.price)
    if (computedDiscount > 0) updated.discount = computedDiscount
    products[index] = updated
    writeProducts(products)
    res.json(updated)
  } catch (e) {
    res.status(500).json({ error: 'Erreur mise à jour produit' })
  }
})

app.post('/api/products', adminAuth, (req, res) => {
  try {
    const products = readProducts()
    const body = req.body || {}
    const price = Number(body.price) || 0
    const originalPrice = body.originalPrice != null ? Number(body.originalPrice) : null
    const computedDiscount = computeDiscountPercent(originalPrice, price)
    const newProduct = {
      id: nextId(products),
      name: body.name || 'Nouveau produit',
      description: body.description || '',
      usage: body.usage || null,
      price,
      originalPrice,
      discount: computedDiscount > 0 ? computedDiscount : (Number(body.discount) || 0),
      image: body.image || '/images/placeholder.png',
      category: body.category || 'Cheveux',
      features: Array.isArray(body.features) ? body.features : [],
      tagline: body.tagline || null,
      bienfaits: body.bienfaits || null,
      pourQui: body.pourQui || null
    }
    products.push(newProduct)
    writeProducts(products)
    res.status(201).json(newProduct)
  } catch (e) {
    res.status(500).json({ error: 'Erreur création produit' })
  }
})

app.delete('/api/products/:id', adminAuth, (req, res) => {
  try {
    const products = readProducts()
    const id = Number(req.params.id)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return res.status(404).json({ error: 'Produit introuvable' })
    const deleted = products.splice(index, 1)[0]
    writeProducts(products)
    res.json(deleted)
  } catch (e) {
    res.status(500).json({ error: 'Erreur suppression produit' })
  }
})

// ——— Résultats (galerie preuve) ———
app.get('/api/results', (req, res) => {
  try {
    res.json(readResults())
  } catch (e) {
    res.status(500).json({ error: 'Erreur lecture résultats' })
  }
})

app.post('/api/results', adminAuth, (req, res) => {
  try {
    const results = readResults()
    const body = req.body || {}
    const newResult = {
      id: nextResultId(results),
      image: body.image || '/images/placeholder.png',
      hairType: body.hairType || 'Cheveux',
      duration: body.duration || '3 mois',
      months: Number(body.months) || 3,
      result: body.result || 'Résultat',
      detail: body.detail || '',
      objectPosition: body.objectPosition || 'center'
    }
    results.push(newResult)
    writeResults(results)
    res.status(201).json(newResult)
  } catch (e) {
    res.status(500).json({ error: 'Erreur création résultat' })
  }
})

app.put('/api/results/:id', adminAuth, (req, res) => {
  try {
    const results = readResults()
    const id = Number(req.params.id)
    const index = results.findIndex((r) => r.id === id)
    if (index === -1) return res.status(404).json({ error: 'Résultat introuvable' })
    results[index] = { ...results[index], ...req.body, id }
    writeResults(results)
    res.json(results[index])
  } catch (e) {
    res.status(500).json({ error: 'Erreur mise à jour résultat' })
  }
})

app.delete('/api/results/:id', adminAuth, (req, res) => {
  try {
    const results = readResults()
    const id = Number(req.params.id)
    const index = results.findIndex((r) => r.id === id)
    if (index === -1) return res.status(404).json({ error: 'Résultat introuvable' })
    const deleted = results.splice(index, 1)[0]
    writeResults(results)
    res.json(deleted)
  } catch (e) {
    res.status(500).json({ error: 'Erreur suppression résultat' })
  }
})

app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}`)
  console.log(`Base de données : ${DATA_FILE}`)
})

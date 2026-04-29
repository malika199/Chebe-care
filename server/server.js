import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");
const RESULTS_FILE = path.join(DATA_DIR, "results.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");
const PUBLIC_DIR = path.join(__dirname, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const IMAGES_PRODUCTS_DIR = path.join(IMAGES_DIR, "products");
const IMAGES_TEMOIGNAGES_DIR = path.join(IMAGES_DIR, "temoignages");
const PORT = process.env.PORT || 3001;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "chebecare@chebecare.fr";
const ADMIN_TEMP_PASSWORD = process.env.ADMIN_TEMP_PASSWORD || "ChangeMe123!";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const RESET_MAIL_FROM = "chebecare@chebecare.fr";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "change-this-secret";
const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_RESET_TTL_MS = 15 * 60 * 1000;
const ADMIN_JWT_TTL = "12h";
const BCRYPT_ROUNDS = 12;

/** URL publique forcée pour les assets (images) si le proxy envoie un Host incorrect. Sans slash final. */
function normalizeEnvBaseUrl(u) {
  let s = String(u || "")
    .trim()
    .replace(/\/+$/, "");
  if (/\/api$/i.test(s)) s = s.replace(/\/api$/i, "").replace(/\/+$/, "");
  s = s
    .replace(/\/images(\/(products|temoignages))?$/i, "")
    .replace(/\/+$/, "");
  return s;
}

const PUBLIC_BASE_URL = normalizeEnvBaseUrl(process.env.PUBLIC_BASE_URL || "");

function stripTrailingSlash(u) {
  return String(u || "").replace(/\/+$/, "");
}

/**
 * URL publique de l’API sans requête HTTP (Railway, Render, Fly…).
 * Évite que X-Asset-Base-Url pointe vers le domaine du site vitrine au lieu de l’API.
 */
function getPlatformPublicBase() {
  if (PUBLIC_BASE_URL) return PUBLIC_BASE_URL;

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (railwayDomain) {
    const host = railwayDomain
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      .split(":")[0];
    if (host) return `https://${host}`;
  }

  const railwayUrl = process.env.RAILWAY_STATIC_URL?.trim();
  if (railwayUrl) return normalizeEnvBaseUrl(railwayUrl);

  const renderUrl = process.env.RENDER_EXTERNAL_URL?.trim();
  if (renderUrl) return normalizeEnvBaseUrl(renderUrl);

  const flyApp = process.env.FLY_APP_NAME?.trim();
  if (flyApp) return `https://${flyApp}.fly.dev`;

  return "";
}

/** Base publique pour préfixer /images/… (identique à /api/public-base). */
function getAssetBaseUrlFromRequest(req) {
  const fromPlatform = getPlatformPublicBase();
  if (fromPlatform) return fromPlatform;

  const proto = String(
    req.headers["x-forwarded-proto"] || req.protocol || "https",
  )
    .split(",")[0]
    .trim();
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "")
    .split(",")[0]
    .trim();
  if (!host) return "";
  return `${proto}://${host}`.replace(/\/+$/, "");
}

function setAssetBaseHeader(req, res) {
  const b = getAssetBaseUrlFromRequest(req);
  if (b) res.setHeader("X-Asset-Base-Url", b);
}

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_PRODUCTS_DIR)) {
  fs.mkdirSync(IMAGES_PRODUCTS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_TEMOIGNAGES_DIR)) {
  fs.mkdirSync(IMAGES_TEMOIGNAGES_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sub = req.query.folder === "temoignages" ? "temoignages" : "products";
    const dir = path.join(IMAGES_DIR, sub);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "");
    const name = base
      ? `${base}-${Date.now()}${ext}`
      : `upload-${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 Mo

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["X-Asset-Base-Url"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  "/images",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    const rel = (req.path || "/").replace(/\/+$/, "") || "/";
    const parts = rel.split("/").filter(Boolean);
    if (
      parts.length === 1 &&
      (parts[0] === "products" || parts[0] === "temoignages")
    ) {
      return res
        .status(404)
        .type("text/plain; charset=utf-8")
        .send(
          "URL incomplète : il faut un fichier, par ex. /images/products/huile-barbe.png — pas seulement /images/products/",
        );
    }
    next();
  },
  express.static(IMAGES_DIR),
);

/** Permet au front de préfixer les URLs /images/… quand seul /api est proxifié (même origine). */
app.get("/api/public-base", (req, res) => {
  try {
    const baseUrl = getAssetBaseUrlFromRequest(req);
    res.json({ baseUrl });
  } catch (e) {
    res.json({ baseUrl: "" });
  }
});

function readProducts() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

function nextId(products) {
  const ids = products.map((p) => p.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

/** Calcule le pourcentage de réduction à partir du prix ancien et du prix actuel. */
function computeDiscountPercent(originalPrice, price) {
  if (originalPrice == null || originalPrice <= 0 || price >= originalPrice)
    return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** Enrichit un produit avec un discount calculé si prix ancien > prix nouveau. */
function enrichProductWithDiscount(product) {
  const p = { ...product };
  const computed = computeDiscountPercent(p.originalPrice, p.price);
  if (computed > 0) p.discount = computed;
  return p;
}

function readResults() {
  try {
    const raw = fs.readFileSync(RESULTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeResults(results) {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2), "utf-8");
}

function nextResultId(results) {
  const ids = results.map((r) => r.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

// ——— Admin auth sécurisée (1 seul admin) ———
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function readAdminConfig() {
  try {
    const raw = fs.readFileSync(ADMIN_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeAdminConfig(config) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(config, null, 2), "utf-8");
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function makeResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return { token, tokenHash: hashResetToken(token) };
}

function adminCookieOptions() {
  const sameSite = process.env.NODE_ENV === "production" ? "none" : "lax";
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite,
    path: "/",
    maxAge: 12 * 60 * 60 * 1000,
  };
}

function createAdminToken(adminEmail, mustChangePassword) {
  return jwt.sign({ email: adminEmail, mustChangePassword }, ADMIN_JWT_SECRET, {
    expiresIn: ADMIN_JWT_TTL,
  });
}

function setAdminSessionCookie(res, adminConfig) {
  const token = createAdminToken(adminConfig.email, adminConfig.mustChangePassword);
  res.cookie(ADMIN_COOKIE_NAME, token, adminCookieOptions());
}

function clearAdminSessionCookie(res) {
  res.clearCookie(ADMIN_COOKIE_NAME, { ...adminCookieOptions(), maxAge: undefined });
}

function getTokenFromRequest(req) {
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();
  if (bearer) return bearer;
  return req.cookies?.[ADMIN_COOKIE_NAME] || "";
}

function getMailTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    requireTLS: SMTP_PORT === 587,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function buildResetUrl(req, token) {
  const fromEnv = String(process.env.ADMIN_APP_URL || "").trim().replace(/\/+$/, "");
  if (fromEnv) return `${fromEnv}/admin/reset-password?token=${encodeURIComponent(token)}`;
  const proto = String(req.headers["x-forwarded-proto"] || req.protocol || "https")
    .split(",")[0]
    .trim();
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "")
    .split(",")[0]
    .trim();
  if (!host) return `/admin/reset-password?token=${encodeURIComponent(token)}`;
  return `${proto}://${host}/admin/reset-password?token=${encodeURIComponent(token)}`;
}

/** Message utilisateur sans exposer de détails sensibles. */
function smtpErrorToClientMessage(err) {
  const code = err?.code || "";
  const response = String(err?.response || err?.message || "");
  if (code === "EAUTH" || /535|534|authentication failed/i.test(response)) {
    return "Connexion SMTP refusée : identifiants incorrects.";
  }
  if (code === "ETIMEDOUT" || code === "ECONNREFUSED") {
    return "Impossible de joindre le serveur SMTP (réseau ou pare-feu).";
  }
  if (code === "ESOCKET" || code === "ECONNRESET") {
    return "Connexion au serveur mail interrompue. Réessayez.";
  }
  return "Impossible d'envoyer l'email.";
}

async function sendResetLinkByEmail(recipientEmail, resetUrl) {
  const transporter = getMailTransporter();
  if (!transporter) throw new Error("SMTP non configuré");
  await transporter.sendMail({
    from: RESET_MAIL_FROM,
    to: recipientEmail,
    envelope: { from: RESET_MAIL_FROM, to: recipientEmail },
    subject: "Réinitialisation du mot de passe administrateur",
    text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}\nCe lien expire dans 15 minutes.`,
    html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Ce lien expire dans 15 minutes.</p>`,
  });
}

function getAdminIdentityOrNull(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function adminAuth(req, res, next) {
  const payload = getAdminIdentityOrNull(req);
  if (!payload?.email) return res.status(401).json({ error: "Non autorisé" });
  req.admin = payload;
  next();
}

function adminAuthRequirePasswordUpdated(req, res, next) {
  const payload = getAdminIdentityOrNull(req);
  if (!payload?.email) return res.status(401).json({ error: "Non autorisé" });
  if (payload.mustChangePassword) {
    return res
      .status(403)
      .json({ error: "Changement de mot de passe requis", mustChangePassword: true });
  }
  req.admin = payload;
  next();
}

const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Réessayez plus tard." },
});

function ensureAdminFile() {
  const existing = readAdminConfig();
  if (existing?.email && existing?.passwordHash) return;
  const email = String(existing?.email || ADMIN_EMAIL || "").trim().toLowerCase();
  const tempPassword = String(existing?.password || ADMIN_TEMP_PASSWORD);
  const passwordHash = bcrypt.hashSync(tempPassword, BCRYPT_ROUNDS);
  writeAdminConfig({
    email,
    passwordHash,
    mustChangePassword: true,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  });
  console.log(
    "[admin] Compte initialisé. Première connexion avec mot de passe temporaire requise.",
  );
}

// ——— Routes publiques ———
app.get("/api/products", (req, res) => {
  try {
    setAssetBaseHeader(req, res);
    const products = readProducts().map(enrichProductWithDiscount);
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Erreur lecture produits" });
  }
});

app.get("/api/products/:id", (req, res) => {
  try {
    setAssetBaseHeader(req, res);
    const products = readProducts();
    const id = Number(req.params.id);
    const product = products.find((p) => p.id === id);
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    res.json(enrichProductWithDiscount(product));
  } catch (e) {
    res.status(500).json({ error: "Erreur lecture produit" });
  }
});

// ——— Routes admin (protégées) ———
app.post("/api/upload", adminAuthRequirePasswordUpdated, upload.single("image"), (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    const sub = req.query.folder === "temoignages" ? "temoignages" : "products";
    const pathUrl = `/images/${sub}/` + req.file.filename;
    res.json({ path: pathUrl });
  } catch (e) {
    res.status(500).json({ error: "Erreur upload" });
  }
});

ensureAdminFile();

app.post("/api/admin/login", loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const config = readAdminConfig();
    if (!config)
      return res.status(500).json({ error: "Configuration admin introuvable" });
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedEnvEmail = String(ADMIN_EMAIL || "").trim().toLowerCase();
    const isEnvTempLogin =
      Boolean(normalizedEnvEmail) &&
      normalizedEmail === normalizedEnvEmail &&
      String(password || "") === String(ADMIN_TEMP_PASSWORD);
    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }
    if (
      !isEnvTempLogin &&
      normalizedEmail !== String(config.email || "").trim().toLowerCase()
    ) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    let ok = isEnvTempLogin
      ? true
      : await bcrypt.compare(String(password), String(config.passwordHash || ""));
    if (
      (!ok && config.mustChangePassword && String(password) === String(ADMIN_TEMP_PASSWORD)) ||
      isEnvTempLogin
    ) {
      config.email = normalizedEnvEmail || normalizedEmail;
      config.passwordHash = await bcrypt.hash(String(ADMIN_TEMP_PASSWORD), BCRYPT_ROUNDS);
      config.mustChangePassword = true;
      writeAdminConfig(config);
      ok = true;
    }
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });
    setAdminSessionCookie(res, config);
    res.json({
      ok: true,
      email: config.email,
      mustChangePassword: Boolean(config.mustChangePassword),
    });
  } catch (e) {
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

app.post("/api/admin/logout", (req, res) => {
  clearAdminSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/admin/me", adminAuth, (req, res) => {
  const config = readAdminConfig();
  res.json({
    ok: true,
    email: config?.email || req.admin.email,
    mustChangePassword: Boolean(config?.mustChangePassword),
  });
});

app.post("/api/admin/change-password", adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};
    const config = readAdminConfig();
    if (!config) return res.status(500).json({ error: "Configuration admin introuvable" });
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    if (String(newPassword) !== String(confirmPassword)) {
      return res.status(400).json({ error: "La confirmation ne correspond pas" });
    }
    if (String(newPassword).length < 8) {
      return res
        .status(400)
        .json({ error: "Le nouveau mot de passe doit faire au moins 8 caractères" });
    }
    const oldOk = await bcrypt.compare(
      String(currentPassword),
      String(config.passwordHash || ""),
    );
    if (!oldOk) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }
    config.passwordHash = await bcrypt.hash(String(newPassword), BCRYPT_ROUNDS);
    config.mustChangePassword = false;
    config.resetTokenHash = null;
    config.resetTokenExpiresAt = null;
    writeAdminConfig(config);
    setAdminSessionCookie(res, config);
    res.json({ ok: true, mustChangePassword: false });
  } catch (e) {
    res.status(500).json({ error: "Erreur lors du changement de mot de passe" });
  }
});

app.post("/api/admin/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Adresse email invalide" });
    }
    const config = readAdminConfig();
    if (!config) return res.status(500).json({ error: "Configuration admin introuvable" });
    if (normalizedEmail !== String(config.email || "").trim().toLowerCase()) {
      return res.json({ ok: true, message: "Si le compte existe, un email a été envoyé." });
    }
    const { token, tokenHash } = makeResetToken();
    config.resetTokenHash = tokenHash;
    config.resetTokenExpiresAt = new Date(Date.now() + ADMIN_RESET_TTL_MS).toISOString();
    writeAdminConfig(config);
    const resetUrl = buildResetUrl(req, token);
    await sendResetLinkByEmail(normalizedEmail, resetUrl);
    res.json({ ok: true, message: "Si le compte existe, un email a été envoyé." });
  } catch (e) {
    console.error("[SMTP] Échec reset password:", e?.message || e);
    if (e?.response) console.error("[SMTP] Réponse serveur:", e.response);
    res.status(500).json({ error: smtpErrorToClientMessage(e) });
  }
});

app.post("/api/admin/reset-password", async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body || {};
    const rawToken = String(token || "").trim();
    if (!rawToken) return res.status(400).json({ error: "Token manquant" });
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    if (String(newPassword) !== String(confirmPassword)) {
      return res.status(400).json({ error: "La confirmation ne correspond pas" });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ error: "Le mot de passe doit faire au moins 8 caractères" });
    }
    const config = readAdminConfig();
    if (!config) return res.status(500).json({ error: "Configuration admin introuvable" });
    if (!config.resetTokenHash || !config.resetTokenExpiresAt) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
    if (Date.now() > new Date(config.resetTokenExpiresAt).getTime()) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
    const providedHash = hashResetToken(rawToken);
    if (providedHash !== String(config.resetTokenHash)) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
    config.passwordHash = await bcrypt.hash(String(newPassword), BCRYPT_ROUNDS);
    config.mustChangePassword = false;
    config.resetTokenHash = null;
    config.resetTokenExpiresAt = null;
    writeAdminConfig(config);
    clearAdminSessionCookie(res);
    res.json({
      ok: true,
      message: "Mot de passe réinitialisé. Connectez-vous avec le nouveau mot de passe.",
    });
  } catch (e) {
    res.status(500).json({ error: "Erreur lors de la réinitialisation" });
  }
});

app.put("/api/products/:id", adminAuthRequirePasswordUpdated, (req, res) => {
  try {
    const products = readProducts();
    const id = Number(req.params.id);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Produit introuvable" });
    const updated = { ...products[index], ...req.body, id };
    const computedDiscount = computeDiscountPercent(
      updated.originalPrice,
      updated.price,
    );
    if (computedDiscount > 0) updated.discount = computedDiscount;
    products[index] = updated;
    writeProducts(products);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Erreur mise à jour produit" });
  }
});

app.post("/api/products", adminAuthRequirePasswordUpdated, (req, res) => {
  try {
    const products = readProducts();
    const body = req.body || {};
    const price = Number(body.price) || 0;
    const originalPrice =
      body.originalPrice != null ? Number(body.originalPrice) : null;
    const computedDiscount = computeDiscountPercent(originalPrice, price);
    const newProduct = {
      id: nextId(products),
      name: body.name || "Nouveau produit",
      description: body.description || "",
      usage: body.usage || null,
      price,
      originalPrice,
      discount:
        computedDiscount > 0 ? computedDiscount : Number(body.discount) || 0,
      image: body.image || "/images/products/placeholder.png",
      category: body.category || "Cheveux",
      features: Array.isArray(body.features) ? body.features : [],
      tagline: body.tagline || null,
      bienfaits: body.bienfaits || null,
      pourQui: body.pourQui || null,
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (e) {
    res.status(500).json({ error: "Erreur création produit" });
  }
});

app.delete("/api/products/:id", adminAuthRequirePasswordUpdated, (req, res) => {
  try {
    const products = readProducts();
    const id = Number(req.params.id);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Produit introuvable" });
    const deleted = products.splice(index, 1)[0];
    writeProducts(products);
    res.json(deleted);
  } catch (e) {
    res.status(500).json({ error: "Erreur suppression produit" });
  }
});

// ——— Résultats (galerie preuve) ———
app.get("/api/results", (req, res) => {
  try {
    setAssetBaseHeader(req, res);
    res.json(readResults());
  } catch (e) {
    res.status(500).json({ error: "Erreur lecture résultats" });
  }
});

app.post("/api/results", adminAuthRequirePasswordUpdated, (req, res) => {
  try {
    const results = readResults();
    const body = req.body || {};
    const newResult = {
      id: nextResultId(results),
      image: body.image || "/images/temoignages/placeholder.png",
      hairType: body.hairType || "Cheveux",
      duration: body.duration || "3 mois",
      months: Number(body.months) || 3,
      result: body.result || "Résultat",
      detail: body.detail || "",
      objectPosition: body.objectPosition || "center",
    };
    results.push(newResult);
    writeResults(results);
    res.status(201).json(newResult);
  } catch (e) {
    res.status(500).json({ error: "Erreur création résultat" });
  }
});

app.put("/api/results/:id", adminAuthRequirePasswordUpdated, (req, res) => {
  try {
    const results = readResults();
    const id = Number(req.params.id);
    const index = results.findIndex((r) => r.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Résultat introuvable" });
    results[index] = { ...results[index], ...req.body, id };
    writeResults(results);
    res.json(results[index]);
  } catch (e) {
    res.status(500).json({ error: "Erreur mise à jour résultat" });
  }
});

app.delete("/api/results/:id", adminAuthRequirePasswordUpdated, (req, res) => {
  try {
    const results = readResults();
    const id = Number(req.params.id);
    const index = results.findIndex((r) => r.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Résultat introuvable" });
    const deleted = results.splice(index, 1)[0];
    writeResults(results);
    res.json(deleted);
  } catch (e) {
    res.status(500).json({ error: "Erreur suppression résultat" });
  }
});

app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}`);
  console.log(`Base de données : ${DATA_FILE}`);
  const pub = getPlatformPublicBase();
  if (pub) {
    console.log(`URL publique images/API (détectée) : ${pub}`);
  } else if (process.env.NODE_ENV === "production") {
    console.warn(
      "[server] Aucune URL publique auto-détectée. En prod, définis PUBLIC_BASE_URL=https://ton-api… pour que les photos s’affichent sur le site.",
    );
  }
});

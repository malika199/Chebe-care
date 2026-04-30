import React, { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import AdminPage from './pages/AdminPage'
import { changePassword, forgotPassword, formatForgotPasswordApiError, getAdminMe, loginAdmin, resetPassword } from './api'
import './pages/AdminAuth.css'

function App() {
  return (
    <BrowserRouter>
      <AdminAuthRouter />
    </BrowserRouter>
  )
}

function AdminAuthRouter() {
  const [session, setSession] = useState({
    loading: true,
    isAuthenticated: false,
    mustChangePassword: false,
    email: ''
  })

  const refreshSession = async () => {
    try {
      const me = await getAdminMe()
      setSession({
        loading: false,
        isAuthenticated: true,
        mustChangePassword: Boolean(me.mustChangePassword),
        email: me.email || ''
      })
    } catch {
      setSession({
        loading: false,
        isAuthenticated: false,
        mustChangePassword: false,
        email: ''
      })
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  if (session.loading) return <div className="auth-loading">Chargement…</div>

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route
        path="/admin/login"
        element={
          session.isAuthenticated
            ? <Navigate to={session.mustChangePassword ? '/admin/change-password' : '/admin/dashboard'} replace />
            : <LoginPage onLoginSuccess={refreshSession} />
        }
      />
      <Route
        path="/admin/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/admin/reset-password"
        element={<ResetPasswordPage />}
      />
      <Route
        path="/admin/change-password"
        element={
          session.isAuthenticated
            ? <ChangePasswordPage onChanged={refreshSession} forced={session.mustChangePassword} />
            : <Navigate to="/admin/login" replace />
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          !session.isAuthenticated
            ? <Navigate to="/admin/login" replace />
            : session.mustChangePassword
              ? <Navigate to="/admin/change-password" replace />
              : <AdminPage />
        }
      />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  )
}

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginAdmin(email.trim(), password)
      await onLoginSuccess()
      navigate(data.mustChangePassword ? '/admin/change-password' : '/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Connexion impossible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Connexion admin"
      subtitle="Accédez au dashboard sécurisé CHEBE CARE."
      footer={
        <Link to="/admin/forgot-password" className="auth-link">
          Mot de passe oublié ?
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Email admin</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="chebecare0@gmail.com" required />
        </label>
        <label className="auth-field">
          <span>Mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" required />
        </label>
        {error ? <p className="auth-msg auth-msg-error">{error}</p> : null}
        <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
      </form>
    </AuthCard>
  )
}

function ChangePasswordPage({ onChanged, forced }) {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')
    setLoading(true)
    try {
      await changePassword(currentPassword, newPassword, confirmPassword)
      setOk('Mot de passe modifié.')
      await onChanged()
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Changer le mot de passe"
      subtitle={forced ? 'Premier login détecté : modification obligatoire pour continuer.' : 'Mettez à jour votre mot de passe admin.'}
      footer={<Link to="/admin/dashboard" className="auth-link">Retour au dashboard</Link>}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Ancien mot de passe</span>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Ancien mot de passe" required />
        </label>
        <label className="auth-field">
          <span>Nouveau mot de passe</span>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 caractères" required />
        </label>
        <label className="auth-field">
          <span>Confirmation</span>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Répétez le nouveau mot de passe" required />
        </label>
        {error ? <p className="auth-msg auth-msg-error">{error}</p> : null}
        {ok ? <p className="auth-msg auth-msg-success">{ok}</p> : null}
        <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
      </form>
    </AuthCard>
  )
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')
    setLoading(true)
    try {
      const data = await forgotPassword(email.trim())
      setOk(data.message || 'Si le compte existe, un email a été envoyé.')
    } catch (err) {
      setError(formatForgotPasswordApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Recevez un lien de réinitialisation sur votre adresse admin."
      footer={<Link to="/admin/login" className="auth-link">Retour à la connexion</Link>}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Email admin</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="chebecare0@gmail.com" required />
        </label>
        {error ? <p className="auth-msg auth-msg-error">{error}</p> : null}
        {ok ? <p className="auth-msg auth-msg-success">{ok}</p> : null}
        <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer le lien de reset'}</button>
      </form>
    </AuthCard>
  )
}

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')
    setLoading(true)
    try {
      await resetPassword(token, newPassword, confirmPassword)
      setOk('Mot de passe réinitialisé. Redirection...')
      setTimeout(() => navigate('/admin/login', { replace: true }), 800)
    } catch (err) {
      setError(err.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Réinitialiser le mot de passe"
      subtitle="Définissez un nouveau mot de passe sécurisé."
      footer={<Link to="/admin/login" className="auth-link">Retour à la connexion</Link>}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Nouveau mot de passe</span>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 caractères" required />
        </label>
        <label className="auth-field">
          <span>Confirmation</span>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Répétez le mot de passe" required />
        </label>
        {error ? <p className="auth-msg auth-msg-error">{error}</p> : null}
        {ok ? <p className="auth-msg auth-msg-success">{ok}</p> : null}
        <button className="auth-btn" type="submit" disabled={!token || loading}>{loading ? 'Validation...' : 'Valider'}</button>
      </form>
      {!token ? <p className="auth-msg auth-msg-error">Token manquant.</p> : null}
    </AuthCard>
  )
}

function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>{title}</h1>
        {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </div>
    </div>
  )
}

export default App

import React, { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TermsOfUsePage from './pages/TermsOfUsePage'
import ProductDetail from './components/ProductDetail'

const SECTIONS = ['products', 'ingredients', 'about', 'values', 'gallery']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function HomeSectionRoute() {
  const { section } = useParams()
  if (section && SECTIONS.includes(section)) return <HomePage />
  return <Navigate to="/" replace />
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cgu" element={<TermsOfUsePage />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/:section" element={<HomeSectionRoute />} />
        <Route path=":section" element={<HomeSectionRoute />} />
      </Routes>
    </HashRouter>
  )
}

export default App

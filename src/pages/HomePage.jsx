import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import LandingNavbar from '../components/LandingNavbar'
import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import IngredientsSection from '../components/IngredientsSection'
import ProductsSection from '../components/ProductsSection'
import BrandValues from '../components/BrandValues'
import ResultsVisibleSection from '../components/ResultsVisibleSection'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

const SECTIONS = ['products', 'ingredients', 'about', 'values', 'gallery']

function HomePage() {
  const location = useLocation()
  const { section: urlSection } = useParams()
  const scrollTo = location.state?.scrollTo || (urlSection && SECTIONS.includes(urlSection) ? urlSection : null)

  useEffect(() => {
    if (!scrollTo) return
    const scrollToSection = () => {
      const el = document.getElementById(scrollTo)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return true
      }
      return false
    }
    if (scrollToSection()) return
    const id = setTimeout(() => scrollToSection(), 150)
    return () => clearTimeout(id)
  }, [scrollTo])

  return (
    <div className="App">
      <LandingNavbar />
      <Hero />
      <ProductsSection />
      <ResultsVisibleSection />
      <IngredientsSection />
      <AboutSection />
      <BrandValues />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default HomePage

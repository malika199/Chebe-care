import React, { useState } from 'react'
import '../styles/Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a 
            href="#home" 
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('home')
            }}
          >
            Accueil
          </a>
          <a 
            href="#products" 
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('products')
            }}
          >
            Nos Produits
          </a>
          <a 
            href="#services" 
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('services')
            }}
          >
            Nos Services
          </a>
          <a 
            href="#about" 
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('about')
            }}
          >
            About Us
          </a>
          <a 
            href="#contact" 
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('contact')
            }}
          >
            Contact
          </a>
        </div>

        <div 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

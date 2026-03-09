import React from 'react'
import '../styles/About.css'

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="section-title">À propos</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>Notre Histoire</h3>
            <p>
              Boutique Capillaire est née de la passion pour les cheveux sains et beaux. 
              Depuis notre création, nous nous engageons à offrir des produits de qualité 
              professionnelle pour tous les types de cheveux.
            </p>
            <p>
              Notre équipe d'experts sélectionne rigoureusement chaque produit pour garantir 
              efficacité et sécurité. Nous croyons que chaque personne mérite d'avoir des 
              cheveux en bonne santé et éclatants.
            </p>
            <h3>Notre Mission</h3>
            <p>
              Fournir des produits capillaires de haute qualité à des prix accessibles, 
              tout en offrant des conseils personnalisés pour aider nos clients à atteindre 
              leurs objectifs capillaires.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

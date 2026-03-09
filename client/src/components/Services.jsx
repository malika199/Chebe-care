import React from 'react'
import '../styles/Services.css'

const Services = () => {
  const services = [
    {
      icon: "💇‍♀️",
      title: "Consultation Capillaire",
      description: "Analyse personnalisée de vos cheveux et conseils adaptés à votre type de cheveux"
    },
    {
      icon: "✨",
      title: "Traitements Professionnels",
      description: "Soins intensifs et traitements réparateurs pour cheveux abîmés"
    },
    {
      icon: "🎨",
      title: "Coloration Expert",
      description: "Services de coloration professionnelle avec produits de qualité"
    },
    {
      icon: "🌿",
      title: "Soins Naturels",
      description: "Traitements à base d'ingrédients naturels et biologiques"
    }
  ]

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h2 className="section-title">Nos Services</h2>
        <p className="section-subtitle">Des services professionnels pour prendre soin de vos cheveux</p>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services

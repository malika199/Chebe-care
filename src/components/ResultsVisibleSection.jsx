import React from 'react'
import temoignage1 from '../assets/images/temoignage-1.png'
import temoignage2 from '../assets/images/temoignage-2.png'
import temoignage3 from '../assets/images/temoignage-3.png'
import temoignage4 from '../assets/images/temoignage-4.png'
import cheveuxLisses from '../assets/images/cheveux-lisses.png'
import resultatPhoto from '../assets/images/resultat-cheveux.png'
import './ResultsVisibleSection.css'

const MODE_EMPLOI_TEXT = `Pour utiliser l'huile de Chebé sur les cheveux et la barbe, appliquez-la en bain d'huile, ou quotidiennement en quelques gouttes pour sceller l'hydratation (deux fois par jour), ou en traitement profond (mélangée à un masque, parfois la nuit) en massant le cuir chevelu et la barbe pour stimuler la pousse, puis rincez ou coiffez selon le type de soin.`

// Chaque photo est indépendante (pas d'avant/après)
// object-fit: cover partout. objectPosition : portrait masculin → center top ; cheveux longs → center
// detail = phrase courte sous le titre pour expliciter le résultat
const resultsPhotos = [
  { image: temoignage1, hairType: 'Poils & barbe', duration: '3 mois', months: 3, result: 'Barbe plus fournie', detail: 'Densité visiblement améliorée', objectPosition: 'center top' },
  { image: temoignage2, hairType: 'Crépus', duration: '3 mois', months: 3, result: 'Cheveux plus épais', detail: 'Volume et force en 3 mois' },
  { image: temoignage3, hairType: 'Bouclés', duration: '4 mois', months: 4, result: 'Boucles définies', detail: 'Boucles plus structurées et soyeuses' },
  { image: temoignage4, hairType: 'Bouclés', duration: '4 mois', months: 4, result: '+4 cm en 4 mois', detail: 'Longueur préservée et gain visible' },
  { image: cheveuxLisses, hairType: 'Lisses', duration: '2 mois', months: 2, result: 'Brillance et hydratation durable', detail: 'Résultats dès 2 mois d\'utilisation' },
  { image: resultatPhoto, hairType: 'Lisses', duration: '3 mois', months: 3, result: 'Cheveux longs et soyeux', detail: 'Brillance et texture visible', objectPosition: 'center' }
]

const CheckIcon = () => (
  <svg className="results-visible-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const ClockIcon = () => (
  <svg className="results-visible-clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const trustItems = [
  'Photos authentiques',
  'Clients réels',
  'Sans retouche'
]

const ResultsVisibleSection = () => {
  return (
    <section id="gallery" className="results-visible-section">
      {/* Bandeau horizontal — minimal, premium */}
      <div className="results-visible-band">
        <div className="results-visible-band-inner">
          {trustItems.map((label, i) => (
            <span key={i} className="results-visible-trust-item">
              <CheckIcon />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="results-visible-container">
        {/* En-tête — hiérarchie forte, peu d'espace */}
        <header className="results-visible-header">
          <p className="results-visible-label">Preuve</p>
          <h2 className="results-visible-title">
            Des résultats réels et visibles en quelques mois
          </h2>
          <p className="results-visible-subtitle">
            Sur barbe, cheveux et boucles — photos authentiques après utilisation des produits Chebé
          </p>
        </header>

        {/* Grille : 3 cartes par ligne (2 lignes) */}
        <div className="results-visible-grid">
          {resultsPhotos.map((item, index) => (
            <article key={index} className="results-visible-card">
              <div className="results-visible-card-image-wrap">
                <img
                  src={item.image}
                  alt={`Résultat : ${item.result} — ${item.hairType}`}
                  className="results-visible-card-image"
                  style={{ objectPosition: item.objectPosition || 'center' }}
                  loading="lazy"
                />
              </div>
              <div className="results-visible-card-footer">
                <p className="results-visible-card-result">{item.result}</p>
                {item.detail && (
                  <p className="results-visible-card-detail">{item.detail}</p>
                )}
                <span className="results-visible-card-duration-badge">
                  <ClockIcon />
                  <span>{item.duration} d&apos;utilisation</span>
                </span>
                <span className="results-visible-card-badge">{item.hairType}</span>
              </div>
            </article>
          ))}
        </div>

        <p className="results-visible-duration-global">
          Résultats observés entre 2 et 4 mois d&apos;utilisation selon le type de cheveux.
        </p>

        {/* CTA — un seul bouton fort + mode d'emploi */}
        <div className="results-visible-cta">
          <a href="#products" className="results-visible-cta-btn results-visible-cta-btn-primary">
            Commencer ma routine
          </a>
          <p className="results-visible-cta-note">
            Rejoignez celles et ceux qui ont déjà transformé leurs cheveux
          </p>
        </div>

        <div className="results-visible-usage">
          <p className="results-visible-usage-title">Mode d&apos;emploi</p>
          <p className="results-visible-usage-text">
            {MODE_EMPLOI_TEXT}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ResultsVisibleSection

import React from 'react'
import { useResults } from '../hooks/useResults'
import { getProductImageUrl } from '../api'
import './ResultsVisibleSection.css'

const MODE_EMPLOI_TEXT = `Pour utiliser l'huile de Chebé sur les cheveux et la barbe, appliquez-la en bain d'huile, ou quotidiennement en quelques gouttes pour sceller l'hydratation (deux fois par jour), ou en traitement profond (mélangée à un masque, parfois la nuit) en massant le cuir chevelu et la barbe pour stimuler la pousse, puis rincez ou coiffez selon le type de soin.`

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
  const { results: resultsPhotos, loading } = useResults()

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
        {loading ? (
          <p className="results-visible-loading">Chargement des résultats…</p>
        ) : (
        <div className="results-visible-grid">
          {resultsPhotos.map((item, index) => (
            <article key={item.id ?? index} className="results-visible-card">
              <div className="results-visible-card-image-wrap">
                <img
                  src={getProductImageUrl(item.image)}
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
        )}

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

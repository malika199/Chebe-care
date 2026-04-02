import React from 'react'
import { getProductImageUrl } from '../api'

const HERO_IMAGE = getProductImageUrl('/images/products/photo_background.jpg')

const Hero = () => {
  return (
    <section
      className="hero-section relative min-h-screen flex flex-col justify-center md:justify-center justify-start bg-[#3A2F2A] overflow-hidden"
      aria-label="Bannière principale"
    >
      {/* Fallback gradient si l'image ne charge pas */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #2a2320 0%, #3A2F2A 50%, #4a3f3a 100%)',
        }}
        aria-hidden="true"
      />
      {/* Photo centrée */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'scroll',
        }}
        aria-hidden="true"
      />

      {/* Overlay gradient : sombre à gauche (texte lisible), dégradé vers transparent à droite (photo visible) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(42,35,32,0.92) 0%, rgba(42,35,32,0.5) 45%, rgba(42,35,32,0.15) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Contenu : centré verticalement, texte aligné à gauche */}
      <div className="hero-content relative z-10 w-full max-w-6xl mx-auto px-5 py-12 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-xl md:max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200/95 font-medium mb-4">
            La puissance naturelle venue du Tchad
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-semibold text-white leading-[1.12] tracking-tight drop-shadow-lg">
            Des cheveux plus forts grâce au secret ancestral du Chebé
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/90 leading-relaxed max-w-lg">
            Soins naturels enrichis en Chebé du Tchad pour fortifier, nourrir et garder la longueur.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] px-8 py-3.5 sm:px-10 sm:py-4 bg-amber-600 text-white shadow-lg hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#2a2320]"
            >
              Découvrir la collection
            </a>
            <span className="text-sm text-white/80">
              Ingrédients naturels · Livraison rapide
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

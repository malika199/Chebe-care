import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#2a2320] text-white py-14 lg:py-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#E8DAD1]/70">By SS</p>
            <Link to="/" className="block">
              <h3 className="text-lg font-serif font-semibold tracking-tight">CHEBE CARE</h3>
            </Link>
            <p className="text-[#E8DAD1]/90 text-sm leading-relaxed max-w-[240px]">
              La puissance naturelle venue du Tchad. Soins Chebé, Karité et Huile de Cerise pour cheveux et barbe.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.12em] text-[#E8DAD1]/70 mb-4">Liens rapides</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" state={{ scrollTo: 'products' }} className="text-[#E8DAD1] hover:text-white transition-colors">Nos produits</Link></li>
              <li><Link to="/" state={{ scrollTo: 'about' }} className="text-[#E8DAD1] hover:text-white transition-colors">Notre histoire</Link></li>
              <li><Link to="/" state={{ scrollTo: 'ingredients' }} className="text-[#E8DAD1] hover:text-white transition-colors">Ingrédients</Link></li>
              <li><Link to="/" state={{ scrollTo: 'values' }} className="text-[#E8DAD1] hover:text-white transition-colors">Pourquoi nous</Link></li>
              <li><Link to="/" state={{ scrollTo: 'gallery' }} className="text-[#E8DAD1] hover:text-white transition-colors">Galerie</Link></li>
            </ul>
          </div>

          {/* Livraison & Service */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.12em] text-[#E8DAD1]/70 mb-4">Livraison & Service</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-[#E8DAD1]">Expédition rapide</li>
              <li className="text-[#E8DAD1]">Paiement sécurisé</li>
              <li className="text-[#E8DAD1]">Service client disponible</li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.12em] text-[#E8DAD1]/70 mb-4">Suivez-nous</h4>
            <div className="flex gap-3">
              <a href="https://instagram.com/samir_chebecare" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500/30 flex items-center justify-center transition-colors" aria-label="Instagram – samir_chebecare">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@samir_sahad25" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500/30 flex items-center justify-center transition-colors" aria-label="TikTok – samir_sahad25">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
          <Link to="/cgu" className="text-[10px] uppercase tracking-[0.08em] text-[#E8DAD1]/70 hover:text-white transition-colors">
            Conditions générales d&apos;utilisation
          </Link>
          <p className="text-[10px] uppercase tracking-[0.08em] text-[#E8DAD1]/60">&copy; 2021 CHEBE CARE By SS. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

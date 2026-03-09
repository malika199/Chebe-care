import React from 'react'
import { Link } from 'react-router-dom'
import { getDisplayDiscount, hasDiscount } from '../utils/product'
import '../styles/ProductCard.css'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1556228720-195a112e97e3?w=500&h=500&fit=crop'

/** Prend les 2 premiers bénéfices en texte complet pour les badges de la carte compacte */
const getCompactFeatures = (features) => {
  if (!features || features.length === 0) return []
  return features.slice(0, 2).map((f) => f.trim()).filter(Boolean)
}

/**
 * Carte produit réutilisable (style landing premium).
 * @param {{ product: object, featured?: boolean, muted?: boolean, compact?: boolean }}
 */
const ProductCard = ({ product, featured = false, muted = false, compact = false }) => {
  const discount = getDisplayDiscount(product)
  const showDiscount = hasDiscount(product)

  if (compact) {
    const features = getCompactFeatures(product.features)
    return (
      <article
        className="product-card-compact group h-full flex flex-col bg-white rounded-2xl border border-[#E8DAD1]/90 overflow-hidden transition-all duration-200 ease-out max-h-[420px] sm:max-h-[420px] shadow-sm hover:shadow-xl hover:border-amber-500/50 hover:-translate-y-1"
      >
        <div className="relative flex items-center justify-center h-[180px] sm:h-[220px] bg-gradient-to-b from-[#FAF8F6] to-[#F5EFEA] rounded-t-2xl shrink-0 p-3 sm:p-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-200 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE
            }}
          />
          {featured && (
            <span className="absolute top-2.5 left-2.5 bg-[#3A2F2A] text-amber-50 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest">
              Le plus apprécié
            </span>
          )}
          {showDiscount && (
            <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[9px] font-semibold">
              −{discount} %
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 min-h-0 min-w-0 p-3 sm:p-4 overflow-hidden">
          <h3 className="text-[13px] sm:text-[14px] font-serif font-semibold text-[#3A2F2A] leading-snug line-clamp-2 break-words" title={product.name}>
            {product.name}
          </h3>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5 min-h-0 overflow-hidden">
              {features.map((label, i) => (
                <span
                  key={i}
                  className="text-[10px] text-[#3A2F2A]/80 bg-[#E8DAD1]/80 px-2 py-0.5 rounded font-medium break-words line-clamp-1"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#E8DAD1]/60 shrink-0">
            <span className="font-serif text-sm sm:text-base font-semibold text-[#3A2F2A] truncate min-w-0">
              {showDiscount ? (
                <>
                  <span className="text-[#3A2F2A]/50 line-through text-xs mr-1">{product.originalPrice.toFixed(2)} €</span>
                  <span className="whitespace-nowrap">{product.price.toFixed(2)} €</span>
                </>
              ) : (
                `${product.price.toFixed(2)} €`
              )}
            </span>
            <Link
              to={`/produit/${product.id}`}
              className="shrink-0 h-9 min-w-[80px] sm:min-w-[90px] flex items-center justify-center rounded-full bg-amber-500 text-white px-3 text-xs font-semibold hover:bg-amber-600 transition-colors duration-150 shadow-sm text-center"
            >
              Découvrir
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={`group h-full flex flex-col bg-white rounded-2xl border overflow-hidden transition-all duration-200 ease-out ${
        featured
          ? 'border-[#C6A75E]/60 shadow-2xl ring-2 ring-[#C6A75E]/20 scale-[1.07]'
          : muted
            ? 'border-[#E8DAD1] shadow-sm opacity-90 saturate-[0.92]'
            : 'border-[#E8DAD1] shadow-md hover:shadow-xl hover:border-[#C6A75E]/40'
      }`}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-[#F5EFEA] rounded-t-2xl shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-200 ease-out ${featured ? 'group-hover:scale-[1.05]' : 'group-hover:scale-[1.03]'}`}
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE
          }}
        />
        {featured && (
          <span className="absolute top-4 left-4 bg-[#3A2F2A] text-white px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-lg">
            Le plus apprécié
          </span>
        )}
        {showDiscount && (
          <span className="absolute top-4 right-4 bg-[#C6A75E] text-white px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider shadow-md">
            −{discount} %
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 sm:p-6 lg:p-8">
        <div className="space-y-3 flex-1">
          <h3 className="text-lg font-serif font-medium text-[#3A2F2A]">
            {product.name}
          </h3>
          <p className="text-[#3A2F2A]/80 text-sm leading-relaxed line-clamp-3">
            {product.description}
          </p>
          {product.features && product.features.length > 0 && (
            <ul className="space-y-1.5 text-sm text-[#3A2F2A]/80">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-[#8FAE9E] shrink-0" aria-hidden>✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between pt-5 mt-auto border-t border-[#E8DAD1]">
          <div className="flex items-baseline gap-3">
            {showDiscount ? (
              <>
                <span className="text-[#3A2F2A]/50 line-through text-sm">
                  {product.originalPrice.toFixed(2)} €
                </span>
                <span className="font-serif text-lg text-[#3A2F2A]">
                  {product.price.toFixed(2)} €
                </span>
              </>
            ) : (
              <span className="font-serif text-lg text-[#3A2F2A]">
                {product.price.toFixed(2)} €
              </span>
            )}
          </div>
          <Link
            to={`/produit/${product.id}`}
            className="inline-block rounded-full bg-[#C6A75E] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#C6A75E]/90 transition-all duration-300 shadow-md hover:shadow-lg text-center"
          >
            Voir le produit
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard

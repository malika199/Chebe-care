import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../api'
import { getDisplayDiscount, hasDiscount } from '../utils/product'
import { products as fallbackProducts } from '../data/products'
import LandingNavbar from './LandingNavbar'
import Footer from './Footer'
import '../styles/ProductDetail.css'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1556228720-195a112e97e3?w=500&h=500&fit=crop'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modeEmploiOpen, setModeEmploiOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const numId = Number(id)
    setLoading(true)
    getProduct(numId)
      .then((p) => setProduct(p))
      .catch(() => {
        const fallback = fallbackProducts.find((p) => p.id === numId)
        setProduct(fallback || null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EFEA] flex flex-col">
        <LandingNavbar />
        <main className="flex-1 flex items-center justify-center px-5 py-24">
          <p className="text-[#3A2F2A]/70">Chargement…</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5EFEA] flex flex-col">
        <LandingNavbar />
        <main className="flex-1 flex items-center justify-center px-5 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-[#3A2F2A] mb-4">Produit introuvable</h1>
            <Link to="/" className="text-[#C6A75E] hover:underline">Retour à l'accueil</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const showDiscount = hasDiscount(product)
  const discount = getDisplayDiscount(product)
  const whatsappUrl = `https://wa.me/33605680350?text=${encodeURIComponent(`Bonjour, je souhaite commander : ${product.name}`)}`

  return (
    <div className="min-h-screen bg-[#F5EFEA] flex flex-col">
      <LandingNavbar />
      <main className="flex-1 pt-12 md:pt-16 pb-24 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-8">
          <Link to="/" state={{ scrollTo: 'products' }} className="inline-flex items-center gap-2 text-[#3A2F2A]/70 hover:text-[#3A2F2A] text-sm mb-6 transition-colors">
            ← Retour aux produits
          </Link>

          <section className="product-detail-section grid grid-cols-1 md:grid-cols-[40%_60%] md:gap-6 lg:gap-8 items-start">
            <div className="product-detail-image-wrapper relative overflow-hidden rounded-2xl bg-white shadow-lg aspect-[4/3] sm:aspect-[3/4] min-h-[320px] max-h-[90vh] flex items-center justify-center md:sticky md:top-24 md:self-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full min-h-[280px] max-h-[80vh] object-contain p-4 sm:p-5"
                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
              />
              {showDiscount && (
                <span className="absolute top-4 right-4 bg-[#C6A75E] text-white px-3 py-1.5 rounded-full text-sm font-medium uppercase tracking-wider shadow-md">
                  −{discount} %
                </span>
              )}
            </div>

            <div className="product-detail-content flex flex-col rounded-2xl bg-[#FCFAF8] shadow-lg border border-[#E8DAD1]/70 px-5 py-6 sm:px-7 sm:py-7 min-w-0">
              <div className="space-y-2">
                {product.id !== 7 && (
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#C6A75E] font-semibold">
                    {product.category}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-[2.4rem] font-serif font-semibold text-[#3A2F2A] leading-tight tracking-tight">
                  {product.name}
                </h1>
                {(product.tagline || product.description) && (
                  <p className="text-[15px] sm:text-base text-[#3A2F2A]/85 leading-relaxed">
                    {product.tagline || product.description}
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-3 pt-4">
                {showDiscount ? (
                  <>
                    <span className="text-[#3A2F2A]/50 line-through text-lg">
                      {product.originalPrice.toFixed(2)} €
                    </span>
                    <span className="font-serif text-2xl text-[#3A2F2A]">
                      {product.price.toFixed(2)} €
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-2xl text-[#3A2F2A]">
                    {product.price.toFixed(2)} €
                  </span>
                )}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#C6A75E] text-white px-8 py-3.5 text-sm font-semibold hover:bg-[#C6A75E]/90 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                  Commander
                </a>
                <Link
                  to="/"
                  state={{ scrollTo: 'products' }}
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#3A2F2A] text-[#3A2F2A] px-8 py-3.5 text-sm font-medium hover:bg-[#3A2F2A] hover:text-white transition-all duration-300 w-full sm:w-auto"
                >
                  Voir les autres produits
                </Link>
              </div>

              <p className="text-xs text-[#3A2F2A]/60 mt-3">
                Livraison rapide · Paiement sécurisé
              </p>

              <div className="border-t border-[#E8DAD1] mt-6 pt-6 space-y-4">
                {product.features && product.features.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-[#3A2F2A] uppercase tracking-[0.12em] mb-2">
                      Points forts
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#3A2F2A]/85">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-[#8FAE9E] shrink-0" aria-hidden>✔</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.bienfaits && product.bienfaits.length > 0 && (
                  <div className="rounded-xl bg-[#F5EFEA] border border-[#E8DAD1]/70 p-4 sm:p-5">
                    <p className="text-xs sm:text-sm font-semibold text-[#3A2F2A] uppercase tracking-[0.16em] mb-3 flex items-center gap-2">
                      <span aria-hidden>🌿</span> Les bienfaits de l&apos;huile de Chébé
                    </p>
                    <ul className="space-y-3 text-[#3A2F2A]/88">
                      {product.bienfaits.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-[#8FAE9E] shrink-0 mt-0.5" aria-hidden>✔</span>
                          <span>
                            <strong className="text-[#3A2F2A] text-sm sm:text-[15px]">{item.title}</strong>
                            <span className="block text-sm text-[#3A2F2A]/80 leading-snug mt-0.5">{item.text}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.pourQui && product.pourQui.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-[#3A2F2A] uppercase tracking-[0.12em] mb-2">
                      Pour qui ?
                    </p>
                    <p className="text-sm text-[#3A2F2A]/75 mb-1.5">Convient particulièrement :</p>
                    <ul className="space-y-1 text-sm text-[#3A2F2A]/85">
                      {product.pourQui.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-[#8FAE9E] shrink-0" aria-hidden>✔</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.usage && (
                  <div className="border border-[#E8DAD1]/70 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setModeEmploiOpen(!modeEmploiOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-[#3A2F2A] uppercase tracking-[0.08em] bg-white hover:bg-[#FAF8F6] transition-colors"
                      aria-expanded={modeEmploiOpen}
                    >
                      <span>Mode d&apos;emploi</span>
                      <span className="text-[#3A2F2A]/70 transition-transform duration-200" aria-hidden>
                        {modeEmploiOpen ? '▲' : '▼'}
                      </span>
                    </button>
                    {modeEmploiOpen && (
                      <div className="px-4 pb-4 pt-0 bg-white border-t border-[#E8DAD1]/70">
                        <p className="text-sm sm:text-[15px] text-[#3A2F2A]/85 leading-relaxed">
                          {product.usage}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Espace pour ne pas cacher le footer sous le bouton sticky (mobile) */}
      <div className="h-14 md:hidden" aria-hidden />

      {/* Bouton sticky mobile : COMMANDEZ MAINTENANT */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-center py-4 px-4 bg-[#C6A75E] text-white text-sm font-bold uppercase tracking-wider shadow-lg hover:bg-[#B45309] transition-colors"
      >
        Commandez maintenant
      </a>

      <Footer />
    </div>
  )
}

export default ProductDetail

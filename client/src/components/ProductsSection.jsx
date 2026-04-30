import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'

const CARD_WIDTH = 268
const CARD_WIDTH_MOBILE = 260
const GAP = 6
const SCROLL_PADDING = 2
const MOBILE_BREAKPOINT = 768

const ProductsSection = () => {
  const { products, loading } = useProducts()
  const scrollRef = useRef(null)
  const wrapperRef = useRef(null)
  const [centerIndex, setCenterIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH)

  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') return CARD_WIDTH
    if (window.innerWidth >= 1024) return CARD_WIDTH
    if (window.innerWidth < MOBILE_BREAKPOINT && wrapperRef.current) {
      const w = wrapperRef.current.clientWidth
      const buttonsAndGaps = 44 + 44 + 8 + 8
      const available = w - buttonsAndGaps
      if (available > 0) return Math.min(CARD_WIDTH_MOBILE, Math.floor(available))
    }
    return CARD_WIDTH_MOBILE
  }, [])

  const updateCenterIndex = useCallback(() => {
    const el = scrollRef.current
    if (!el || products.length === 0) return
    const width = getCardWidth()
    const scrollLeft = el.scrollLeft
    const center = scrollLeft + el.clientWidth / 2
    const raw = (center - SCROLL_PADDING - width / 2) / (width + GAP)
    const index = Math.round(Math.max(0, Math.min(products.length - 1, raw)))
    setCenterIndex(index)
  }, [getCardWidth, products.length])

  useEffect(() => {
    const updateWidth = () => {
      setCardWidth(getCardWidth())
      setTimeout(updateCenterIndex, 100)
    }
    updateWidth()
    const raf = requestAnimationFrame(() => updateWidth())
    let ro = null
    if (typeof ResizeObserver !== 'undefined' && wrapperRef.current) {
      const el = wrapperRef.current
      ro = new ResizeObserver(updateWidth)
      ro.observe(el)
    }
    const onResize = () => updateWidth()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      if (ro && wrapperRef.current) ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [getCardWidth, updateCenterIndex])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateCenterIndex()
    el.addEventListener('scroll', updateCenterIndex, { passive: true })
    return () => el.removeEventListener('scroll', updateCenterIndex)
  }, [updateCenterIndex, cardWidth])

  const scrollTo = (direction) => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const step = cardWidth + GAP
    const maxScroll = el.scrollWidth - el.clientWidth
    const targetScroll =
      direction === 'prev'
        ? Math.max(0, el.scrollLeft - step)
        : Math.min(maxScroll, el.scrollLeft + step)
    el.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
    const targetScroll = Math.min(SCROLL_PADDING + index * (cardWidth + GAP), maxScroll)
    el.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' })
  }

  return (
    <section id="products" className="py-12 lg:py-16 bg-[#F5EFEA] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-4">
        <header className="text-center mb-10 lg:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-serif font-semibold text-[#3A2F2A] tracking-tight">
            Nos produits
          </h2>
          <p className="mt-3 text-[#3A2F2A]/75 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Une routine simple et naturelle pour des cheveux forts et en bonne santé
          </p>
        </header>

        {(loading && products.length === 0) ? (
          <p className="text-center text-[#3A2F2A]/70 py-8">Chargement des produits…</p>
        ) : products.length === 0 ? (
          <p className="text-center text-[#3A2F2A]/70 py-8">Aucun produit pour le moment.</p>
        ) : (
        <>
        <div ref={wrapperRef} className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
          <button
            type="button"
            onClick={() => scrollTo('prev')}
            aria-label="Produits précédents"
            className="flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white border border-[#E8DAD1] shadow-md flex items-center justify-center text-[#3A2F2A] hover:bg-[#F5EFEA] hover:border-[#C6A75E]/50 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex-1 min-w-0 flex overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-mandatory scrollbar-hide py-4 px-1"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              gap: GAP,
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 snap-start transition-all duration-200 ease-out"
                style={{ width: cardWidth }}
              >
                <ProductCard
                  product={product}
                  featured={product.isMostPopular === true}
                  compact
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollTo('next')}
            aria-label="Produits suivants"
            className="flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white border border-[#E8DAD1] shadow-md flex items-center justify-center text-[#3A2F2A] hover:bg-[#F5EFEA] hover:border-[#C6A75E]/50 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

          <div className="flex justify-center gap-2 mt-6" aria-hidden>
            {products.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Produit ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === centerIndex
                    ? 'w-6 bg-[#8B6914]'
                    : 'w-2 bg-[#3A2F2A]/20 hover:bg-[#3A2F2A]/35'
                }`}
              />
            ))}
          </div>

        <p className="text-center text-sm text-[#3A2F2A]/45 mt-3">Glissez ou utilisez les flèches pour parcourir</p>
        </>
        )}
      </div>
    </section>
  )
}

export default ProductsSection

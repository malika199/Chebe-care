import React from 'react'
import { Link } from 'react-router-dom'

const ICON_CLASS = 'w-14 h-14 mx-auto text-[#3A2F2A] transition-colors duration-300 ease-out group-hover:text-[#C6A75E]/90'
const STROKE = 1.5
const STROKE_LINE = 'round'

const IconChebe = () => (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap={STROKE_LINE} strokeLinejoin={STROKE_LINE} aria-hidden>
    <path d="M12 3C8 7 6 11 6 13.5c0 2.5 2.2 4.5 5 4.5s5-2 5-4.5C16 11 14 7 12 3z" />
    <path d="M12 3c2 4 4 8 4 10.5 0 2.5-2.2 4.5-5 4.5s-5-2-5-4.5c0-2.5 2-6.5 4-10.5z" opacity="0.6" />
    <path d="M12 5v11" />
  </svg>
)

const IconShea = () => (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap={STROKE_LINE} strokeLinejoin={STROKE_LINE} aria-hidden>
    <path d="M12 4c-3 4-5 8-5 11 0 3.3 2.2 6 5 6s5-2.7 5-6c0-3-2-7-5-11z" />
  </svg>
)

const IconCherry = () => (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap={STROKE_LINE} strokeLinejoin={STROKE_LINE} aria-hidden>
    <path d="M9 10m-3.5 0a3.5 3.5 0 1 1 7 0a3.5 3.5 0 1 1-7 0" />
    <path d="M15 10m-3.5 0a3.5 3.5 0 1 1 7 0a3.5 3.5 0 1 1-7 0" opacity="0.85" />
    <path d="M9.5 13.5V18c0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2v-4.5" />
    <path d="M14.5 13.5V18c0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2v-4.5" opacity="0.85" />
    <path d="M12 5c-1 1.5-2 3.5-2 5" />
  </svg>
)

const ingredients = [
  {
    icon: IconChebe,
    name: 'Chebé',
    description: 'Aide à réduire la casse et favorise la rétention de longueur.'
  },
  {
    icon: IconShea,
    name: 'Beurre de Karité',
    description: 'Hydrate intensément et protège contre la sécheresse.'
  },
  {
    icon: IconCherry,
    name: 'Huile de Cerise',
    description: 'Apporte brillance, douceur et protection naturelle.'
  }
]

const IngredientsSection = () => {
  return (
    <section id="ingredients" className="py-14 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8 lg:mb-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#3A2F2A]/60 mb-2">
            Formules signature
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#3A2F2A] tracking-tight">
            Nos ingrédients signature
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
          {ingredients.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="group text-center p-6 lg:p-8 bg-[#FAF8F6] rounded-2xl border border-[#E8DAD1]/80 transition-all duration-200 ease-out hover:shadow-lg hover:border-amber-500/40 hover:-translate-y-0.5"
              >
                <span className="block mb-4" aria-hidden>
                  <Icon />
                </span>
                <h3 className="text-lg font-serif font-semibold text-[#3A2F2A] mb-3 uppercase tracking-[0.05em]">
                  {item.name}
                </h3>
                <p className="text-[#3A2F2A]/80 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 lg:mt-10 text-center">
          <Link
            to="/"
            state={{ scrollTo: 'products' }}
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors duration-200 shadow-sm hover:shadow"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    </section>
  )
}

export default IngredientsSection

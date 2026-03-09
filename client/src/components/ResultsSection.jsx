import React from 'react'

const STROKE = 1.5
const ICON_CLASS = 'w-10 h-10 text-[#C6A75E]'

const IconCheck = () => (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const IconLeaf = () => (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3C8 7 6 11 6 14c0 3 2.2 5 5 5s5-2 5-5c0-3-2-7-6-11z" />
    <path d="M12 5v12" />
  </svg>
)

const IconShield = () => (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l6 2.5v4c0 4.5-2.3 8.8-6 10.5-3.7-1.7-6-6-6-10.5v-4L12 3z" />
  </svg>
)

const IconDrop = () => (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 4c-3 4-5 8-5 11 0 3.3 2.2 6 5 6s5-2.7 5-6c0-3-2-7-5-11z" />
  </svg>
)

const results = [
  {
    icon: IconCheck,
    title: 'Moins de casse',
    subtitle: 'Chebé et soins ciblés'
  },
  {
    icon: IconLeaf,
    title: 'Longueur préservée',
    subtitle: 'Rétention naturelle'
  },
  {
    icon: IconDrop,
    title: 'Hydratation durable',
    subtitle: 'Beurre de Karité'
  },
  {
    icon: IconShield,
    title: 'Formule naturelle',
    subtitle: 'Sans sulfates'
  }
]

const ResultsSection = () => {
  return (
    <section id="results" className="py-28 lg:py-36 bg-[#F5EFEA]">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#3A2F2A]/70 mb-4">
            Preuve
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#3A2F2A] tracking-tight">
            Efficacité prouvée
          </h2>
          <p className="mt-6 text-[#3A2F2A]/85 text-lg font-light max-w-md mx-auto">
            Des bénéfices visibles, une formule qui tient ses promesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {results.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="text-center group"
              >
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-[#E8DAD1] shadow-[0_2px_12px_rgba(58,47,42,0.06)] transition-all duration-300 ease-out group-hover:border-[#C6A75E]/40 group-hover:shadow-md" aria-hidden>
                  <Icon />
                </span>
                <h3 className="mt-5 text-base font-serif font-medium text-[#3A2F2A] uppercase tracking-[0.08em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#3A2F2A]/75">
                  {item.subtitle}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ResultsSection

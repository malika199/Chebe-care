import React from 'react'

const CheckIcon = () => (
  <svg className="w-6 h-6 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const BrandValues = () => {
  const values = [
    { title: 'Formules inspirées d\'un rituel ancestral' },
    { title: 'Ingrédients naturels' },
    { title: 'Prix accessibles' },
    { title: 'Adapté aux hommes et aux femmes' },
    { title: 'Fabrication soignée' }
  ]

  return (
    <section id="values" className="py-14 lg:py-20 bg-[#E8DAD1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 lg:mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#3A2F2A]/60 mb-2">
            L'excellence naturelle
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#3A2F2A] tracking-tight">
            Pourquoi choisir CHEBE CAIR By SS ?
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {values.slice(0, 3).map((value, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-5 lg:p-6 bg-white rounded-2xl border border-[#E8DAD1]/90 shadow-sm transition-all duration-200 ease-out hover:shadow-lg hover:border-amber-500/40 hover:-translate-y-0.5"
            >
              <CheckIcon />
              <span className="font-medium text-[#3A2F2A] text-[15px] leading-snug">{value.title}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 lg:gap-5 mt-4 lg:mt-5">
          {values.slice(3, 5).map((value, index) => (
            <div
              key={index + 3}
              className="flex items-center gap-4 p-5 lg:p-6 bg-white rounded-2xl border border-[#E8DAD1]/90 shadow-sm w-full sm:w-[calc(50%-0.5rem)] lg:max-w-[calc(33.333%-10px)] min-w-0 transition-all duration-200 ease-out hover:shadow-lg hover:border-amber-500/40 hover:-translate-y-0.5"
            >
              <CheckIcon />
              <span className="font-medium text-[#3A2F2A] text-[15px] leading-snug">{value.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandValues

import React from 'react'

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-[#F5EFEA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-[60px] items-start">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden w-full aspect-[4/5] max-h-[520px] rounded-3xl shadow-xl">
              <img
                src="/photo_histoire.jpg"
                alt="Portrait — Notre histoire, tradition et élégance"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2F2A]/5 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2 max-w-[520px]">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#3A2F2A]/70">
              Du Tchad à Paris
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#3A2F2A] tracking-tight">
              Notre histoire
            </h2>
            <p className="text-lg text-[#3A2F2A]/80 leading-relaxed">
              Du fin fond du Tchad, là où la terre est riche et le soleil intense, les femmes tchadiennes aux longs cheveux noirs perpétuent un rituel ancestral : l'utilisation du Chebé.
            </p>
            <p className="text-lg text-[#3A2F2A]/80 leading-relaxed">
              Transmise de génération en génération, cette tradition protège, renforce et préserve la longueur des cheveux.
            </p>
            <p className="text-lg text-[#3A2F2A]/80 leading-relaxed">
              De N'Djamena à Paris, ville de l'amour et de l'élégance, ce secret naturel traverse les époques pour donner naissance à une marque unique : <strong className="font-medium text-[#3A2F2A]">CHEBE CAIR By SS</strong>. Une rencontre entre tradition africaine et modernité européenne.
            </p>
            <a
              href="#ingredients"
              className="inline-block mt-4 text-[11px] uppercase tracking-[0.25em] text-[#C6A75E] border-b border-[#C6A75E] pb-1 hover:opacity-80 transition-opacity"
            >
              Nos ingrédients
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection

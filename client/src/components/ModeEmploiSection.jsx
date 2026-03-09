import React from 'react'

const MODE_EMPLOI_TEXT = `Pour utiliser l'huile de Chebé sur les cheveux et la barbe, appliquez-la en bain d'huile, ou quotidiennement en quelques gouttes pour sceller l'hydratation (deux fois par jour), ou en traitement profond (mélangée à un masque, parfois la nuit) en massant le cuir chevelu et la barbe pour stimuler la pousse, puis rincez ou coiffez selon le type de soin.`

const ModeEmploiSection = () => {
  return (
    <section id="mode-emploi" className="py-14 lg:py-20 bg-[#F5EFEA]">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <header className="text-center mb-8 lg:mb-10">
          <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#C6A75E] font-semibold mb-3">
            Guide
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#3A2F2A] tracking-tight">
            Mode d'emploi
          </h2>
        </header>

        <div className="rounded-2xl bg-white shadow-[0_4px_24px_rgba(58,47,42,0.08)] border border-[#E8DAD1]/70 p-6 sm:p-8 lg:p-10">
          <p className="text-[#3A2F2A]/90 text-base sm:text-lg leading-relaxed">
            {MODE_EMPLOI_TEXT}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ModeEmploiSection

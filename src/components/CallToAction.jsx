import React from 'react'

const CallToAction = () => {
  return (
    <section className="relative py-12 lg:py-16 bg-[#3A2F2A] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 55%)',
        }}
      />
      <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-amber-200/90 mb-3">
          Rejoignez l'expérience
        </p>
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white tracking-tight mb-3">
          Transformez votre routine capillaire
        </h2>
        <p className="text-sm text-white/80 leading-relaxed mb-6 max-w-md mx-auto">
          Découvrez notre collection complète et offrez à vos cheveux le soin qu'ils méritent.
        </p>
        <a
          href="#products"
          className="inline-flex items-center justify-center bg-amber-500 text-white px-7 py-3 rounded-full text-sm font-semibold tracking-wide shadow-lg hover:bg-amber-400 hover:shadow-xl transition-all duration-200"
        >
          Découvrir la collection
        </a>
        <p className="mt-5 text-[11px] text-white/50 uppercase tracking-wider">
          Livraison rapide · Paiement sécurisé
        </p>
      </div>
    </section>
  )
}

export default CallToAction

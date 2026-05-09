import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LandingNavbar from '../components/LandingNavbar'
import Footer from '../components/Footer'

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="font-serif text-lg sm:text-xl text-[#3A2F2A] mb-4">{title}</h2>
    <div className="text-[#3A2F2A]/85 text-sm sm:text-[15px] leading-relaxed space-y-3">{children}</div>
  </section>
)

function TermsOfUsePage() {
  useEffect(() => {
    document.title = 'Conditions générales d\'utilisation — CHEBE CARE By SS'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBFA]">
      <LandingNavbar />
      <main className="flex-1 pt-24 lg:pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#3A2F2A]/50 mb-2">Informations légales</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#3A2F2A] mb-3">
            Conditions générales d&apos;utilisation
          </h1>
          <p className="text-sm text-[#3A2F2A]/70 mb-10">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>

          <Section title="1. Objet">
            <p>
              Les présentes conditions générales d&apos;utilisation (ci-après « CGU ») ont pour objet de définir les modalités
              d&apos;accès et d&apos;utilisation du site internet CHEBE CARE By SS (ci-après « le Site »), ainsi que les droits et
              obligations des utilisateurs.
            </p>
            <p>
              En accédant au Site ou en le consultant, vous acceptez sans réserve les présentes CGU. Si vous n&apos;acceptez pas
              ces conditions, nous vous invitons à ne pas utiliser le Site.
            </p>
          </Section>

          <Section title="2. Éditeur du site">
            <p>
              Le Site est édité par CHEBE CARE By SS. Pour toute question relative aux présentes CGU ou au Site, vous pouvez nous
              contacter via les moyens mis à votre disposition sur la <Link to="/" className="text-amber-700 underline underline-offset-2 hover:text-amber-800">page d&apos;accueil</Link> du Site
              (liens vers nos réseaux sociaux, formulaire ou email lorsqu&apos;ils sont communiqués).
            </p>
          </Section>

          <Section title="3. Accès au Site">
            <p>
              Le Site est accessible en principe 24h/24 et 7j/7, sous réserve des opérations de maintenance, des cas de force
              majeure et des contraintes techniques ou réseaux indépendantes de notre volonté.
            </p>
            <p>
              Nous nous efforçons d&apos;assurer un accès de qualité mais ne garantissons pas l&apos;absence d&apos;interruption,
              d&apos;erreur ou de dysfonctionnement.
            </p>
          </Section>

          <Section title="4. Utilisation du Site">
            <p>
              Vous vous engagez à utiliser le Site de manière loyal et conforme à sa destination. Il est notamment interdit :
              d&apos;utiliser le Site à des fins illégales ou frauduleuses ; de porter atteinte au bon fonctionnement ou à la
              sécurité du Site ; de tenter d&apos;accéder de manière non autorisée à des systèmes ou données ; de diffuser des
              contenus illicites, diffamatoires ou contraires aux droits des tiers.
            </p>
          </Section>

          <Section title="5. Produits, prix et commandes">
            <p>
              Les informations relatives aux produits (descriptions, visuels, prix) sont fournies à titre indicatif et peuvent
              évoluer. Les commandes et conditions de vente (paiement, livraison, droit de rétractation, etc.) sont régies par les
              conditions générales de vente applicables au moment de la commande, lorsqu&apos;elles vous sont communiquées.
            </p>
          </Section>

          <Section title="6. Propriété intellectuelle">
            <p>
              L&apos;ensemble des éléments du Site (textes, visuels, logos, charte graphique, structure, marques, etc.) sont
              protégés par le droit de la propriété intellectuelle. Toute reproduction, représentation, adaptation ou exploitation,
              totale ou partielle, sans autorisation écrite préalable est interdite, sauf exceptions prévues par la loi.
            </p>
          </Section>

          <Section title="7. Responsabilité">
            <p>
              Nous ne saurions être tenus responsables des dommages indirects ou immatériels résultant de l&apos;utilisation ou de
              l&apos;impossibilité d&apos;utiliser le Site. Le Site peut contenir des liens vers des sites tiers ; nous ne
              contrôlons pas ces sites et déclinons toute responsabilité quant à leur contenu ou leur accessibilité.
            </p>
          </Section>

          <Section title="8. Données personnelles">
            <p>
              Les traitements de données personnelles réalisés dans le cadre du Site sont effectués conformément à la règlementation
              applicable (notamment le RGPD). Les finalités, bases légales et vos droits sont précisés dans notre politique de
              confidentialité ou dans les mentions d&apos;information fournies lors de la collecte des données, le cas échéant.
            </p>
          </Section>

          <Section title="9. Modification des CGU">
            <p>
              Nous nous réservons le droit de modifier les présentes CGU à tout moment. La version en vigueur est celle publiée sur
              cette page à la date de mise à jour indiquée en tête de document. Nous vous invitons à consulter régulièrement cette page.
            </p>
          </Section>

          <Section title="10. Droit applicable">
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution
              des présentes, et à défaut de solution amiable, les tribunaux français seront seuls compétents, sous réserve des règles
              d&apos;ordre public applicables.
            </p>
          </Section>

          <p className="mt-12 pt-8 border-t border-[#E8DAD1]/80">
            <Link to="/" className="text-sm font-medium text-amber-700 hover:text-amber-800 underline underline-offset-2">
              ← Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default TermsOfUsePage

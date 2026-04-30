/** Chemins servis par l’API : /images/products/… (voir server/public/images/products). */
export const products = [
  {
    id: 1,
    name: 'Huile de Barbe – 20ml',
    description: 'Huile nourrissante enrichie en Chebé et Huile de Cerise pour une barbe plus douce et brillante. Hair & beard.',
    usage: 'Pour utiliser l\'huile de Chebé sur les cheveux et la barbe, appliquez-la en bain d\'huile, ou quotidiennement en quelques gouttes pour sceller l\'hydratation (deux fois par jour), ou en traitement profond (mélangée à un masque, parfois la nuit) en massant le cuir chevelu et la barbe pour stimuler la pousse, puis rincez ou coiffez selon le type de soin.',
    price: 10,
    originalPrice: null,
    discount: 0,
    image: '/images/products/huile-barbe.png',
    category: 'Barbe',
    features: ['Hydrate la peau', 'Réduit les démangeaisons', 'Apporte brillance', 'Texture légère non grasse']
  },
  {
    id: 2,
    name: 'Huile de Cheveux – 100ml',
    description: 'Huile fortifiante au Chébé. Nourrit, renforce et limite la casse.',
    usage: 'Pour utiliser l\'huile de Chebé sur les cheveux et la barbe, appliquez-la en bain d\'huile, ou quotidiennement en quelques gouttes pour sceller l\'hydratation (deux fois par jour), ou en traitement profond (mélangée à un masque, parfois la nuit) en massant le cuir chevelu et la barbe pour stimuler la pousse, puis rincez ou coiffez selon le type de soin.',
    price: 12,
    originalPrice: null,
    discount: 0,
    image: '/images/products/huile-cheveux.png',
    category: 'Cheveux',
    features: ['Nourrit en profondeur', 'Limite la casse', 'Favorise la rétention de longueur', 'Tous types de cheveux'],
    bienfaits: [
      { title: 'Réduit la casse', text: 'Le chébé aide à maintenir l\'hydratation dans la fibre capillaire, ce qui limite la casse et les pointes fourchues.' },
      { title: 'Favorise la rétention de longueur', text: 'En protégeant le cheveu, il permet de conserver la longueur plus longtemps.' },
      { title: 'Renforce la fibre capillaire', text: 'Il fortifie les cheveux fragilisés et améliore leur résistance.' },
      { title: 'Protège contre la sécheresse', text: 'Idéal pour les cheveux secs, crépus, bouclés ou frisés.' },
      { title: 'Apporte brillance et souplesse', text: 'Les cheveux sont plus doux, plus brillants et plus faciles à coiffer.' }
    ],
    pourQui: [
      'Cheveux cassants',
      'Cheveux secs ou déshydratés',
      'Cheveux en transition',
      'Barbes sèches',
      'Cheveux crépus, frisés, bouclés'
    ]
  },
  {
    id: 5,
    name: 'Poudre de Chebé',
    description: 'Poudre naturelle pure du Tchad. Maintient et nourrit vos cheveux en profondeur, démêle et assouplit tout en favorisant la pousse. Produit naturel Ghébé-Gare pour cheveux longs. By SS.',
    price: 14,
    originalPrice: null,
    discount: 0,
    image: '/images/products/poudre-chebe.png',
    category: 'Cheveux',
    features: ['Chebé pur du Tchad', 'Nourrit en profondeur', 'Démêle et assouplit', 'Favorise la pousse'],
    isMostPopular: true
  },
  {
    id: 3,
    name: 'Crème Capillaire – 200ml',
    description: 'Crème nourrissante et d\'entretien Chebe-care. Mélange de beurre de Karité et actifs essentiels pour nourrir et discipliner vos cheveux. MLG & SS.',
    price: 16.5,
    originalPrice: null,
    discount: 0,
    image: '/images/products/creme-cheveux.png',
    category: 'Cheveux',
    features: ['Hydratation intense', 'Anti-frisottis', 'Facilite le coiffage', 'Protection longue durée']
  },
  {
    id: 4,
    name: 'Crème pour Barbe – 100ml',
    description: 'Crème nourrissante Hair & beard. Spécialement formulée avec un mélange de beurres et huiles essentielles pour structurer et renforcer la barbe. Oil by SS.',
    price: 12,
    originalPrice: null,
    discount: 0,
    image: '/images/products/creme-barbe.png',
    category: 'Barbe',
    features: ['Discipline les poils', 'Hydrate intensément', 'Rend la barbe plus souple', 'Finition naturelle']
  },
  {
    id: 6,
    name: 'Encens Tchadien – Doukan',
    tagline: 'Purifiant • Relaxant • Traditionnel',
    description: 'Le Doukan est un encens naturel du Tchad reconnu pour ses vertus purifiantes et apaisantes. Présenté en pot de verre avec bouchon liège et ficelle, il purifie et parfume durablement l\'espace tout en créant une ambiance chaleureuse et orientale. Idéal pour rituels, relaxation et moments cocooning. MLG & SS.',
    price: 12.5,
    originalPrice: null,
    discount: 0,
    image: '/images/products/encens-tchadien-doukan.png',
    category: 'Encens',
    features: [
      'Purifie et parfume durablement l\'espace',
      'Favorise la détente et le bien-être',
      'Crée une ambiance chaleureuse et orientale',
      'Idéal pour rituels, relaxation et moments cocooning'
    ]
  },
  {
    id: 7,
    name: 'Derma Roller – Barbe & peau',
    description: 'Rouleau dermique à micro-aiguilles pour stimuler la pousse de la barbe et préparer la peau. Design ergonomique, finition noire. Idéal en complément des huiles et soins Chebé.',
    price: 3.99,
    originalPrice: null,
    discount: 0,
    image: '/images/products/derma_roller.jpeg',
    category: 'Barbe',
    features: ['Stimule la pousse de la barbe', 'Prépare la peau à l\'absorption des soins', 'Micro-aiguilles en métal', 'Poignée ergonomique']
  }
]

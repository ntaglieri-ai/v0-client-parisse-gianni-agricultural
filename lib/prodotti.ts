export type Step = {
  icon: string
  label: string
  data: string
  done: boolean
}

export type Prodotto = {
  id: string
  nome: string
  cat: 'ortaggi' | 'legumi' | 'cereali' | 'olio' | 'frutta'
  emoji: string
  bio: boolean
  bg: string
  prezzo: string
  unita: string
  desc: string
  lotto: string
  raccolta: string
  campo: string
  varieta: string
  metodo: string
  cert: string
  steps: Step[]
}

export const prodotti: Prodotto[] = [
  {
    id: 'P001',
    nome: 'Patate del Fucino',
    cat: 'ortaggi',
    emoji: '🥔',
    bio: true,
    bg: '#fef9e7',
    prezzo: '1,20',
    unita: 'kg',
    desc: "Patate a pasta gialla coltivate sull'altopiano del Fucino, ricche di amido e dal sapore unico.",
    lotto: 'FUC-2025-001',
    raccolta: '15 Mar 2025',
    campo: 'Campo Nord – Loc. Collarmele',
    varieta: 'Monalisa',
    metodo: 'Agricoltura integrata',
    cert: 'GlobalGAP',
    steps: [
      { icon: '🌱', label: 'Semina', data: '28 Gen 2025', done: true },
      { icon: '🌿', label: 'Coltivazione & irrigazione', data: 'Feb – Mar 2025', done: true },
      { icon: '🚜', label: 'Raccolta meccanizzata', data: '15 Mar 2025', done: true },
      { icon: '🏭', label: 'Selezione e confezionamento', data: '16 Mar 2025', done: true },
      { icon: '🛒', label: 'Distribuzione', data: '17 Mar 2025', done: true },
    ],
  },
  {
    id: 'P002',
    nome: 'Lenticchie della Marsica',
    cat: 'legumi',
    emoji: '🫘',
    bio: true,
    bg: '#fdf2e9',
    prezzo: '3,50',
    unita: '500g',
    desc: "Lenticchie piccole e profumate, coltivate nei terreni vulcanici dell'altopiano abruzzese.",
    lotto: 'MAR-2025-002',
    raccolta: '20 Giu 2025',
    campo: 'Campo Sud – Loc. Trasacco',
    varieta: 'Lenticchia nana',
    metodo: 'Biologico certificato',
    cert: 'ICEA Bio',
    steps: [
      { icon: '🌱', label: 'Semina', data: 'Apr 2025', done: true },
      { icon: '🌿', label: 'Crescita naturale', data: 'Apr – Giu 2025', done: true },
      { icon: '🚜', label: 'Raccolta', data: '20 Giu 2025', done: true },
      { icon: '🏭', label: 'Pulitura e insacchettamento', data: '22 Giu 2025', done: true },
      { icon: '🛒', label: 'Distribuzione', data: '24 Giu 2025', done: false },
    ],
  },
  {
    id: 'P003',
    nome: 'Olio Extravergine Fucino',
    cat: 'olio',
    emoji: '🫒',
    bio: false,
    bg: '#e9f5e9',
    prezzo: '12,00',
    unita: '500ml',
    desc: 'Olio EVO prodotto da olive Gentile di Chieti raccolte a mano, prima spremitura a freddo.',
    lotto: 'OLI-2024-003',
    raccolta: '20 Ott 2024',
    campo: 'Uliveto Est – Loc. Avezzano',
    varieta: 'Gentile di Chieti',
    metodo: 'Prima spremitura a freddo',
    cert: 'DOP in attesa',
    steps: [
      { icon: '🫒', label: 'Raccolta olive a mano', data: '20 Ott 2024', done: true },
      { icon: '⚙️', label: 'Frangitura entro 24h', data: '21 Ott 2024', done: true },
      { icon: '🏭', label: 'Spremitura a freddo', data: '21 Ott 2024', done: true },
      { icon: '🫙', label: 'Imbottigliamento', data: '25 Ott 2024', done: true },
      { icon: '🛒', label: 'Distribuzione', data: 'Nov 2024', done: true },
    ],
  },
  {
    id: 'P004',
    nome: 'Farro della Marsica',
    cat: 'cereali',
    emoji: '🌾',
    bio: true,
    bg: '#fdf6e3',
    prezzo: '2,80',
    unita: '500g',
    desc: 'Farro monococco antico, coltivato in altura. Ricco di proteine, fibre e minerali.',
    lotto: 'FAR-2025-004',
    raccolta: '10 Lug 2025',
    campo: 'Campo Ovest – Loc. Pescina',
    varieta: 'Farro monococco',
    metodo: 'Biologico certificato',
    cert: 'CCPB Bio',
    steps: [
      { icon: '🌱', label: 'Semina autunnale', data: 'Nov 2024', done: true },
      { icon: '🌿', label: 'Crescita invernale', data: 'Dic 2024 – Mag 2025', done: true },
      { icon: '🚜', label: 'Raccolta', data: '10 Lug 2025', done: true },
      { icon: '🏭', label: 'Trebbiatura e confezionamento', data: '12 Lug 2025', done: false },
      { icon: '🛒', label: 'Distribuzione', data: 'Ago 2025', done: false },
    ],
  },
  {
    id: 'P005',
    nome: 'Peperoni IGP Altopiano',
    cat: 'ortaggi',
    emoji: '🫑',
    bio: false,
    bg: '#fde8e8',
    prezzo: '2,00',
    unita: 'kg',
    desc: "Peperoni dolci e carnosi, tipici dell'altopiano del Fucino. Ideali per peperonata e conserve.",
    lotto: 'PEP-2025-005',
    raccolta: '5 Ago 2025',
    campo: 'Campo Sud – Loc. Celano',
    varieta: 'Corno di bue',
    metodo: 'Agricoltura integrata',
    cert: 'IGP Fucino',
    steps: [
      { icon: '🌱', label: 'Trapianto', data: 'Apr 2025', done: true },
      { icon: '🌿', label: 'Coltivazione in pieno campo', data: 'Apr – Ago 2025', done: true },
      { icon: '🚜', label: 'Raccolta manuale', data: '5 Ago 2025', done: false },
      { icon: '🏭', label: 'Selezione e confezionamento', data: '6 Ago 2025', done: false },
      { icon: '🛒', label: 'Distribuzione', data: '7 Ago 2025', done: false },
    ],
  },
  {
    id: 'P006',
    nome: 'Mele Rosa dei Monti Sibillini',
    cat: 'frutta',
    emoji: '🍎',
    bio: true,
    bg: '#fde8f0',
    prezzo: '1,80',
    unita: 'kg',
    desc: 'Mele antiche a polpa croccante e profumata. Coltivazione biologica a 900m di altitudine.',
    lotto: 'MEL-2025-006',
    raccolta: '15 Set 2025',
    campo: 'Meleto Montagna – Loc. Ortucchio',
    varieta: 'Mela Rosa',
    metodo: 'Biologico certificato',
    cert: 'ICEA Bio',
    steps: [
      { icon: '🌸', label: 'Fioritura', data: 'Apr 2025', done: true },
      { icon: '🌿', label: 'Crescita e diradamento', data: 'Mag – Ago 2025', done: true },
      { icon: '🍎', label: 'Raccolta manuale', data: '15 Set 2025', done: false },
      { icon: '🏭', label: 'Calibratura e confezionamento', data: '16 Set 2025', done: false },
      { icon: '🛒', label: 'Distribuzione', data: '17 Set 2025', done: false },
    ],
  },
]

export const nomeCat = (cat: string) =>
  ({ ortaggi: 'Ortaggio', legumi: 'Legume', cereali: 'Cereale', olio: 'Olio', frutta: 'Frutta' }[cat] ?? cat)

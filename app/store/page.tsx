"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";

// Product data
const prodotti = [
  {
    id: "P001",
    nome: "Patate del Fucino",
    cat: "ortaggi",
    emoji: "🥔",
    bio: true,
    bg: "#fef9e7",
    prezzo: "1,20",
    unita: "kg",
    desc: "Patate a pasta gialla coltivate sull'altopiano del Fucino, ricche di amido e dal sapore unico.",
    lotto: "FUC-2025-001",
    raccolta: "15 Mar 2025",
    campo: "Campo Nord – Loc. Collarmele",
    varieta: "Monalisa",
    metodo: "Agricoltura integrata",
    cert: "GlobalGAP",
    steps: [
      { icon: "🌱", label: "Semina", data: "28 Gen 2025", done: true },
      { icon: "🌿", label: "Coltivazione & irrigazione", data: "Feb – Mar 2025", done: true },
      { icon: "🚜", label: "Raccolta meccanizzata", data: "15 Mar 2025", done: true },
      { icon: "🏭", label: "Selezione e confezionamento", data: "16 Mar 2025", done: true },
      { icon: "🛒", label: "Distribuzione", data: "17 Mar 2025", done: true },
    ],
  },
  {
    id: "P002",
    nome: "Lenticchie della Marsica",
    cat: "legumi",
    emoji: "🫘",
    bio: true,
    bg: "#fdf2e9",
    prezzo: "3,50",
    unita: "500g",
    desc: "Lenticchie piccole e profumate, coltivate nei terreni vulcanici dell'altopiano abruzzese.",
    lotto: "MAR-2025-002",
    raccolta: "20 Giu 2025",
    campo: "Campo Sud – Loc. Trasacco",
    varieta: "Lenticchia nana",
    metodo: "Biologico certificato",
    cert: "ICEA Bio",
    steps: [
      { icon: "🌱", label: "Semina", data: "Apr 2025", done: true },
      { icon: "🌿", label: "Crescita naturale", data: "Apr – Giu 2025", done: true },
      { icon: "🚜", label: "Raccolta", data: "20 Giu 2025", done: true },
      { icon: "🏭", label: "Pulitura e insacchettamento", data: "22 Giu 2025", done: true },
      { icon: "🛒", label: "Distribuzione", data: "24 Giu 2025", done: false },
    ],
  },
  {
    id: "P003",
    nome: "Olio Extravergine Fucino",
    cat: "olio",
    emoji: "🫒",
    bio: false,
    bg: "#e9f5e9",
    prezzo: "12,00",
    unita: "500ml",
    desc: "Olio EVO prodotto da olive Gentile di Chieti raccolte a mano, prima spremitura a freddo.",
    lotto: "OLI-2024-003",
    raccolta: "20 Ott 2024",
    campo: "Uliveto Est – Loc. Avezzano",
    varieta: "Gentile di Chieti",
    metodo: "Prima spremitura a freddo",
    cert: "DOP in attesa",
    steps: [
      { icon: "🫒", label: "Raccolta olive a mano", data: "20 Ott 2024", done: true },
      { icon: "⚙️", label: "Frangitura entro 24h", data: "21 Ott 2024", done: true },
      { icon: "🏭", label: "Spremitura a freddo", data: "21 Ott 2024", done: true },
      { icon: "🫙", label: "Imbottigliamento", data: "25 Ott 2024", done: true },
      { icon: "🛒", label: "Distribuzione", data: "Nov 2024", done: true },
    ],
  },
  {
    id: "P004",
    nome: "Farro della Marsica",
    cat: "cereali",
    emoji: "🌾",
    bio: true,
    bg: "#fdf6e3",
    prezzo: "2,80",
    unita: "500g",
    desc: "Farro monococco antico, coltivato in altura. Ricco di proteine, fibre e minerali.",
    lotto: "FAR-2025-004",
    raccolta: "10 Lug 2025",
    campo: "Campo Ovest – Loc. Pescina",
    varieta: "Farro monococco",
    metodo: "Biologico certificato",
    cert: "CCPB Bio",
    steps: [
      { icon: "🌱", label: "Semina autunnale", data: "Nov 2024", done: true },
      { icon: "🌿", label: "Crescita invernale", data: "Dic 2024 – Mag 2025", done: true },
      { icon: "🚜", label: "Raccolta", data: "10 Lug 2025", done: true },
      { icon: "🏭", label: "Trebbiatura e confezionamento", data: "12 Lug 2025", done: false },
      { icon: "🛒", label: "Distribuzione", data: "Ago 2025", done: false },
    ],
  },
  {
    id: "P005",
    nome: "Peperoni IGP Altopiano",
    cat: "ortaggi",
    emoji: "🫑",
    bio: false,
    bg: "#fde8e8",
    prezzo: "2,00",
    unita: "kg",
    desc: "Peperoni dolci e carnosi, tipici dell'altopiano del Fucino. Ideali per peperonata e conserve.",
    lotto: "PEP-2025-005",
    raccolta: "5 Ago 2025",
    campo: "Campo Sud – Loc. Celano",
    varieta: "Corno di bue",
    metodo: "Agricoltura integrata",
    cert: "IGP Fucino",
    steps: [
      { icon: "🌱", label: "Trapianto", data: "Apr 2025", done: true },
      { icon: "🌿", label: "Coltivazione in pieno campo", data: "Apr – Ago 2025", done: true },
      { icon: "🚜", label: "Raccolta manuale", data: "5 Ago 2025", done: false },
      { icon: "🏭", label: "Selezione e confezionamento", data: "6 Ago 2025", done: false },
      { icon: "🛒", label: "Distribuzione", data: "7 Ago 2025", done: false },
    ],
  },
  {
    id: "P006",
    nome: "Mele Rosa dei Monti Sibillini",
    cat: "frutta",
    emoji: "🍎",
    bio: true,
    bg: "#fde8f0",
    prezzo: "1,80",
    unita: "kg",
    desc: "Mele antiche a polpa croccante e profumata. Coltivazione biologica a 900m di altitudine.",
    lotto: "MEL-2025-006",
    raccolta: "15 Set 2025",
    campo: "Meleto Montagna – Loc. Ortucchio",
    varieta: "Mela Rosa",
    metodo: "Biologico certificato",
    cert: "ICEA Bio",
    steps: [
      { icon: "🌸", label: "Fioritura", data: "Apr 2025", done: true },
      { icon: "🌿", label: "Crescita e diradamento", data: "Mag – Ago 2025", done: true },
      { icon: "🍎", label: "Raccolta manuale", data: "15 Set 2025", done: false },
      { icon: "🏭", label: "Calibratura e confezionamento", data: "16 Set 2025", done: false },
      { icon: "🛒", label: "Distribuzione", data: "17 Set 2025", done: false },
    ],
  },
];

const categories = [
  { id: "tutti", label: "Tutti", emoji: "" },
  { id: "ortaggi", label: "Ortaggi", emoji: "🥦" },
  { id: "legumi", label: "Legumi", emoji: "🫘" },
  { id: "cereali", label: "Cereali", emoji: "🌾" },
  { id: "olio", label: "Olio", emoji: "🫒" },
  { id: "frutta", label: "Frutta", emoji: "🍎" },
];

function nomeCat(c: string) {
  const map: Record<string, string> = {
    ortaggi: "Ortaggio",
    legumi: "Legume",
    cereali: "Cereale",
    olio: "Olio",
    frutta: "Frutta",
  };
  return map[c] || c;
}

type Product = (typeof prodotti)[number];

export default function StorePage() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("tutti");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [traceView, setTraceView] = useState<Product | null>(null);

  // Handle URL params for traceability
  useEffect(() => {
    const tracciaId = searchParams.get("traccia");
    if (tracciaId) {
      const product = prodotti.find((p) => p.id === tracciaId);
      if (product) {
        setTraceView(product);
      }
    }
  }, [searchParams]);

  const filteredProducts =
    activeFilter === "tutti"
      ? prodotti
      : prodotti.filter((p) => p.cat === activeFilter);

  // Traceability view (when scanned from QR)
  if (traceView) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary to-primary/80 px-6 py-12 text-center">
          <div className="mb-4 text-6xl">✅</div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Prodotto Verificato
          </h1>
          <p className="mt-2 text-white/75">
            Hai scansionato il QR code autentico di{" "}
            <strong className="text-accent">{traceView.nome}</strong>
          </p>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 py-10">
          {/* Steps */}
          <div className="mb-8">
            <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Filiera Completa
            </h4>
            <div className="space-y-0">
              {traceView.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xl ${
                      step.done
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-secondary"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <strong className="block text-sm text-foreground">
                      {step.label}
                    </strong>
                    <span className="text-xs text-muted-foreground">
                      {step.data}
                    </span>
                  </div>
                  {step.done ? (
                    <span className="text-lg text-primary">✓</span>
                  ) : (
                    <span className="text-lg text-muted-foreground/40">○</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-secondary p-4">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Campo
              </div>
              <div className="text-sm font-bold text-primary">
                {traceView.campo}
              </div>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Varieta
              </div>
              <div className="text-sm font-bold text-primary">
                {traceView.varieta}
              </div>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Metodo
              </div>
              <div className="text-sm font-bold text-primary">
                {traceView.metodo}
              </div>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Certificazione
              </div>
              <div className="text-sm font-bold text-primary">
                {traceView.cert}
              </div>
            </div>
          </div>

          {/* Verified badge */}
          <div className="text-center">
            <div className="inline-block rounded-xl bg-secondary p-6">
              <p className="mb-2 text-xs text-muted-foreground">
                LOTTO VERIFICATO
              </p>
              <p className="text-2xl font-bold tracking-widest text-primary">
                {traceView.lotto}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Gianni Parisse Azienda Agricola - Pescina (AQ)
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setTraceView(null);
                window.history.pushState({}, "", "/store");
              }}
              className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent/90"
            >
              Torna al Catalogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 px-6 py-16 text-center md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <span className="mb-4 inline-block rounded-full border border-accent bg-accent/25 px-4 py-1.5 text-xs uppercase tracking-widest text-accent">
          Dal Fucino alla Tua Tavola
        </span>
        <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          I Nostri Prodotti
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-white/75">
          Ortaggi, legumi, cereali e molto altro. Coltivati con cura a Pescina
          (AQ), nel cuore della Marsica.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border bg-white px-4 py-4">
        <span className="mr-2 text-xs uppercase tracking-wider text-muted-foreground">
          Filtra:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all ${
              activeFilter === cat.id
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-foreground hover:border-accent hover:text-accent"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Card Image */}
              <div
                className="relative flex h-48 items-center justify-center text-7xl"
                style={{ backgroundColor: product.bg }}
              >
                <span>{product.emoji}</span>
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {nomeCat(product.cat)}
                </span>
                {product.bio && (
                  <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Bio
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-primary">
                  {product.nome}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {product.desc}
                </p>

                {/* Price row */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="font-serif text-2xl font-bold text-accent">
                    € {product.prezzo}
                    <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                      / {product.unita}
                    </span>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <strong className="block text-[10px]">Lotto</strong>
                    {product.lotto}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-center text-xs font-bold tracking-wide text-white transition-colors hover:bg-accent"
                  >
                    Dettagli e Filiera
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between rounded-t-2xl bg-gradient-to-br from-primary to-primary/80 px-6 py-6 md:px-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {selectedProduct.nome}
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  Lotto {selectedProduct.lotto} - Raccolta:{" "}
                  {selectedProduct.raccolta}
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8">
              {/* Filiera */}
              <div className="mb-6">
                <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Filiera di produzione
                </h4>
                <div className="space-y-0">
                  {selectedProduct.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 border-b border-border py-3 last:border-b-0"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xl ${
                          step.done
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-secondary"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <strong className="block text-sm text-foreground">
                          {step.label}
                        </strong>
                        <span className="text-xs text-muted-foreground">
                          {step.data}
                        </span>
                      </div>
                      {step.done ? (
                        <span className="text-lg text-primary">✓</span>
                      ) : (
                        <span className="text-lg text-muted-foreground/40">
                          ○
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Grid */}
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-secondary p-4">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Campo
                  </div>
                  <div className="text-sm font-bold text-primary">
                    {selectedProduct.campo}
                  </div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Varieta
                  </div>
                  <div className="text-sm font-bold text-primary">
                    {selectedProduct.varieta}
                  </div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Metodo
                  </div>
                  <div className="text-sm font-bold text-primary">
                    {selectedProduct.metodo}
                  </div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Certificazione
                  </div>
                  <div className="text-sm font-bold text-primary">
                    {selectedProduct.cert}
                  </div>
                </div>
              </div>

              {/* QR Section */}
              <div className="rounded-xl border-2 border-dashed border-border bg-secondary p-6 text-center">
                <h4 className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  QR Code Tracciabilita
                </h4>
                <p className="mb-4 text-xs text-muted-foreground">
                  Scansiona per vedere l&apos;intera filiera del prodotto.
                </p>
                <p className="text-sm text-muted-foreground">
                  Lotto:{" "}
                  <strong className="text-foreground">
                    {selectedProduct.lotto}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

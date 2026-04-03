import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, Heart, Users, Mountain } from "lucide-react";

export const metadata: Metadata = {
  title: "Azienda Agricola a Pescina (AQ) | Tradizione e Qualita del Fucino",
  description:
    "Scopri la storia dell'Azienda Agricola Parisse Gianni a Pescina, nel cuore della Marsica. Tradizione agricola, qualita genuina e prodotti del Fucino.",
};

const values = [
  {
    icon: Leaf,
    title: "Qualita",
    description:
      "Ogni prodotto che coltiviamo rispecchia il nostro impegno per l'eccellenza. Selezioniamo con cura le varieta piu adatte al nostro territorio.",
  },
  {
    icon: Heart,
    title: "Stagionalita",
    description:
      "Rispettiamo i ritmi della natura, coltivando e raccogliendo ogni prodotto nel momento ottimale per garantire il massimo del sapore.",
  },
  {
    icon: Users,
    title: "Filiera Corta",
    description:
      "Dal nostro campo alla tua tavola senza intermediari. Questo significa freschezza, tracciabilita e un rapporto diretto con chi coltiva il tuo cibo.",
  },
  {
    icon: Mountain,
    title: "Territorio",
    description:
      "Il Fucino e la Marsica sono la nostra casa. Coltiviamo qui perche crediamo nelle qualita uniche di questa terra.",
  },
];

export default function AziendaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-accent">
                La Nostra Storia
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                <span className="text-balance">
                  Azienda Agricola a Pescina (AQ)
                </span>
              </h1>
              <p className="mt-2 font-serif text-xl text-primary">
                Tradizione e Qualita del Fucino
              </p>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Nel cuore della Marsica, tra le montagne dell&apos;Abruzzo e la
                fertile piana del Fucino, la nostra famiglia coltiva la terra
                con passione e dedizione da generazioni.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/farmer.jpg"
                alt="Le mani del contadino con i prodotti freschi"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              <span className="text-balance">Una Storia di Famiglia e di Terra</span>
            </h2>
            <div className="mt-8 space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                L&apos;Azienda Agricola Parisse Gianni nasce dalla passione per
                la terra e dal desiderio di continuare una tradizione agricola
                che si tramanda di generazione in generazione. Situata a
                Pescina, in provincia dell&apos;Aquila, la nostra azienda si
                estende nella fertile piana del Fucino.
              </p>
              <p className="leading-relaxed">
                Il Fucino, un tempo il terzo lago piu grande d&apos;Italia,
                fu bonificato nel XIX secolo dal Principe Alessandro Torlonia,
                trasformandosi in una delle aree agricole piu produttive del
                centro Italia. I terreni, ricchi di minerali depositati nei
                secoli, conferiscono ai nostri prodotti caratteristiche
                organolettiche uniche.
              </p>
              <p className="leading-relaxed">
                Oggi coltiviamo ortaggi, legumi e cereali seguendo pratiche
                agricole che rispettano l&apos;ambiente e valorizzano le
                tradizioni del territorio. La nostra filosofia e semplice:
                produrre cibo genuino, sano e saporito, portandolo direttamente
                dal campo alla tavola di chi lo apprezza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Territory */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src="/images/harvest.jpg"
                alt="Raccolto nel Fucino"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:order-1">
              <span className="text-sm font-medium uppercase tracking-wider text-accent">
                Il Territorio
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-balance">
                  La Marsica e il Fucino: Un Terroir Unico
                </span>
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  La Marsica, situata nella parte occidentale dell&apos;Abruzzo,
                  e un territorio ricco di storia e tradizioni agricole. Al
                  centro si trova la piana del Fucino, a circa 700 metri di
                  altitudine, circondata dalle montagne dell&apos;Appennino.
                </p>
                <p className="leading-relaxed">
                  Le condizioni climatiche sono ideali per l&apos;agricoltura:
                  inverni freddi ed estati miti, con importanti escursioni
                  termiche tra giorno e notte che concentrano i sapori nei
                  prodotti. La qualita dell&apos;acqua e dei terreni,
                  naturalmente fertili, completa questo quadro privilegiato.
                </p>
                <p className="leading-relaxed">
                  Non e un caso che il Fucino sia famoso in tutta Italia per
                  le sue patate, carote e finocchi, riconosciuti per il gusto
                  inconfondibile che solo questo territorio sa dare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-accent">
              I Nostri Valori
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
              <span className="text-balance">Cosa Ci Guida Ogni Giorno</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 font-serif text-xl font-semibold text-primary-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dove Siamo */}
      <section id="dove-siamo" className="bg-secondary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Dove Siamo
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Vieni a trovarci in azienda
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2946.1234567890123!2d13.6558!3d42.0264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132fe7c8c8c8c8c8%3A0x123456789abcdef!2sVia%20II%20Traversa%20delle%20Croci%2C%2016%2C%2067057%20Pescina%20AQ!5e0!3m2!1sit!2sit!4v1234567890123!5m2!1sit!2sit"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa Azienda Agricola Parisse Gianni"
            />
          </div>

          <p className="mt-8 text-center text-lg text-foreground">
            Via II Traversa delle Croci, 16 — 67057 Pescina (AQ)
          </p>
        </div>
      </section>
    </>
  );
}

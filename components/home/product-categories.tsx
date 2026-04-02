import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Ortaggi Freschi",
    description: "Patate, carote, finocchi, sedano e molto altro, coltivati nella fertile piana del Fucino.",
    image: "/images/ortaggi.jpg",
    href: "/prodotti-agricoli-marsica#ortaggi",
  },
  {
    name: "Legumi",
    description: "Lenticchie, ceci, fagioli e altri legumi della tradizione abruzzese.",
    image: "/images/legumi.jpg",
    href: "/prodotti-agricoli-marsica#legumi",
  },
  {
    name: "Cereali",
    description: "Farro, orzo e grani antichi coltivati con metodi tradizionali.",
    image: "/images/cereali.jpg",
    href: "/prodotti-agricoli-marsica#cereali",
  },
  {
    name: "Farine",
    description: "Farine artigianali macinate a pietra per pane, pasta e dolci.",
    image: "/images/farine.jpg",
    href: "/prodotti-agricoli-marsica#farine",
  },
  {
    name: "Trasformati",
    description: "Conserve, sottoli e prodotti lavorati secondo le ricette della tradizione.",
    image: "/images/trasformati.jpg",
    href: "/prodotti-agricoli-marsica#trasformati",
  },
];

export function ProductCategories() {
  const whatsappUrl =
    "https://wa.me/393382726361?text=" +
    encodeURIComponent("Salve, vorrei conoscere la disponibilita dei vostri prodotti.");

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            I Nostri Prodotti
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            <span className="text-balance">Dalla Terra alla Tavola</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Scopri la nostra selezione di prodotti agricoli genuini, coltivati con passione nel cuore della Marsica.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-serif text-xl font-semibold">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {category.description}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
                >
                  Chiedi Disponibilita
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/prodotti-agricoli-marsica"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Scopri Tutti i Prodotti
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

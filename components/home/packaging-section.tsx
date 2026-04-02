import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export function PackagingSection() {
  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            Qualita Garantita
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            <span className="text-balance">Packaging curato & consegne rapide</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Dalla raccolta alla consegna, ogni dettaglio e pensato per garantire freschezza e qualita.
          </p>
        </div>

        {/* Content Blocks */}
        <div className="mt-16 space-y-16 lg:space-y-24">
          {/* Block 1 - Packaging (Image Left, Text Right) */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/packaging.jpg"
                alt="Verdure fresche confezionate con cura in cassette di legno"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            <div className="lg:pl-8">
              <h3 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                Packaging attento alla qualita
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                I nostri prodotti vengono selezionati e confezionati con cura, per preservarne 
                freschezza, integrita e caratteristiche naturali. Utilizziamo soluzioni semplici 
                ed efficaci, pensate per mantenere intatta la qualita dal campo alla tavola.
              </p>
            </div>
          </div>

          {/* Block 2 - Delivery (Image Right, Text Left) */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="order-1 lg:order-2 relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/delivery.jpg"
                alt="Consegna di prodotti agricoli freschi"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            <div className="order-2 lg:order-1 lg:pr-8">
              <h3 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                Consegne rapide e flessibili
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Organizziamo consegne rapide sul territorio e ritiri diretti in azienda. 
                Contattaci per conoscere disponibilita, tempi e modalita: troviamo sempre 
                la soluzione piu comoda per te.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="tel:+393200748337"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="h-4 w-4" />
            Contattaci per disponibilita
          </Link>
          <Link
            href="https://wa.me/393200748337?text=Ciao,%20vorrei%20informazioni%20su%20packaging%20e%20consegne"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-transparent px-8 py-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Scrivi su WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { Package, Truck } from "lucide-react";

export function PackagingSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            Qualita Garantita
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            <span className="text-balance">Packaging curato e consegne rapide</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Dalla raccolta alla consegna, ogni dettaglio e pensato per garantire freschezza e qualita.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Packaging */}
          <div className="overflow-hidden rounded-2xl bg-secondary">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/packaging.jpg"
                alt="Verdure fresche confezionate con cura in cassette di legno"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
                  Packaging attento alla qualita
                </h3>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                I nostri prodotti vengono selezionati e confezionati con cura, per preservarne 
                freschezza, integrita e caratteristiche naturali. Utilizziamo soluzioni semplici 
                ed efficaci, pensate per mantenere intatta la qualita dal campo alla tavola.
              </p>
            </div>
          </div>

          {/* Right Column - Delivery */}
          <div className="overflow-hidden rounded-2xl bg-secondary">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/delivery.jpg"
                alt="Consegna di prodotti agricoli freschi"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
                  Consegne rapide e flessibili
                </h3>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Organizziamo consegne rapide sul territorio e ritiri diretti in azienda. 
                Contattaci per conoscere disponibilita, tempi e modalita: troviamo sempre 
                la soluzione piu comoda per te.
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
}

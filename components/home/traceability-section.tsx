import { Leaf, Calendar, Package, QrCode } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Leaf,
    title: "Origine Certificata",
    description: "Sapere esattamente in quale campo e stato coltivato il tuo prodotto.",
  },
  {
    icon: Calendar,
    title: "Data di Raccolta",
    description: "Conoscere quando e stato raccolto e lavorato.",
  },
  {
    icon: Package,
    title: "Lotto Tracciato",
    description: "Seguire il percorso completo dal campo alla tavola.",
  },
];

export function TraceabilitySection() {
  return (
    <section className="bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            Trasparenza dal Campo alla Tavola
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
            <span className="text-balance">
              Ogni Prodotto Ha una Storia. Noi Te la Raccontiamo.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-primary-foreground/80">
            Crediamo che la fiducia nasca dalla trasparenza. Per questo ogni nostro prodotto 
            e dotato di un sistema di tracciabilita completo: dal seme alla confezione, 
            puoi seguire ogni passaggio della filiera. Basta scansionare il QR code presente 
            sulla confezione per accedere a tutte le informazioni: il campo di coltivazione, 
            le tecniche agronomiche utilizzate, la data di raccolta e ogni fase della lavorazione.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/10">
                <feature.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mt-6 font-serif text-xl font-semibold text-primary-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-primary-foreground/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* QR Box */}
        <div className="mt-16 rounded-2xl bg-primary-foreground/10 p-8 lg:p-10">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/20">
              <QrCode className="h-10 w-10 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-semibold text-primary-foreground">
                Scansiona il QR su ogni prodotto
              </h3>
              <p className="mt-2 text-primary-foreground/70">
                Scopri la storia completa del tuo prodotto: origine, data di raccolta, lotto e tutto il percorso dal campo alla tua tavola.
              </p>
            </div>
            <Link
              href="/store"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-accent/90"
            >
              Vai allo Store
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

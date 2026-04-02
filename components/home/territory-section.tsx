import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TerritorySection() {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-square">
            <Image
              src="/images/hero-farm.jpg"
              alt="La piana del Fucino in Abruzzo"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" />
          </div>

          {/* Content */}
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-accent">
              Il Nostro Territorio
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              <span className="text-balance">
                La Marsica e il Fucino: Terra di Eccellenze
              </span>
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Il Fucino, situato nel cuore dell&apos;Abruzzo, e una delle aree agricole piu fertili d&apos;Italia. Quello che un tempo era il terzo lago piu grande del paese, oggi e una pianura rigogliosa dove crescono ortaggi di qualita eccezionale.
              </p>
              <p className="leading-relaxed">
                Le condizioni climatiche uniche, con escursioni termiche che esaltano il sapore dei prodotti, e i terreni ricchi di minerali rendono i nostri ortaggi, legumi e cereali inconfondibili per gusto e genuinita.
              </p>
              <p className="leading-relaxed">
                La nostra azienda si trova a Pescina, nel cuore della Marsica, dove coltiviamo seguendo le tradizioni tramandate di generazione in generazione, con il rispetto per la terra che ci caratterizza da sempre.
              </p>
            </div>
            <Link
              href="/azienda-agricola-pescina"
              className="mt-8 inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80"
            >
              Scopri la Nostra Storia
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

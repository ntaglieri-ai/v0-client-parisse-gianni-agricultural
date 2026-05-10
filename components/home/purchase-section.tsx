import { ShoppingCart, Phone } from "lucide-react";
import Link from "next/link";

export function PurchaseSection() {
  return (
    <section className="bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            I Nostri Prodotti
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
            <span className="text-balance">Scegli Come Acquistare</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Puoi ordinare comodamente online oppure contattarci direttamente come preferisci.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Box Acquista Online */}
          <div className="rounded-2xl bg-primary-foreground/10 p-8 lg:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <ShoppingCart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-semibold text-primary-foreground">
                Acquista Online
              </h3>
              <p className="mt-4 text-primary-foreground/70">
                Sfoglia il catalogo, aggiungi al carrello e ordina direttamente dal nostro store.
              </p>
              <Link
                href="/store"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-accent/90"
              >
                Vai allo Store
              </Link>
            </div>
          </div>

          {/* Box Contatto Diretto */}
          <div className="rounded-2xl bg-primary-foreground/10 p-8 lg:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <Phone className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-semibold text-primary-foreground">
                Contatto Diretto
              </h3>
              <p className="mt-4 text-primary-foreground/70">
                Preferisci parlare con noi? Chiamaci o scrivici su WhatsApp.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:+393382726361"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-primary-foreground bg-transparent px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
                >
                  Chiama Ora
                </a>
                <a
                  href="https://wa.me/393382726361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-primary-foreground bg-transparent px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

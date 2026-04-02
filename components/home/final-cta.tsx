import { Phone, MessageCircle } from "lucide-react";

export function FinalCta() {
  const whatsappUrl =
    "https://wa.me/393382726361?text=" +
    encodeURIComponent(
      "Salve, vorrei ordinare dei prodotti agricoli direttamente da voi."
    );

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center sm:px-12 lg:px-20 lg:py-24">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            Contattaci Oggi
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            <span className="text-balance">
              Ordina Direttamente dal Produttore
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Niente intermediari, niente attese. Contattaci per scoprire i prodotti freschi disponibili e organizzare il ritiro o la consegna.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="tel:+393382726361"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg sm:w-auto"
            >
              <Phone className="h-5 w-5" />
              Chiama Ora
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white hover:text-primary sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Scrivi su WhatsApp
            </a>
          </div>

          <p className="mt-8 text-sm text-primary-foreground/60">
            Azienda Agricola Parisse Gianni - Pescina (AQ)
          </p>
        </div>
      </div>
    </section>
  );
}

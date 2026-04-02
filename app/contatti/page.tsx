import type { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contatti | Azienda Agricola Parisse Gianni - Pescina (AQ)",
  description:
    "Contatta l'Azienda Agricola Parisse Gianni a Pescina (AQ). Telefono, email, WhatsApp e indirizzo per ordinare prodotti agricoli del Fucino.",
};

const contactInfo = [
  {
    icon: Phone,
    label: "Telefono",
    value: "+39 338 272 6361",
    href: "tel:+393382726361",
    description: "Chiamaci per informazioni e ordini",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+39 338 272 6361",
    href: "https://wa.me/393382726361?text=Salve%2C%20vorrei%20informazioni%20sui%20vostri%20prodotti%20agricoli.",
    description: "Scrivici per una risposta rapida",
  },
  {
    icon: Mail,
    label: "Email",
    value: "gianniparisse@libero.it",
    href: "mailto:gianniparisse@libero.it",
    description: "Per comunicazioni dettagliate",
  },
  {
    icon: MapPin,
    label: "Indirizzo",
    value: "Via II Traversa delle Croci, 16",
    subvalue: "67057 Pescina (AQ)",
    href: "https://maps.google.com/?q=Via+II+Traversa+delle+Croci+16+67057+Pescina+AQ",
    description: "Vieni a trovarci in azienda",
  },
];

export default function ContattiPage() {
  const whatsappUrl =
    "https://wa.me/393382726361?text=" +
    encodeURIComponent(
      "Salve, vorrei informazioni sui vostri prodotti agricoli."
    );

  return (
    <>
      {/* Hero */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            Parliamo
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="text-balance">Contatti</span>
          </h1>
          <p className="mt-2 font-serif text-xl text-primary">
            Azienda Agricola Parisse Gianni
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Contattaci per conoscere i prodotti disponibili, organizzare il
            ritiro o semplicemente per saperne di piu sulla nostra azienda
            agricola.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  contact.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <contact.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  {contact.label}
                </h2>
                <p className="mt-2 font-medium text-primary">{contact.value}</p>
                {contact.subvalue && (
                  <p className="font-medium text-primary">{contact.subvalue}</p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  {contact.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-accent">
                Dove Siamo
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-balance">Vieni a Trovarci</span>
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                La nostra azienda si trova a Pescina, nel cuore della Marsica,
                facilmente raggiungibile dall&apos;autostrada A25
                Roma-Pescara (uscita Pescina). Siamo disponibili per visite
                su appuntamento.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Indirizzo</p>
                    <p className="text-muted-foreground">
                      Via II Traversa delle Croci, 16
                      <br />
                      67057 Pescina (AQ) - Abruzzo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Orari di Apertura
                    </p>
                    <p className="text-muted-foreground">
                      Lunedi - Sabato: 8:00 - 18:00
                      <br />
                      Domenica: Su appuntamento
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Via+II+Traversa+delle+Croci+16+67057+Pescina+AQ"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <MapPin className="h-4 w-4" />
                Apri in Google Maps
              </a>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted lg:aspect-square">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2945.1234567890123!2d13.6618!3d42.0254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132fd5e4e4e4e4e5%3A0x1234567890abcdef!2sVia%20II%20Traversa%20delle%20Croci%2C%2016%2C%2067057%20Pescina%20AQ!5e0!3m2!1sit!2sit!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa Azienda Agricola Parisse Gianni"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
            <span className="text-balance">
              Contattaci per Conoscere i Prodotti Disponibili
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Siamo sempre felici di parlare con te. Che tu voglia ordinare
            prodotti, visitare l&apos;azienda o semplicemente fare due
            chiacchiere sulla nostra terra, non esitare a contattarci.
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
        </div>
      </section>
    </>
  );
}

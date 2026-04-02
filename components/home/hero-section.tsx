import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";

export function HeroSection() {
  const whatsappUrl =
    "https://wa.me/393382726361?text=" +
    encodeURIComponent(
      "Salve, vorrei informazioni sui vostri prodotti agricoli."
    );

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-farm.jpg"
          alt="Campi agricoli del Fucino"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/60" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8">
        <span className="mb-6 inline-block rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent">
          Dal Produttore alla Tua Tavola
        </span>

        <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
          <span className="text-balance">
            Prodotti Agricoli dal Fucino
          </span>
          <span className="mt-2 block text-accent">
            Direttamente dal Produttore
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
          Ortaggi, legumi e cereali coltivati a Pescina (AQ), nel cuore della
          Marsica. Qualita genuina, filiera corta, dal campo alla tua tavola.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="tel:+393382726361"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
          >
            <Phone className="h-5 w-5" />
            Chiama Ora
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white hover:text-primary"
          >
            <MessageCircle className="h-5 w-5" />
            Scrivi su WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-white/80" />
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Azienda", href: "/azienda-agricola-pescina" },
  { name: "Prodotti", href: "/prodotti-agricoli-marsica" },
  { name: "Contatti", href: "/contatti" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Azienda Agricola Gianni Parisse"
                width={180}
                height={68}
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-primary-foreground/80">
              Coltiviamo ortaggi, legumi e cereali nel cuore del Fucino, in
              Abruzzo. Prodotti genuini dalla terra alla tua tavola, con la
              passione di una tradizione agricola che si tramanda da
              generazioni.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif text-lg font-semibold">Navigazione</h3>
            <ul className="mt-4 space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold">Contatti</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="https://maps.google.com/?q=Via+II+Traversa+delle+Croci+16+67057+Pescina+AQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Via II Traversa delle Croci, 16
                    <br />
                    67057 Pescina (AQ)
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+393382726361"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+39 338 272 6361</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:gianniparisse@libero.it"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>gianniparisse@libero.it</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Azienda Agricola Parisse Gianni.
            Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}

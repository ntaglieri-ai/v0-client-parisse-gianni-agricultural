import { Leaf, MapPin, Calendar, Award } from "lucide-react";

const trustItems = [
  {
    icon: MapPin,
    title: "Coltivazioni nel Fucino",
    description: "I nostri campi si trovano nella fertile piana del Fucino, nota per la qualita dei suoi terreni.",
  },
  {
    icon: Leaf,
    title: "Filiera Corta",
    description: "Dal nostro campo direttamente a te, senza intermediari per garantire freschezza e qualita.",
  },
  {
    icon: Calendar,
    title: "Raccolta Stagionale",
    description: "Rispettiamo i tempi della natura, raccogliendo i prodotti al momento giusto di maturazione.",
  },
  {
    icon: Award,
    title: "Prodotti Genuini",
    description: "Tecniche agricole tradizionali combinate con il rispetto per la terra e l'ambiente.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            Perche Sceglierci
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            <span className="text-balance">La Nostra Promessa di Qualita</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="group text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-6 font-serif text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

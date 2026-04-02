import { Phone, CheckCircle, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Phone,
    title: "Contattaci",
    description: "Chiamaci o scrivici su WhatsApp per conoscere i prodotti disponibili in stagione.",
  },
  {
    number: "02",
    icon: CheckCircle,
    title: "Verifica Disponibilita",
    description: "Ti informeremo su cosa abbiamo in magazzino e potremo riservare i prodotti per te.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Ritiro o Consegna",
    description: "Ritira direttamente in azienda a Pescina o organizziamo la consegna nella tua zona.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            Come Funziona
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
            <span className="text-balance">Ordinare e Semplice</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Niente carrelli online o procedure complicate. Basta una telefonata per avere prodotti freschi dal produttore.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-primary-foreground/20 md:block" />
              )}

              <div className="relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-8 font-serif text-xl font-semibold text-primary-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

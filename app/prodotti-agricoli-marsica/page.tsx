import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Prodotti Agricoli della Marsica | Vendita Diretta - Parisse Gianni",
  description:
    "Ortaggi del Fucino, legumi, cereali e farine dalla Marsica. Vendita diretta di prodotti agricoli genuini a Pescina (AQ). Contattaci per disponibilita.",
};

const productCategories = [
  {
    id: "ortaggi",
    name: "Ortaggi del Fucino",
    description:
      "I nostri ortaggi crescono nella fertile piana del Fucino, dove le condizioni climatiche uniche e i terreni ricchi di minerali conferiscono sapori inconfondibili. Coltiviamo seguendo i ritmi delle stagioni, garantendo prodotti sempre freschi e genuini.",
    products: [
      "Patate del Fucino",
      "Carote",
      "Finocchi",
      "Sedano",
      "Cipolle",
      "Aglio",
      "Insalate",
      "Cavoli",
      "Verze",
    ],
    image: "/images/ortaggi.jpg",
    seasonal: "Disponibilita stagionale - Contattaci per sapere cosa c'e",
  },
  {
    id: "legumi",
    name: "Legumi della Marsica",
    description:
      "I legumi della Marsica sono rinomati per la loro qualita e il loro gusto intenso. Li coltiviamo con metodi tradizionali, rispettando i tempi di crescita naturali per ottenere prodotti ricchi di nutrienti e sapore.",
    products: [
      "Lenticchie",
      "Ceci",
      "Fagioli borlotti",
      "Fagioli cannellini",
      "Cicerchie",
    ],
    image: "/images/legumi.jpg",
    seasonal: "Raccolto estivo - Disponibili tutto l'anno",
  },
  {
    id: "cereali",
    name: "Cereali e Grani",
    description:
      "Coltiviamo cereali e grani antichi che hanno fatto la storia dell'agricoltura abruzzese. Varieta selezionate per le loro caratteristiche nutrizionali e organolettiche superiori.",
    products: [
      "Farro",
      "Orzo",
      "Grano tenero",
      "Grano duro",
      "Mais",
    ],
    image: "/images/cereali.jpg",
    seasonal: "Raccolto estivo - Disponibili tutto l'anno",
  },
  {
    id: "farine",
    name: "Farine Artigianali",
    description:
      "Le nostre farine sono macinate a pietra per preservare tutte le proprieta nutritive del chicco. Ideali per pane, pasta fresca e dolci della tradizione.",
    products: [
      "Farina di grano tenero tipo 0",
      "Farina di grano tenero tipo 1",
      "Farina integrale",
      "Farina di farro",
      "Semola di grano duro",
    ],
    image: "/images/farine.jpg",
    seasonal: "Sempre disponibili",
  },
  {
    id: "trasformati",
    name: "Prodotti Trasformati",
    description:
      "Seguendo le ricette della tradizione, trasformiamo parte del nostro raccolto in conserve e prodotti lavorati. Un modo per gustare i sapori del Fucino tutto l'anno.",
    products: [
      "Passata di pomodoro",
      "Legumi in barattolo",
      "Sottoli",
      "Marmellate",
    ],
    image: "/images/trasformati.jpg",
    seasonal: "Disponibili tutto l'anno",
  },
];

export default function ProdottiPage() {
  const whatsappUrl =
    "https://wa.me/393382726361?text=" +
    encodeURIComponent(
      "Salve, vorrei conoscere la disponibilita dei vostri prodotti agricoli."
    );

  return (
    <>
      {/* Hero */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            I Nostri Prodotti
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="text-balance">
              Prodotti Agricoli della Marsica
            </span>
          </h1>
          <p className="mt-2 font-serif text-xl text-primary">
            Vendita Diretta dal Produttore
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Ortaggi, legumi, cereali e farine coltivati con passione nella
            fertile piana del Fucino. Contattaci per conoscere la disponibilita
            e organizzare il ritiro.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="tel:+393382726361"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Phone className="h-5 w-5" />
              Chiama per Disponibilita
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary bg-transparent px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="h-5 w-5" />
              Scrivi su WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      {productCategories.map((category, index) => (
        <section
          key={category.id}
          id={category.id}
          className={`scroll-mt-24 py-20 lg:py-28 ${
            index % 2 === 0 ? "bg-background" : "bg-card"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div
              className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <span className="text-sm font-medium uppercase tracking-wider text-accent">
                  {category.seasonal}
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
                  {category.name}
                </h2>
                <p className="mt-6 leading-relaxed text-muted-foreground">
                  {category.description}
                </p>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Prodotti
                  </h3>
                  <ul className="mt-4 grid grid-cols-2 gap-2">
                    {category.products.map((product, productIndex) => (
                      <li
                        key={productIndex}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chiedi Disponibilita
                </a>
              </div>

              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      
    </>
  );
}

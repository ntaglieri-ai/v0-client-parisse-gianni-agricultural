import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Azienda Agricola Parisse Gianni | Prodotti del Fucino",
  description:
    "Vendita diretta di ortaggi, legumi e cereali dalla Marsica. Azienda agricola a Pescina (AQ).",
  generator: "v0.app",
  metadataBase: new URL("https://parisse.it"),
  openGraph: {
    title: "Azienda Agricola Parisse Gianni | Prodotti del Fucino",
    description:
      "Vendita diretta di ortaggi, legumi e cereali dalla Marsica. Azienda agricola a Pescina (AQ).",
    url: "https://parisse.it",
    siteName: "Azienda Agricola Parisse Gianni",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Azienda Agricola Parisse Gianni - Prodotti Agricoli dal Fucino",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Azienda Agricola Parisse Gianni | Prodotti del Fucino",
    description:
      "Vendita diretta di ortaggi, legumi e cereali dalla Marsica. Azienda agricola a Pescina (AQ).",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2f4f3f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

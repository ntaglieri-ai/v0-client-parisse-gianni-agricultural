"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Phone, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Azienda", href: "/azienda-agricola-pescina" },
  { name: "Prodotti", href: "/prodotti-agricoli-marsica" },
  { name: "Contatti", href: "/contatti" },
];

const desktopNavigation = [
  { name: "Home", href: "/" },
  { name: "Azienda", href: "/azienda-agricola-pescina" },
  { name: "Prodotti", href: "/prodotti-agricoli-marsica" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [mobilePopup, setMobilePopup] = useState<"phone" | "email" | null>(null);
  const contactMenuRef = useRef<HTMLDivElement>(null);

  // Close contact menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contactMenuRef.current &&
        !contactMenuRef.current.contains(event.target as Node)
      ) {
        setContactMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile popup when clicking outside
  useEffect(() => {
    function handleClickOutside() {
      if (mobilePopup) {
        setMobilePopup(null);
      }
    }
    if (mobilePopup) {
      // Delay to prevent immediate close on same tap
      const timer = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [mobilePopup]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <nav className="mx-auto flex max-w-7xl items-center px-4 py-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/logo.png"
              alt="Azienda Agricola Gianni Parisse"
              width={200}
              height={75}
              className="h-20 w-auto sm:h-24"
              priority
            />
          </Link>

          {/* Mobile Contact Icons - Center */}
          <div className="flex flex-1 items-center justify-center gap-4 md:hidden">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobilePopup(mobilePopup === "email" ? null : "email");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobilePopup(mobilePopup === "phone" ? null : "phone");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              aria-label="Telefono"
            >
              <Phone className="h-5 w-5" />
            </button>
            <a
              href="https://wa.me/393382726361"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600 transition-colors hover:bg-green-500/20"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {desktopNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA with dropdown */}
          <div className="relative hidden flex-1 items-center justify-end md:flex" ref={contactMenuRef}>
            <button
              type="button"
              onClick={() => setContactMenuOpen(!contactMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Contattaci
            </button>

            {/* Dropdown menu */}
            {contactMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
                <a
                  href="tel:+393382726361"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                  onClick={() => setContactMenuOpen(false)}
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+39 338 272 6361</span>
                </a>
                <a
                  href="mailto:info@parisse.it"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                  onClick={() => setContactMenuOpen(false)}
                >
                  <Mail className="h-4 w-4 text-primary" />
                  <span>info@parisse.it</span>
                </a>
                <a
                  href="https://wa.me/393382726361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                  onClick={() => setContactMenuOpen(false)}
                >
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <div className="space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Popups */}
      {mobilePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 md:hidden">
          <div
            className="mx-4 w-full max-w-sm rounded-xl bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {mobilePopup === "email" && (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold">Email</h3>
                </div>
                <p className="mb-4 text-lg text-foreground">info@parisse.it</p>
                <a
                  href="mailto:info@parisse.it"
                  className="block w-full rounded-lg bg-primary py-3 text-center font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  onClick={() => setMobilePopup(null)}
                >
                  Invia Email
                </a>
              </>
            )}
            {mobilePopup === "phone" && (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold">Telefono</h3>
                </div>
                <p className="mb-4 text-lg text-foreground">+39 338 272 6361</p>
                <a
                  href="tel:+393382726361"
                  className="block w-full rounded-lg bg-primary py-3 text-center font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  onClick={() => setMobilePopup(null)}
                >
                  Chiama Ora
                </a>
              </>
            )}
            <button
              type="button"
              onClick={() => setMobilePopup(null)}
              className="mt-3 block w-full rounded-lg border border-border py-3 text-center font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

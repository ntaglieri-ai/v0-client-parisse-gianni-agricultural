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

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Azienda Agricola Gianni Parisse"
            width={200}
            height={75}
            className="h-16 w-auto sm:h-20"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
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
        <div className="relative hidden md:block" ref={contactMenuRef}>
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
            
            {/* Mobile contact options */}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <p className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contattaci
              </p>
              <a
                href="tel:+393382726361"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Phone className="h-5 w-5 text-primary" />
                <span>+39 338 272 6361</span>
              </a>
              <a
                href="mailto:info@parisse.it"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span>info@parisse.it</span>
              </a>
              <a
                href="https://wa.me/393382726361"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { Mail, Phone } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 text-sm md:justify-end">
        <a
          href="mailto:gianniparisse@libero.it"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">gianniparisse@libero.it</span>
        </a>
        <a
          href="tel:+393382726361"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Phone className="h-4 w-4" />
          <span>+39 338 272 6361</span>
        </a>
      </div>
    </div>
  );
}

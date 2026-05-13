import Link from "next/link";
import { FOOTER_LINKS, CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/pg-ventures.svg"
                alt="PG Ventures"
                height={28}
                className="h-7 w-auto dark:invert"
              />
            </Link>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              Building and delivering<br />intelligent systems.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-block mt-3 text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-fg)] mb-4">
              Company
            </p>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Divisions */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-fg)] mb-4">
              Divisions
            </p>
            <ul className="space-y-3">
              {FOOTER_LINKS.divisions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-fg)] mb-4">
              Legal
            </p>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted-fg)]">
            © {year} {SITE_NAME} LLC. All rights reserved.
          </p>
          <p className="text-sm text-[var(--muted-fg)]">
            PG Technologies · PG Consulting
          </p>
        </div>
      </div>
    </footer>
  );
}

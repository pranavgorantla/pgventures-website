import type { Metadata } from "next";
import { Suspense } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/sections/ContactForm";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with PG Ventures. Whether you're scaling systems or building something new, we'd like to hear from you.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-none mb-6">
              Let&apos;s talk.
            </h1>
            <p className="text-xl text-[var(--muted-fg)] leading-relaxed mb-8">
              Whether you&apos;re scaling systems or building something new, we&apos;d
              like to hear from you.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--muted-fg)] transition-colors font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
              {CONTACT_EMAIL}
            </a>

            <div className="mt-12 space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
                  Divisions
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-sm">PG Technologies</p>
                    <p className="text-sm text-[var(--muted-fg)]">
                      Software, systems, and intelligent tooling
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">PG Consulting</p>
                    <p className="text-sm text-[var(--muted-fg)]">
                      Implementation, integration, and optimization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Suspense>
              <ContactForm />
            </Suspense>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME} LLC.`,
  alternates: { canonical: `${SITE_URL}/legal/terms` },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-[var(--muted-fg)] mb-12">
        Last updated: January 1, 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-[var(--muted-fg)] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using pgventures.co (the &ldquo;Site&rdquo;), you accept and
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            2. Use of the Site
          </h2>
          <p>
            This Site is provided for informational purposes about PG Ventures LLC,
            PG Technologies, and PG Consulting. You may use the Site for lawful
            purposes only. You may not use the Site in any way that violates
            applicable laws or regulations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            3. Intellectual Property
          </h2>
          <p>
            All content on this Site — including text, logos, graphics, and design —
            is the property of PG Ventures LLC and is protected by applicable
            intellectual property laws. You may not reproduce, distribute, or create
            derivative works without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            4. Disclaimer
          </h2>
          <p>
            The Site is provided &ldquo;as is&rdquo; without warranties of any kind, express
            or implied. PG Ventures LLC makes no representations or warranties about
            the accuracy, completeness, or suitability of the information on the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            5. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, PG Ventures LLC shall not be
            liable for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of or inability to use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these Terms of Service at any time.
            Continued use of the Site following any changes constitutes acceptance
            of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            7. Contact
          </h2>
          <p>
            Questions about these Terms should be directed to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--foreground)] underline hover:no-underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

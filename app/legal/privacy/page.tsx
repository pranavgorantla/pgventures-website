import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME} LLC.`,
  alternates: { canonical: `${SITE_URL}/legal/privacy` },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-[var(--muted-fg)] mb-12">
        Last updated: January 1, 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-[var(--muted-fg)] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us when you submit our
            contact form, including your name, email address, company name (optional),
            and the content of your message. We do not collect payment information
            or sensitive personal data through this website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information you provide to respond to your inquiries,
            communicate with you about our services, and improve our website
            experience. We do not sell or share your personal information with
            third parties for their marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            3. Analytics
          </h2>
          <p>
            We use Vercel Analytics and Vercel Speed Insights to understand how
            visitors interact with our website. These tools collect anonymized
            usage data. No personally identifiable information is collected through
            these analytics tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            4. Data Retention
          </h2>
          <p>
            Contact form submissions are retained for as long as necessary to
            respond to your inquiry and for legitimate business purposes. You may
            request deletion of your information at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            5. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. To exercise these rights, please contact us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--foreground)] underline hover:no-underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
            6. Contact
          </h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--foreground)] underline hover:no-underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p className="mt-3">
            {SITE_NAME} LLC
            <br />
            United States
          </p>
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/HomeHero";
import { DivisionPanels } from "@/components/sections/DivisionPanels";
import { TheLoop } from "@/components/sections/TheLoop";
import { RecentWork } from "@/components/sections/RecentWork";
import { Manifesto } from "@/components/sections/Manifesto";
import { HomeCTA } from "@/components/sections/HomeCTA";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Building and Delivering Intelligent Systems`,
  description:
    "PG Ventures is a technology-driven company with two divisions: PG Technologies builds scalable software and AI systems, while PG Consulting designs and implements them for modern businesses.",
  alternates: { canonical: SITE_URL },
  openGraph: { url: SITE_URL },
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "PG Ventures LLC",
            legalName: "PG Ventures LLC",
            url: SITE_URL,
            email: CONTACT_EMAIL,
            subOrganization: [
              {
                "@type": "Organization",
                name: "PG Technologies",
                url: `${SITE_URL}/technologies`,
                description:
                  "Software, automation tools, and intelligent systems.",
              },
              {
                "@type": "Organization",
                name: "PG Consulting",
                url: `${SITE_URL}/consulting`,
                description:
                  "System design, implementation, and optimization for businesses.",
              },
            ],
          }),
        }}
      />
      <HomeHero />
      <DivisionPanels />
      <TheLoop />
      <RecentWork />
      <Manifesto />
      <HomeCTA />
    </>
  );
}

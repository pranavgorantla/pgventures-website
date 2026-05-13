import type { Metadata } from "next";
import { Suspense } from "react";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/sections/ContactForm";
import { PlatformLogos } from "@/components/sections/PlatformLogos";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { ConsultingHeroVisual } from "@/components/sections/ConsultingHeroVisual";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "PG Consulting",
  description:
    "PG Consulting partners with businesses to design, implement, and optimize systems — from CRM and ERP to data pipelines, automation, and AI. Fix your systems. Scale your business.",
  alternates: { canonical: `${SITE_URL}/consulting` },
  openGraph: { url: `${SITE_URL}/consulting` },
};

const SERVICES = [
  {
    title: "System Strategy & Tool Selection",
    items: ["Identify workflow gaps", "Recommend tools and platforms", "Design scalable systems"],
  },
  {
    title: "Implementation & Integration",
    items: ["CRM / ERP setup", "Data pipelines and ETL", "System integrations"],
  },
  {
    title: "Automation & AI Enablement",
    items: ["Workflow automation", "AI-powered improvements", "Intelligent systems"],
  },
  {
    title: "Optimization & Scaling",
    items: ["Cleanup and restructuring", "Performance improvements", "Ongoing support"],
  },
];

const STEPS = [
  {
    number: "01",
    title: "Assess",
    description: "We evaluate your current systems, workflows, and gaps.",
  },
  {
    number: "02",
    title: "Design",
    description: "We recommend the right tools and system architecture.",
  },
  {
    number: "03",
    title: "Implement",
    description: "We build, integrate, and deploy the solution.",
  },
  {
    number: "04",
    title: "Optimize",
    description: "We refine and improve systems for long-term performance.",
  },
];

export default function ConsultingPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[3px] w-8 rounded-full bg-consulting" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-widest text-consulting">
                PG Consulting
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-none mb-6 max-w-4xl">
              Fix your systems. Automate your workflows. Scale your business.
            </h1>
            <p className="text-xl text-[var(--muted-fg)] max-w-2xl mb-10 leading-relaxed">
              We partner with companies to design, implement, and optimize the systems
              they rely on.
            </p>
            <Button href="#contact" size="lg" variant="consulting">
              Start a Project
            </Button>

            {/* Mobile visual — stacks below CTA, hidden on md+ */}
            <div className="md:hidden mt-10 flex justify-center">
              <div className="w-full max-w-[280px]">
                <ConsultingHeroVisual delay={0.4} />
              </div>
            </div>
          </FadeIn>

          {/* Desktop/tablet visual */}
          <div className="hidden md:flex items-center justify-center">
            <ConsultingHeroVisual />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Most systems don&apos;t break —{" "}
              <span className="text-[var(--muted-fg)]">they slow you down.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[var(--muted-fg)] leading-relaxed text-lg">
              Disconnected tools, manual processes, and messy data create friction
              across your business. Teams spend more time working around systems
              than benefiting from them.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Solution */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              We design and implement systems that actually work.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[var(--muted-fg)] leading-relaxed text-lg">
              From selecting the right tools to building and integrating them, we
              handle the full process — so your systems support your business, not
              slow it down.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
            Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            How it works
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
          {STEPS.map((step) => (
            <FadeInItem key={step.number}>
              <div className="bg-[var(--background)] p-8 h-full">
                <span className="font-mono text-xs text-consulting mb-6 block">
                  {step.number}
                </span>
                <h3 className="font-semibold text-lg tracking-tight mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      <PlatformLogos />

      {/* Services */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
            Services
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            What we do
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
          {SERVICES.map((service) => (
            <FadeInItem key={service.title}>
              <div className="bg-[var(--background)] p-8 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-consulting flex-shrink-0" aria-hidden="true" />
                  <h3 className="font-semibold tracking-tight">{service.title}</h3>
                </div>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-[var(--muted-fg)] flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--muted-fg)] flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      <EngagementModels />

      {/* Positioning pull-quote */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn>
          <blockquote className="max-w-3xl">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug text-[var(--muted-fg)]">
              &ldquo;We don&apos;t just implement systems — we partner with you to design,
              build, and optimize them for long-term success.&rdquo;
            </p>
          </blockquote>
        </FadeIn>
      </section>

      {/* Contact form */}
      <section
        id="contact"
        className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              Ready to improve how your business operates?
            </h2>
            <p className="text-[var(--muted-fg)] leading-relaxed text-lg">
              Let&apos;s build systems that actually work.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Suspense>
              <ContactForm defaultTeam="consulting" />
            </Suspense>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

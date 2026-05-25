import type { Metadata } from "next";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { TechnologiesHeroVisual } from "@/components/sections/TechnologiesHeroVisual";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "PG Technologies",
  description:
    "PG Technologies builds scalable software, automation tools, and intelligent systems designed for real-world use. From data infrastructure to AI-powered platforms.",
  alternates: { canonical: `${SITE_URL}/technologies` },
  openGraph: { url: `${SITE_URL}/technologies` },
};

const SERVICES = [
  {
    title: "Software & Applications",
    description:
      "Custom-built tools and platforms designed for usability and scale. From internal tools to customer-facing applications.",
  },
  {
    title: "Data & System Infrastructure",
    description:
      "Systems that manage, move, and structure data efficiently across environments. Built for reliability and growth.",
  },
  {
    title: "Automation & AI Systems",
    description:
      "Intelligent systems that reduce manual work and enhance decision-making. Practical AI that delivers measurable outcomes.",
  },
];

const FOCUS_AREAS = [
  "AI-powered systems",
  "Workflow automation",
  "Data infrastructure",
  "System integration platforms",
  "Custom software development",
  "Intelligent tooling",
];

export default function TechnologiesPage() {
  return (
    <>
      {/* Hero — page background */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[3px] w-8 rounded-full bg-tech" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-widest text-tech">
                PG Technologies
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-none mb-6 max-w-3xl">
              Build systems that scale.
            </h1>
            <p className="text-xl text-[var(--muted-fg)] max-w-2xl mb-10 leading-relaxed">
              We design and develop software, automation tools, and intelligent
              systems built for real-world use.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="#what-we-build" size="lg" variant="tech">
                Explore Our Technology
              </Button>
              <Button href="/contact?team=technologies" size="lg" variant="secondary">
                Join the Build
              </Button>
            </div>
            <div className="md:hidden mt-10 flex justify-center">
              <div className="w-full max-w-[280px]">
                <TechnologiesHeroVisual delay={0.4} />
              </div>
            </div>
          </FadeIn>
          <div className="hidden md:flex items-center justify-center">
            <TechnologiesHeroVisual />
          </div>
        </div>
      </section>

      {/* Positioning — tinted */}
      <div className="section-tinted border-t border-[var(--border)]">
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Not just ideas.{" "}
                <span className="text-[var(--muted-fg)]">Systems that work.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-[var(--muted-fg)] leading-relaxed text-lg">
                PG Technologies focuses on building practical, scalable systems —
                from internal tools to intelligent platforms. Everything we develop
                is designed to solve real problems and operate in real environments.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* What We're Building — page background */}
      <section
        id="what-we-build"
        className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <FadeIn className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
            Focus areas
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            What we&apos;re building
          </h2>
        </FadeIn>
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
          {SERVICES.map((service) => (
            <FadeInItem key={service.title}>
              <div className="bg-[var(--background)] p-8 h-full">
                <div className="w-1.5 h-1.5 rounded-full bg-tech mb-6" aria-hidden="true" />
                <h3 className="font-semibold tracking-tight mb-3">{service.title}</h3>
                <p className="text-sm text-[var(--muted-fg)] leading-relaxed">{service.description}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      {/* R&D Focus — tinted */}
      <div className="section-tinted border-t border-[var(--border)]">
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">R&amp;D</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">Areas of focus</h2>
              <p className="text-[var(--muted-fg)] leading-relaxed">
                We invest in building systems that sit at the intersection of data,
                automation, and intelligence.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-full text-[var(--muted-fg)] hover:border-tech hover:text-tech transition-colors"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Connection to Consulting — page background */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn>
          <div className="border border-[var(--border)] rounded-xl p-10 md:p-16">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-4">
              The connection
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              Built from real-world problems
            </h2>
            <p className="text-[var(--muted-fg)] leading-relaxed text-lg mb-8 max-w-2xl">
              Our technology is shaped by real implementation work. Problems
              identified through PG Consulting directly inform what we build —
              ensuring our systems are practical, relevant, and ready to deploy.
            </p>
            <Button href="/consulting" variant="secondary" size="md">
              See PG Consulting →
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Vision — tinted */}
      <div className="section-tinted border-t border-[var(--border)]">
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeIn className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-4">
              Vision
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              Designed for long-term scale
            </h2>
            <p className="text-[var(--muted-fg)] leading-relaxed text-lg">
              We&apos;re building systems and tools that can grow beyond individual use
              cases — products that can be expanded, reused, and scaled across
              industries.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Coming Soon — page background */}
      <section className="border-t border-[var(--border)] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-tech animate-pulse" aria-hidden="true" />
            <p className="text-sm text-[var(--muted-fg)] font-mono">
              Products in development. More soon.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Final CTA — tinted */}
      <div className="section-tinted border-t border-[var(--border)]">
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeIn className="text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Want to build something with us?
            </h2>
            <p className="text-[var(--muted-fg)] mb-10 text-lg">
              We&apos;re building systems that matter. Join us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/contact?team=technologies" size="lg" variant="tech">
                Join the Build
              </Button>
              <Button href="#what-we-build" size="lg" variant="secondary">
                Explore Our Technology
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}

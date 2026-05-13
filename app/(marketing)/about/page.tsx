import type { Metadata } from "next";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "PG Ventures is a technology-driven parent company built around one thesis: consulting work surfaces real problems, and those problems inform what we build.",
  alternates: { canonical: `${SITE_URL}/about` },
};

const VALUES = [
  {
    title: "Practical over theoretical.",
    description:
      "We build systems that work in the real world — not systems that work in demos. Every product and engagement is grounded in real use cases.",
  },
  {
    title: "Integrated, not siloed.",
    description:
      "Our two arms share knowledge. What we learn implementing shapes what we build. What we build makes us better at implementing.",
  },
  {
    title: "Quality over quantity.",
    description:
      "We'd rather do a few things exceptionally well than many things adequately. That applies to clients, products, and partnerships.",
  },
  {
    title: "Long-term thinking.",
    description:
      "We build systems designed to scale. We take on clients we can grow with. We don't optimize for the short term.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-none mb-8 max-w-3xl">
            One venture.{" "}
            <span className="text-[var(--muted-fg)]">Two arms. One mission.</span>
          </h1>
        </FadeIn>
      </section>

      {/* Story */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <FadeIn className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)]">
              Our story
            </p>
          </FadeIn>
          <div className="lg:col-span-8 space-y-6">
            <FadeIn>
              <p className="text-lg text-[var(--muted-fg)] leading-relaxed">
                PG Ventures was built around a simple thesis: the best technology
                comes from understanding real problems. Not hypothetical ones. Not
                market research. Real friction, encountered in real businesses, by
                people who have to work around broken systems every day.
              </p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <p className="text-lg text-[var(--muted-fg)] leading-relaxed">
                PG Consulting exists to fix those systems. We work directly with
                businesses to design, implement, and optimize the tools and processes
                they rely on. That work puts us in close contact with where systems
                fail — and where better ones could succeed.
              </p>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="text-lg text-[var(--muted-fg)] leading-relaxed">
                PG Technologies turns those insights into products. The problems we
                encounter on the consulting side directly inform what we build — so
                our technology isn&apos;t speculative. It&apos;s grounded in the specific,
                recurring gaps we&apos;ve seen businesses struggle with.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
            Principles
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            How we work
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
          {VALUES.map((value) => (
            <FadeInItem key={value.title}>
              <div className="bg-[var(--background)] p-8 h-full">
                <h3 className="font-semibold tracking-tight mb-3">{value.title}</h3>
                <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            Want to work with us?
          </h2>
          <p className="text-[var(--muted-fg)] mb-8 text-lg">
            Whether you&apos;re building something new or improving what you have.
          </p>
          <Button href="/contact" size="lg" variant="primary">
            Get in Touch
          </Button>
        </FadeIn>
      </section>
    </>
  );
}

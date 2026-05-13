import Link from "next/link";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

const MODELS = [
  {
    number: "01",
    title: "Project-based",
    description:
      "Fixed-scope deliverables with a defined start and end. Right for teams with a clear problem to solve and a need for fast, measurable output.",
    duration: "4–12 weeks",
    pricing: "Fixed fee",
  },
  {
    number: "02",
    title: "Embedded partnership",
    description:
      "We operate as a fractional systems team inside your organization — attending standups, owning workstreams, and moving at your pace.",
    duration: "3–12 months",
    pricing: "Monthly retainer",
  },
  {
    number: "03",
    title: "Advisory & strategy",
    description:
      "Structured guidance for decision-makers navigating a tool selection, migration, or architecture choice. We bring the map; you steer.",
    duration: "1–4 weeks",
    pricing: "Hourly or flat rate",
  },
];

export function EngagementModels() {
  return (
    <section
      className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Engagement models"
    >
      <FadeIn className="mb-12">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
          How we engage
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Choose the model that fits.
        </h2>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
        {MODELS.map((model) => (
          <FadeInItem key={model.number} className="h-full">
            <div className="bg-[var(--background)] p-8 flex flex-col h-full">
              <span className="font-mono text-xs text-consulting mb-6 block">
                {model.number}
              </span>
              <h3 className="font-semibold tracking-tight mb-3">{model.title}</h3>
              <p className="text-sm text-[var(--muted-fg)] leading-relaxed flex-1 mb-6">
                {model.description}
              </p>
              <div className="flex flex-col gap-1 pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--muted-fg)] flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-[var(--muted-fg)]">{model.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--muted-fg)] flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-[var(--muted-fg)]">{model.pricing}</span>
                </div>
              </div>
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>

      <FadeIn>
        <div className="mt-8 flex items-center gap-2">
          <Link
            href="#contact"
            className="text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
          >
            Not sure which fits?
          </Link>
          <span className="text-sm text-[var(--muted-fg)]" aria-hidden="true">→</span>
          <Link
            href="#contact"
            className="text-sm font-medium text-consulting hover:opacity-85 transition-opacity"
          >
            Let&apos;s talk through it.
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

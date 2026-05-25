import Link from "next/link";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { type ReactNode } from "react";

const MODELS = [
  {
    number: "01",
    title: "Project-based",
    description:
      "A scoped engagement with a defined start, end, and clear deliverable. Right for teams with a specific problem to solve who need fast, measurable output without the overhead of an ongoing relationship.",
    duration: "4–12 weeks",
    pricing: "Fixed fee",
    icon: <ProjectIcon />,
  },
  {
    number: "02",
    title: "Embedded partnership",
    description:
      "We operate as a fractional systems team inside your organization — attending standups, owning workstreams, shipping alongside your people. Designed for complex or fast-moving initiatives where deep context matters.",
    duration: "3–12 months",
    pricing: "Monthly retainer",
    icon: <EmbeddedIcon />,
  },
  {
    number: "03",
    title: "Advisory & strategy",
    description:
      "Structured guidance for decision-makers navigating a tool selection, migration, or architecture choice. We bring the map; you steer. Best for leaders who need a clear-eyed outside perspective without a full buildout.",
    duration: "1–4 weeks",
    pricing: "Hourly or flat rate",
    icon: <AdvisoryIcon />,
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
            <ModelCard model={model} />
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

function ModelCard({
  model,
}: {
  model: {
    number: string;
    title: string;
    description: string;
    duration: string;
    pricing: string;
    icon: ReactNode;
  };
}) {
  return (
    <div className="bg-[var(--surface)] p-8 flex flex-col h-full relative">
      {/* Left accent strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-consulting"
        style={{ opacity: 0.25 }}
        aria-hidden="true"
      />

      {/* Header: number + icon */}
      <div className="flex items-center justify-between mb-7">
        <span className="font-mono text-xs text-consulting">{model.number}</span>
        <span className="text-consulting opacity-70">{model.icon}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold tracking-tight text-[1.0625rem] mb-3">{model.title}</h3>

      {/* Description */}
      <p className="text-sm text-[var(--muted-fg)] leading-relaxed flex-1 mb-6">
        {model.description}
      </p>

      {/* Footer quick-facts */}
      <div className="flex flex-col gap-1.5 pt-5 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span
            className="w-1 h-1 rounded-full bg-consulting flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs text-[var(--muted-fg)]">{model.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-1 h-1 rounded-full bg-consulting flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs text-[var(--muted-fg)]">{model.pricing}</span>
        </div>
      </div>
    </div>
  );
}

// ── Icons — geometric, minimal, monochrome ────────────────────────────────────

// 01 Project-based: bounded scope / deliverable (flag with staff)
function ProjectIcon() {
  return (
    <svg viewBox="0 0 18 18" width="17" height="17" fill="none" aria-hidden="true">
      <path
        d="M4 2v14M4 2h9l-3.5 4.5L13 11H4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 02 Embedded partnership: two overlapping circles (integration)
function EmbeddedIcon() {
  return (
    <svg viewBox="0 0 18 18" width="17" height="17" fill="none" aria-hidden="true">
      <circle cx="6.5"  cy="9" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11.5" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// 03 Advisory & strategy: compass — crosshair + center dot (direction/navigation)
function AdvisoryIcon() {
  return (
    <svg viewBox="0 0 18 18" width="17" height="17" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 2.5v2.25M9 13.25V15.5M2.5 9h2.25M13.25 9H15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="9" r="1.75" fill="currentColor" />
    </svg>
  );
}

import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

// Inline SVG wordmarks — placeholder representations using currentColor.
// These adapt to dark/light mode automatically and make no use of licensed assets.

function Wordmark({ name, wide }: { name: string; wide?: boolean }) {
  const w = wide ? 140 : 100;
  return (
    <svg
      viewBox={`0 0 ${w} 28`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={name}
      className="h-7 w-auto"
    >
      <text
        x={w / 2}
        y="14"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="currentColor"
        fontSize="12"
        fontWeight="500"
        fontFamily="inherit"
        letterSpacing="0.01em"
      >
        {name}
      </text>
    </svg>
  );
}

const PLATFORMS: { name: string; wide?: boolean }[] = [
  { name: "Salesforce" },
  { name: "HubSpot" },
  { name: "Dynamics 365", wide: true },
  { name: "NetSuite" },
  { name: "Snowflake" },
  { name: "Databricks", wide: true },
  { name: "Airbyte" },
  { name: "Segment" },
  { name: "Zapier" },
  { name: "n8n" },
  { name: "OpenAI" },
  { name: "Anthropic" },
];

export function PlatformLogos() {
  return (
    <section
      className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Platforms we work with"
    >
      <FadeIn className="mb-12">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
          Platforms &amp; tools
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Built on what you already use.
        </h2>
      </FadeIn>

      <FadeInStagger
        staggerDelay={0.05}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[var(--border)] rounded-xl overflow-hidden"
      >
        {PLATFORMS.map((platform) => (
          <FadeInItem key={platform.name} className="h-full">
            <div className="bg-[var(--background)] p-6 flex items-center justify-center h-full min-h-[80px] text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors">
              <Wordmark name={platform.name} wide={platform.wide} />
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>

      <FadeIn>
        <p className="mt-6 font-mono text-xs text-[var(--muted-fg)]">
          Common platforms in our toolkit. Not an endorsement or client list — specifics available on request.
        </p>
      </FadeIn>
    </section>
  );
}

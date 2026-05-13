import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

export function Manifesto() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-t border-[var(--border)]"
      aria-label="Our approach"
    >
      <FadeIn className="max-w-3xl mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Built to create and deliver the systems that power modern businesses.
        </h2>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)]">
        <FadeInItem>
          <div className="bg-[var(--background)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[3px] w-5 rounded-full bg-tech" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-widest text-tech">
                Build
              </span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-3">
              Software and systems engineered for scale.
            </h3>
            <p className="text-[var(--muted-fg)] leading-relaxed">
              PG Technologies develops practical software, automation tools, and
              intelligent systems built for real-world use. Every system we build
              is designed to grow — across use cases, industries, and scale.
            </p>
          </div>
        </FadeInItem>

        <FadeInItem>
          <div className="bg-[var(--background)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[3px] w-5 rounded-full bg-consulting" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-widest text-consulting">
                Deliver
              </span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-3">
              Implementation that turns strategy into execution.
            </h3>
            <p className="text-[var(--muted-fg)] leading-relaxed">
              PG Consulting partners with businesses to design, implement, and
              optimize the systems they rely on. From selecting the right tools to
              building and integrating them, we handle the full process.
            </p>
          </div>
        </FadeInItem>
      </FadeInStagger>
    </section>
  );
}

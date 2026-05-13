import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";

export function HomeCTA() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
      aria-label="Call to action"
    >
      <FadeIn className="border border-[var(--border)] rounded-xl p-12 md:p-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          Ready to build or deliver?
        </h2>
        <p className="text-[var(--muted-fg)] text-lg mb-10 max-w-xl mx-auto">
          Whether you need systems built or implemented, we&apos;d like to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/contact" size="lg" variant="primary">
            Get in Touch
          </Button>
          <Button href="/about" size="lg" variant="secondary">
            Learn About Us
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}

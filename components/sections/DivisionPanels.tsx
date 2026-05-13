"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";

export function DivisionPanels() {
  return (
    <section
      id="divisions"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      aria-label="Our divisions"
    >
      <FadeIn className="text-center mb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
          Two divisions
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          What we do
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
        <DivisionPanel
          eyebrow="Technologies"
          title="Build the Future"
          description="Building scalable software, applications, and intelligent systems that solve real problems and operate in real environments."
          href="/technologies"
          cta="Explore Technologies"
          accentClass="bg-tech"
          accentTextClass="text-tech"
          hoverBgClass="group-hover:bg-tech/[0.04]"
          services={[
            "Software & Applications",
            "Data Infrastructure",
            "Automation & AI Systems",
          ]}
          delay={0}
        />
        <DivisionPanel
          eyebrow="Consulting"
          title="Deliver Results"
          description="Designing, implementing, and optimizing systems for modern businesses — from strategy to execution."
          href="/consulting"
          cta="Explore Consulting"
          accentClass="bg-consulting"
          accentTextClass="text-consulting"
          hoverBgClass="group-hover:bg-consulting/[0.04]"
          services={[
            "System Strategy & Tool Selection",
            "Implementation & Integration",
            "Optimization & Scaling",
          ]}
          delay={0.08}
        />
      </div>
    </section>
  );
}

interface DivisionPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  accentClass: string;
  accentTextClass: string;
  hoverBgClass: string;
  services: string[];
  delay: number;
}

function DivisionPanel({
  eyebrow,
  title,
  description,
  href,
  cta,
  accentClass,
  accentTextClass,
  hoverBgClass,
  services,
  delay,
}: DivisionPanelProps) {
  const [hovered, setHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <FadeIn delay={delay}>
      <Link
        href={href}
        className={`group relative flex flex-col p-8 md:p-12 bg-[var(--background)] transition-colors duration-300 h-full min-h-[440px] ${hoverBgClass}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`${eyebrow}: ${title}`}
      >
        {/* Eyebrow accent bar */}
        <div className="flex items-center gap-3 mb-6">
          <motion.span
            className={`inline-block h-[3px] rounded-full ${accentClass}`}
            animate={
              shouldReduceMotion
                ? { width: hovered ? 32 : 20 }
                : { width: hovered ? 32 : 20 }
            }
            transition={{ duration: 0.2 }}
          />
          <span className={`text-xs font-medium uppercase tracking-widest ${accentTextClass}`}>
            {eyebrow}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
          {title}
        </h3>

        <p className="text-[var(--muted-fg)] leading-relaxed mb-8 max-w-md">
          {description}
        </p>

        <ul className="flex-1 space-y-2 mb-8">
          {services.map((service) => (
            <li key={service} className="flex items-center gap-2 text-sm text-[var(--muted-fg)]">
              <span className={`w-1 h-1 rounded-full flex-shrink-0 ${accentClass}`} aria-hidden="true" />
              {service}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 mt-auto">
          <span className={`text-sm font-medium ${accentTextClass}`}>{cta}</span>
          <motion.span
            animate={shouldReduceMotion ? {} : { x: hovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
            className={accentTextClass}
            aria-hidden="true"
          >
            →
          </motion.span>
        </div>
      </Link>
    </FadeIn>
  );
}

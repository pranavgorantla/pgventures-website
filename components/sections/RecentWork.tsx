"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

type Division = "consulting" | "tech";

interface CaseStudy {
  category: string;
  division: Division;
  tags: string[];
  title: string;
  description: string;
  cta: string;
  href: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    category: "SaaS / B2B",
    division: "consulting",
    tags: ["Consulting", "Data Engineering"],
    title: "Data infrastructure rebuild",
    description:
      "Replaced a brittle ETL pipeline serving 40+ internal dashboards. New architecture cut data latency by 80% and eliminated weekly outages.",
    cta: "Read implementation",
    href: "#",
  },
  {
    category: "Logistics",
    division: "consulting",
    tags: ["Consulting", "CRM", "Automation"],
    title: "CRM consolidation + automation",
    description:
      "Migrated three disconnected CRMs into a unified Salesforce instance with automated lead routing. Reduced duplicate records by 94% and saved the ops team 12+ hours/week.",
    cta: "Read implementation",
    href: "#",
  },
  {
    category: "Internal Tools",
    division: "tech",
    tags: ["Technologies", "Software"],
    title: "Custom platform development",
    description:
      "Built a custom internal operations platform replacing four legacy tools. Currently in production at the client; preparing for productization in 2026.",
    cta: "Project details",
    href: "#",
  },
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [hovered, setHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isConsulting = study.division === "consulting";
  const hoverBg = isConsulting ? "hover:bg-consulting/[0.04]" : "hover:bg-tech/[0.04]";
  const ctaColor = isConsulting ? "text-consulting" : "text-tech";
  const tagBorder = isConsulting ? "border-consulting/30 text-consulting" : "border-tech/30 text-tech";

  return (
    <Link
      href={study.href}
      className={`group flex flex-col h-full bg-[var(--background)] p-8 transition-colors duration-200 ${hoverBg}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={study.title}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <span className="font-mono text-xs text-[var(--muted-fg)]">{study.category}</span>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {study.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 text-[10px] font-mono border rounded-full uppercase tracking-wider ${tagBorder}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold tracking-tight mb-3">{study.title}</h3>
        <p className="text-sm text-[var(--muted-fg)] leading-relaxed flex-1 mb-6">
          {study.description}
        </p>
      </div>

      <div className={`flex items-center gap-1.5 text-sm font-medium ${ctaColor}`}>
        <span>{study.cta}</span>
        <motion.span
          animate={{ x: !shouldReduceMotion && hovered ? 4 : 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          aria-hidden="true"
        >
          →
        </motion.span>
      </div>
    </Link>
  );
}

export function RecentWork() {
  return (
    <section
      className="border-t border-[var(--border)] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Recent work"
    >
      <FadeIn className="mb-12">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">
          Recent work
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          What we&apos;ve shipped.
        </h2>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
        {CASE_STUDIES.map((study) => (
          <FadeInItem key={study.title} className="h-full">
            <CaseStudyCard study={study} />
          </FadeInItem>
        ))}
      </FadeInStagger>

      <FadeIn>
        <p className="mt-8 font-mono text-xs text-[var(--muted-fg)]">
          More case studies coming soon.
        </p>
      </FadeIn>
    </section>
  );
}

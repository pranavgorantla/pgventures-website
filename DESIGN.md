# PG Ventures — Design System Reference

This document is the authoritative design reference for the PG Ventures website. An AI agent reading only this file should be able to produce visually consistent additions without seeing any other source file.

---

## 1. Color Tokens

The site uses Tailwind CSS v4 with tokens defined in `app/globals.css`. Dark mode is class-based (`.dark` class, managed by next-themes). There are **no hardcoded hex values in component files** — all components reference CSS custom properties or the named Tailwind color tokens below.

### Semantic tokens

| Token | CSS variable | Light (`#hex`) | Dark (`#hex`) | Tailwind class |
|---|---|---|---|---|
| Background | `--background` | `#ffffff` | `#0a0a0a` | `bg-background`, `text-[var(--background)]` |
| Foreground | `--foreground` | `#0a0a0a` | `#fafafa` | `text-[var(--foreground)]`, `bg-[var(--foreground)]` |
| Surface | `--surface` | `#f5f5f5` | `#171717` | `bg-[var(--surface)]` |
| Surface Elevated | `--surface-elevated` | `#ffffff` | `#1c1c1c` | `bg-[var(--surface-elevated)]` |
| Border | `--border` | `#e5e5e5` | `#262626` | `border-[var(--border)]`, `bg-[var(--border)]` |
| Muted | `--muted` | `#f5f5f5` | `#171717` | `bg-[var(--muted)]` |
| Muted Foreground | `--muted-fg` | `#737373` | `#a3a3a3` | `text-[var(--muted-fg)]` |

### Division accent colors (static — identical in both modes)

| Name | Hex | Hover Hex | Tailwind token | Tailwind class |
|---|---|---|---|---|
| Tech (blue) | `#3b82f6` | `#2563eb` | `--color-tech` / `--color-tech-hover` | `bg-tech`, `text-tech`, `hover:bg-tech-hover` |
| Consulting (green) | `#10b981` | `#059669` | `--color-consulting` / `--color-consulting-hover` | `bg-consulting`, `text-consulting`, `hover:bg-consulting-hover` |

### Accent usage rules

- **Tech blue** is used only on PG Technologies pages and on the homepage Technologies panel.
- **Consulting green** is used only on PG Consulting pages and on the homepage Consulting panel.
- Accent colors appear in: eyebrow bars (`h-[3px] rounded-full bg-tech`), eyebrow text (`text-tech`), dot bullets (`bg-tech`), accent buttons (`variant="tech"`), focus-area pill hover states.
- Use `bg-tech/[0.04]` and `bg-consulting/[0.04]` (4% opacity) only for panel background hover states — not for fills or decorative blocks.
- Use `bg-consulting/10` only for success/confirmation icon backgrounds (one-off, not a pattern to repeat).

### Colors NOT used

There are no gradients, no colored backgrounds, no tinted sections, no glow effects, no shadows. The only decorative element on the site is the hero grid (described in §6). Do not introduce any of these.

---

## 2. Typography

### Font families

| Role | Family | CSS variable | Tailwind utility |
|---|---|---|---|
| Body / UI | Geist Sans | `--font-geist-sans` | `font-sans` (default on `body`) |
| Code / Mono labels | Geist Mono | `--font-geist-mono` | `font-mono` |

Both fonts are loaded via `next/font/google` with `display: swap` and injected as CSS variables. The `body` applies `antialiased font-sans` globally.

### Type scale

The site uses responsive Tailwind utility classes, not CSS `clamp()`. Sizes step up at `sm:` and `md:` breakpoints.

| Role | Classes | When to use |
|---|---|---|
| **Homepage hero h1** | `text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-none` | Homepage hero only |
| **Division page hero h1** | `text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-none` | Inner page heroes (Technologies, Consulting, About) |
| **Manifesto headline** | `text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight` | Large standalone pull-quotes without eyebrow |
| **Section h2 (standard)** | `text-3xl sm:text-4xl font-semibold tracking-tight` | Section titles on the homepage |
| **Section h2 (compact)** | `text-2xl sm:text-3xl font-semibold tracking-tight` | Section titles on inner pages |
| **Card/panel h3 (large)** | `text-2xl sm:text-3xl font-semibold tracking-tight` | Division panel titles |
| **Card/panel h3 (standard)** | `text-xl font-semibold tracking-tight` | Manifesto card titles |
| **Card/panel h3 (small)** | `font-semibold tracking-tight` (no size override, inherits `text-base`) | Service card titles, values grid |
| **Body lead** | `text-xl sm:text-2xl text-[var(--muted-fg)] font-normal tracking-tight` | Hero subheadline (homepage) |
| **Body large** | `text-lg text-[var(--muted-fg)] leading-relaxed` | Section body copy |
| **Body standard** | `text-base text-[var(--muted-fg)] leading-relaxed` | Panel descriptions |
| **Body small** | `text-sm text-[var(--muted-fg)] leading-relaxed` | Service list items, card body |
| **Eyebrow** | `text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)]` | Section labels in muted color |
| **Eyebrow (accent)** | `text-xs font-medium uppercase tracking-widest text-tech` / `text-consulting` | Division labels with accent color |
| **Caption / Mono label** | `font-mono text-xs text-[var(--muted-fg)]` | Step numbers (01, 02…), status lines |
| **Pull-quote** | `text-2xl sm:text-3xl font-semibold tracking-tight leading-snug text-[var(--muted-fg)]` | Blockquote positioning statements |
| **Navigation links** | `text-sm` | Header nav, footer links |
| **Mobile nav links** | `text-2xl font-medium` | Mobile overlay only |

### Rules

- `font-semibold` is used for all headings (h1–h3). The site does not use `font-bold` or `font-light`.
- `tracking-tight` is always paired with headings. `tracking-widest` is always paired with eyebrows.
- `leading-none` is for hero headlines. `leading-tight` for manifesto. `leading-relaxed` for all body text.
- `font-normal` is default body weight; only omit it when it would be redundant.
- Do not introduce `text-xl` or larger for body text unless it is a designated "body lead" directly under a hero h1.
- Partial muted contrast in headlines: use `<span className="text-[var(--muted-fg)]">secondary phrase</span>` inline within a heading to de-emphasize a portion. Example: `"Not just ideas. <span muted>Systems that work.</span>"`.

---

## 3. Spacing System

### Container

All sections share the same container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

This is non-negotiable. Never use a narrower or wider max-width for section content.

### Content max-widths (within the container)

| Purpose | Class |
|---|---|
| Hero title | `max-w-4xl` or `max-w-3xl` |
| Body text under hero | `max-w-2xl` |
| Manifesto intro heading | `max-w-3xl` |
| Vision / long-form text | `max-w-3xl` |

### Section vertical rhythm

| Pattern | Classes | Context |
|---|---|---|
| Standard section padding | `py-24` | Most sections |
| Generous section padding | `py-24 md:py-32` | TheLoop, Manifesto (homepage narrative sections) |
| Reduced section padding | `py-16` | Short utility sections (status/coming-soon rows) |
| Inner page hero (clears header) | `pt-32 pb-24` | All inner page heroes |
| Homepage hero | `min-h-screen pt-16 pb-24` with `flex flex-col items-center justify-center` | Homepage only |

### Section header spacing

When a section has an eyebrow + heading before a content grid:
- `mb-12` between the header block and the grid
- `mb-3` between eyebrow and h2
- `mb-4` or `mb-6` between h2 and body paragraph

### Card/panel internal padding

- Standard panel: `p-8` (mobile first), `md:p-12` (desktop)
- Small content panel: `p-8` (no responsive change)
- Standalone bordered card: `p-10 md:p-16` or `p-12 md:p-20`

### Gaps

| Layout | Gap |
|---|---|
| Two-column narrative (heading + body) | `gap-16` |
| Division panels (seamless grid) | `gap-px` (border bleeds through) |
| Button groups | `gap-3` |
| Eyebrow accent bar + label | `gap-3` |
| Service list items | `space-y-2` |
| Footer link columns | `space-y-3` |
| Footer column grid | `gap-8` |

### Breakpoints (Tailwind v4 defaults)

| Name | Min width |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px (not actively used) |

---

## 4. Component Patterns

### Button

Five variants, three sizes. Always rendered as `<Button>` from `components/ui/Button.tsx`. Renders as `<Link>` when `href` is provided.

**Base classes** (all variants): `inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none`

| Variant | Classes | Use when |
|---|---|---|
| `primary` | `bg-[var(--foreground)] text-[var(--background)] hover:opacity-85 focus-visible:opacity-85` | Primary CTA; use sparingly (one per section) |
| `secondary` | `border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)]` | Secondary CTA alongside primary |
| `ghost` | `text-[var(--foreground)] hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)]` | Tertiary / inline actions |
| `tech` | `bg-tech text-white hover:bg-tech-hover focus-visible:bg-tech-hover` | Primary CTA on Technologies pages only |
| `consulting` | `bg-consulting text-white hover:bg-consulting-hover focus-visible:bg-consulting-hover` | Primary CTA on Consulting pages only |

| Size | Classes |
|---|---|
| `sm` | `h-8 px-3 text-sm` |
| `md` (default) | `h-10 px-5 text-sm` |
| `lg` | `h-12 px-7 text-base` |

**Button group layout**: `flex flex-col sm:flex-row gap-3 justify-center` (centered) or without `justify-center` (left-aligned on inner pages).

### Grid panels (seamless gap-px pattern)

The dominant card pattern. A grid with `gap-px bg-[var(--border)] rounded-xl overflow-hidden`. Children have `bg-[var(--background)]`, creating 1px borders from the background color bleeding through the gap.

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
  <div class="bg-[var(--background)] p-8 md:p-12 h-full">
    <!-- card content -->
  </div>
</div>
```

This is used for: Division panels, Manifesto cards, Services grids, Values grid. Always include `h-full` on children for equal heights.

### Standalone bordered card

For isolated call-out blocks (CTA boxes, connection sections):

```html
<div class="border border-[var(--border)] rounded-xl p-10 md:p-16">
  <!-- content -->
</div>
```

### Eyebrow accent bar

Used at the top of division panels and on inner page heroes. Always: accent-colored horizontal bar + uppercase label.

```html
<div class="flex items-center gap-3 mb-6">
  <span class="h-[3px] w-5 rounded-full bg-tech" aria-hidden="true" />
  <span class="text-xs font-medium uppercase tracking-widest text-tech">
    PG Technologies
  </span>
</div>
```

The bar animates `width: 20px → 32px` on hover (via `motion.span`). Static fallback: `w-5` (20px) for the bar, `w-8` (32px) on hero pages.

### Dot bullet

Small circular accent used in list items.

- Accent dot: `w-1.5 h-1.5 rounded-full bg-tech` (or `bg-consulting`) — used next to service titles
- Muted dot: `w-1 h-1 rounded-full bg-[var(--muted-fg)]` — used for sub-items within a service
- Division panel service dot: `w-1 h-1 rounded-full bg-tech` — inline with service name

### Tag pills (R&D focus areas)

```html
<span class="px-3 py-1.5 text-sm border border-[var(--border)] rounded-full text-[var(--muted-fg)] hover:border-tech hover:text-tech transition-colors">
  Label
</span>
```

Only use `rounded-full` for pills. Cards and buttons use `rounded-md`.

### Section dividers

Sections are separated exclusively by `border-t border-[var(--border)]` — no spacing-only gaps at the section level. Every section after the first in a page flow has `border-t`.

### Header

Fixed at top, `h-16`. Transparent when at top of page; on scroll (`scrollY > 12`) adds:
```
bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]
```
Nav links: `text-sm px-3 py-2 rounded-md`. Active: `text-[var(--foreground)] font-medium`. Inactive: `text-[var(--muted-fg)] hover:text-[var(--foreground)]`.

### Focus state (global)

```css
:focus-visible {
  outline: 2px solid var(--foreground);
  outline-offset: 2px;
  border-radius: 2px;
}
```

Form inputs use a different focus pattern: `focus:ring-2 focus:ring-offset-1 focus:ring-[var(--muted-fg)]/30 focus:border-[var(--muted-fg)]`.

### Form inputs

```
w-full px-3.5 py-2.5 rounded-md border bg-[var(--background)] text-[var(--foreground)] text-sm
placeholder:text-[var(--muted-fg)]
focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--background)]
border-[var(--border)] focus:border-[var(--muted-fg)] focus:ring-[var(--muted-fg)]/30
```

Error state: swap border to `border-red-400 focus:ring-red-400`.

---

## 5. Motion Patterns

All animation uses **Framer Motion**. Every animated component calls `useReducedMotion()` and respects the result.

### Core easing curve

`[0.25, 0.1, 0.25, 1]` — a cubic-bezier ease-in-out. Used in virtually every transition.

### FadeIn (reusable component)

Default behavior: `{ opacity: 0, y: 20 }` → `{ opacity: 1, y: 0 }`. Duration: 0.5s. Triggered `whileInView` with `once: true, margin: "-50px"`.

Supports directional variants: `up` (y: 20), `down` (y: -20), `left` (x: 20), `right` (x: -20), `none` (opacity only).

With `useReducedMotion`: translates only opacity, collapses duration to 0.1s, removes delay.

### FadeInStagger + FadeInItem

`FadeInStagger` is a container that uses `staggerChildren: 0.1` (default). `FadeInItem` children animate: `{ opacity: 0, y: 16 }` → `{ opacity: 1, y: 0 }`, duration 0.5s.

Use `FadeInStagger` wrapping the `gap-px` grid and `FadeInItem` wrapping each panel child.

### Hero entry animation

Homepage hero: `{ opacity: 0, y: 24 }` → `{ opacity: 1, y: 0 }`, duration 0.7s.

Underline bars beneath "Build" and "Deliver": `scaleX: 0 → 1` with `originX: 0`, ease `[0.25, 0.1, 0.25, 1]`, duration 0.8s. "Build" bar delays 0.8s, "Deliver" bar delays 1.0s.

Scroll indicator: fades in at 1.2s delay, then infinite `y: [0, 8, 0]`, duration 1.8s, `easeInOut`.

### Hover interactions

- Word hover scale: `whileHover: { scale: 1.02 }`, duration 0.15s
- Arrow nudge (division panel CTA): `{ x: hovered ? 4 : 0 }`, duration 0.2s
- Eyebrow bar width: `{ width: hovered ? 32 : 20 }`, duration 0.2s

### SVG path drawing (TheLoop diagram)

Three paths draw sequentially using `pathLength: 0 → 1` with `strokeDasharray: 100`. Delays: 0.3s, 0.6s, 0.9s. Duration: 0.8s each. Arrowhead nodes appear at 1.1s, 1.4s, 1.7s. Loop nodes scale from 0.8 → 1 with opacity.

### Mobile nav overlay

Container: `{ opacity: 0, y: -8 }` → `{ opacity: 1, y: 0 }`, duration 0.2s, ease "easeOut". Items stagger at `delay: i * 0.07`, duration 0.3s each.

### prefers-reduced-motion

Global CSS sets all animation durations to 0.01ms. Framer Motion components additionally check `useReducedMotion()` and omit y/x offsets, set duration to 0.1s, and remove delays. Both layers of protection are always present.

---

## 6. Layout Patterns

### Page structure

All marketing pages follow this hierarchy:

```
<Header /> (fixed)
<main>
  <section> Hero — pt-32 pb-24 (clears header) </section>
  <section className="border-t ..."> Positioning / narrative </section>
  <section className="border-t ..."> Content grid </section>
  ...
  <section className="border-t ..."> CTA </section>
</main>
<Footer />
```

The homepage hero is the one exception: it fills the viewport (`min-h-screen`) and has no `border-t` on the section below it — the DivisionPanels section has no border-t since it follows immediately.

### Section content structure (eyebrow pattern)

When a section has a label, the order is always:

1. `<p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-3">` — eyebrow label
2. `<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">` — section title
3. Optional: `<p className="text-[var(--muted-fg)] leading-relaxed">` — brief description

This block is wrapped in `<FadeIn className="mb-12">` before the content grid.

### Two-column narrative split

Used for problem/solution statements, positioning copy, and story sections:

```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
  <FadeIn>  <!-- heading left -->
    <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight"> … </h2>
  </FadeIn>
  <FadeIn delay={0.1}>  <!-- body right -->
    <p class="text-[var(--muted-fg)] leading-relaxed text-lg"> … </p>
  </FadeIn>
</div>
```

`items-start` is standard. Use `items-center` only when the right side is a diagram/visual.

### Grid layouts

| Columns | Classes | Used for |
|---|---|---|
| 2-col equal | `grid-cols-1 md:grid-cols-2` | Manifesto, Values, Services |
| 3-col | `grid-cols-1 md:grid-cols-3` | Technologies service cards |
| 4-col | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | Process steps |
| 12-col asymmetric | `lg:grid-cols-12` with `lg:col-span-4` / `lg:col-span-8` | About page story section |

All content grids using the seamless divider pattern add `gap-px bg-[var(--border)] rounded-xl overflow-hidden`.

### Hero background grid

The homepage hero has a subtle crosshatch pattern — the only decorative surface element on the site:

```js
style={{
  backgroundImage:
    "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
  maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
  opacity: 0.4,
}}
```

This is `position: absolute inset-0 pointer-events-none aria-hidden`. Do not replicate this on inner pages.

### Footer structure

4-column footer (`grid-cols-2 md:grid-cols-4`): brand block (`col-span-2 md:col-span-1`), Company links, Divisions links, Legal links. Bottom bar: copyright left, division names right. Separated by `border-t border-[var(--border)]`. Padding: `py-12 md:py-16`.

---

## 7. Voice and Copy Patterns

### Tone

Editorial restraint. Direct. No exclamation points. No marketing hyperbole. Closer to Vercel or Linear than a typical SaaS landing page.

### Eyebrow labels

Short (1–3 words), uppercase, sentence-case source converted to all-caps by CSS (`uppercase`). Examples: "Two divisions", "The difference", "Focus areas", "R&D", "Process", "Services", "Vision", "Principles", "Our story", "The connection".

### Headlines

Sentence case. Can use a period at the end for declarative statements: "Build systems that scale." Multi-clause headlines separate with em-dash space or period: "Fix your systems. Automate your workflows. Scale your business."

The inline muted-color technique applies a soft/bold contrast within a single heading:

```jsx
<h2>One venture.{" "}
  <span className="text-[var(--muted-fg)]">One feedback loop.</span>
</h2>
```

The bold phrase comes first, the muted qualifier follows.

### Body text

`text-[var(--muted-fg)]` always. Body text is never full `foreground` color — that is reserved for headings, labels, and interactive elements.

### Pull-quote / blockquote

Uses `<blockquote>` with `text-2xl sm:text-3xl font-semibold tracking-tight leading-snug text-[var(--muted-fg)]`. Uses proper curly quotes (`&ldquo;` / `&rdquo;`). No border-left decoration.

### Status / in-progress line

A single `font-mono text-sm text-[var(--muted-fg)]` line preceded by a small pulsing dot: `w-2 h-2 rounded-full bg-tech animate-pulse`. Used once on Technologies page for "Products in development."

---

## 8. Constraints for New Sections

### DO

- **DO** use the `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` container on every section — no exceptions.
- **DO** separate sections with `border-t border-[var(--border)]` and `py-24` vertical padding.
- **DO** follow the eyebrow → h2 → body → content sequence when introducing a new content grid.
- **DO** use `FadeIn` on every section header and `FadeInStagger` + `FadeInItem` on grids.
- **DO** call `useReducedMotion()` in every Client Component that animates.
- **DO** use the gap-px seamless grid pattern (`gap-px bg-[var(--border)] rounded-xl overflow-hidden`) for card grids.
- **DO** keep headlines in sentence case and eyebrows uppercase.
- **DO** use `text-[var(--muted-fg)]` for all body text; use `text-[var(--foreground)]` only for headings, labels, and interactive text.
- **DO** restrict accent colors (tech blue, consulting green) to the division they belong to. On shared/parent pages, use neutral colors with accent highlights only.
- **DO** use `rounded-md` for buttons/inputs/cards, `rounded-full` for pills and dots only, `rounded-xl` for panel grids.
- **DO** add `aria-hidden="true"` to all decorative elements (dots, bars, icons).

### DON'T

- **DON'T** introduce new colors. The palette is closed: neutrals + tech blue + consulting green + error red (form only).
- **DON'T** use `font-bold` or weights other than `font-semibold` (headings) and `font-medium` (eyebrows, button labels) and `font-normal` (body).
- **DON'T** add new font sizes outside the existing scale. Do not introduce `text-9xl`, `text-2xl` for body, or custom `clamp()` values.
- **DON'T** use generic SaaS patterns: gradient hero blobs, feature cards with icons in colored circles, floating cards, animated counters, testimonial carousels, star ratings.
- **DON'T** use `border-radius` values other than `rounded-md`, `rounded-xl`, and `rounded-full` that are already in the codebase.
- **DON'T** put images, illustrations, or background photography in sections. The site is text and line-based.
- **DON'T** add hover effects heavier than `hover:opacity-85`, `hover:bg-[var(--surface)]`, or `hover:text-[var(--foreground)]`. No transform lifts, no scale-up cards.
- **DON'T** replicate the hero grid background on inner pages or sections — it appears once, on the homepage hero only.
- **DON'T** use `text-white` except inside `variant="tech"` or `variant="consulting"` buttons.
- **DON'T** center-align body text except in explicit CTA sections where the entire block is centered.
- **DON'T** use `px-*` container widths smaller than `max-w-7xl` for sections — if content should feel narrower, constrain the inner element with `max-w-3xl` etc., not the section itself.
- **DON'T** use `animate-*` Tailwind utilities (except `animate-pulse` for the single status dot) — all animation goes through Framer Motion.

---

## Quick Reference: Classname Cheat Sheet

```
/* Containers */
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

/* Section padding */
py-24                          /* standard */
py-24 md:py-32                 /* narrative/hero sections */
pt-32 pb-24                    /* inner page hero (clears fixed header) */

/* Section divider */
border-t border-[var(--border)]

/* Eyebrow */
text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)]
text-xs font-medium uppercase tracking-widest text-tech
text-xs font-medium uppercase tracking-widest text-consulting

/* Eyebrow accent bar */
h-[3px] w-5 rounded-full bg-tech aria-hidden="true"
h-[3px] w-8 rounded-full bg-tech aria-hidden="true"   /* hero / larger */

/* Section title (inner pages) */
text-2xl sm:text-3xl font-semibold tracking-tight

/* Section title (homepage) */
text-3xl sm:text-4xl font-semibold tracking-tight

/* Body text */
text-[var(--muted-fg)] leading-relaxed
text-lg text-[var(--muted-fg)] leading-relaxed

/* Seamless card grid */
grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] rounded-xl overflow-hidden

/* Card panel body */
bg-[var(--background)] p-8 md:p-12 h-full

/* Standalone bordered card */
border border-[var(--border)] rounded-xl p-10 md:p-16

/* Tag pill */
px-3 py-1.5 text-sm border border-[var(--border)] rounded-full text-[var(--muted-fg)]
hover:border-tech hover:text-tech transition-colors

/* Two-column split */
grid grid-cols-1 lg:grid-cols-2 gap-16 items-start

/* Button group */
flex flex-col sm:flex-row gap-3 justify-center
```

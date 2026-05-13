# PG Ventures Website

Production marketing site for **PG Ventures LLC** and its two divisions — PG Technologies and PG Consulting. Live at [pgventures.co](https://pgventures.co).

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | Framework |
| TypeScript | Language |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| next/font (Geist) | Self-hosted fonts |
| next-themes | Dark/light mode |
| Resend | Contact form email delivery |
| react-hook-form + Zod | Form validation |
| Vercel Analytics + Speed Insights | Analytics |
| SVGO | Logo SVG optimization |

---

## Local Development

```bash
# 1. Clone the repo and install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables below)

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes (for contact form) | API key from [resend.com](https://resend.com/api-keys) |
| `CONTACT_TO_EMAIL` | Yes | Inbox that receives form submissions (`connect@pgventures.co`) |
| `CONTACT_FROM_EMAIL` | Yes | Verified sender address (`noreply@pgventures.co`) |

Without `RESEND_API_KEY`, the contact form will return a 500 error. The rest of the site works fine without it.

---

## Deployment to Vercel

1. Push this repo to GitHub (or another Git provider).
2. Import the project in [vercel.com/new](https://vercel.com/new).
3. Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Next.js and configures everything.
5. Set your custom domain `pgventures.co` under **Settings → Domains**.

That's it. The site generates static pages at build time and uses server functions only where needed (contact API, OG images, favicons).

---

## Wiring Up Resend (Contact Form)

The contact form sends email via [Resend](https://resend.com). To make it work:

1. **Create a Resend account** at [resend.com](https://resend.com).
2. **Verify your domain** (`pgventures.co`) under Resend → Domains. This requires adding DNS records — Resend shows exactly which records to add.
3. **Generate an API key** under Resend → API Keys.
4. **Set the environment variables** in `.env.local` (local) and in Vercel's dashboard (production):
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   CONTACT_TO_EMAIL=connect@pgventures.co
   CONTACT_FROM_EMAIL=noreply@pgventures.co
   ```
5. Test by submitting the contact form at `/contact`.

**Rate limiting:** The contact API uses in-memory rate limiting (3 submissions per IP per hour). For production at scale, upgrade to Upstash Redis — there's a `TODO` comment in `app/api/contact/route.ts` pointing to where this change goes.

---

## Enabling Optional Analytics (PostHog / Plausible)

Vercel Analytics and Speed Insights are already wired up in `app/layout.tsx` and activate automatically on Vercel.

For **PostHog**:
1. Create a project at [posthog.com](https://posthog.com).
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```
3. Install: `npm install posthog-js`
4. Add the PostHog provider to `app/layout.tsx` following the PostHog Next.js docs.

---

## Updating Content

All content lives directly in the page and component files — there's no CMS. Key locations:

| What | Where |
|------|-------|
| Site-wide constants (URL, email, nav links) | `lib/constants.ts` |
| Homepage hero text | `components/sections/HomeHero.tsx` |
| Division panels (homepage) | `components/sections/DivisionPanels.tsx` |
| The Loop section | `components/sections/TheLoop.tsx` |
| Technologies page copy | `app/(marketing)/technologies/page.tsx` |
| Consulting page copy | `app/(marketing)/consulting/page.tsx` |
| About page copy | `app/(marketing)/about/page.tsx` |
| Footer links | `lib/constants.ts` → `FOOTER_LINKS` |
| Legal pages | `app/legal/privacy/page.tsx`, `app/legal/terms/page.tsx` |

---

## Replacing Logos

The three logo files live in `public/logos/`:

```
public/logos/
├── pg-ventures.svg       # Used on homepage, about, contact, legal pages
├── pg-technologies.svg   # Used on /technologies and subroutes
└── pg-consulting.svg     # Used on /consulting and subroutes
```

To replace a logo:
1. Drop the new SVG file in `public/logos/` with the same filename.
2. Run SVGO to re-optimize: `npx svgo --config svgo.config.js -f public/logos`
3. Verify it renders correctly in both light and dark mode.

**Dark mode note:** Logos use `dark:invert` CSS. This works best for monochrome logos with black/white fills. If you replace a logo with color fills, update the Logo component in `components/logo/Logo.tsx`.

**Sizing note:** PG Ventures logo is square (1254×1254 viewBox). PG Technologies and Consulting logos are portrait (1024×1536). Both are rendered at 32px height in the header. If a replacement logo looks visually out of balance, adjust the `height` prop in `components/layout/Header.tsx`.

---

## Known TODOs / Future Enhancements

- [ ] **Rate limiting:** Upgrade in-memory rate limiter to Upstash Redis for distributed environments. See `app/api/contact/route.ts`.
- [ ] **Per-page OG images:** Add `opengraph-image.tsx` files inside `/technologies` and `/consulting` routes for division-specific social cards.
- [ ] **CMS:** Content is hardcoded. For non-developer editing, consider Sanity or Contentlayer.
- [ ] **Blog / Case studies:** A `/blog` route with MDX is a natural next step.
- [ ] **PostHog / Plausible:** Scaffolded in `.env.example` — needs provider wired up in `layout.tsx`.
- [ ] **Email template:** The HTML email in `lib/email.ts` is functional but minimal.

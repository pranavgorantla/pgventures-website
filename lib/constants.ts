export const SITE_URL = "https://pgventures.co";
export const SITE_NAME = "PG Ventures";
export const CONTACT_EMAIL = "connect@pgventures.co";

export const NAV_LINKS = [
  { href: "/technologies", label: "Technologies" },
  { href: "/consulting", label: "Consulting" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  divisions: [
    { href: "/technologies", label: "PG Technologies" },
    { href: "/consulting", label: "PG Consulting" },
  ],
  legal: [
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms of Service" },
  ],
} as const;

export type LogoVariant = "ventures" | "technologies" | "consulting";

export function getLogoVariant(pathname: string): LogoVariant {
  if (pathname.startsWith("/technologies")) return "technologies";
  if (pathname.startsWith("/consulting")) return "consulting";
  return "ventures";
}

export function getAccentColor(variant: LogoVariant) {
  if (variant === "technologies") return "tech";
  if (variant === "consulting") return "consulting";
  return null;
}

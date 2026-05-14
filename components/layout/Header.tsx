"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/logo/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_LINKS, getLogoVariant } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const logoVariant = getLogoVariant(pathname);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo — links home from any division */}
            <Link
              href="/"
              aria-label={
                logoVariant === "technologies"
                  ? "PG Technologies — return to PG Ventures homepage"
                  : logoVariant === "consulting"
                  ? "PG Consulting — return to PG Ventures homepage"
                  : "PG Ventures — return to homepage"
              }
            >
              <Logo variant={logoVariant} className="h-9 md:h-11" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-[var(--foreground)] font-medium"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-md text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <HamburgerIcon open={mobileOpen} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Navigation menu"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[var(--background)] flex flex-col pt-16"
          >
            <nav
              className="flex flex-col items-center justify-center flex-1 gap-2 px-6"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-4 text-2xl font-medium transition-colors",
                      pathname === link.href || pathname.startsWith(link.href + "/")
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <motion.line
        x1="2" y1="5" x2="18" y2="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        style={{ originX: "50%", originY: "50%" }}
        transition={{ duration: 0.2 }}
      />
      <motion.line
        x1="2" y1="10" x2="18" y2="10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.line
        x1="2" y1="15" x2="18" y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
        style={{ originX: "50%", originY: "50%" }}
        transition={{ duration: 0.2 }}
      />
    </svg>
  );
}

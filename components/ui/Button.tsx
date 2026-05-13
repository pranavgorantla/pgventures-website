import { cn } from "@/lib/utils";
import Link from "next/link";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "tech" | "consulting";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--foreground)] text-[var(--background)] hover:opacity-85 focus-visible:opacity-85",
  secondary:
    "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)]",
  ghost:
    "text-[var(--foreground)] hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)]",
  tech: "bg-tech text-white hover:bg-tech-hover focus-visible:bg-tech-hover",
  consulting:
    "bg-consulting text-white hover:bg-consulting-hover focus-visible:bg-consulting-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  onClick,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 select-none",
    "disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  company: z.string().optional(),
  team: z.enum(["technologies", "consulting", "general"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
  _honeypot: z.string().max(0, ""),
});

type FormData = z.infer<typeof schema>;
type Status = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  defaultTeam?: "technologies" | "consulting" | "general";
}

export function ContactForm({ defaultTeam }: ContactFormProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const teamParam = searchParams.get("team") as FormData["team"] | null;
  const resolvedDefaultTeam = defaultTeam ?? teamParam ?? "general";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { team: resolvedDefaultTeam },
  });

  const selectedTeam = watch("team");

  async function onSubmit(data: FormData) {
    if (data._honeypot) return;
    setStatus("submitting");
    setErrorMessage("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _honeypot: _hp, ...payload } = data;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="py-16 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-consulting/10 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-consulting">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg mb-2">Message sent.</h3>
        <p className="text-[var(--muted-fg)] mb-6">
          We&apos;ll be in touch shortly.
        </p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact form"
    >
      {/* Honeypot — hidden from humans */}
      <input
        {...register("_honeypot")}
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name" fieldId="contact-name" error={errors.name?.message} required>
          <input
            {...register("name")}
            id="contact-name"
            type="text"
            autoComplete="name"
            className={inputClass(!!errors.name)}
            placeholder="Your name"
            aria-required="true"
          />
        </Field>

        <Field label="Email" fieldId="contact-email" error={errors.email?.message} required>
          <input
            {...register("email")}
            id="contact-email"
            type="email"
            autoComplete="email"
            className={inputClass(!!errors.email)}
            placeholder="you@company.com"
            aria-required="true"
          />
        </Field>

        <Field label="Company" fieldId="contact-company" className="sm:col-span-2">
          <input
            {...register("company")}
            id="contact-company"
            type="text"
            autoComplete="organization"
            className={inputClass(false)}
            placeholder="Optional"
          />
        </Field>

        <Field
          label="Which team?"
          error={errors.team?.message}
          required
          className="sm:col-span-2"
        >
          <div className="flex gap-3 flex-wrap" role="radiogroup" aria-label="Which team?">
            {(["technologies", "consulting", "general"] as const).map((t) => (
              <label
                key={t}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm cursor-pointer transition-colors",
                  selectedTeam === t
                    ? t === "technologies"
                      ? "border-tech text-tech bg-tech/5"
                      : t === "consulting"
                      ? "border-consulting text-consulting bg-consulting/5"
                      : "border-[var(--foreground)] text-[var(--foreground)] bg-[var(--surface)]"
                    : "border-[var(--border)] text-[var(--muted-fg)] hover:border-[var(--muted-fg)]"
                )}
              >
                <input
                  {...register("team")}
                  type="radio"
                  value={t}
                  className="sr-only"
                />
                {t === "technologies"
                  ? "Technologies"
                  : t === "consulting"
                  ? "Consulting"
                  : "General"}
              </label>
            ))}
          </div>
        </Field>

        <Field
          label="Message"
          fieldId="contact-message"
          error={errors.message?.message}
          required
          className="sm:col-span-2"
        >
          <textarea
            {...register("message")}
            id="contact-message"
            rows={5}
            className={cn(inputClass(!!errors.message), "resize-none")}
            placeholder="Tell us about your project or question..."
            aria-required="true"
          />
        </Field>
      </div>

      {status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400"
        >
          {errorMessage}
        </div>
      )}

      <div className="mt-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === "submitting"}
          className="w-full sm:w-auto"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full px-3.5 py-2.5 rounded-md border bg-[var(--background)] text-[var(--foreground)] text-sm",
    "placeholder:text-[var(--muted-fg)]",
    "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--background)]",
    "transition-colors",
    hasError
      ? "border-red-400 focus:ring-red-400"
      : "border-[var(--border)] focus:border-[var(--muted-fg)] focus:ring-[var(--muted-fg)]/30"
  );
}

function Field({
  label,
  fieldId,
  error,
  required,
  className,
  children,
}: {
  label: string;
  fieldId?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const id = fieldId ?? label.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
      >
        {label}
        {required && (
          <span className="text-[var(--muted-fg)] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div aria-describedby={error ? errorId : undefined}>{children}</div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

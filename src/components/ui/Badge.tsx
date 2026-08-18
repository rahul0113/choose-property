import type { ReactNode } from "react";
import { clsx } from "clsx";

const VARIANTS: Record<string, string> = {
  brand: "bg-brand-soft text-brand-dark",
  amber: "bg-accent-soft text-accent",
  green: "bg-emerald-100 text-emerald-800",
  red: "bg-red-100 text-red-700",
  slate: "bg-slate-100 text-slate-600",
  outline: "border border-paper-line text-ink-soft",
};

export function Badge({
  children,
  variant = "slate",
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function availabilityVariant(availability: string): keyof typeof VARIANTS {
  if (availability === "available") return "green";
  if (availability === "sold") return "red";
  if (availability === "under_contract") return "amber";
  return "slate";
}

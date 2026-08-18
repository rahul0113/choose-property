"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-paper-line rounded-2xl border border-paper-line bg-white shadow-card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium">{item.q}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-ink-faint transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

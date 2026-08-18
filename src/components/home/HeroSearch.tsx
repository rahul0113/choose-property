"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search, ChevronDown } from "lucide-react";
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "@/lib/constants";
import { track } from "@/lib/analytics";

export function HeroSearch({ districts }: { districts: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [district, setDistrict] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (q.trim()) qs.set("q", q.trim());
    if (type) qs.set("type", type);
    if (district) qs.set("district", district);
    track({ event: "search", meta: { q: q.trim(), type, district } });
    router.push(qs.toString() ? `/properties?${qs.toString()}` : "/properties");
  };

  const fieldCls =
    "h-12 w-full rounded-full border border-paper-line bg-white px-4 text-base sm:text-sm outline-none ring-brand focus:ring-2";

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-2xl" role="search">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search plots, locations, or property ID…"
            className={`${fieldCls} pl-10`}
            aria-label="Search properties"
          />
        </div>
        <div className="relative sm:w-44 shrink-0">
          <select value={type} onChange={(e) => setType(e.target.value)} className={`${fieldCls} appearance-none pr-10 bg-none`} aria-label="Property type">
            <option value="">All types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden />
        </div>
        <div className="relative sm:w-40 shrink-0">
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className={`${fieldCls} appearance-none pr-10 bg-none`} aria-label="District">
            <option value="">All districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden />
        </div>
        <button
          type="submit"
          className="h-12 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Search
        </button>
      </div>
    </form>
  );
}

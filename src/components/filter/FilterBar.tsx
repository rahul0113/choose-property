"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { AVAILABILITY_LABELS, FACINGS, PROPERTY_TYPES, PROPERTY_TYPE_LABELS, PRESET_AMENITIES } from "@/lib/constants";
import { track } from "@/lib/analytics";

interface FilterDraft {
  q: string;
  type: string;
  district: string;
  area: string;
  roadWidth: string;
  facing: string;
  availability: string;
  electricity: boolean;
  water: boolean;
  drainage: boolean;
  openSites: string;
  amenities: string[];
}

const AREA_PRESETS = [
  { key: "", label: "Any size" },
  { key: "lt1000", label: "Under 1,000 sq.ft" },
  { key: "1000-2000", label: "1,000 – 2,000" },
  { key: "2000-4000", label: "2,000 – 4,000" },
  { key: "gt4000", label: "4,000+" },
];

const ROAD_PRESETS = [
  { key: "", label: "Any road" },
  { key: "20", label: "20+ ft" },
  { key: "30", label: "30+ ft" },
  { key: "40", label: "40+ ft" },
];

const OPEN_SITES_PRESETS = [
  { key: "", label: "Any" },
  { key: "1", label: "1+" },
  { key: "2", label: "2+" },
  { key: "3", label: "3+" },
];

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

function getArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return v.split(",").filter(Boolean);
}

export function FilterBar({
  basePath,
  districts,
  params,
  activeCount,
}: {
  basePath: string;
  districts: string[];
  params: Record<string, string | string[] | undefined>;
  activeCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [draft, setDraft] = useState<FilterDraft>(() => {
    const min = one(params.min_area);
    const max = one(params.max_area);
    const area =
      min === "1000" && max === "2000"
        ? "1000-2000"
        : min === "2000" && max === "4000"
          ? "2000-4000"
          : min === "4000" && !max
            ? "gt4000"
            : max === "1000" && !min
              ? "lt1000"
              : "";
    return {
      q: one(params.q),
      type: one(params.type),
      district: one(params.district),
      area,
      roadWidth: one(params.road_width),
      facing: one(params.facing),
      availability: one(params.availability),
      electricity: one(params.electricity) === "1",
      water: one(params.water) === "1",
      drainage: one(params.drainage) === "1",
      openSites: one(params.open_sites),
      amenities: getArray(params.amenities),
    };
  });

  const set = <K extends keyof FilterDraft>(key: K, value: FilterDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const apply = (withSearch = false) => {
    const d = draft;
    const qs = new URLSearchParams();
    if (withSearch && d.q.trim()) qs.set("q", d.q.trim());
    else if (!withSearch && d.q.trim()) qs.set("q", d.q.trim());
    if (d.type) qs.set("type", d.type);
    if (d.district) qs.set("district", d.district);
    if (d.area === "lt1000") qs.set("max_area", "1000");
    if (d.area === "1000-2000") { qs.set("min_area", "1000"); qs.set("max_area", "2000"); }
    if (d.area === "2000-4000") { qs.set("min_area", "2000"); qs.set("max_area", "4000"); }
    if (d.area === "gt4000") qs.set("min_area", "4000");
    if (d.roadWidth) qs.set("road_width", d.roadWidth);
    if (d.facing) qs.set("facing", d.facing);
    if (d.availability) qs.set("availability", d.availability);
    if (d.electricity) qs.set("electricity", "1");
    if (d.water) qs.set("water", "1");
    if (d.drainage) qs.set("drainage", "1");
    if (d.openSites) qs.set("open_sites", d.openSites);
    if (d.amenities.length > 0) qs.set("amenities", d.amenities.join(","));

    const target = qs.toString() ? `${basePath}?${qs.toString()}` : basePath;
    track({ event: "filter_used", meta: { filters: qs.toString() } });
    router.push(target);
    setOpen(false);
  };

  const reset = () => {
    setDraft({ q: "", type: "", district: "", area: "", roadWidth: "", facing: "", availability: "", electricity: false, water: false, drainage: false, openSites: "", amenities: [] });
    router.push(basePath);
    setOpen(false);
  };

  const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
        active ? "bg-brand text-white" : "bg-paper-soft text-ink-soft hover:bg-paper-line"
      }`}
    >
      {children}
    </button>
  );

  const Toggle = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
        active ? "bg-brand text-white" : "bg-paper-soft text-ink-soft hover:bg-paper-line"
      }`}
    >
      {active && <Check className="h-4 w-4" aria-hidden />}
      {label}
    </button>
  );

  const sheet = (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label="Filters">
      {/* Backdrop */}
      <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="Close filters" />
      {/* Sheet panel */}
      <div className="relative z-10 flex w-full flex-col rounded-t-2xl bg-white shadow-sheet sm:max-h-[90dvh] sm:w-[480px] sm:rounded-2xl max-h-[90dvh]">
        <div className="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-paper-line sm:hidden" aria-hidden />
        <div className="flex shrink-0 items-center justify-between border-b border-paper-line px-5 py-3.5">
          <h2 className="text-base font-semibold">Filters</h2>
          <button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-paper-soft" aria-label="Close filters">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {basePath === "/properties" && (
            <section className="mb-5">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Property type</h3>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <Chip key={t} active={draft.type === t} onClick={() => set("type", draft.type === t ? "" : t)}>
                    {PROPERTY_TYPE_LABELS[t]}
                  </Chip>
                ))}
              </div>
            </section>
          )}

          <section className="mb-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">District</h3>
            <div className="flex flex-wrap gap-2">
              <Chip active={!draft.district} onClick={() => set("district", "")}>All</Chip>
              {districts.map((d) => (
                <Chip key={d} active={draft.district === d} onClick={() => set("district", draft.district === d ? "" : d)}>
                  {d}
                </Chip>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Plot size</h3>
            <div className="flex flex-wrap gap-2">
              {AREA_PRESETS.map((a) => (
                <Chip key={a.key} active={draft.area === a.key} onClick={() => set("area", a.key)}>
                  {a.label}
                </Chip>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Road width</h3>
            <div className="flex flex-wrap gap-2">
              {ROAD_PRESETS.map((r) => (
                <Chip key={r.key} active={draft.roadWidth === r.key} onClick={() => set("roadWidth", r.key)}>
                  {r.label}
                </Chip>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Facing</h3>
            <div className="flex flex-wrap gap-2">
              {FACINGS.map((f) => (
                <Chip key={f} active={draft.facing === f} onClick={() => set("facing", draft.facing === f ? "" : f)}>
                  {f}
                </Chip>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(AVAILABILITY_LABELS) as Array<keyof typeof AVAILABILITY_LABELS>).map((a) => (
                <Chip key={a} active={draft.availability === a} onClick={() => set("availability", draft.availability === a ? "" : a)}>
                  {AVAILABILITY_LABELS[a]}
                </Chip>
              ))}
            </div>
          </section>

          {/* Open sites filter */}
          <section className="mb-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Open Sites Around Property</h3>
            <div className="flex flex-wrap gap-2">
              {OPEN_SITES_PRESETS.map((o) => (
                <Chip key={o.key} active={draft.openSites === o.key} onClick={() => set("openSites", o.key)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </section>

          {/* Amenities & Utilities */}
          <section className="mb-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Amenities & Utilities</h3>
            <div className="flex flex-wrap gap-2">
              <Toggle active={draft.electricity} onClick={() => set("electricity", !draft.electricity)} label="Electricity" />
              <Toggle active={draft.water} onClick={() => set("water", !draft.water)} label="Water" />
              <Toggle active={draft.drainage} onClick={() => set("drainage", !draft.drainage)} label="Drainage" />
              
              {PRESET_AMENITIES.map((amenity) => {
                const isActive = draft.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        set("amenities", draft.amenities.filter((a) => a !== amenity));
                      } else {
                        set("amenities", [...draft.amenities, amenity]);
                      }
                    }}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-brand text-white" : "bg-paper-soft text-ink-soft hover:bg-paper-line"
                    }`}
                  >
                    {isActive && <Check className="h-4 w-4" aria-hidden />}
                    {amenity}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-paper-line p-4">
          <button type="button" onClick={reset} className="rounded-full border border-paper-line px-5 py-3 text-sm font-semibold text-ink-soft hover:bg-paper-soft">
            Reset
          </button>
          <button type="button" onClick={() => apply()} className="flex-1 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-90">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sticky top-16 z-30 border-b border-paper-line bg-paper-soft/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6">
        <form
          className="relative flex-1"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            apply(true);
          }}
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden />
          <input
            type="search"
            value={draft.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search plots, locations, or property ID…"
            className="h-12 w-full rounded-full border border-paper-line bg-white pl-10 pr-4 text-base sm:text-sm outline-none ring-brand focus:ring-2"
            aria-label="Search properties"
          />
        </form>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex h-12 items-center gap-2 rounded-full border border-paper-line bg-white px-4 text-sm font-semibold text-ink hover:bg-paper-soft"
          aria-haspopup="dialog"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>
      {open && mounted && createPortal(sheet, document.body)}
    </div>
  );
}

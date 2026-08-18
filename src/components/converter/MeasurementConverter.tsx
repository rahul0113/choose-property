"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Info } from "lucide-react";
import { MEASUREMENT_UNITS, UNIT_LABELS, displayUnit, sqftToAll, toSqft } from "@/lib/measurements/engine";
import { STANDARDS, getStandard } from "@/lib/measurements/standards";
import { DISCLAIMER_MEASUREMENTS } from "@/lib/constants";

export function MeasurementConverter() {
  const [value, setValue] = useState("1500");
  const [unit, setUnit] = useState<(typeof MEASUREMENT_UNITS)[number]>("sqft");
  const [standardId, setStandardId] = useState<string>(STANDARDS[0].id);

  const standard = getStandard(standardId);
  const number = Number(value);

  const results = useMemo(() => {
    const sqft = toSqft(number, unit, standard);
    if (sqft == null) return null;
    return sqftToAll(sqft, standard);
  }, [number, unit, standard]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-paper-line bg-white p-5 shadow-card sm:p-7">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Value</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-12 w-full rounded-xl border border-paper-line px-4 text-lg font-semibold tabular outline-none ring-brand focus:ring-2"
              aria-label="Measurement value"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">From unit</span>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as (typeof MEASUREMENT_UNITS)[number])}
              className="h-12 w-full rounded-xl border border-paper-line bg-white px-3 text-sm outline-none ring-brand focus:ring-2"
              aria-label="Input unit"
            >
              {MEASUREMENT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Measurement standard</span>
            <select
              value={standardId}
              onChange={(e) => setStandardId(e.target.value)}
              className="h-12 w-full rounded-xl border border-paper-line bg-white px-3 text-sm outline-none ring-brand focus:ring-2"
              aria-label="Measurement standard"
            >
              {STANDARDS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                  {s.is_default ? " (default)" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results ? (
          <>
            <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
              <ArrowRightLeft className="h-4 w-4 text-brand" aria-hidden />
              {Number.isNaN(number) ? "Enter a value" : (
                <>
                  {displayUnit(number)} {UNIT_LABELS[unit]} ={" "}
                  <span className="font-semibold text-ink">
                    {displayUnit(results.sqft)} sq.ft
                  </span>
                </>
              )}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {MEASUREMENT_UNITS.map((u) => (
                <div key={u} className="rounded-xl border border-paper-line bg-paper-soft p-3">
                  <p className="text-xs text-ink-faint">{UNIT_LABELS[u]}</p>
                  <p className="tabular mt-0.5 text-lg font-semibold">
                    {u === unit ? displayUnit(number) : `≈ ${displayUnit(results[u])}`}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-ink-faint">Enter a valid value to see conversions.</p>
        )}
      </div>

      <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-ink-faint">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        {DISCLAIMER_MEASUREMENTS}
      </p>
    </div>
  );
}

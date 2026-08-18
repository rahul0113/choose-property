import { Info } from "lucide-react";
import type { MeasurementStandard } from "@/types/database";
import { MEASUREMENT_UNITS, UNIT_LABELS, displayUnit, sqftToAll } from "@/lib/measurements/engine";
import { DISCLAIMER_MEASUREMENTS } from "@/lib/constants";

export function MeasurementTable({ areaSqft, standard }: { areaSqft: number; standard: MeasurementStandard }) {
  const all = sqftToAll(areaSqft, standard);
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-paper-line">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Area of {areaSqft} sq.ft in different measurement units using {standard.name}
          </caption>
          <thead className="bg-paper-soft text-xs uppercase tracking-wide text-ink-faint">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-semibold">Unit</th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-line bg-white">
            {MEASUREMENT_UNITS.map((u) => (
              <tr key={u}>
                <th scope="row" className="px-4 py-2.5 font-medium text-ink-soft">{UNIT_LABELS[u]}</th>
                <td className="tabular px-4 py-2.5 text-right font-semibold">
                  {u === "sqft" ? areaSqft.toLocaleString("en-IN") : `≈ ${displayUnit(all[u])}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink-soft">
        <span className="font-semibold">Standard used:</span> {standard.name}
        {standard.district ? ` (${standard.district} district)` : " (state-wide)"}
      </p>

      <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-ink-faint">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        {DISCLAIMER_MEASUREMENTS}
      </p>
    </div>
  );
}

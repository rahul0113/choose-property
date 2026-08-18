import { Info } from "lucide-react";
import type { PropertyMeasurement } from "@/types/database";
import { DISCLAIMER_DIAGRAM } from "@/lib/constants";
import { formatDimension } from "@/lib/format";

export function PlotDiagram({ measurements }: { measurements: PropertyMeasurement }) {
  const { north_ft, south_ft, east_ft, west_ft, road_frontage_ft, road_width_ft } = measurements;

  const dims = { north: north_ft, south: south_ft, east: east_ft, west: west_ft };
  const hasDims = Object.values(dims).some((v) => v != null);
  if (!hasDims) return null;

  const top = dims.north ?? dims.south ?? 40;
  const side = dims.east ?? dims.west ?? 60;

  return (
    <div className="rounded-xl border border-paper-line bg-paper-soft p-4">
      <svg viewBox="0 0 360 300" className="mx-auto w-full max-w-sm" role="img" aria-label="Plot diagram">
        {/* Plot body */}
        <rect x="70" y="60" width="220" height="140" rx="4" fill="#ccfbf1" stroke="#0f766e" strokeWidth="2" />

        {/* North label */}
        <text x="180" y="42" textAnchor="middle" fontSize="13" fill="#475569" fontWeight="600">
          North {formatDimension(top)}
        </text>
        {/* South label */}
        <text x="180" y="224" textAnchor="middle" fontSize="13" fill="#475569" fontWeight="600">
          South {formatDimension(dims.south)}
        </text>
        {/* West label */}
        <text x="52" y="133" textAnchor="middle" fontSize="13" fill="#475569" fontWeight="600">
          West {formatDimension(dims.west)}
        </text>
        {/* East label */}
        <text x="308" y="133" textAnchor="middle" fontSize="13" fill="#475569" fontWeight="600">
          East {formatDimension(dims.east)}
        </text>

        {/* Road at bottom */}
        <rect x="50" y="252" width="260" height="22" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeDasharray="4 3" />
        <text x="180" y="267" textAnchor="middle" fontSize="12" fill="#475569">
          Road {road_width_ft ? formatDimension(road_width_ft) : ""} wide
        </text>
        {road_frontage_ft != null && (
          <text x="180" y="243" textAnchor="middle" fontSize="11" fill="#94a3b8">
            Road frontage {formatDimension(road_frontage_ft)}
          </text>
        )}
      </svg>
      <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-ink-faint">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        {DISCLAIMER_DIAGRAM}
      </p>
    </div>
  );
}

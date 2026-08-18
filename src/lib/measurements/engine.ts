// Bihar-aware land measurement engine (FR-MEAS-01…06).
// Pure TypeScript, shared by the converter (/converter) and property pages.
// Base unit = square feet. All other units derive from it.

import type { MeasurementStandard } from "@/types/database";

export type MeasurementUnit =
  | "sqft"
  | "sqm"
  | "decimal"
  | "dismil"
  | "katha"
  | "bigha"
  | "acre"
  | "hectare";

export const MEASUREMENT_UNITS: MeasurementUnit[] = [
  "sqft",
  "sqm",
  "decimal",
  "dismil",
  "katha",
  "bigha",
  "acre",
  "hectare",
];

export const UNIT_LABELS: Record<MeasurementUnit, string> = {
  sqft: "Sq.ft",
  sqm: "Sq.m",
  decimal: "Decimal",
  dismil: "Dismil",
  katha: "Katha",
  bigha: "Bigha",
  acre: "Acre",
  hectare: "Hectare",
};

// Fixed international conversions.
export const SQFT_PER_ACRE = 43560;
export const SQFT_PER_HECTARE = 107639;
export const SQFT_PER_SQM = 10.7639;

export function toSqft(value: number, unit: MeasurementUnit, standard: MeasurementStandard): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case "sqft":
      return value;
    case "sqm":
      return value * SQFT_PER_SQM;
    case "decimal":
      return value * standard.decimal_sqft;
    case "dismil":
      return value * standard.decimal_sqft; // Dismil ≡ Decimal
    case "katha":
      return value * standard.katha_sqft;
    case "bigha":
      return value * standard.katha_sqft * standard.bigha_katha;
    case "acre":
      return value * SQFT_PER_ACRE;
    case "hectare":
      return value * SQFT_PER_HECTARE;
  }
}

export function fromSqft(sqft: number, unit: MeasurementUnit, standard: MeasurementStandard): number | null {
  if (!Number.isFinite(sqft) || sqft < 0) return null;
  switch (unit) {
    case "sqft":
      return sqft;
    case "sqm":
      return sqft / SQFT_PER_SQM;
    case "decimal":
      return sqft / standard.decimal_sqft;
    case "dismil":
      return sqft / standard.decimal_sqft;
    case "katha":
      return sqft / standard.katha_sqft;
    case "bigha":
      return sqft / (standard.katha_sqft * standard.bigha_katha);
    case "acre":
      return sqft / SQFT_PER_ACRE;
    case "hectare":
      return sqft / SQFT_PER_HECTARE;
  }
}

export function convert(
  value: number,
  from: MeasurementUnit,
  to: MeasurementUnit,
  standard: MeasurementStandard
): number | null {
  const sqft = toSqft(value, from, standard);
  if (sqft == null) return null;
  return fromSqft(sqft, to, standard);
}

/** Full conversion grid from a base sq.ft value using the given standard. */
export function sqftToAll(sqft: number, standard: MeasurementStandard): Record<MeasurementUnit, number> {
  const out = {} as Record<MeasurementUnit, number>;
  for (const unit of MEASUREMENT_UNITS) {
    const v = fromSqft(sqft, unit, standard);
    out[unit] = v == null ? 0 : v;
  }
  return out;
}

/** Human-friendly rounded value for display (e.g. 1,361 → "1,361", 0.72 → "0.72"). */
export function displayUnit(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1000) return Math.round(value).toLocaleString("en-IN");
  if (value >= 100) return value.toFixed(1);
  if (value >= 10) return value.toFixed(2);
  return value.toFixed(2).replace(/\.?0+$/, "");
}

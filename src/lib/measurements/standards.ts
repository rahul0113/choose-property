// Default Bihar measurement standards — mirrors the seed data in
// supabase/migrations/0001_init.sql. In production these come from the
// measurement_standards table; this module is the offline/demo source.

import type { MeasurementStandard } from "@/types/database";

export const STANDARDS: MeasurementStandard[] = [
  {
    id: "std-bihar-patna",
    name: "Bihar Standard (Patna)",
    state: "Bihar",
    district: null,
    katha_sqft: 1361,
    bigha_katha: 20,
    decimal_sqft: 435.6,
    is_default: true,
  },
  { id: "std-patna", name: "Patna District", state: "Bihar", district: "Patna", katha_sqft: 1361, bigha_katha: 20, decimal_sqft: 435.6, is_default: false },
  { id: "std-gaya", name: "Gaya District", state: "Bihar", district: "Gaya", katha_sqft: 1361, bigha_katha: 20, decimal_sqft: 435.6, is_default: false },
  { id: "std-muzaffarpur", name: "Muzaffarpur District", state: "Bihar", district: "Muzaffarpur", katha_sqft: 1361, bigha_katha: 20, decimal_sqft: 435.6, is_default: false },
  { id: "std-darbhanga", name: "Darbhanga District", state: "Bihar", district: "Darbhanga", katha_sqft: 1361, bigha_katha: 20, decimal_sqft: 435.6, is_default: false },
  { id: "std-purnia", name: "Purnia District", state: "Bihar", district: "Purnia", katha_sqft: 1361, bigha_katha: 20, decimal_sqft: 435.6, is_default: false },
  { id: "std-bhagalpur", name: "Bhagalpur District", state: "Bihar", district: "Bhagalpur", katha_sqft: 1361, bigha_katha: 20, decimal_sqft: 435.6, is_default: false },
];

export function getStandard(id: string | null | undefined): MeasurementStandard {
  if (id) {
    const found = STANDARDS.find((s) => s.id === id);
    if (found) return found;
  }
  return STANDARDS.find((s) => s.is_default) ?? STANDARDS[0];
}

export function getStandardsForDistrict(district: string | null | undefined): MeasurementStandard[] {
  if (!district) return STANDARDS;
  const matches = STANDARDS.filter((s) => s.district === district);
  return matches.length > 0 ? matches : STANDARDS;
}

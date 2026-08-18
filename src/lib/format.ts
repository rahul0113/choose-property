// Number + distance formatting helpers (Indian locale, tabular figures).

export function formatNumber(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Number(value.toFixed(maxDecimals));
  return rounded.toLocaleString("en-IN", { maximumFractionDigits: maxDecimals });
}

export function formatAreaSqft(value: number): string {
  return `${formatNumber(value, 0)} sq.ft`;
}

export function formatDistance(km: number | null): string {
  if (km == null) return "—";
  if (km < 1) return `${formatNumber(km * 1000, 0)} m`;
  return `${formatNumber(km, 1)} km`;
}

export function formatDimension(ft: number | null): string {
  return ft == null ? "—" : `${formatNumber(ft, 0)} ft`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

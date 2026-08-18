// Human-facing ID generators (FR-SEO-06): CP-BR-0001, CP-LEAD-0045.

export function formatSequence(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(4, "0");
}

export function propertyIdFromSequence(stateCode: string, n: number): string {
  return `CP-${stateCode.toUpperCase()}-${formatSequence(n)}`;
}

export function leadIdFromSequence(n: number): string {
  return `CP-LEAD-${formatSequence(n)}`;
}

/** Next property ID from existing property IDs (e.g. ["CP-BR-0001", "CP-BR-0007"] → CP-BR-0008). */
export function nextPropertyId(stateCode: string, existing: string[]): string {
  const max = existing.reduce((acc, id) => {
    const m = /CP-[A-Z]{2}-(\d+)$/.exec(id);
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
  }, 0);
  return propertyIdFromSequence(stateCode, max + 1);
}

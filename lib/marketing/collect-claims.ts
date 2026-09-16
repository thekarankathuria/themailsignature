/**
 * Walks any value and returns every string found under a `claims` array,
 * a `features` array or a `claimId` field. Content modules use those three
 * shapes to cite entries in CLAIMS; the guard scripts use this to find them.
 */
export function collectClaimIds(value: unknown, seen = new Set<unknown>()): string[] {
  if (value === null || typeof value !== "object" || seen.has(value)) return [];
  seen.add(value);
  const found: string[] = [];
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if ((key === "claims" || key === "features") && Array.isArray(child)) {
      found.push(...child.filter((c): c is string => typeof c === "string"));
    } else if (key === "claimId" && typeof child === "string") {
      found.push(child);
    }
    found.push(...collectClaimIds(child, seen));
  }
  return found;
}

const SLUG_RE = /^[a-z][a-z0-9-]{1,62}$/;

/** Canonical slug for API (must match admin create rules). */
export function normalizeReportSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!s || !SLUG_RE.test(s)) return null;
  return s;
}

/** Best-effort slug from filename or title (may still fail `normalizeReportSlug`). */
export function slugSuggestionFromLabel(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let out = s || "new-report";
  if (!/^[a-z]/.test(out)) {
    out = `r-${out}`;
  }
  return out.slice(0, 63);
}

/** Returns a slug that passes `normalizeReportSlug`, or a safe fallback. */
export function coerceValidReportSlug(raw: string): string {
  let base = slugSuggestionFromLabel(raw);
  let n = normalizeReportSlug(base);
  if (n) return n;
  base = `${base}-doc`;
  n = normalizeReportSlug(base);
  if (n) return n;
  return "catalog-report";
}

import { getSql } from "@/lib/db";
import type { Report } from "@/data/reports";
import { reports } from "@/data/reports";

export type ReportOverrideRow = {
  report_id: string;
  price_usdt: string | number | null;
  doc_public_path: string | null;
  pdf_public_path: string | null;
};

export function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "string" ? Number(v) : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function mergeReportWithOverride(base: Report, row: ReportOverrideRow | null): Report {
  if (!row) return base;
  const price = numOrNull(row.price_usdt);
  return {
    ...base,
    ...(price !== null ? { priceUsdt: price } : {}),
    ...(row.doc_public_path ? { fullReportPath: row.doc_public_path } : {}),
    ...(row.pdf_public_path ? { fullReportPdfPath: row.pdf_public_path } : {}),
  };
}

export async function fetchReportOverrideRow(
  reportId: string,
): Promise<ReportOverrideRow | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql`
    SELECT report_id, price_usdt, doc_public_path, pdf_public_path
    FROM report_overrides
    WHERE report_id = ${reportId}
  `;
  const r = (rows as ReportOverrideRow[])[0];
  return r ?? null;
}

export async function fetchAllOverrideRows(): Promise<Map<string, ReportOverrideRow>> {
  const sql = getSql();
  const m = new Map<string, ReportOverrideRow>();
  if (!sql) return m;
  const rows = await sql`
    SELECT report_id, price_usdt, doc_public_path, pdf_public_path
    FROM report_overrides
  `;
  for (const row of rows as ReportOverrideRow[]) {
    m.set(row.report_id, row);
  }
  return m;
}

export async function mergeReportFromDb(base: Report): Promise<Report> {
  const row = await fetchReportOverrideRow(base.id);
  return mergeReportWithOverride(base, row);
}

export type CatalogEntry = {
  id: string;
  slug: string;
  title: string;
  sector: string;
  priceUsdt: number;
};

export async function buildMergedCatalog(): Promise<CatalogEntry[]> {
  const map = await fetchAllOverrideRows();
  return reports.map((r) => {
    const row = map.get(r.id) ?? null;
    const merged = mergeReportWithOverride(r, row);
    return {
      id: merged.id,
      slug: merged.slug,
      title: merged.title,
      sector: merged.sector,
      priceUsdt: merged.priceUsdt,
    };
  });
}

export async function upsertOverridePatch(
  reportId: string,
  patch: {
    priceUsdt?: number | null;
    docPath?: string | null;
    pdfPath?: string | null;
  },
): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("Database not configured");
  const cur = await fetchReportOverrideRow(reportId);
  const price =
    patch.priceUsdt !== undefined ? patch.priceUsdt : numOrNull(cur?.price_usdt ?? null);
  const doc =
    patch.docPath !== undefined ? patch.docPath : cur?.doc_public_path ?? null;
  const pdf =
    patch.pdfPath !== undefined ? patch.pdfPath : cur?.pdf_public_path ?? null;

  const empty =
    price === null &&
    (doc === null || doc === "") &&
    (pdf === null || pdf === "");
  if (empty) {
    await sql`DELETE FROM report_overrides WHERE report_id = ${reportId}`;
    return;
  }

  await sql`
    INSERT INTO report_overrides (report_id, price_usdt, doc_public_path, pdf_public_path, updated_at)
    VALUES (
      ${reportId},
      ${price},
      ${doc},
      ${pdf},
      now()
    )
    ON CONFLICT (report_id) DO UPDATE SET
      price_usdt = EXCLUDED.price_usdt,
      doc_public_path = EXCLUDED.doc_public_path,
      pdf_public_path = EXCLUDED.pdf_public_path,
      updated_at = now()
  `;
}

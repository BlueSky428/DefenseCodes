import type { MonteCarloRow, RecommendationRow, Report, ReportSector } from "@/data/reports";
import { reports as builtinReports } from "@/data/reports";
import { getSql } from "@/lib/db";
import { fetchAllOverrideRows, mergeReportWithOverride } from "@/lib/report-overrides";

const SECTORS: ReportSector[] = ["Space", "Defense", "Aerospace"];

export function isReportSector(s: string): s is ReportSector {
  return (SECTORS as string[]).includes(s);
}

export function parseReportPayload(o: unknown): Report | null {
  if (!o || typeof o !== "object") return null;
  const r = o as Record<string, unknown>;
  const slug = typeof r.slug === "string" && r.slug.trim() ? r.slug.trim() : null;
  const id = typeof r.id === "string" && r.id.trim() ? r.id.trim() : slug;
  if (!slug || !id) return null;
  const title = typeof r.title === "string" && r.title.trim() ? r.title.trim() : null;
  if (!title) return null;
  const sectorRaw = typeof r.sector === "string" ? r.sector.trim() : "";
  if (!isReportSector(sectorRaw)) return null;
  const date = typeof r.date === "string" && r.date.trim() ? r.date.trim() : "—";
  const riskHighlight =
    typeof r.riskHighlight === "string" && r.riskHighlight.trim()
      ? r.riskHighlight.trim()
      : "—";
  const author =
    typeof r.author === "string" && r.author.trim() ? r.author.trim() : "Unknown";
  const version =
    typeof r.version === "string" && r.version.trim() ? r.version.trim() : "v1";
  const classification =
    typeof r.classification === "string" && r.classification.trim()
      ? r.classification.trim()
      : "COMMERCIAL IN CONFIDENCE";
  const methodology =
    typeof r.methodology === "string" && r.methodology.trim()
      ? r.methodology.trim()
      : "—";
  const pageCount =
    typeof r.pageCount === "number" && Number.isInteger(r.pageCount) && r.pageCount > 0
      ? r.pageCount
      : 1;
  const priceUsdt =
    typeof r.priceUsdt === "number" && Number.isFinite(r.priceUsdt) && r.priceUsdt >= 0
      ? r.priceUsdt
      : 1;
  const fullReportPath =
    typeof r.fullReportPath === "string" && r.fullReportPath.trim()
      ? r.fullReportPath.trim()
      : "/reports/doc/placeholder.docx";
  const fullReportPdfPath =
    typeof r.fullReportPdfPath === "string" && r.fullReportPdfPath.trim()
      ? r.fullReportPdfPath.trim()
      : "/reports/pdf/placeholder.pdf";

  const exec = Array.isArray(r.executiveSummary)
    ? (r.executiveSummary as unknown[]).filter(
        (x): x is string => typeof x === "string" && x.trim() !== "",
      )
    : [];
  const mc = Array.isArray(r.monteCarlo)
    ? (r.monteCarlo as unknown[]).filter((row): row is MonteCarloRow => {
        if (!row || typeof row !== "object") return false;
        const m = row as Record<string, unknown>;
        return (
          typeof m.label === "string" &&
          typeof m.value === "string" &&
          (!m.note || typeof m.note === "string")
        );
      })
    : [];
  const rec = Array.isArray(r.recommendationsPreview)
    ? (r.recommendationsPreview as unknown[]).filter((row): row is RecommendationRow => {
        if (!row || typeof row !== "object") return false;
        const m = row as Record<string, unknown>;
        return (
          typeof m.priority === "string" &&
          typeof m.action === "string" &&
          typeof m.horizon === "string"
        );
      })
    : [];

  return {
    id,
    slug,
    title,
    sector: sectorRaw,
    date,
    riskHighlight,
    author,
    version,
    classification,
    methodology,
    pageCount,
    priceUsdt,
    fullReportPath,
    fullReportPdfPath,
    executiveSummary: exec.length ? exec : ["Executive summary to be added."],
    monteCarlo: mc,
    recommendationsPreview: rec,
  };
}

export const builtinReportIds = new Set(builtinReports.map((r) => r.id));
export const builtinReportSlugs = new Set(builtinReports.map((r) => r.slug));

export async function fetchHiddenBuiltinIds(): Promise<Set<string>> {
  const sql = getSql();
  if (!sql) return new Set();
  const rows = await sql`SELECT report_id FROM report_catalog_hidden`;
  return new Set((rows as { report_id: string }[]).map((r) => r.report_id));
}

type DefinitionRow = { id: string; slug: string; body: unknown };

export async function fetchDynamicReportIdSet(): Promise<Set<string>> {
  const sql = getSql();
  if (!sql) return new Set();
  const rows = await sql`SELECT id FROM report_definitions`;
  return new Set((rows as { id: string }[]).map((r) => r.id));
}

export async function fetchDynamicDefinitions(): Promise<Report[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, slug, body FROM report_definitions ORDER BY updated_at DESC
  `;
  const out: Report[] = [];
  for (const row of rows as DefinitionRow[]) {
    let body: unknown = row.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body) as unknown;
      } catch {
        continue;
      }
    }
    const parsed = parseReportPayload(body);
    if (parsed && parsed.id === row.id && parsed.slug === row.slug) {
      out.push(parsed);
    }
  }
  return out;
}

/** Active catalog: visible built-ins + dynamic reports (DB). */
export async function resolveAllReports(): Promise<Report[]> {
  const hidden = await fetchHiddenBuiltinIds();
  const dynamics = await fetchDynamicDefinitions();
  const vis = builtinReports.filter((r) => !hidden.has(r.id));
  return [...vis, ...dynamics];
}

export async function resolveReportBySlug(slug: string): Promise<Report | undefined> {
  const all = await resolveAllReports();
  return all.find((r) => r.slug === slug);
}

export type CatalogEntry = {
  id: string;
  slug: string;
  title: string;
  sector: string;
  priceUsdt: number;
  date: string;
  riskHighlight: string;
};

export async function buildMergedCatalog(): Promise<CatalogEntry[]> {
  const list = await resolveAllReports();
  const map = await fetchAllOverrideRows();
  return list.map((r) => {
    const row = map.get(r.id) ?? null;
    const merged = mergeReportWithOverride(r, row);
    return {
      id: merged.id,
      slug: merged.slug,
      title: merged.title,
      sector: merged.sector,
      priceUsdt: merged.priceUsdt,
      date: merged.date,
      riskHighlight: merged.riskHighlight,
    };
  });
}

export async function reportExistsInCatalog(reportId: string): Promise<boolean> {
  const all = await resolveAllReports();
  return all.some((r) => r.id === reportId);
}

export function isBuiltinReportId(id: string): boolean {
  return builtinReportIds.has(id);
}

export async function isDynamicReportId(id: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  const rows = await sql`SELECT 1 FROM report_definitions WHERE id = ${id} LIMIT 1`;
  return (rows as unknown[]).length > 0;
}

export type HiddenBuiltinRow = { id: string; title: string; slug: string; sector: string };

export async function listHiddenBuiltinsForAdmin(): Promise<HiddenBuiltinRow[]> {
  const hidden = await fetchHiddenBuiltinIds();
  return builtinReports
    .filter((r) => hidden.has(r.id))
    .map((r) => ({ id: r.id, title: r.title, slug: r.slug, sector: r.sector }));
}

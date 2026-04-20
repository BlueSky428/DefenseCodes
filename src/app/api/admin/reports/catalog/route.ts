import { NextRequest, NextResponse } from "next/server";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import {
  isReportSector,
  parseReportPayload,
  resolveAllReports,
} from "@/lib/reports-catalog";

const SLUG_RE = /^[a-z][a-z0-9-]{1,62}$/;

function adminJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function normalizeSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!s || !SLUG_RE.test(s)) return null;
  return s;
}

/** Create a catalog (dynamic) report. */
export async function POST(req: NextRequest) {
  if (!adminSecretConfigured()) {
    return adminJson({ error: "ADMIN_API_SECRET is not set" }, 503);
  }
  if (!verifyAdminRequest(req)) {
    return adminJson({ error: "Unauthorized" }, 401);
  }
  const sql = getSql();
  if (!sql) {
    return adminJson({ error: "DATABASE_URL is not set" }, 503);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return adminJson({ error: "Invalid JSON" }, 400);
  }
  const o = body as Record<string, unknown>;
  const slugNorm = typeof o.slug === "string" ? normalizeSlug(o.slug) : null;
  if (!slugNorm) {
    return adminJson(
      { error: "Invalid slug (lowercase letters, digits, hyphen; 2–63 chars)" },
      400,
    );
  }

  const existing = await resolveAllReports();
  if (existing.some((r) => r.slug === slugNorm)) {
    return adminJson({ error: "Slug already in use" }, 409);
  }

  const title = typeof o.title === "string" ? o.title.trim() : "";
  if (!title) {
    return adminJson({ error: "Title is required" }, 400);
  }
  const sector = typeof o.sector === "string" ? o.sector.trim() : "";
  if (!isReportSector(sector)) {
    return adminJson({ error: "Invalid sector (Space, Defense, or Aerospace)" }, 400);
  }
  const date = typeof o.date === "string" ? o.date.trim() : "—";
  const riskHighlight =
    typeof o.riskHighlight === "string" && o.riskHighlight.trim()
      ? o.riskHighlight.trim()
      : "—";
  const author =
    typeof o.author === "string" && o.author.trim() ? o.author.trim() : "Unknown";
  const version =
    typeof o.version === "string" && o.version.trim() ? o.version.trim() : "v1";
  const classification =
    typeof o.classification === "string" && o.classification.trim()
      ? o.classification.trim()
      : "COMMERCIAL IN CONFIDENCE";
  const methodology =
    typeof o.methodology === "string" && o.methodology.trim()
      ? o.methodology.trim()
      : "—";
  const pageCount =
    typeof o.pageCount === "number" && Number.isInteger(o.pageCount) && o.pageCount > 0
      ? o.pageCount
      : 24;
  const priceUsdt =
    typeof o.priceUsdt === "number" && Number.isFinite(o.priceUsdt) && o.priceUsdt >= 0
      ? o.priceUsdt
      : 1;
  const summaryLine =
    typeof o.summary === "string" && o.summary.trim()
      ? o.summary.trim()
      : "Executive summary to be completed.";

  const reportPayload = {
    id: slugNorm,
    slug: slugNorm,
    title,
    sector,
    date,
    riskHighlight,
    author,
    version,
    classification,
    methodology,
    pageCount,
    priceUsdt,
    fullReportPath: `/reports/doc/${slugNorm}.docx`,
    fullReportPdfPath: `/reports/pdf/${slugNorm}.pdf`,
    executiveSummary: [summaryLine],
    monteCarlo: [] as { label: string; value: string; note?: string }[],
    recommendationsPreview: [] as { priority: string; action: string; horizon: string }[],
  };

  const parsed = parseReportPayload(reportPayload);
  if (!parsed) {
    return adminJson({ error: "Could not build report payload" }, 400);
  }

  const json = JSON.stringify(parsed);
  try {
    await sql`
      INSERT INTO report_definitions (id, slug, body, updated_at)
      VALUES (${parsed.id}, ${parsed.slug}, ${json}, now())
    `;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/unique|duplicate/i.test(msg)) {
      return adminJson({ error: "Report id or slug already exists" }, 409);
    }
    console.error("[admin catalog POST]", e);
    return adminJson({ error: "Failed to create report" }, 500);
  }

  return adminJson({ ok: true, report: parsed });
}

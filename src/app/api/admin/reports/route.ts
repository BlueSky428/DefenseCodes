import { NextRequest, NextResponse } from "next/server";
import { reports } from "@/data/reports";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import {
  fetchAllOverrideRows,
  mergeReportWithOverride,
  numOrNull,
} from "@/lib/report-overrides";

function adminJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(req: NextRequest) {
  if (!adminSecretConfigured()) {
    return adminJson({ error: "ADMIN_API_SECRET is not set" }, 503);
  }
  if (!verifyAdminRequest(req)) {
    return adminJson({ error: "Unauthorized" }, 401);
  }
  const sqlConfigured = Boolean(process.env.DATABASE_URL?.trim());
  if (!sqlConfigured) {
    return adminJson({ error: "DATABASE_URL is not set" }, 503);
  }

  const map = await fetchAllOverrideRows();
  const list = reports.map((base) => {
    const row = map.get(base.id) ?? null;
    const merged = mergeReportWithOverride(base, row);
    return {
      id: base.id,
      slug: base.slug,
      title: base.title,
      sector: base.sector,
      defaultPriceUsdt: base.priceUsdt,
      effectivePriceUsdt: merged.priceUsdt,
      defaultDocPath: base.fullReportPath,
      defaultPdfPath: base.fullReportPdfPath,
      overridePriceUsdt: row ? numOrNull(row.price_usdt) : null,
      overrideDocPath: row?.doc_public_path ?? null,
      overridePdfPath: row?.pdf_public_path ?? null,
      effectiveDocPath: merged.fullReportPath,
      effectivePdfPath: merged.fullReportPdfPath,
    };
  });
  return adminJson({ reports: list });
}

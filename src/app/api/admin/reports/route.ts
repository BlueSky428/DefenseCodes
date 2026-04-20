import { NextRequest, NextResponse } from "next/server";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import {
  fetchDynamicReportIdSet,
  listHiddenBuiltinsForAdmin,
  resolveAllReports,
} from "@/lib/reports-catalog";
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
  if (!process.env.DATABASE_URL?.trim()) {
    return adminJson({ error: "DATABASE_URL is not set" }, 503);
  }

  const map = await fetchAllOverrideRows();
  const dynamicIds = await fetchDynamicReportIdSet();
  const mergedList = await resolveAllReports();
  const list = mergedList.map((base) => {
    const row = map.get(base.id) ?? null;
    const merged = mergeReportWithOverride(base, row);
    return {
      id: base.id,
      slug: base.slug,
      title: base.title,
      sector: base.sector,
      source: dynamicIds.has(base.id) ? ("dynamic" as const) : ("builtin" as const),
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
  const hiddenBuiltins = await listHiddenBuiltinsForAdmin();
  return adminJson({ reports: list, hiddenBuiltins });
}

import { NextRequest, NextResponse } from "next/server";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import {
  isBuiltinReportId,
  isDynamicReportId,
} from "@/lib/reports-catalog";

type Ctx = { params: Promise<{ reportId: string }> };

function adminJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** Remove from catalog: deletes dynamic reports, or hides built-in reports. */
export async function DELETE(req: NextRequest, ctx: Ctx) {
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

  const { reportId } = await ctx.params;
  if (!reportId.trim()) {
    return adminJson({ error: "Missing report id" }, 400);
  }

  const dynamic = await isDynamicReportId(reportId);
  if (dynamic) {
    try {
      await sql`DELETE FROM report_overrides WHERE report_id = ${reportId}`;
      await sql`DELETE FROM report_definitions WHERE id = ${reportId}`;
    } catch (e) {
      console.error("[admin catalog DELETE dynamic]", e);
      return adminJson({ error: "Failed to delete report" }, 500);
    }
    return adminJson({ ok: true, mode: "deleted" });
  }

  if (isBuiltinReportId(reportId)) {
    try {
      await sql`
        INSERT INTO report_catalog_hidden (report_id)
        VALUES (${reportId})
        ON CONFLICT (report_id) DO NOTHING
      `;
    } catch (e) {
      console.error("[admin catalog DELETE hide]", e);
      return adminJson({ error: "Failed to hide report" }, 500);
    }
    return adminJson({ ok: true, mode: "hidden" });
  }

  return adminJson({ error: "Unknown report id" }, 404);
}

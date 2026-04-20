import { NextRequest, NextResponse } from "next/server";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { isBuiltinReportId } from "@/lib/reports-catalog";

type Ctx = { params: Promise<{ reportId: string }> };

function adminJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** Un-hide a built-in report removed from the catalog earlier. */
export async function POST(req: NextRequest, ctx: Ctx) {
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
  if (!isBuiltinReportId(reportId)) {
    return adminJson({ error: "Only built-in reports can be restored this way" }, 400);
  }

  try {
    await sql`DELETE FROM report_catalog_hidden WHERE report_id = ${reportId}`;
  } catch (e) {
    console.error("[admin restore]", e);
    return adminJson({ error: "Failed to restore" }, 500);
  }
  return adminJson({ ok: true });
}

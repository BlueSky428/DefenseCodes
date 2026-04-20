import { NextRequest, NextResponse } from "next/server";
import { reportExistsInCatalog } from "@/lib/reports-catalog";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import {
  fetchReportOverrideRow,
  upsertOverridePatch,
} from "@/lib/report-overrides";
import { tryDeletePublicFile } from "@/lib/report-file-storage";

type Ctx = { params: Promise<{ reportId: string }> };

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!adminSecretConfigured()) {
    return NextResponse.json({ error: "ADMIN_API_SECRET is not set" }, { status: 503 });
  }
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "DATABASE_URL is not set" }, { status: 503 });
  }

  const { reportId } = await ctx.params;
  if (!(await reportExistsInCatalog(reportId))) {
    return NextResponse.json({ error: "Unknown report" }, { status: 404 });
  }

  const kind = req.nextUrl.searchParams.get("kind");
  if (kind !== "pdf" && kind !== "doc") {
    return NextResponse.json({ error: "kind must be pdf or doc" }, { status: 400 });
  }

  const row = await fetchReportOverrideRow(reportId);
  const path =
    kind === "pdf" ? row?.pdf_public_path ?? null : row?.doc_public_path ?? null;

  try {
    await tryDeletePublicFile(path);
    if (kind === "pdf") {
      await upsertOverridePatch(reportId, { pdfPath: null });
    } else {
      await upsertOverridePatch(reportId, { docPath: null });
    }
  } catch (e) {
    console.error("[admin file delete]", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

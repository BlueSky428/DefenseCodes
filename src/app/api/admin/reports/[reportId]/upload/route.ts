import { NextRequest, NextResponse } from "next/server";
import { reportExistsInCatalog } from "@/lib/reports-catalog";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import {
  fetchReportOverrideRow,
  upsertOverridePatch,
} from "@/lib/report-overrides";
import {
  tryDeletePublicFile,
  uploadPublicPath,
  writeUploadedFile,
} from "@/lib/report-file-storage";

type Ctx = { params: Promise<{ reportId: string }> };

const MAX_BYTES = 48 * 1024 * 1024;

export async function POST(req: NextRequest, ctx: Ctx) {
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

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const kind = form.get("kind");
  if (kind !== "pdf" && kind !== "doc") {
    return NextResponse.json({ error: "kind must be pdf or doc" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const lower = file.name.toLowerCase();
  if (kind === "pdf" && !lower.endsWith(".pdf")) {
    return NextResponse.json({ error: "PDF uploads must use a .pdf filename" }, { status: 400 });
  }
  if (kind === "doc" && !lower.endsWith(".docx") && !lower.endsWith(".doc")) {
    return NextResponse.json(
      { error: "Document uploads must use .docx or .doc" },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const publicPath = uploadPublicPath(reportId, file.name);
  const row = await fetchReportOverrideRow(reportId);
  const oldPath =
    kind === "pdf" ? row?.pdf_public_path ?? null : row?.doc_public_path ?? null;

  try {
    await writeUploadedFile(publicPath, buf);
    await tryDeletePublicFile(oldPath);
    if (kind === "pdf") {
      await upsertOverridePatch(reportId, { pdfPath: publicPath });
    } else {
      await upsertOverridePatch(reportId, { docPath: publicPath });
    }
  } catch (e) {
    console.error("[admin upload]", e);
    await tryDeletePublicFile(publicPath);
    return NextResponse.json(
      { error: "Upload failed (check server filesystem permissions for public/reports/uploads)" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, publicPath });
}

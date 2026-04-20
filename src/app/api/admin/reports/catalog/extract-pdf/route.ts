import { PDFParse } from "pdf-parse";
import { NextRequest, NextResponse } from "next/server";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import { hintsFromPdfContent } from "@/lib/pdf-catalog-hints";
import { coerceValidReportSlug } from "@/lib/report-slug";

export const runtime = "nodejs";

const MAX_BYTES = 20 * 1024 * 1024;

function adminJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Parse an uploaded PDF and return suggested catalog fields (metadata + first pages of text).
 */
export async function POST(req: NextRequest) {
  if (!adminSecretConfigured()) {
    return adminJson({ error: "ADMIN_API_SECRET is not set" }, 503);
  }
  if (!verifyAdminRequest(req)) {
    return adminJson({ error: "Unauthorized" }, 401);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return adminJson({ error: "Invalid form data" }, 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return adminJson({ error: "Missing file" }, 400);
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return adminJson({ error: "Only PDF files are supported" }, 400);
  }
  if (file.size > MAX_BYTES) {
    return adminJson({ error: "PDF too large (max 20 MB)" }, 413);
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const parser = new PDFParse({ data: new Uint8Array(buf) });

  try {
    const infoResult = await parser.getInfo();
    const textResult = await parser.getText({ first: 5 });
    const hints = hintsFromPdfContent(infoResult, textResult.text ?? "", file.name);
    const slugSuggestion = coerceValidReportSlug(hints.title || file.name);

    return adminJson({
      slugSuggestion,
      pdfFileName: file.name,
      ...hints,
    });
  } catch (e) {
    console.error("[extract-pdf]", e);
    const msg = e instanceof Error ? e.message : "Failed to read PDF";
    return adminJson(
      {
        error: msg,
        hint:
          "Some secured or scanned PDFs cannot be parsed. Try “Save as” from your editor, or fill the form manually.",
      },
      422,
    );
  } finally {
    try {
      await parser.destroy();
    } catch {
      /* ignore */
    }
  }
}

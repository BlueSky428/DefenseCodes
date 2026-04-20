import { NextRequest, NextResponse } from "next/server";
import { reportExistsInCatalog } from "@/lib/reports-catalog";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import { upsertOverridePatch } from "@/lib/report-overrides";

type Ctx = { params: Promise<{ reportId: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = body as Record<string, unknown>;
  if (!("priceUsdt" in o)) {
    return NextResponse.json({ error: "Missing priceUsdt (number or null)" }, { status: 400 });
  }
  const raw = o.priceUsdt;
  if (raw !== null) {
    if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 0) {
      return NextResponse.json({ error: "priceUsdt must be a non-negative number or null" }, { status: 400 });
    }
  }

  const priceUsdt = raw === null ? null : (raw as number);
  try {
    await upsertOverridePatch(reportId, { priceUsdt: priceUsdt ?? null });
  } catch (e) {
    console.error("[admin price]", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

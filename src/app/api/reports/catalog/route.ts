import { NextResponse } from "next/server";
import { buildMergedCatalog } from "@/lib/reports-catalog";

/** Public merged prices (and ids) for the reports library; no file paths. */
export async function GET() {
  try {
    const reports = await buildMergedCatalog();
    return NextResponse.json({ reports });
  } catch (e) {
    console.error("[catalog]", e);
    return NextResponse.json({ error: "Catalog unavailable" }, { status: 500 });
  }
}

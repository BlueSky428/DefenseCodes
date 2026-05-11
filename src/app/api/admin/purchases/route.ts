import { NextRequest, NextResponse } from "next/server";
import { adminSecretConfigured, verifyAdminRequest } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

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

  const sql = getSql();
  if (!sql) {
    return adminJson({ error: "DATABASE_URL is not set" }, 503);
  }

  const limitRaw = req.nextUrl.searchParams.get("limit")?.trim() ?? "100";
  const limit = Number(limitRaw);
  if (!Number.isFinite(limit) || limit < 1 || limit > 500) {
    return adminJson({ error: "Invalid limit (1-500)" }, 400);
  }

  try {
    const rows = await sql`
      SELECT id, report_id, wallet_address, chain_id, tx_hash, created_at
      FROM purchases
      ORDER BY created_at DESC
      LIMIT ${Math.floor(limit)}
    `;
    return adminJson({
      purchases: (rows as Array<Record<string, unknown>>).map((r) => ({
        id: String(r.id ?? ""),
        reportId: String(r.report_id ?? ""),
        walletAddress: String(r.wallet_address ?? ""),
        chainId: Number(r.chain_id ?? 0),
        txHash: String(r.tx_hash ?? ""),
        createdAt: String(r.created_at ?? ""),
      })),
    });
  } catch (e) {
    console.error("[admin purchases GET]", e);
    return adminJson(
      {
        error: "Failed to load purchases",
        hint: "Ensure `purchases` exists (run `db/schema.sql` in Neon).",
      },
      500,
    );
  }
}

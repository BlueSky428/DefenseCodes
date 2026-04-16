import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

const ADDR = /^0x[a-fA-F0-9]{40}$/;
const TX = /^0x[a-fA-F0-9]{64}$/;

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet")?.trim();
  if (!wallet || !ADDR.test(wallet)) {
    return NextResponse.json({ error: "Invalid or missing wallet" }, { status: 400 });
  }
  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ reportIds: [] as string[], dbConfigured: false });
  }
  const rows = await sql`
    SELECT report_id FROM purchases
    WHERE lower(wallet_address) = lower(${wallet})
  `;
  const reportIds = (rows as { report_id: string }[]).map((r) => r.report_id);
  return NextResponse.json({ reportIds, dbConfigured: true });
}

export async function POST(req: NextRequest) {
  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = body as Record<string, unknown>;
  const reportId = typeof o.reportId === "string" ? o.reportId.trim() : "";
  const walletAddress = typeof o.walletAddress === "string" ? o.walletAddress.trim() : "";
  const txHash = typeof o.txHash === "string" ? o.txHash.trim() : "";
  const chainRaw = o.chainId;

  if (!reportId || reportId.length > 128) {
    return NextResponse.json({ error: "Invalid reportId" }, { status: 400 });
  }
  if (!ADDR.test(walletAddress)) {
    return NextResponse.json({ error: "Invalid walletAddress" }, { status: 400 });
  }
  if (!TX.test(txHash)) {
    return NextResponse.json({ error: "Invalid txHash" }, { status: 400 });
  }

  let chainNum: number;
  try {
    chainNum = Number(BigInt(String(chainRaw)));
  } catch {
    return NextResponse.json({ error: "Invalid chainId" }, { status: 400 });
  }
  if (!Number.isFinite(chainNum) || chainNum < 0) {
    return NextResponse.json({ error: "Invalid chainId" }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO purchases (report_id, wallet_address, chain_id, tx_hash)
      VALUES (
        ${reportId},
        ${walletAddress.toLowerCase()},
        ${chainNum},
        ${txHash.toLowerCase()}
      )
      ON CONFLICT (chain_id, tx_hash) DO NOTHING
    `;
  } catch (e) {
    console.error("[purchases] insert failed", e);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

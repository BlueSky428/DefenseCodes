"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/glass-panel";
import { useWallet } from "@/context/wallet-context";
import { reports } from "@/data/reports";
import { WalletConnectEntry } from "@/components/wallet-connect-modal";

type CatalogEntry = { id: string; priceUsdt: number };

export function ReportsLibrary() {
  const { address } = useWallet();
  const [catalogPrices, setCatalogPrices] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (!address) {
      setCatalogPrices(null);
      return;
    }
    let cancelled = false;
    void fetch("/api/reports/catalog")
      .then((r) => r.json())
      .then((data: { reports?: CatalogEntry[] }) => {
        if (cancelled) return;
        const m: Record<string, number> = {};
        for (const e of data.reports ?? []) {
          m[e.id] = e.priceUsdt;
        }
        setCatalogPrices(m);
      })
      .catch(() => {
        if (!cancelled) setCatalogPrices({});
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

  if (!address) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <GlassPanel className="p-8 text-center">
          <h1 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white">
            Connect your wallet
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            The reports library is available after you connect with{" "}
            <strong className="text-slate-300">MetaMask</strong> or{" "}
            <strong className="text-slate-300">Phantom</strong> (Ethereum). Your
            address appears in the header; nothing is spent until you buy a report.
          </p>
          <div className="mt-8 flex justify-center">
            <WalletConnectEntry variant="block" />
          </div>
          <Link
            href="/"
            className="mt-6 inline-block text-sm text-slate-500 hover:text-[var(--accent)]"
          >
            ← Back to home
          </Link>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold text-white">
          Reports library
        </h1>
        <p className="mt-2 text-slate-400">
          March 2026 series: open a report for the free executive summary. Pay with
          USDT (ERC-20 or BEP-20) to unlock the full PDF; an editable .docx is
          included after purchase.
        </p>
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {reports.map((r) => (
          <li key={r.id}>
            <GlassPanel className="flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-[var(--accent)]/35 px-2 py-0.5 text-[var(--accent)]">
                  {r.sector}
                </span>
                <span className="text-slate-500">{r.date}</span>
              </div>
              <h2 className="mt-3 font-[family-name:var(--font-space)] text-xl font-semibold text-white">
                {r.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--accent)]">{r.riskHighlight}</p>
              <p className="mt-3 text-xs text-slate-500">
                From{" "}
                <span className="font-semibold text-slate-300">
                  {catalogPrices === null
                    ? "…"
                    : (catalogPrices[r.id] ?? r.priceUsdt)}{" "}
                  USDT
                </span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/report/${r.slug}`}
                  className="inline-flex rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent)]/20 hover:text-[var(--accent)]"
                >
                  View executive summary
                </Link>
              </div>
            </GlassPanel>
          </li>
        ))}
      </ul>
    </div>
  );
}

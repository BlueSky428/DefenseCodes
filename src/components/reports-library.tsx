"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/glass-panel";
import { useWallet } from "@/context/wallet-context";
import { reports as builtinReports } from "@/data/reports";
import { WalletConnectEntry } from "@/components/wallet-connect-modal";

type CatalogRow = {
  id: string;
  slug: string;
  title: string;
  sector: string;
  priceUsdt: number;
  date: string;
  riskHighlight: string;
};

export function ReportsLibrary() {
  const { address } = useWallet();
  const [catalog, setCatalog] = useState<CatalogRow[] | undefined | null>(undefined);

  const builtinMapped: CatalogRow[] = builtinReports.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    sector: r.sector,
    priceUsdt: r.priceUsdt,
    date: r.date,
    riskHighlight: r.riskHighlight,
  }));

  useEffect(() => {
    if (!address) {
      setCatalog(undefined);
      return;
    }
    let cancelled = false;
    setCatalog(undefined);
    void fetch("/api/reports/catalog")
      .then((r) => r.json())
      .then((data: { reports?: CatalogRow[] }) => {
        if (cancelled) return;
        setCatalog(data.reports ?? []);
      })
      .catch(() => {
        if (!cancelled) setCatalog(null);
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

  const displayRows: CatalogRow[] =
    catalog && catalog.length > 0 ? catalog : builtinMapped;

  const catalogLoading = Boolean(address) && catalog === undefined;

  if (!address) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <GlassPanel className="border border-white/[0.08] p-8 text-center shadow-[0_0_0_1px_rgba(0,229,255,0.04)]">
          <h1 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white">
            Connect your wallet
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            The reports library is available after you connect with{" "}
            <strong className="text-slate-300">MetaMask</strong> or{" "}
            <strong className="text-slate-300">Phantom</strong> (Ethereum). Your address appears in
            the header; nothing is spent until you buy a report.
          </p>
          <div className="mt-8 flex justify-center">
            <WalletConnectEntry variant="block" />
          </div>
          <Link
            href="/"
            className="mt-6 inline-block text-sm text-slate-500 transition hover:text-[var(--accent)]"
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Library
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-space)] text-3xl font-semibold tracking-tight text-white">
          Reports
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Open a report for the free executive summary. Pay with USDT (ERC-20 or BEP-20 on your
          wallet network) to unlock the full PDF; an editable .docx is included after purchase.
        </p>
        {catalogLoading ? (
          <p className="mt-2 text-xs text-slate-500">Refreshing catalog…</p>
        ) : null}
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {displayRows.map((r) => (
          <li key={r.id}>
            <GlassPanel className="flex h-full flex-col border border-white/[0.08] p-6 transition hover:border-[var(--accent)]/20 hover:shadow-[0_0_0_1px_rgba(0,229,255,0.06)]">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-[var(--accent)]/35 px-2 py-0.5 font-medium text-[var(--accent)]">
                  {r.sector}
                </span>
                <span className="text-slate-500">{r.date}</span>
              </div>
              <h2 className="mt-3 font-[family-name:var(--font-space)] text-xl font-semibold text-white">
                {r.title}
              </h2>
              <p className="mt-2 text-sm leading-snug text-[var(--accent)]">{r.riskHighlight}</p>
              <p className="mt-3 text-xs text-slate-500">
                From{" "}
                <span className="font-semibold text-slate-300">
                  {catalogLoading ? "…" : r.priceUsdt} USDT
                </span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/report/${r.slug}`}
                  className="inline-flex rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
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

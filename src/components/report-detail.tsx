"use client";

import { useState } from "react";
import Link from "next/link";
import type { Report } from "@/data/reports";
import { GlassPanel } from "@/components/glass-panel";
import { usePurchase } from "@/context/purchase-context";
import { useWallet } from "@/context/wallet-context";
import { PurchaseModal } from "@/components/purchase-modal";

function chainLabel(chainId: bigint | null): string {
  if (chainId === null) return "n/a";
  const n = Number(chainId);
  if (n === 11155111) return "Sepolia";
  if (n === 97) return "BSC Testnet";
  if (n === 56) return "BSC Mainnet";
  if (n === 1) return "Ethereum Mainnet";
  return `Chain ${n}`;
}

export function ReportDetail({ report }: { report: Report }) {
  const { chainId } = useWallet();
  const { isUnlocked } = usePurchase();
  const unlocked = isUnlocked(report.id);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <PurchaseModal
        report={report}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <Link href="/reports" className="hover:text-[var(--accent)]">
            ← Reports library
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">{report.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(260px,320px)_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {unlocked ? (
              <>
                <GlassPanel className="p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Report metadata
                  </h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Author</dt>
                      <dd className="text-slate-100">{report.author}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Version</dt>
                      <dd className="text-slate-100">{report.version}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Publication</dt>
                      <dd className="text-slate-100">{report.date}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Classification</dt>
                      <dd className="text-slate-100">{report.classification}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Sector</dt>
                      <dd className="text-slate-100">{report.sector}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Wallet network</dt>
                      <dd className="font-mono text-xs text-[var(--accent)]">
                        {chainLabel(chainId)}
                      </dd>
                    </div>
                  </dl>
                </GlassPanel>
                <GlassPanel className="p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Methodology
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {report.methodology}
                  </p>
                </GlassPanel>
                <GlassPanel className="p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Key Monte Carlo outputs
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Tables from the full {report.pageCount}-page deliverable.
                  </p>
                  <ul className="mt-4 space-y-3">
                    {report.monteCarlo.map((row) => (
                      <li
                        key={row.label}
                        className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                      >
                        <div className="text-xs text-slate-500">{row.label}</div>
                        <div className="font-[family-name:var(--font-space)] text-lg font-semibold text-white">
                          {row.value}
                        </div>
                        {row.note ? (
                          <div className="text-xs text-slate-400">{row.note}</div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </GlassPanel>
              </>
            ) : (
              <GlassPanel className="p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  Free preview
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Only the executive summary is shown until you purchase. The full PDF
                  includes methodology, Monte Carlo tables, supplier context, and the
                  full recommendations register.
                </p>
                <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Sector</dt>
                    <dd className="text-right text-slate-200">{report.sector}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Pages</dt>
                    <dd className="text-right text-slate-200">{report.pageCount}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Unlock</dt>
                    <dd className="text-right font-medium text-[var(--accent)]">
                      {report.priceUsdt} USDT
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Your network</dt>
                    <dd className="text-right font-mono text-xs text-slate-300">
                      {chainLabel(chainId)}
                    </dd>
                  </div>
                </dl>
              </GlassPanel>
            )}
          </aside>

          <main className="min-w-0 space-y-8">
            <GlassPanel className="overflow-hidden">
              <div className="border-b border-white/10 bg-gradient-to-r from-[var(--accent)]/10 to-transparent px-6 py-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent)]">
                  <span className="rounded-full border border-[var(--accent)]/30 px-2 py-0.5">
                    {report.sector}
                  </span>
                  <span className="text-slate-500">{report.date}</span>
                </div>
                <h1 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {report.title}
                </h1>
                <p className="mt-2 text-sm text-[var(--accent)]">
                  {report.riskHighlight}
                </p>
              </div>
              <div className="space-y-6 px-6 py-8">
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Executive summary
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Free preview. Purchase with USDT (ERC-20 or BEP-20 on your wallet
                    network) to download the full report PDF.
                  </p>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-200">
                    {report.executiveSummary.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </section>

                {unlocked ? (
                  <section>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Recommendations (excerpt)
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Representative rows from the full register in the paid PDF.
                    </p>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full min-w-[480px] text-left text-sm">
                        <thead className="bg-white/[0.04] text-xs uppercase text-slate-400">
                          <tr>
                            <th className="px-4 py-3 font-medium">Priority</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                            <th className="px-4 py-3 font-medium">Horizon</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                          {report.recommendationsPreview.map((r, i) => (
                            <tr key={`${r.priority}-${i}`} className="bg-transparent">
                              <td className="px-4 py-3 font-mono text-[var(--accent)]">
                                {r.priority}
                              </td>
                              <td className="px-4 py-3">{r.action}</td>
                              <td className="px-4 py-3 text-slate-400">
                                {r.horizon}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ) : null}

                {!unlocked ? (
                  <section className="relative overflow-hidden rounded-2xl border border-dashed border-[var(--accent)]/35 bg-[#070b18]/80 p-8">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.07]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(-45deg, transparent, transparent 8px, #00e5ff 8px, #00e5ff 9px)",
                      }}
                    />
                    <div className="relative">
                      <h2 className="font-[family-name:var(--font-space)] text-lg font-semibold text-white">
                        Full report (locked)
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-slate-400">
                        {report.pageCount}-page deliverable with Monte Carlo tables,
                        supplier landscape, and full recommendations. Pay{" "}
                        {report.priceUsdt} USDT to unlock and download the PDF (Word
                        .docx also available).
                      </p>
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#0A0F1F] shadow-[0_0_32px_rgba(0,229,255,0.35)] transition hover:brightness-110"
                      >
                        Unlock with {report.priceUsdt} USDT
                      </button>
                    </div>
                  </section>
                ) : (
                  <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8">
                    <h2 className="font-[family-name:var(--font-space)] text-lg font-semibold text-emerald-300">
                      Full report unlocked
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                      After a confirmed on-chain USDT transfer, downloads are enabled
                      for this browser. Use the primary PDF for distribution; .docx is
                      provided for editing workflows.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a
                        href={report.fullReportPdfPath}
                        className="inline-flex justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                        download
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download full report (PDF)
                      </a>
                      <a
                        href={report.fullReportPath}
                        className="inline-flex justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                        download
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download full report (.docx)
                      </a>
                    </div>
                  </section>
                )}
              </div>
            </GlassPanel>
          </main>
        </div>
      </div>
    </>
  );
}

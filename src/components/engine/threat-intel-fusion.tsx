"use client";

import { MOCK_FEEDS } from "@/lib/engine/mock-api";
import type { TrustLevel } from "@/lib/engine/mock-api";

const TRUST_COLORS: Record<TrustLevel, string> = {
  HIGH: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  MED: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  LOW: "text-red-400 border-red-500/30 bg-red-500/10",
};

const TRUST_BAR: Record<TrustLevel, string> = {
  HIGH: "bg-emerald-400",
  MED: "bg-amber-400",
  LOW: "bg-red-400",
};

const TRUST_WEIGHT: Record<TrustLevel, number> = {
  HIGH: 85,
  MED: 50,
  LOW: 15,
};

const STATS = [
  { label: "ACTIVE FEEDS", value: "1,492", sub: "STREAMS", color: "text-[#00e5ff]" },
  { label: "POISONED DATA CAUGHT", value: "14.2", sub: "%", color: "text-red-400" },
  { label: "CONFIDENCE FLOOR", value: "0.65", sub: "TOLERANCE", color: "text-amber-400" },
  { label: "L1 DRIFT STATE", value: "NOMINAL", sub: "STATUS", color: "text-emerald-400" },
];

export function ThreatIntelFusion() {
  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white">
            Threat Intel Fusion
          </h1>
          <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-px font-mono text-[9px] font-bold uppercase tracking-widest text-purple-400">
            L1 Adversarial Screening
          </span>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
          Continuous ingestion, normalisation, and synthesis. Adversarial actors actively manipulate SCADA, AIS, and financial inputs. Passive ingestion is equivalent to poisoning the model.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-4"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">{s.label}</p>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className={`font-mono text-2xl font-bold leading-none ${s.color}`}>{s.value}</span>
              <span className="font-mono text-[10px] text-slate-600">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feed table */}
      <div className="rounded-lg border border-white/[0.07] bg-white/[0.025]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
            Live Feed Provenance Check
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-px font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Auto-Quarantine Active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["Stream ID", "Source Type", "Domain", "Trust Score", "Engine Weight", "Adversarial Flags (L1)"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {MOCK_FEEDS.map((feed) => (
                <tr key={feed.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-slate-600" aria-hidden>
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-mono text-xs font-semibold text-slate-300">{feed.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-slate-300">{feed.sourceType}</p>
                    <p className="font-mono text-[10px] text-slate-600">Age: {feed.sourceAge}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{feed.domain}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded border px-2 py-px font-mono text-[9px] font-bold uppercase ${TRUST_COLORS[feed.trustScore]}`}>
                      {feed.trustScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 rounded-full bg-white/[0.06]">
                        <div
                          className={`h-1 rounded-full ${TRUST_BAR[feed.trustScore]}`}
                          style={{ width: `${TRUST_WEIGHT[feed.trustScore]}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-slate-300">{feed.engineWeight}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {feed.adversarialFlags.length === 0 ? (
                      <span className="font-mono text-[10px] text-slate-600">No Flags</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {feed.adversarialFlags.map((flag) => (
                          <span
                            key={flag}
                            className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-px font-mono text-[9px] font-semibold text-red-400"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trust legend */}
        <div className="border-t border-white/[0.05] px-4 py-3">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-slate-600">
            Threat Classification Key
          </p>
          <div className="flex flex-wrap gap-4">
            {(["HIGH", "MED", "LOW"] as TrustLevel[]).map((t) => (
              <div key={t} className="flex items-center gap-2 font-mono text-[10px]">
                <span className={`rounded border px-1.5 py-px text-[9px] font-bold ${TRUST_COLORS[t]}`}>{t}</span>
                <span className="text-slate-600">
                  {t === "HIGH" ? "0.7–1.0 · Full weight" : t === "MED" ? "0.3–0.6 · Partial weight" : "0.0–0.2 · Auto-quarantine"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

// ── Static mock data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    type: "BASELINE",
    typeColor: "text-slate-400 border-slate-600/40 bg-slate-500/10",
    name: "Peacetime Steady-State",
    lossRaR: "$12M RaR",
    p90: "14 days",
    p90Delta: null,
    fromLabel: null,
  },
  {
    type: "STRESSED",
    typeColor: "text-red-400 border-red-500/40 bg-red-500/10",
    name: "Taiwan Strait Blockade",
    lossRaR: "$340M RaR",
    p90: "45 days",
    p90Delta: "+31 days",
    fromLabel: null,
  },
  {
    type: "MITIGATED",
    typeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    name: "Blockade + Sec. Supplier",
    lossRaR: "$85M RaR",
    p90: "22 days",
    p90Delta: "+23 from Stressed",
    fromLabel: "EXPECTED LOSS",
  },
];

const HEALTH_COMPONENTS = [
  { label: "Supplier Concentration Risk", score: 18, max: 25, color: "bg-red-500" },
  { label: "Transit Route Redundancy", score: 15, max: 25, color: "bg-red-500" },
  { label: "Inventory Buffer Adequacy", score: 20, max: 25, color: "bg-amber-500" },
  { label: "Adversarial Exposure", score: 19, max: 25, color: "bg-amber-500" },
];

const ADJ_QUEUE = [
  {
    id: "ADJ-8891",
    name: "Taiwan Strait Blockade (P99 = 62 Days)",
    note: "High discrepancy in Red Team HUMINT vs ERP data.",
    adj: "ADJ. REQUIRED: ANALYST J. DOE",
    adjColor: "text-amber-400",
    tag: "MANDATORY HITL",
    tagColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    id: "ADJ-8890",
    name: "Supplier Node Delta Capacity Drop",
    note: "Adversarial screening flagged 15% noise in latest report.",
    adj: "ADJ. REQUIRED: AUTO-GENERATED",
    adjColor: "text-slate-500",
    tag: "AUTO-QUEUED",
    tagColor: "text-slate-400 border-white/10 bg-white/[0.03]",
  },
];

const DECISION_JOURNAL = [
  { id: "#SCEN-842", name: "Taiwan Strait Blockade", status: "COMPLETED", statusColor: "text-emerald-400", analyst: "J.DOE", acc: "11/12 ACC", weight: "HIGH WEIGHT", ovr: "1 OVR", date: "22 May 22:18" },
  { id: "#SCEN-841", name: "Kinetic Strike: Hub Alpha", status: "COMPLETED", statusColor: "text-emerald-400", analyst: "M.SMITH", acc: "4/5 ACC", weight: "MED WEIGHT", ovr: "0 OVR", date: "21 May 14:05" },
  { id: "#SCEN-840", name: "Rare Earth Embargo", status: "REJECTED", statusColor: "text-red-400", analyst: "J.DOE", acc: "11/12 ACC", weight: "HIGH WEIGHT", ovr: "3 OVR", date: "19 May 09:12" },
];

const FRAGILE_PATH = [
  { type: "SUB-TIER SOURCE", node: "Supplier Node Delta", status: "DEGRADED", statusColor: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { type: "SPEC. COMPONENT", node: "Supplier Node Echo", status: "OFFLINE", statusColor: "text-red-400 border-red-500/30 bg-red-500/10" },
  { type: "CHOKEPOINT", node: "Transit Hub Alpha", status: "RED", statusColor: "text-red-400 border-red-500/30 bg-red-500/10" },
];

// ── Health ring ───────────────────────────────────────────────────────────────

function HealthRing({ score }: { score: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <svg viewBox="0 0 90 90" className="h-20 w-20" aria-hidden>
      <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle cx="45" cy="45" r={r} fill="none" stroke="#f59e0b" strokeWidth="8"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 45 45)" />
      <text x="45" y="49" textAnchor="middle" fontSize="18" fontWeight="700" fill="#f59e0b">{score}</text>
    </svg>
  );
}

// ── Panel wrapper ─────────────────────────────────────────────────────────────

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-white/[0.07] bg-white/[0.025] ${className}`}>
      {children}
    </div>
  );
}

function PanelHeader({ label, badge, badgeColor, action }: { label: string; badge?: string; badgeColor?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </span>
        {badge && (
          <span className={`rounded border px-1.5 py-px font-mono text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function EngineDashboard() {
  return (
    <div className="space-y-4 p-5">
      {/* Page title */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white">
              Command Center
            </h1>
            <span className="rounded border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-2 py-px font-mono text-[9px] font-bold uppercase tracking-widest text-[#00e5ff]">
              L6 Hybrid Product Output
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Supply chain risk analysis — active simulations and comparative scenario matrices.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/engine/simulation/new"
            className="inline-flex items-center gap-2 rounded-md bg-[#00e5ff] px-3 py-1.5 font-mono text-xs font-semibold text-[#0A0F1F] transition hover:brightness-110"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Simulation (MC)
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Full Stress Test Suite
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        {/* Scenario matrix */}
        <Panel>
          <PanelHeader label="L7 Interlocking Flow: Comparative Scenario Matrix" />
          <div className="p-4">
            {/* Dialect toggle */}
            <div className="mb-4 flex gap-1 rounded-md border border-white/[0.07] bg-white/[0.02] p-0.5 w-fit">
              {["Financial Dialect", "Operational Dialect"].map((d, i) => (
                <button
                  key={d}
                  type="button"
                  className={`rounded px-3 py-1.5 font-mono text-xs font-semibold transition ${i === 0 ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-300"}`}
                >
                  {d}
                </button>
              ))}
            </div>
            {/* Scenario columns */}
            <div className="grid gap-3 sm:grid-cols-3">
              {SCENARIOS.map((s) => (
                <div
                  key={s.type}
                  className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 space-y-3"
                >
                  <span className={`inline-block rounded border px-1.5 py-px font-mono text-[9px] font-bold uppercase tracking-widest ${s.typeColor}`}>
                    {s.type}
                  </span>
                  <p className="font-[family-name:var(--font-space)] text-sm font-semibold text-white leading-snug">
                    {s.name}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Expected Loss</p>
                      <p className={`mt-0.5 font-mono text-xl font-bold ${s.type === "STRESSED" ? "text-red-400" : s.type === "MITIGATED" ? "text-emerald-400" : "text-[#00e5ff]"}`}>
                        {s.lossRaR}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">P90 Delivery</p>
                      <p className="mt-0.5 font-mono text-lg font-bold text-white">
                        {s.p90}
                        {s.p90Delta && (
                          <span className={`ml-2 text-sm ${s.type === "STRESSED" ? "text-red-400" : "text-emerald-400"}`}>
                            {s.p90Delta}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Network health */}
        <Panel>
          <PanelHeader label="Network Health" badge="Aggregate Exposure" badgeColor="text-slate-400 border-white/10 bg-white/[0.03]" />
          <div className="p-4">
            <div className="flex items-center gap-4">
              <HealthRing score={72} />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Vulnerability Score (Now)</p>
                <p className="font-mono text-2xl font-bold text-amber-400">72</p>
                <p className="font-mono text-xs font-semibold text-amber-400">MODERATE RISK</p>
                <p className="mt-1 font-mono text-[10px] text-slate-600">Score 30 days ago: <span className="text-slate-400">85</span></p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Component Breakdown</p>
              {HEALTH_COMPONENTS.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <span className="flex-1 truncate text-[11px] text-slate-400">{c.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-16 rounded-full bg-white/[0.06]">
                      <div className={`h-1 rounded-full ${c.color}`} style={{ width: `${(c.score / c.max) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right font-mono text-[10px] font-semibold text-slate-300">
                      {c.score}/{c.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_240px]">
        {/* Adjudication Queue */}
        <Panel>
          <PanelHeader
            label="Adjudication Queue"
            badge="Mandatory HITL"
            badgeColor="text-amber-400 border-amber-500/30 bg-amber-500/10"
          />
          <div className="divide-y divide-white/[0.05]">
            {ADJ_QUEUE.map((item) => (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden>
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{item.note}</p>
                    <p className={`mt-1.5 font-mono text-[10px] font-semibold ${item.adjColor}`}>
                      {item.adj}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded border px-1.5 py-px font-mono text-[9px] font-bold uppercase ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.05] px-4 py-2">
            <Link href="/engine/adjudication" className="font-mono text-[10px] text-[#00e5ff] transition hover:brightness-125">
              View full queue →
            </Link>
          </div>
        </Panel>

        {/* Decision Journal */}
        <Panel>
          <PanelHeader
            label="Decision Journal"
            action={
              <Link href="/engine/adjudication" className="font-mono text-[10px] text-[#00e5ff] transition hover:brightness-125">
                VIEW ALL
              </Link>
            }
          />
          <div className="divide-y divide-white/[0.05]">
            {DECISION_JOURNAL.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500">{entry.id}</span>
                    <span className={`font-mono text-[9px] font-bold ${entry.statusColor}`}>{entry.status}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-slate-200">{entry.name}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-600">{entry.analyst} · {entry.acc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[10px] font-semibold text-slate-400">{entry.weight}</p>
                  <p className="font-mono text-[10px] text-slate-600">{entry.ovr}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-600">{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Most Fragile Path */}
        <Panel>
          <PanelHeader label="Most Fragile Path" badge="KCCS Weighted" badgeColor="text-slate-500 border-white/[0.07] bg-white/[0.02]" />
          <div className="p-4 space-y-2">
            {FRAGILE_PATH.map((node, i) => (
              <div key={node.node}>
                <div className="rounded-md border border-white/[0.07] bg-white/[0.02] p-3">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">{node.type}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-200">{node.node}</p>
                  <span className={`mt-1.5 inline-block rounded border px-1.5 py-px font-mono text-[9px] font-bold uppercase ${node.statusColor}`}>
                    {node.status}
                  </span>
                </div>
                {i < FRAGILE_PATH.length - 1 && (
                  <div className="flex justify-center py-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-slate-700" aria-hidden>
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

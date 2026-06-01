"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { MOCK_ANALYSTS } from "@/lib/engine/mock-api";
import type { MockAnalyst } from "@/lib/engine/mock-api";

const WEIGHT_COLORS: Record<MockAnalyst["weightLabel"], string> = {
  "HIGH WT": "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  "MED WT": "text-amber-400 border-amber-500/30 bg-amber-500/10",
  "LOW WT": "text-red-400 border-red-500/30 bg-red-500/10",
};

function AnalystListItem({
  analyst,
  selected,
  onClick,
}: {
  analyst: MockAnalyst;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md border p-3 text-left transition-all ${
        selected
          ? "border-[#00e5ff]/30 bg-[#00e5ff]/[0.05]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-white">{analyst.name}</span>
        <span className={`rounded border px-1.5 py-px font-mono text-[9px] font-bold ${WEIGHT_COLORS[analyst.weightLabel]}`}>
          {analyst.weightLabel}
        </span>
      </div>
      <p className="mt-0.5 font-mono text-[10px] text-slate-600 uppercase tracking-wider">{analyst.unit}</p>
      <div className="mt-2 flex gap-3 font-mono text-[10px]">
        <span className="text-slate-400">{analyst.accuracy}% ACC</span>
        <span className="text-slate-600">{analyst.overrides} OVR</span>
      </div>
    </button>
  );
}

function StatCell({ label, value, valueColor }: { label: string; value: string; valueColor: string }) {
  return (
    <div className="flex-1 rounded-md border border-white/[0.07] bg-white/[0.02] p-3 text-center">
      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">{label}</p>
      <p className={`mt-1.5 font-mono text-xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

export function AnalystReputation() {
  const [selectedId, setSelectedId] = useState(MOCK_ANALYSTS[0].id);
  const [query, setQuery] = useState("");

  const filtered = MOCK_ANALYSTS.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.unit.toLowerCase().includes(query.toLowerCase())
  );

  const analyst = MOCK_ANALYSTS.find((a) => a.id === selectedId) ?? MOCK_ANALYSTS[0];

  return (
    <div className="flex h-full flex-col p-5 gap-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white">
            Analyst Profiles & Scoring
          </h1>
          <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-px font-mono text-[9px] font-bold uppercase tracking-widest text-purple-400">
            L7 Analyst Reputation System
          </span>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
          The simulation engine automatically weights HUMINT overrides inversely proportional to the historical accuracy of the analyst bounding. Human capital is treated as a quantified asset with measurable drift and precision.
        </p>
      </div>

      {/* Two-pane */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left: roster */}
        <div className="flex w-64 shrink-0 flex-col gap-2 overflow-y-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search analysts..."
            className="rounded-md border border-white/[0.07] bg-white/[0.03] px-3 py-2 font-mono text-xs text-slate-300 placeholder:text-slate-700 focus:border-[#00e5ff]/30 focus:outline-none"
          />
          {filtered.map((a) => (
            <AnalystListItem
              key={a.id}
              analyst={a}
              selected={a.id === selectedId}
              onClick={() => setSelectedId(a.id)}
            />
          ))}
        </div>

        {/* Right: profile */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {/* Profile header */}
          <div className="flex items-start gap-4 rounded-md border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#00e5ff]/10 ring-1 ring-[#00e5ff]/20">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-7 w-7 text-[#00e5ff]/60" aria-hidden>
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-[family-name:var(--font-space)] text-lg font-semibold text-white">
                  {analyst.name}
                </h2>
                <span className={`rounded border px-2 py-px font-mono text-[9px] font-bold uppercase ${WEIGHT_COLORS[analyst.weightLabel]}`}>
                  Adjudicator {analyst.adjudicatorLevel}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-slate-500">
                {analyst.unit} &bull; ID: {analyst.id}
              </p>
            </div>
            {/* Stats row */}
            <div className="flex gap-4">
              {[
                { label: "Lifetime Overrides", value: String(analyst.overrides), color: "text-white" },
                { label: "Confirmed Correct", value: String(analyst.confirmed), color: "text-white" },
                { label: "Current Acc Rank", value: `${analyst.accuracy}%`, color: "text-[#00e5ff]" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">{s.label}</p>
                  <p className={`mt-1 font-mono text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trend + multiplier */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Bounding accuracy trend */}
            <div className="rounded-md border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                Bounding Accuracy Trend
              </p>
              <ResponsiveContainer width="100%" height={90}>
                <LineChart data={analyst.accuracyTrend} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 5", "dataMax + 5"]}
                    tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "10px", fontFamily: "monospace" }}
                    labelStyle={{ color: "#94a3b8" }}
                    itemStyle={{ color: "#00e5ff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="acc"
                    stroke="#00e5ff"
                    strokeWidth={2}
                    dot={{ fill: "#00e5ff", r: 3 }}
                    activeDot={{ r: 4, fill: "#00e5ff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Engine weighting multiplier */}
            <div className="rounded-md border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                Engine Weighting Multiplier
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Base Multiplier</span>
                <span className="font-mono text-lg font-bold text-[#00e5ff]">
                  {analyst.multiplier}x
                </span>
                <span className="rounded border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-1.5 py-px font-mono text-[9px] font-semibold text-[#00e5ff]">
                  {analyst.multiplier >= 1.3 ? "Priority" : analyst.multiplier >= 1.0 ? "Standard" : "Reduced"}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Future overrides originating from {analyst.id} concerning{" "}
                <span className="text-slate-300">{analyst.multiplierDomain}</span> will be automatically
                assigned this probabilistic weight in the L4 Monte Carlo distribution.
              </p>
            </div>
          </div>

          {/* Ledger */}
          <div className="rounded-md border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-600 mb-3">
              Latest Ledger Injections
            </p>
            <p className="text-xs italic text-slate-600">
              View all historically signed overrides for this analyst
            </p>
            <button
              type="button"
              className="mt-3 rounded border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300 transition hover:border-[#00e5ff]/30 hover:text-[#00e5ff]"
            >
              Query L7 Audit Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

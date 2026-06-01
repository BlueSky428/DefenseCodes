"use client";

import { useState } from "react";
import { MOCK_SCENARIOS } from "@/lib/engine/mock-api";
import type { MockScenario, ScenarioCategoryColor } from "@/lib/engine/mock-api";

const CATEGORY_COLORS: Record<ScenarioCategoryColor, string> = {
  red: "text-red-400 border-red-500/40 bg-red-500/10",
  orange: "text-orange-400 border-orange-500/40 bg-orange-500/10",
  amber: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  slate: "text-slate-400 border-white/15 bg-white/[0.03]",
};

function ScenarioCard({ scenario, onLaunch }: { scenario: MockScenario; onLaunch: (id: string) => void }) {
  const catCls = CATEGORY_COLORS[scenario.categoryColor];
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-5 flex flex-col gap-4 hover:border-white/15 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded border px-2 py-px font-mono text-[9px] font-bold uppercase tracking-wider ${catCls}`}>
          {scenario.category}
        </span>
        <span className="font-mono text-[10px] text-slate-600">{scenario.id}</span>
      </div>
      <div>
        <h3 className="font-[family-name:var(--font-space)] text-sm font-semibold text-white">
          {scenario.name}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{scenario.description}</p>
      </div>
      <div className="flex gap-4 font-mono text-[10px]">
        <div>
          <p className="uppercase tracking-widest text-slate-600">History</p>
          <p className="mt-0.5 font-semibold text-slate-300">{scenario.runs.toLocaleString()} Runs</p>
        </div>
        <div>
          <p className="uppercase tracking-widest text-slate-600">Accuracy</p>
          <p className="mt-0.5 font-semibold text-slate-300">{scenario.accuracy}%</p>
        </div>
        <div>
          <p className="uppercase tracking-widest text-slate-600">Validated</p>
          <p className="mt-0.5 font-semibold text-slate-300">{scenario.validatedDate} ({scenario.validatedBy})</p>
        </div>
      </div>
      <div className="mt-auto">
        {scenario.status === "active" ? (
          <span className="inline-flex items-center gap-1.5 rounded border border-red-500/40 bg-red-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            Active
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onLaunch(scenario.id)}
            className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300 transition hover:border-[#00e5ff]/30 hover:bg-[#00e5ff]/10 hover:text-[#00e5ff]"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Launch
          </button>
        )}
      </div>
    </div>
  );
}

export function ScenarioLibrary() {
  const [query, setQuery] = useState("");

  const filtered = MOCK_SCENARIOS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white">
            Scenario Library
          </h1>
          <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-px font-mono text-[9px] font-bold uppercase tracking-widest text-purple-400">
            L2 Wartime Scenario Library
          </span>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
          Palantir and C3 optimize existing processes based on historical continuity. War represents a fundamental discontinuity. The L2 Library injects severe, non-linear stress (10x demand surges, zero-day port outages) to test the L3 structural graph.
        </p>
      </div>

      {/* Search + action */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" aria-hidden>
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scenarios by operational domain..."
            className="w-full rounded-md border border-white/[0.07] bg-white/[0.03] py-2 pl-9 pr-3 font-mono text-xs text-slate-300 placeholder:text-slate-600 focus:border-[#00e5ff]/30 focus:outline-none focus:ring-1 focus:ring-[#00e5ff]/20"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#00e5ff] transition hover:bg-[#00e5ff]/20"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Author New Inject
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} onLaunch={() => {}} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-8 text-center font-mono text-xs text-slate-600">
            No scenarios match &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

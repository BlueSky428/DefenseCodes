"use client";

import { useState } from "react";
import { MOCK_ADJUDICATION } from "@/lib/engine/mock-api";
import type { MockAdjItem } from "@/lib/engine/mock-api";

function AdjListItem({
  item,
  selected,
  onClick,
}: {
  item: MockAdjItem;
  selected: boolean;
  onClick: () => void;
}) {
  const isAction = item.status === "ACTION REQUIRED";
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
        <span className={`rounded border px-1.5 py-px font-mono text-[9px] font-bold uppercase tracking-wider ${
          isAction
            ? "text-red-400 border-red-500/30 bg-red-500/10"
            : "text-slate-500 border-white/[0.07] bg-white/[0.02]"
        }`}>
          {item.id}
        </span>
        <span className="font-mono text-[10px] text-slate-600">{item.ageAgo}</span>
      </div>
      <p className="mt-1.5 text-xs font-semibold text-white">{item.title}</p>
      <p className="mt-0.5 font-mono text-[10px] text-slate-600">{item.source}</p>
    </button>
  );
}

function RiskBox({
  label,
  labelColor,
  risk,
  riskColor,
  note,
}: {
  label: string;
  labelColor: string;
  risk: number;
  riskColor: string;
  note: string;
}) {
  return (
    <div className={`flex-1 rounded-md border p-4 ${labelColor.includes("amber") ? "border-amber-500/20 bg-amber-500/[0.06]" : "border-white/[0.07] bg-white/[0.025]"}`}>
      <p className={`font-mono text-[9px] font-semibold uppercase tracking-widest ${labelColor}`}>{label}</p>
      <p className={`mt-2 font-mono text-3xl font-bold ${riskColor}`}>Risk: {risk}%</p>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{note}</p>
    </div>
  );
}

export function AdjudicationQueue() {
  const [selectedId, setSelectedId] = useState<string>(MOCK_ADJUDICATION[0].id);
  const [committed, setCommitted] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());

  const selected = MOCK_ADJUDICATION.find((a) => a.id === selectedId)!;
  const isResolved = committed.has(selectedId) || rejected.has(selectedId);
  const wasCommitted = committed.has(selectedId);

  const pending = MOCK_ADJUDICATION.filter(
    (a) => !committed.has(a.id) && !rejected.has(a.id)
  );

  return (
    <div className="flex h-full flex-col p-5 gap-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white">
            Human Adjudication Queue
          </h1>
          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-px font-mono text-[9px] font-bold uppercase tracking-widest text-amber-400">
            L7 Mandatory Adjudication
          </span>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
          Models output distributions, not decisions. Software cannot synthesize tacit knowledge, geopolitical intent, or unwritten rules. The L7 queue forces human analysts to take accountability for final system parameters.
        </p>
      </div>

      {/* Two-pane */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left: list */}
        <div className="flex w-64 shrink-0 flex-col gap-2 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-600">
              Pending Review
            </p>
            <span className="rounded border border-white/[0.07] bg-white/[0.02] px-1.5 py-px font-mono text-[9px] font-semibold text-slate-400">
              {pending.length} Items
            </span>
          </div>
          {MOCK_ADJUDICATION.map((item) => (
            <AdjListItem
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
        </div>

        {/* Right: detail */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {/* Action bar */}
          <div className="flex items-center justify-between rounded-md border border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-px font-mono text-[9px] font-bold uppercase tracking-wider text-red-400">
                {isResolved ? (wasCommitted ? "COMMITTED" : "REJECTED") : "Action Required"}
              </span>
              <span className="font-mono text-xs font-semibold text-white">{selected.id}</span>
            </div>
            {!isResolved && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejected((s) => new Set(s).add(selectedId))}
                  className="inline-flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500/20"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Reject Override
                </button>
                <button
                  type="button"
                  onClick={() => setCommitted((s) => new Set(s).add(selectedId))}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-emerald-400"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sign & Commit
                </button>
              </div>
            )}
            {isResolved && (
              <span className={`font-mono text-xs font-semibold ${wasCommitted ? "text-emerald-400" : "text-slate-500"}`}>
                {wasCommitted ? "Override committed to L4 distribution" : "Baseline value retained"}
              </span>
            )}
          </div>

          {/* Override title */}
          <h2 className="font-[family-name:var(--font-space)] text-lg font-semibold text-white">
            {selected.title}
          </h2>

          {/* Risk comparison */}
          <div className="flex gap-3">
            <RiskBox
              label="L2 Model Baseline Output"
              labelColor="text-slate-500"
              risk={selected.baselineRisk}
              riskColor="text-white"
              note={selected.baselineNote}
            />
            <RiskBox
              label="Requested Override"
              labelColor="text-amber-400"
              risk={selected.overrideRisk}
              riskColor="text-amber-400"
              note={selected.overrideNote}
            />
          </div>

          {/* Justification memo */}
          <div className="rounded-md border border-white/[0.07] bg-white/[0.025]">
            <div className="border-b border-white/[0.07] px-4 py-2.5">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
                Analyst Justification Memo
              </p>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2 rounded border border-white/[0.07] bg-white/[0.02] px-3 py-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0 text-[#00e5ff]/60" aria-hidden>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-mono text-[10px] font-semibold text-slate-400">
                  Origin: {selected.justificationOrigin}
                </span>
              </div>
              {selected.justification.split("\n\n").map((para, i) => (
                <p key={i} className={`text-sm leading-relaxed text-slate-400 ${i > 0 ? "mt-3" : ""}`}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Sign-off authority */}
          <div className="rounded-md border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Sign-off Authority</p>
            <p className="mt-1 text-sm font-semibold text-slate-200">{selected.assignedTo}</p>
          </div>

          {/* Ledger note */}
          <div className="rounded-md border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-2">Latest Ledger Injections</p>
            <p className="text-xs text-slate-600 italic">View all historically signed overrides for this analyst</p>
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

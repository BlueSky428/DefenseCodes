"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { mockGetSimulationResult } from "@/lib/engine/mock-api";
import { useResultsStore } from "@/lib/engine/stores";
import type { SimulationResult } from "@/lib/engine/types";

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 w-56 rounded-lg bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-white/5" />
      <div className="h-48 rounded-xl bg-white/5" />
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0D1526] px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400">Day {label}</p>
      <p className="font-semibold text-blue-300">Density: {payload[0]?.value?.toFixed(1)}</p>
    </div>
  );
};

export function ResultsView({ simulationId }: { simulationId: string }) {
  const { results, setResult } = useResultsStore();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"failureContribution" | "avgDelayInduced">("failureContribution");
  const [sortAsc, setSortAsc] = useState(false);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [availableSims, setAvailableSims] = useState<Array<{ id: string; name: string }>>([]);

  const result: SimulationResult | undefined = results[simulationId];

  const fetchResult = useCallback(async () => {
    if (results[simulationId]) {
      setLoading(false);
      return;
    }
    const data = await mockGetSimulationResult(simulationId);
    if (data) {
      setResult(simulationId, data);
    }
    setLoading(false);
  }, [simulationId, results, setResult]);

  useEffect(() => {
    void fetchResult();
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("engine-recent-sims") ?? "[]");
      setAvailableSims(
        saved
          .filter((s: { id: string; status: string }) => s.status === "completed" && s.id !== simulationId)
          .map((s: { id: string; name: string }) => ({ id: s.id, name: s.name }))
      );
    }
  }, [fetchResult, simulationId]);

  if (loading) return <LoadingSkeleton />;
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
        <p className="text-lg font-semibold text-slate-300">Result not found</p>
        <p className="mt-2 text-sm text-slate-500">This simulation may still be running or was not found.</p>
        <Link href="/engine" className="mt-4 text-sm text-blue-400 hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  const sortedBottlenecks = [...result.bottlenecks].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const exportCSV = () => {
    const header = "Name,Failure Contribution %,Avg Delay Induced (days),Recommended Action\n";
    const rows = result.bottlenecks
      .map((b) => `"${b.name}",${b.failureContribution},${b.avgDelayInduced},"${b.recommendedAction}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.name}-bottlenecks.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.name}-snapshot.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/engine" className="text-xs text-slate-500 hover:text-slate-300">Dashboard</Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">Results</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-white">{result.name}</h1>
          <p className="text-sm text-slate-400">{result.scenarioLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
            aria-label="Export CSV"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            CSV
          </button>
          <button
            type="button"
            onClick={exportJSON}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
            aria-label="Export JSON snapshot"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            JSON
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
            aria-label="Export PDF report"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            PDF Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "P50 Delivery", value: `${result.p50} days`, color: "text-emerald-400", sub: "50th percentile" },
          { label: "P90 Delivery", value: `${result.p90} days`, color: "text-yellow-400", sub: "90th percentile" },
          { label: "P99 Delivery", value: `${result.p99} days`, color: "text-red-400", sub: "99th percentile" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-medium text-slate-400">{m.label}</p>
            <p className={`mt-1 text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-slate-500 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Probability Outcome Curve */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-white">Probability Outcome Curve</h2>
          <p className="text-xs text-slate-500">
            {Math.round(
              (result.probabilityCurveData
                .filter((d) => d.x <= result.p90)
                .reduce((s, d) => s + d.y, 0) /
                result.probabilityCurveData.reduce((s, d) => s + d.y, 0)) *
                100
            )}% probability of delivery within {result.p90} days
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.probabilityCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="x" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} label={{ value: "Days", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={result.p50} stroke="#34d399" strokeDasharray="4 2" label={{ value: "P50", fill: "#34d399", fontSize: 11, position: "top" }} />
              <ReferenceLine x={result.p90} stroke="#fbbf24" strokeDasharray="4 2" label={{ value: "P90", fill: "#fbbf24", fontSize: 11, position: "top" }} />
              <ReferenceLine x={result.p99} stroke="#f87171" strokeDasharray="4 2" label={{ value: "P99", fill: "#f87171", fontSize: 11, position: "top" }} />
              <Area type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottleneck Table */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">Bottleneck Ranking</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            Sort by:
            <button
              type="button"
              onClick={() => { setSortBy("failureContribution"); setSortAsc(false); }}
              className={`px-2 py-1 rounded-lg transition ${sortBy === "failureContribution" ? "bg-blue-500/20 text-blue-400" : "hover:text-slate-300"}`}
            >
              Contribution
            </button>
            <button
              type="button"
              onClick={() => { setSortBy("avgDelayInduced"); setSortAsc(false); }}
              className={`px-2 py-1 rounded-lg transition ${sortBy === "avgDelayInduced" ? "bg-blue-500/20 text-blue-400" : "hover:text-slate-300"}`}
            >
              Delay
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 font-medium">Node / Route</th>
                <th className="px-5 py-3 font-medium">Failure Contribution %</th>
                <th className="px-5 py-3 font-medium">Avg Delay Induced</th>
                <th className="px-5 py-3 font-medium">Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedBottlenecks.map((b, idx) => (
                <tr key={b.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-white/10">
                        <div
                          className="h-1.5 rounded-full bg-red-400"
                          style={{ width: `${b.failureContribution}%` }}
                        />
                      </div>
                      <span className="text-red-400 font-semibold">{b.failureContribution}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-yellow-400 font-medium">{b.avgDelayInduced} days</td>
                  <td className="px-5 py-3 text-slate-400 text-xs max-w-[260px]">{b.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mitigation Recommendations */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Actionable Mitigation Recommendations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.recommendations.map((rec) => (
            <div key={rec.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 mb-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-400" aria-hidden>
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{rec.text}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">{rec.impact}</span>
                <Link
                  href="/engine/simulation/new"
                  className="text-xs text-blue-400 hover:underline"
                >
                  Re-run with change →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Scenario Comparison</h2>
        {availableSims.length === 0 ? (
          <p className="text-sm text-slate-500">Run more simulations to compare scenarios side-by-side.</p>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableSims.slice(0, 4).map((sim) => (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() =>
                    setComparisonIds((ids) =>
                      ids.includes(sim.id) ? ids.filter((i) => i !== sim.id) : [...ids.slice(0, 2), sim.id]
                    )
                  }
                  aria-pressed={comparisonIds.includes(sim.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    comparisonIds.includes(sim.id)
                      ? "border-blue-500 bg-blue-500/15 text-blue-300"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  }`}
                >
                  {sim.name}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[simulationId, ...comparisonIds].map((id) => {
                const r = results[id];
                if (!r) return null;
                return (
                  <div key={id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-xs font-semibold text-slate-300 truncate">{r.name}</p>
                    <p className="text-[10px] text-slate-500 mb-3 truncate">{r.scenarioLabel}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">P50</span>
                        <span className="text-emerald-400 font-semibold">{r.p50}d</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">P90</span>
                        <span className="text-yellow-400 font-semibold">{r.p90}d</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">P99</span>
                        <span className="text-red-400 font-semibold">{r.p99}d</span>
                      </div>
                    </div>
                    <div className="mt-3 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={r.probabilityCurveData.slice(0, 20)}>
                          <Area type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={1.5} fill="#3b82f620" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

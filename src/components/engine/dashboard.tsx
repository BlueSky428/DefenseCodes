"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { mockGetRecentSimulations } from "@/lib/engine/mock-api";

interface RecentSim {
  id: string;
  name: string;
  scenarioLabel: string;
  timestamp: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  running: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  failed: "text-red-400 bg-red-500/10 border-red-500/30",
  queued: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  running: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 animate-spin" aria-hidden>
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
  ),
  completed: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  failed: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  queued: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
};

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const HEALTH_SCORE = 72;
const CRITICAL_NODES = [
  { id: "n1", name: "Transit Hub Alpha", status: "degraded" },
  { id: "n2", name: "Port of Entry Bravo", status: "at-risk" },
  { id: "n3", name: "Supplier Node Delta", status: "degraded" },
];

function HealthRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";

  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="54" textAnchor="middle" fontSize="22" fontWeight="700" fill={color}>
        {score}
      </text>
    </svg>
  );
}

export function EngineDashboard() {
  const [recentSims, setRecentSims] = useState<RecentSim[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSims = useCallback(async () => {
    const sims = await mockGetRecentSimulations();
    setRecentSims(sims);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchSims();
    const interval = setInterval(() => void fetchSims(), 5000);
    return () => clearInterval(interval);
  }, [fetchSims]);

  const activeSims = recentSims.filter(
    (s) => s.status === "running" || s.status === "queued"
  );

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-white">Command Center</h1>
        <p className="mt-1 text-sm text-slate-400">
          Supply chain risk analysis — active simulations and health summary
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/engine/simulation/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Simulation
        </Link>
        <Link
          href="/engine/simulation/new"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Run Standard Stress Test
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Simulations */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">Active Simulations</h2>
            <span className="text-xs text-slate-500">Auto-refreshes every 5s</span>
          </div>
          <div className="p-1">
            {loading ? (
              <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
            ) : activeSims.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No active simulations</p>
                <Link
                  href="/engine/simulation/new"
                  className="mt-3 inline-block text-xs text-blue-400 hover:underline"
                >
                  Start one now →
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Progress</th>
                    <th className="px-4 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {activeSims.map((sim) => (
                    <tr key={sim.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-slate-200">{sim.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[sim.status] ?? ""}`}
                        >
                          {STATUS_ICONS[sim.status]}
                          {sim.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-1.5 w-24 rounded-full bg-white/10">
                          <div
                            className="h-1.5 rounded-full bg-blue-400 transition-all"
                            style={{ width: "45%" }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/engine/simulation/${sim.id}/progress`}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Network Health Summary */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">Network Health</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4">
              <HealthRing score={HEALTH_SCORE} />
              <div>
                <p className="text-2xl font-bold text-white">{HEALTH_SCORE}</p>
                <p className="text-xs text-yellow-400 font-medium">Moderate Risk</p>
                <p className="mt-1 text-xs text-slate-500">Vulnerability Score</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Critical Nodes
              </p>
              <ul className="space-y-2">
                {CRITICAL_NODES.map((node) => (
                  <li key={node.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{node.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${
                        node.status === "degraded"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {node.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">Recent Reports</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
        ) : recentSims.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No simulations run yet. Start your first simulation above.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentSims.slice(0, 8).map((sim) => (
              <div
                key={sim.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0 h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold">
                    {sim.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{sim.name}</p>
                    <p className="text-xs text-slate-500">
                      {sim.scenarioLabel} · {formatTimestamp(sim.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[sim.status] ?? ""}`}
                  >
                    {STATUS_ICONS[sim.status]}
                    {sim.status}
                  </span>
                  {sim.status === "completed" && (
                    <Link
                      href={`/engine/results/${sim.id}`}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Results →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

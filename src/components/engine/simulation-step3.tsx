"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardSteps } from "./wizard-steps";
import { useSimulationStore } from "@/lib/engine/stores";
import { useJobStore } from "@/lib/engine/stores";
import { mockCreateSimulation } from "@/lib/engine/mock-api";

const ITERATION_OPTIONS = [
  { value: 1000, label: "1K", description: "Fast, low precision" },
  { value: 10000, label: "10K", description: "Balanced (recommended)" },
  { value: 100000, label: "100K", description: "High precision, ~30s" },
  { value: 1000000, label: "1M", description: "Maximum precision, ~5 min" },
];

const CI_OPTIONS = [90, 95, 99];

export function SimulationStep3() {
  const router = useRouter();
  const { network, variables, executionParams, setExecutionParams, setCurrentSimulationId, reset } =
    useSimulationStore();
  const addJob = useJobStore((s) => s.addJob);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRun =
    executionParams.name.trim().length > 0 &&
    executionParams.scenarioLabel.trim().length > 0 &&
    executionParams.iterations > 0;

  const runSimulation = async () => {
    setRunning(true);
    setError(null);
    try {
      const { simulationId } = await mockCreateSimulation({
        name: executionParams.name,
        scenarioLabel: executionParams.scenarioLabel,
        iterations: executionParams.iterations,
      });
      setCurrentSimulationId(simulationId);
      addJob({
        id: simulationId,
        name: executionParams.name,
        status: "running",
        progressPercent: 0,
        etaSeconds: Math.ceil(executionParams.iterations / 5000),
        createdAt: new Date().toISOString(),
      });
      reset();
      router.push(`/engine/simulation/${simulationId}/progress`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
      setRunning(false);
    }
  };

  const activeDisruptions = Object.entries(variables.disruptions)
    .filter(([, v]) => (v as { enabled: boolean }).enabled)
    .map(([k]) => k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0D1526]/60 px-6 py-4">
        <WizardSteps current={3} />
        <h1 className="mt-3 text-lg font-semibold text-white">Execution Parameters</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Configure the Monte Carlo run and review your settings before launching.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Params */}
          <div className="space-y-6">
            {/* Simulation Name */}
            <div>
              <label htmlFor="sim-name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Simulation Name <span className="text-red-400">*</span>
              </label>
              <input
                id="sim-name"
                type="text"
                value={executionParams.name}
                onChange={(e) => setExecutionParams({ name: e.target.value })}
                placeholder="e.g. Q3-2026 Baseline"
                className="w-full rounded-xl border border-white/10 bg-[#0A0F1F] px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>

            {/* Scenario Label */}
            <div>
              <label htmlFor="scenario-label" className="block text-sm font-medium text-slate-300 mb-1.5">
                Scenario Label <span className="text-red-400">*</span>
              </label>
              <input
                id="scenario-label"
                type="text"
                value={executionParams.scenarioLabel}
                onChange={(e) => setExecutionParams({ scenarioLabel: e.target.value })}
                placeholder="e.g. Port Closure + Cyber (Combined)"
                className="w-full rounded-xl border border-white/10 bg-[#0A0F1F] px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>

            {/* Iteration Count */}
            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Iteration Count</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ITERATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setExecutionParams({ iterations: opt.value })}
                    aria-pressed={executionParams.iterations === opt.value}
                    className={`rounded-xl border p-3 text-left transition ${
                      executionParams.iterations === opt.value
                        ? "border-blue-500 bg-blue-500/15 text-white"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <span className="block text-lg font-bold">{opt.label}</span>
                    <span className="text-xs">{opt.description}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Selected: {executionParams.iterations.toLocaleString()} iterations
              </p>
            </div>

            {/* Confidence Interval */}
            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Confidence Interval</p>
              <div className="flex gap-2">
                {CI_OPTIONS.map((ci) => (
                  <button
                    key={ci}
                    type="button"
                    onClick={() => setExecutionParams({ confidenceInterval: ci })}
                    aria-pressed={executionParams.confidenceInterval === ci}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                      executionParams.confidenceInterval === ci
                        ? "border-blue-500 bg-blue-500/15 text-white"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {ci}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Configuration Summary</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Nodes</dt>
                <dd className="font-medium text-slate-200">{network.nodes.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Routes</dt>
                <dd className="font-medium text-slate-200">{network.edges.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Iterations</dt>
                <dd className="font-medium text-slate-200">
                  {executionParams.iterations.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Confidence Interval</dt>
                <dd className="font-medium text-slate-200">{executionParams.confidenceInterval}%</dd>
              </div>
              <div className="border-t border-white/10 pt-3">
                <dt className="text-slate-400 mb-2">Active Disruptions</dt>
                <dd>
                  {activeDisruptions.length === 0 ? (
                    <span className="text-slate-500 text-xs">None enabled</span>
                  ) : (
                    <ul className="space-y-1">
                      {activeDisruptions.map((d) => (
                        <li key={d} className="flex items-center gap-1.5 text-xs text-red-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" aria-hidden />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
              <div className="border-t border-white/10 pt-3">
                <dt className="text-slate-400">Estimated Runtime</dt>
                <dd className="font-medium text-slate-200">
                  {executionParams.iterations <= 1000
                    ? "< 1 second"
                    : executionParams.iterations <= 10000
                    ? "2–5 seconds"
                    : executionParams.iterations <= 100000
                    ? "15–30 seconds"
                    : "3–5 minutes"}
                </dd>
              </div>
            </dl>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 bg-[#0D1526]/60 px-6 py-4">
        <button
          type="button"
          onClick={() => router.push("/engine/simulation/new/variables")}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          type="button"
          disabled={!canRun || running}
          onClick={() => void runSimulation()}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Run simulation"
        >
          {running ? (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 animate-spin" aria-hidden>
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Launching…
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Run Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

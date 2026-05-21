"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockGetSimulationStatus } from "@/lib/engine/mock-api";
import { useJobStore } from "@/lib/engine/stores";

interface ProgressState {
  status: string;
  progressPercent: number;
  etaSeconds: number;
  totalIterations: number;
  completedIterations: number;
}

function formatTime(seconds: number) {
  if (seconds <= 0) return "finishing…";
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  return `${Math.ceil(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
}

export function SimulationProgress({ simulationId }: { simulationId: string }) {
  const router = useRouter();
  const updateJobStatus = useJobStore((s) => s.updateJobStatus);
  const [state, setState] = useState<ProgressState | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [startTime] = useState(Date.now());

  const poll = useCallback(async () => {
    try {
      const data = await mockGetSimulationStatus(simulationId);
      setState(data as ProgressState);
      updateJobStatus(simulationId, {
        status: data.status as "running" | "completed" | "failed" | "queued",
        progressPercent: data.progressPercent,
        etaSeconds: data.etaSeconds,
      });

      if (data.status === "completed") {
        setTimeout(() => router.push(`/engine/results/${simulationId}`), 1200);
      }
    } catch {
      /* ignore poll errors */
    }
  }, [simulationId, router, updateJobStatus]);

  useEffect(() => {
    void poll();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
      void poll();
    }, 2000);
    return () => clearInterval(interval);
  }, [poll, startTime]);

  const progress = state?.progressPercent ?? 0;
  const isComplete = state?.status === "completed";

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8">
      <div className="w-full max-w-lg">
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {isComplete ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-emerald-400" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-blue-400 animate-spin" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white">
            {isComplete ? "Simulation Complete" : "Running Simulation"}
          </h1>
          <p className="mt-1 text-sm text-slate-400 font-mono">{simulationId}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isComplete ? "bg-emerald-400" : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <p className="text-lg font-bold text-white">
              {state?.completedIterations?.toLocaleString() ?? "—"}
            </p>
            <p className="text-xs text-slate-500 mt-1">Iterations Done</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <p className="text-lg font-bold text-white">{elapsed}s</p>
            <p className="text-xs text-slate-500 mt-1">Elapsed</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <p className="text-lg font-bold text-white">
              {isComplete ? "Done" : formatTime(state?.etaSeconds ?? 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Remaining</p>
          </div>
        </div>

        {/* Status message */}
        {isComplete ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <p className="text-sm font-semibold text-emerald-400">
              Redirecting to results…
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-xs text-slate-500">
              You can navigate away — a notification will appear when complete.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => router.push("/engine")}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

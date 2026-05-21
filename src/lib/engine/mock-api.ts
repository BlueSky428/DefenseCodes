"use client";

import type { SimulationResult } from "./types";

const MOCK_DELAY = 400;

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function generateCurveData(p50: number, p90: number, p99: number) {
  const data: Array<{ x: number; y: number }> = [];
  const min = Math.max(1, p50 - 10);
  const max = p99 + 5;
  for (let x = min; x <= max; x++) {
    const normalized = (x - min) / (max - min);
    const y = Math.exp(-0.5 * Math.pow((normalized - 0.42) / 0.18, 2));
    data.push({ x, y: Math.round(y * 1000) / 10 });
  }
  return data;
}

const MOCK_RESULTS: Record<string, SimulationResult> = {};

export async function mockCreateSimulation(payload: {
  name: string;
  scenarioLabel: string;
  iterations: number;
}): Promise<{ simulationId: string; status: "queued" }> {
  await delay(MOCK_DELAY);
  const id = `sim-${Date.now()}`;

  const p50 = 12 + Math.round(Math.random() * 4);
  const p90 = p50 + 4 + Math.round(Math.random() * 3);
  const p99 = p90 + 3 + Math.round(Math.random() * 2);

  MOCK_RESULTS[id] = {
    id,
    name: payload.name || "Unnamed Simulation",
    scenarioLabel: payload.scenarioLabel || "Baseline",
    status: "running",
    progressPercent: 0,
    etaSeconds: Math.ceil(payload.iterations / 5000),
    createdAt: new Date().toISOString(),
    probabilityCurveData: generateCurveData(p50, p90, p99),
    bottlenecks: [
      {
        id: "b1",
        name: "Transit Hub Alpha",
        failureContribution: 34.2,
        avgDelayInduced: 6.4,
        recommendedAction: "Add redundant route via southern corridor",
      },
      {
        id: "b2",
        name: "Port of Entry Bravo",
        failureContribution: 22.8,
        avgDelayInduced: 4.1,
        recommendedAction: "Pre-clear manifests 72h in advance",
      },
      {
        id: "b3",
        name: "Supplier Node Delta",
        failureContribution: 18.5,
        avgDelayInduced: 3.7,
        recommendedAction: "Qualify secondary supplier within 90 days",
      },
      {
        id: "b4",
        name: "Storage Depot Echo",
        failureContribution: 12.1,
        avgDelayInduced: 2.2,
        recommendedAction: "Increase buffer stock by 15%",
      },
      {
        id: "b5",
        name: "Customs Processing Foxtrot",
        failureContribution: 8.6,
        avgDelayInduced: 1.8,
        recommendedAction: "Enroll in trusted trader programme",
      },
    ],
    recommendations: [
      {
        id: "r1",
        text: `Increase inventory buffer at Storage Depot Echo by 12% — reduces P90 delivery by 4.2 days`,
        impact: "−4.2 days at P90",
      },
      {
        id: "r2",
        text: "Qualify a secondary supplier for Supplier Node Delta — reduces failure contribution by ~11%",
        impact: "−11% failure contribution",
      },
      {
        id: "r3",
        text: "Enable pre-clearance at Port of Entry Bravo — reduces average customs delay from 4.1 to 1.8 days",
        impact: "−2.3 days avg customs delay",
      },
    ],
    p50,
    p90,
    p99,
  };

  if (typeof window !== "undefined") {
    const saved = JSON.parse(localStorage.getItem("engine-recent-sims") ?? "[]");
    saved.unshift({
      id,
      name: payload.name || "Unnamed Simulation",
      scenarioLabel: payload.scenarioLabel || "Baseline",
      timestamp: new Date().toISOString(),
      status: "running",
    });
    localStorage.setItem("engine-recent-sims", JSON.stringify(saved.slice(0, 20)));
  }

  return { simulationId: id, status: "queued" };
}

export async function mockGetSimulationStatus(id: string): Promise<{
  status: string;
  progressPercent: number;
  etaSeconds: number;
  totalIterations: number;
  completedIterations: number;
}> {
  await delay(200);
  const result = MOCK_RESULTS[id];
  if (!result) {
    return {
      status: "completed",
      progressPercent: 100,
      etaSeconds: 0,
      totalIterations: 10000,
      completedIterations: 10000,
    };
  }

  if (result.status === "running") {
    result.progressPercent = Math.min(100, result.progressPercent + 8 + Math.random() * 12);
    result.etaSeconds = Math.max(0, result.etaSeconds - 1);
    if (result.progressPercent >= 100) {
      result.status = "completed";
      result.progressPercent = 100;
      result.etaSeconds = 0;
      if (typeof window !== "undefined") {
        const saved = JSON.parse(localStorage.getItem("engine-recent-sims") ?? "[]");
        const idx = saved.findIndex((s: { id: string }) => s.id === id);
        if (idx >= 0) saved[idx].status = "completed";
        localStorage.setItem("engine-recent-sims", JSON.stringify(saved));
      }
    }
  }

  return {
    status: result.status,
    progressPercent: result.progressPercent,
    etaSeconds: result.etaSeconds,
    totalIterations: 10000,
    completedIterations: Math.round(result.progressPercent * 100),
  };
}

export async function mockGetSimulationResult(id: string): Promise<SimulationResult | null> {
  await delay(MOCK_DELAY);
  return MOCK_RESULTS[id] ?? null;
}

export async function mockGetRecentSimulations(): Promise<
  Array<{ id: string; name: string; timestamp: string; scenarioLabel: string; status: string }>
> {
  await delay(MOCK_DELAY);
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("engine-recent-sims") ?? "[]");
}

export async function mockGetTemplates(): Promise<
  Array<{ id: string; name: string; description: string }>
> {
  await delay(MOCK_DELAY);
  return [
    {
      id: "t1",
      name: "Single-Source Regional Hub",
      description: "Single supplier feeding a regional distribution hub with 3 end-points.",
    },
    {
      id: "t2",
      name: "Multi-Tier Global Grid",
      description: "Two-tier global supply network with redundant transit hubs and customs nodes.",
    },
    {
      id: "t3",
      name: "Aerospace Component Chain",
      description: "Specialised chain for composite components with autoclave and tier-2 treaters.",
    },
  ];
}

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
      { id: "b1", name: "Transit Hub Alpha", failureContribution: 34.2, avgDelayInduced: 6.4, recommendedAction: "Add redundant route via southern corridor" },
      { id: "b2", name: "Port of Entry Bravo", failureContribution: 22.8, avgDelayInduced: 4.1, recommendedAction: "Pre-clear manifests 72h in advance" },
      { id: "b3", name: "Supplier Node Delta", failureContribution: 18.5, avgDelayInduced: 3.7, recommendedAction: "Qualify secondary supplier within 90 days" },
      { id: "b4", name: "Storage Depot Echo", failureContribution: 12.1, avgDelayInduced: 2.2, recommendedAction: "Increase buffer stock by 15%" },
      { id: "b5", name: "Customs Processing Foxtrot", failureContribution: 8.6, avgDelayInduced: 1.8, recommendedAction: "Enroll in trusted trader programme" },
    ],
    recommendations: [
      { id: "r1", text: `Increase inventory buffer at Storage Depot Echo by 12% — reduces P90 delivery by 4.2 days`, impact: "−4.2 days at P90" },
      { id: "r2", text: "Qualify a secondary supplier for Supplier Node Delta — reduces failure contribution by ~11%", impact: "−11% failure contribution" },
      { id: "r3", text: "Enable pre-clearance at Port of Entry Bravo — reduces average customs delay from 4.1 to 1.8 days", impact: "−2.3 days avg customs delay" },
    ],
    p50,
    p90,
    p99,
  };

  if (typeof window !== "undefined") {
    const saved = JSON.parse(localStorage.getItem("engine-recent-sims") ?? "[]");
    saved.unshift({ id, name: payload.name || "Unnamed Simulation", scenarioLabel: payload.scenarioLabel || "Baseline", timestamp: new Date().toISOString(), status: "running" });
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
    return { status: "completed", progressPercent: 100, etaSeconds: 0, totalIterations: 10000, completedIterations: 10000 };
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
  return { status: result.status, progressPercent: result.progressPercent, etaSeconds: result.etaSeconds, totalIterations: 10000, completedIterations: Math.round(result.progressPercent * 100) };
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
    { id: "t1", name: "Single-Source Regional Hub", description: "Single supplier feeding a regional distribution hub with 3 end-points." },
    { id: "t2", name: "Multi-Tier Global Grid", description: "Two-tier global supply network with redundant transit hubs and customs nodes." },
    { id: "t3", name: "Aerospace Component Chain", description: "Specialised chain for composite components with autoclave and tier-2 treaters." },
  ];
}

// ── Scenario Library ──────────────────────────────────────────────────────────

export type ScenarioCategoryColor = "red" | "orange" | "amber" | "slate";

export interface MockScenario {
  id: string;
  name: string;
  category: string;
  categoryColor: ScenarioCategoryColor;
  description: string;
  runs: number;
  accuracy: number;
  validatedDate: string;
  validatedBy: string;
  status: "active" | "available";
}

export const MOCK_SCENARIOS: MockScenario[] = [
  {
    id: "SCEN-842",
    name: "Taiwan Strait Blockade (Adversarial)",
    category: "WARTIME MOBILIZATION (10X)",
    categoryColor: "red",
    description: "Full maritime denial with simultaneous localized cyber disruption of primary logistics nodes.",
    runs: 842,
    accuracy: 95.2,
    validatedDate: "2026-05-15",
    validatedBy: "J.Doe",
    status: "active",
  },
  {
    id: "SCEN-119",
    name: "Red Sea Chokepoint Closure",
    category: "KINETIC DENIAL",
    categoryColor: "orange",
    description: "Sustained kinetic denial of Bab el-Mandeb strait forcing routing via Cape of Good Hope.",
    runs: 84,
    accuracy: 88.1,
    validatedDate: "2026-04-10",
    validatedBy: "M.Smith",
    status: "available",
  },
  {
    id: "SCEN-551",
    name: "Rare Earth Export Embargo (PRC)",
    category: "ECONOMIC WARFARE",
    categoryColor: "amber",
    description: "Legal and physical embargo on critical minerals required for Tier 2 and Tier 3 defense manufacturing.",
    runs: 201,
    accuracy: 92.4,
    validatedDate: "2026-03-22",
    validatedBy: "Red-Cell 4",
    status: "available",
  },
  {
    id: "SCEN-002",
    name: "Peacetime Baseline (Current Real)",
    category: "BASELINE",
    categoryColor: "slate",
    description: "Standard operating conditions factoring in current port congestion and ambient cyber noise.",
    runs: 890,
    accuracy: 98.9,
    validatedDate: "2026-05-20",
    validatedBy: "Auto",
    status: "available",
  },
];

// ── Threat Intel Feeds ────────────────────────────────────────────────────────

export type TrustLevel = "HIGH" | "MED" | "LOW";

export interface MockFeed {
  id: string;
  sourceType: string;
  sourceAge: string;
  domain: string;
  trustScore: TrustLevel;
  engineWeight: number;
  adversarialFlags: string[];
}

export const MOCK_FEEDS: MockFeed[] = [
  { id: "FEED-84A", sourceType: "PLA-Logistics-Public", sourceAge: "4H", domain: "Port Capacity", trustScore: "LOW", engineWeight: 0.1, adversarialFlags: ["DECEPTION SIGNATURE MATCH", "INCONSISTENT OUTPUT"] },
  { id: "FEED-22C", sourceType: "COMINT-Intercept-Tango", sourceAge: "12M", domain: "Rail Transit", trustScore: "HIGH", engineWeight: 0.8, adversarialFlags: [] },
  { id: "FEED-91B", sourceType: "Commercial-AIS", sourceAge: "1M", domain: "Vessel Tracking", trustScore: "MED", engineWeight: 0.4, adversarialFlags: ["GPS SPOOFING DETECTED IN SECTOR 4"] },
  { id: "FEED-04X", sourceType: "HUMINT-Asset-K", sourceAge: "2D", domain: "Sub-tier Factory", trustScore: "HIGH", engineWeight: 0.9, adversarialFlags: [] },
  { id: "FEED-55Y", sourceType: "OSINT-Financial", sourceAge: "5H", domain: "Capital Flow", trustScore: "MED", engineWeight: 0.6, adversarialFlags: ["ANOMALY: SUDDEN DIVESTITURE"] },
];

// ── Adjudication Queue ────────────────────────────────────────────────────────

export interface MockAdjItem {
  id: string;
  title: string;
  source: string;
  ageAgo: string;
  status: "ACTION REQUIRED" | "PENDING";
  baselineRisk: number;
  baselineNote: string;
  overrideRisk: number;
  overrideNote: string;
  justification: string;
  justificationOrigin: string;
  assignedTo: string;
}

export const MOCK_ADJUDICATION: MockAdjItem[] = [
  {
    id: "ADJ-8891",
    title: "Semiconductor Buffering Constraint",
    source: "HUMINT / SITE VISIT (ANALYST K)",
    ageAgo: "14 min ago",
    status: "ACTION REQUIRED",
    baselineRisk: 12,
    baselineNote: "Based on historical shipping data and public capacity declarations.",
    overrideRisk: 85,
    overrideNote: "Based on HUMINT field observations of informal capacity limitations.",
    justificationOrigin: "SITE VISIT (May 14) / ANALYST K.",
    justification: "The quantitative model assumes full operational capacity 24/7 as declared by the facility. During the site visit, it was observed that the second shift is staffed entirely by temporary workers with less than 2 weeks tenure.\n\nThis informal labor configuration will not survive a 10x wartime surge. A massive quality cliff is imminent if loading exceeds current peacetime rates. The baseline 12% disruption risk is systematically blind to this tacit constraint. Override to 85% required for correct L4 consequence modeling.",
    assignedTo: "Analyst J. Doe",
  },
  {
    id: "ADJ-8890",
    title: "Port Congestion at Node C",
    source: "PROCESS CHANGE LOCAL",
    ageAgo: "2h ago",
    status: "PENDING",
    baselineRisk: 18,
    baselineNote: "Standard congestion model using AIS vessel tracking data.",
    overrideRisk: 42,
    overrideNote: "Local process change doubles dwell time at berth 7–12.",
    justificationOrigin: "PROCESS CHANGE LOG / ANALYST M.",
    justification: "Recent infrastructure maintenance at berths 7 through 12 has reduced effective throughput capacity by approximately 55%. Current AIS data does not yet reflect the updated dwell time distribution. Override required to correctly model delivery risk for the next 30-day window.",
    assignedTo: "Analyst M. Smith",
  },
  {
    id: "ADJ-8889",
    title: "Cyber Resilience Score — Logistics Firm",
    source: "L1 ADVERSARIAL FLAG (DECEPTION)",
    ageAgo: "5h ago",
    status: "PENDING",
    baselineRisk: 8,
    baselineNote: "Based on published cyber certification and historical incident rate.",
    overrideRisk: 61,
    overrideNote: "L1 flag detected deception signature in self-reported resilience metrics.",
    justificationOrigin: "L1 ADVERSARIAL SCREENING / AUTO-FLAG",
    justification: "Feed FEED-84A flagged a deception signature in the logistics firm's self-reported cyber resilience metrics. Cross-referencing with COMINT intercepts indicates active concealment of a recent ransomware incident. The published certification score is not a reliable input for the current simulation cycle.",
    assignedTo: "Analyst T. Nguyen",
  },
];

// ── Analyst Profiles ──────────────────────────────────────────────────────────

export interface MockAnalyst {
  id: string;
  name: string;
  unit: string;
  weightLabel: "HIGH WT" | "MED WT" | "LOW WT";
  accuracy: number;
  overrides: number;
  confirmed: number;
  adjudicatorLevel: string;
  multiplier: number;
  multiplierDomain: string;
  accuracyTrend: Array<{ month: string; acc: number }>;
}

export const MOCK_ANALYSTS: MockAnalyst[] = [
  {
    id: "AN-772",
    name: "Analyst J.Doe",
    unit: "Red-Cell 2",
    weightLabel: "HIGH WT",
    accuracy: 91,
    overrides: 12,
    confirmed: 11,
    adjudicatorLevel: "L7",
    multiplier: 1.5,
    multiplierDomain: "Taiwan / Semiconductor",
    accuracyTrend: [
      { month: "Feb", acc: 83 },
      { month: "Mar", acc: 87 },
      { month: "Apr", acc: 89 },
      { month: "May", acc: 91 },
    ],
  },
  {
    id: "AN-441",
    name: "Analyst M.Smith",
    unit: "Global Log. CMD",
    weightLabel: "MED WT",
    accuracy: 80,
    overrides: 5,
    confirmed: 4,
    adjudicatorLevel: "L5",
    multiplier: 1.0,
    multiplierDomain: "Maritime / Port Operations",
    accuracyTrend: [
      { month: "Feb", acc: 75 },
      { month: "Mar", acc: 78 },
      { month: "Apr", acc: 80 },
      { month: "May", acc: 80 },
    ],
  },
  {
    id: "AN-309",
    name: "Analyst T.Nguyen",
    unit: "Supply Chain Res.",
    weightLabel: "HIGH WT",
    accuracy: 87,
    overrides: 8,
    confirmed: 7,
    adjudicatorLevel: "L6",
    multiplier: 1.3,
    multiplierDomain: "Electronics / Semiconductor",
    accuracyTrend: [
      { month: "Feb", acc: 82 },
      { month: "Mar", acc: 84 },
      { month: "Apr", acc: 86 },
      { month: "May", acc: 87 },
    ],
  },
  {
    id: "RC-004",
    name: "Team Red-Cell 4",
    unit: "Adversarial TT.",
    weightLabel: "LOW WT",
    accuracy: 41,
    overrides: 34,
    confirmed: 14,
    adjudicatorLevel: "L3",
    multiplier: 0.4,
    multiplierDomain: "Adversarial Scenarios",
    accuracyTrend: [
      { month: "Feb", acc: 44 },
      { month: "Mar", acc: 43 },
      { month: "Apr", acc: 42 },
      { month: "May", acc: 41 },
    ],
  },
];

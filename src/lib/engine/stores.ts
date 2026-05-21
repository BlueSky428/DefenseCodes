"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  NetworkNode,
  NetworkEdge,
  NodeParams,
  RouteParams,
  DisruptionConfig,
  ExecutionParams,
  SimulationResult,
} from "./types";

// ─── Simulation Builder Store ────────────────────────────────────────────────

interface SimulationState {
  currentSimulationId: string | null;
  network: { nodes: NetworkNode[]; edges: NetworkEdge[] };
  variables: {
    nodeParams: Record<string, NodeParams>;
    routeParams: Record<string, RouteParams>;
    disruptions: DisruptionConfig;
  };
  executionParams: ExecutionParams;
  setNetwork: (network: { nodes: NetworkNode[]; edges: NetworkEdge[] }) => void;
  setVariables: (vars: Partial<SimulationState["variables"]>) => void;
  setExecutionParams: (params: Partial<ExecutionParams>) => void;
  setCurrentSimulationId: (id: string | null) => void;
  reset: () => void;
}

const defaultDisruptions: DisruptionConfig = {
  portClosure: { enabled: false, probability: 5 },
  cyberDos: { enabled: false, probability: 3 },
  physicalDamage: { enabled: false, probability: 2, recoveryMin: 7, recoveryMax: 30 },
  supplierInsolvency: { enabled: false, probability: 1 },
  customsDelay: { enabled: false, probability: 8, delayMin: 3, delayMax: 21 },
  geopoliticalEscalation: { enabled: false, probability: 4 },
};

const defaultExecutionParams: ExecutionParams = {
  iterations: 10000,
  name: "",
  scenarioLabel: "",
  confidenceInterval: 95,
};

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      currentSimulationId: null,
      network: { nodes: [], edges: [] },
      variables: {
        nodeParams: {},
        routeParams: {},
        disruptions: defaultDisruptions,
      },
      executionParams: defaultExecutionParams,
      setNetwork: (network) => set({ network }),
      setVariables: (vars) =>
        set((s) => ({ variables: { ...s.variables, ...vars } })),
      setExecutionParams: (params) =>
        set((s) => ({ executionParams: { ...s.executionParams, ...params } })),
      setCurrentSimulationId: (id) => set({ currentSimulationId: id }),
      reset: () =>
        set({
          currentSimulationId: null,
          network: { nodes: [], edges: [] },
          variables: {
            nodeParams: {},
            routeParams: {},
            disruptions: defaultDisruptions,
          },
          executionParams: defaultExecutionParams,
        }),
    }),
    { name: "engine-simulation-draft" }
  )
);

// ─── Job Store ────────────────────────────────────────────────────────────────

interface JobEntry {
  id: string;
  name: string;
  status: "queued" | "running" | "completed" | "failed";
  progressPercent: number;
  etaSeconds: number;
  createdAt: string;
}

interface JobState {
  activeJobs: Record<string, JobEntry>;
  updateJobStatus: (id: string, entry: Partial<JobEntry>) => void;
  addJob: (entry: JobEntry) => void;
  removeJob: (id: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  activeJobs: {},
  addJob: (entry) =>
    set((s) => ({ activeJobs: { ...s.activeJobs, [entry.id]: entry } })),
  updateJobStatus: (id, entry) =>
    set((s) => ({
      activeJobs: {
        ...s.activeJobs,
        [id]: { ...s.activeJobs[id], ...entry },
      },
    })),
  removeJob: (id) =>
    set((s) => {
      const next = { ...s.activeJobs };
      delete next[id];
      return { activeJobs: next };
    }),
}));

// ─── Results Store ────────────────────────────────────────────────────────────

interface ResultsState {
  results: Record<string, SimulationResult>;
  setResult: (id: string, result: SimulationResult) => void;
  getResult: (id: string) => SimulationResult | undefined;
}

export const useResultsStore = create<ResultsState>((set, get) => ({
  results: {},
  setResult: (id, result) =>
    set((s) => ({ results: { ...s.results, [id]: result } })),
  getResult: (id) => get().results[id],
}));

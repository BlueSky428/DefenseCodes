export type NodeType =
  | "manufacturer"
  | "transit_hub"
  | "storage_depot"
  | "endpoint_delivery"
  | "customs_port";

export interface NetworkNode {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export type DistributionType = "Normal" | "LogNormal" | "Triangular" | "Uniform";

export interface RouteParams {
  meanLeadTime: number;
  minLeadTime: number;
  maxLeadTime: number;
  distribution: DistributionType;
}

export interface NodeParams {
  inventoryBuffer: number;
  processingCapacity: number;
  reliabilityScore: number;
}

export interface DisruptionConfig {
  portClosure: { enabled: boolean; probability: number };
  cyberDos: { enabled: boolean; probability: number };
  physicalDamage: {
    enabled: boolean;
    probability: number;
    recoveryMin: number;
    recoveryMax: number;
  };
  supplierInsolvency: { enabled: boolean; probability: number };
  customsDelay: {
    enabled: boolean;
    probability: number;
    delayMin: number;
    delayMax: number;
  };
  geopoliticalEscalation: { enabled: boolean; probability: number };
}

export interface ExecutionParams {
  iterations: number;
  name: string;
  scenarioLabel: string;
  confidenceInterval: number;
}

export interface SimulationResult {
  id: string;
  name: string;
  scenarioLabel: string;
  status: "queued" | "running" | "completed" | "failed";
  progressPercent: number;
  etaSeconds: number;
  createdAt: string;
  probabilityCurveData: Array<{ x: number; y: number }>;
  bottlenecks: Array<{
    id: string;
    name: string;
    failureContribution: number;
    avgDelayInduced: number;
    recommendedAction: string;
  }>;
  recommendations: Array<{
    id: string;
    text: string;
    impact: string;
    nodeId?: string;
  }>;
  p50: number;
  p90: number;
  p99: number;
}

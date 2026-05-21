"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardSteps } from "./wizard-steps";
import { useSimulationStore } from "@/lib/engine/stores";
import type { NodeParams, RouteParams, DisruptionConfig, DistributionType } from "@/lib/engine/types";

const DISTRIBUTIONS: DistributionType[] = ["Normal", "LogNormal", "Triangular", "Uniform"];

function NodeParamCard({
  nodeId,
  nodeLabel,
  params,
  onChange,
}: {
  nodeId: string;
  nodeLabel: string;
  params: NodeParams;
  onChange: (p: NodeParams) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-400">
            N
          </span>
          <span className="text-sm font-medium text-slate-200">{nodeLabel}</span>
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="grid gap-4 border-t border-white/10 p-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Inventory Buffer (units)</span>
            <input
              type="number"
              min={0}
              value={params.inventoryBuffer}
              onChange={(e) => onChange({ ...params, inventoryBuffer: Number(e.target.value) })}
              className="rounded-lg border border-white/10 bg-[#0A0F1F] px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label={`Inventory buffer for ${nodeLabel}`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Processing Capacity (units/day)</span>
            <input
              type="number"
              min={0}
              value={params.processingCapacity}
              onChange={(e) => onChange({ ...params, processingCapacity: Number(e.target.value) })}
              className="rounded-lg border border-white/10 bg-[#0A0F1F] px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label={`Processing capacity for ${nodeLabel}`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Supplier Reliability (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={params.reliabilityScore}
              onChange={(e) => onChange({ ...params, reliabilityScore: Number(e.target.value) })}
              className="rounded-lg border border-white/10 bg-[#0A0F1F] px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label={`Reliability score for ${nodeLabel}`}
            />
          </label>
        </div>
      )}
    </div>
  );
}

function RouteParamCard({
  edgeId,
  edgeLabel,
  params,
  onChange,
}: {
  edgeId: string;
  edgeLabel: string;
  params: RouteParams;
  onChange: (p: RouteParams) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-bold text-purple-400">
            R
          </span>
          <span className="text-sm font-medium text-slate-200">{edgeLabel}</span>
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="grid gap-4 border-t border-white/10 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Mean Lead Time (days)</span>
            <input
              type="number"
              min={0}
              value={params.meanLeadTime}
              onChange={(e) => onChange({ ...params, meanLeadTime: Number(e.target.value) })}
              className="rounded-lg border border-white/10 bg-[#0A0F1F] px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label={`Mean lead time for route ${edgeLabel}`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Min Lead Time (days)</span>
            <input
              type="number"
              min={0}
              value={params.minLeadTime}
              onChange={(e) => onChange({ ...params, minLeadTime: Number(e.target.value) })}
              className="rounded-lg border border-white/10 bg-[#0A0F1F] px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label={`Min lead time for route ${edgeLabel}`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Max Lead Time (days)</span>
            <input
              type="number"
              min={0}
              value={params.maxLeadTime}
              onChange={(e) => onChange({ ...params, maxLeadTime: Number(e.target.value) })}
              className="rounded-lg border border-white/10 bg-[#0A0F1F] px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label={`Max lead time for route ${edgeLabel}`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Distribution</span>
            <select
              value={params.distribution}
              onChange={(e) => onChange({ ...params, distribution: e.target.value as DistributionType })}
              className="rounded-lg border border-white/10 bg-[#0A0F1F] px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label={`Distribution type for route ${edgeLabel}`}
            >
              {DISTRIBUTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

interface DisruptionRowProps {
  label: string;
  description: string;
  enabled: boolean;
  probability: number;
  extraFields?: React.ReactNode;
  onToggle: (v: boolean) => void;
  onProbability: (v: number) => void;
}

function DisruptionRow({ label, description, enabled, probability, extraFields, onToggle, onProbability }: DisruptionRowProps) {
  return (
    <div className={`rounded-xl border p-4 transition ${enabled ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onToggle(!enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              enabled ? "bg-red-500" : "bg-white/10"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <div>
            <p className="text-sm font-medium text-slate-200">{label}</p>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>
        {enabled && (
          <label className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">Probability</span>
            <input
              type="number"
              min={0}
              max={100}
              value={probability}
              onChange={(e) => onProbability(Number(e.target.value))}
              className="w-16 rounded-lg border border-white/10 bg-[#0A0F1F] px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
              aria-label={`Probability for ${label}`}
            />
            <span className="text-xs text-slate-500">%</span>
          </label>
        )}
      </div>
      {enabled && extraFields && <div className="mt-3 border-t border-white/10 pt-3">{extraFields}</div>}
    </div>
  );
}

const defaultNodeParams = (): NodeParams => ({
  inventoryBuffer: 100,
  processingCapacity: 50,
  reliabilityScore: 85,
});

const defaultRouteParams = (): RouteParams => ({
  meanLeadTime: 7,
  minLeadTime: 3,
  maxLeadTime: 14,
  distribution: "Normal",
});

export function SimulationStep2() {
  const router = useRouter();
  const { network, variables, setVariables } = useSimulationStore();
  const [advancedMode, setAdvancedMode] = useState(false);
  const [panel, setPanel] = useState<"nodes" | "routes">("nodes");

  const updateNodeParams = (nodeId: string, params: NodeParams) => {
    setVariables({ nodeParams: { ...variables.nodeParams, [nodeId]: params } });
  };

  const updateRouteParams = (edgeId: string, params: RouteParams) => {
    setVariables({ routeParams: { ...variables.routeParams, [edgeId]: params } });
  };

  const updateDisruption = (patch: Partial<DisruptionConfig>) => {
    setVariables({ disruptions: { ...variables.disruptions, ...patch } });
  };

  const d = variables.disruptions;

  const toggleGeopolitical = (v: boolean) => {
    updateDisruption({
      geopoliticalEscalation: { ...d.geopoliticalEscalation, enabled: v },
      ...(v
        ? {
            portClosure: { enabled: true, probability: 15 },
            cyberDos: { enabled: true, probability: 8 },
            physicalDamage: { enabled: true, probability: 6, recoveryMin: 14, recoveryMax: 60 },
            customsDelay: { enabled: true, probability: 20, delayMin: 7, delayMax: 45 },
          }
        : {}),
    });
  };

  const canProceed = network.nodes.every(
    (n) => (variables.nodeParams[n.id]?.reliabilityScore ?? 85) > 0
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0D1526]/60 px-6 py-4">
        <WizardSteps current={2} />
        <div className="mt-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Variable & Risk Assignment</h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Configure lead times, capacities, and disruption probabilities.
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <span className="text-xs font-medium text-slate-400">Advanced Mode</span>
            <button
              type="button"
              role="switch"
              aria-checked={advancedMode}
              onClick={() => setAdvancedMode((a) => !a)}
              className={`relative inline-flex h-5 w-9 rounded-full border-2 border-transparent transition-colors ${
                advancedMode ? "bg-blue-500" : "bg-white/10"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  advancedMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Nodes / Routes tabs */}
        <div>
          <div className="flex gap-1 border-b border-white/10 mb-4" role="tablist">
            <button
              role="tab"
              aria-selected={panel === "nodes"}
              type="button"
              onClick={() => setPanel("nodes")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
                panel === "nodes" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Nodes ({network.nodes.length})
            </button>
            <button
              role="tab"
              aria-selected={panel === "routes"}
              type="button"
              onClick={() => setPanel("routes")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
                panel === "routes" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Routes ({network.edges.length})
            </button>
          </div>

          {panel === "nodes" && (
            <div className="space-y-3">
              {network.nodes.length === 0 ? (
                <p className="text-sm text-slate-500">No nodes defined. Go back to Step 1.</p>
              ) : (
                network.nodes.map((node) => (
                  <NodeParamCard
                    key={node.id}
                    nodeId={node.id}
                    nodeLabel={node.label}
                    params={variables.nodeParams[node.id] ?? defaultNodeParams()}
                    onChange={(p) => updateNodeParams(node.id, p)}
                  />
                ))
              )}
            </div>
          )}

          {panel === "routes" && (
            <div className="space-y-3">
              {network.edges.length === 0 ? (
                <p className="text-sm text-slate-500">No routes defined. Go back to Step 1.</p>
              ) : (
                network.edges.map((edge) => {
                  const srcNode = network.nodes.find((n) => n.id === edge.source);
                  const tgtNode = network.nodes.find((n) => n.id === edge.target);
                  const label = `${srcNode?.label ?? edge.source} → ${tgtNode?.label ?? edge.target}`;
                  return (
                    <RouteParamCard
                      key={edge.id}
                      edgeId={edge.id}
                      edgeLabel={label}
                      params={variables.routeParams[edge.id] ?? defaultRouteParams()}
                      onChange={(p) => updateRouteParams(edge.id, p)}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Disruption Triggers */}
        <div>
          <h2 className="mb-1 text-base font-semibold text-white">Disruption Triggers</h2>
          <p className="mb-4 text-sm text-slate-400">
            Toggle disruption scenarios and set their probability of occurrence.
          </p>
          <div className="space-y-3">
            <DisruptionRow
              label="Port Closure"
              description="Temporary or extended closure of maritime/air ports"
              enabled={d.portClosure.enabled}
              probability={d.portClosure.probability}
              onToggle={(v) => updateDisruption({ portClosure: { ...d.portClosure, enabled: v } })}
              onProbability={(v) => updateDisruption({ portClosure: { ...d.portClosure, probability: v } })}
            />
            <DisruptionRow
              label="Cyber Denial-of-Service"
              description="Targeted cyberattack disrupting logistics systems"
              enabled={d.cyberDos.enabled}
              probability={d.cyberDos.probability}
              onToggle={(v) => updateDisruption({ cyberDos: { ...d.cyberDos, enabled: v } })}
              onProbability={(v) => updateDisruption({ cyberDos: { ...d.cyberDos, probability: v } })}
            />
            <DisruptionRow
              label="Physical Infrastructure Damage"
              description="Natural disaster, strike, or sabotage causing physical damage"
              enabled={d.physicalDamage.enabled}
              probability={d.physicalDamage.probability}
              onToggle={(v) => updateDisruption({ physicalDamage: { ...d.physicalDamage, enabled: v } })}
              onProbability={(v) => updateDisruption({ physicalDamage: { ...d.physicalDamage, probability: v } })}
              extraFields={
                <div className="flex gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">Recovery Min (days)</span>
                    <input
                      type="number"
                      min={0}
                      value={d.physicalDamage.recoveryMin}
                      onChange={(e) => updateDisruption({ physicalDamage: { ...d.physicalDamage, recoveryMin: Number(e.target.value) } })}
                      className="w-20 rounded-lg border border-white/10 bg-[#0A0F1F] px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                      aria-label="Recovery min days"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">Recovery Max (days)</span>
                    <input
                      type="number"
                      min={0}
                      value={d.physicalDamage.recoveryMax}
                      onChange={(e) => updateDisruption({ physicalDamage: { ...d.physicalDamage, recoveryMax: Number(e.target.value) } })}
                      className="w-20 rounded-lg border border-white/10 bg-[#0A0F1F] px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                      aria-label="Recovery max days"
                    />
                  </label>
                </div>
              }
            />
            <DisruptionRow
              label="Supplier Insolvency"
              description="Key supplier goes insolvent or exits market"
              enabled={d.supplierInsolvency.enabled}
              probability={d.supplierInsolvency.probability}
              onToggle={(v) => updateDisruption({ supplierInsolvency: { ...d.supplierInsolvency, enabled: v } })}
              onProbability={(v) => updateDisruption({ supplierInsolvency: { ...d.supplierInsolvency, probability: v } })}
            />
            <DisruptionRow
              label="Customs / Regulatory Delay"
              description="Unexpected regulatory or customs clearance delay"
              enabled={d.customsDelay.enabled}
              probability={d.customsDelay.probability}
              onToggle={(v) => updateDisruption({ customsDelay: { ...d.customsDelay, enabled: v } })}
              onProbability={(v) => updateDisruption({ customsDelay: { ...d.customsDelay, probability: v } })}
              extraFields={
                <div className="flex gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">Delay Min (days)</span>
                    <input type="number" min={0} value={d.customsDelay.delayMin} onChange={(e) => updateDisruption({ customsDelay: { ...d.customsDelay, delayMin: Number(e.target.value) } })} className="w-20 rounded-lg border border-white/10 bg-[#0A0F1F] px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500" aria-label="Delay min days" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">Delay Max (days)</span>
                    <input type="number" min={0} value={d.customsDelay.delayMax} onChange={(e) => updateDisruption({ customsDelay: { ...d.customsDelay, delayMax: Number(e.target.value) } })} className="w-20 rounded-lg border border-white/10 bg-[#0A0F1F] px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500" aria-label="Delay max days" />
                  </label>
                </div>
              }
            />
            <DisruptionRow
              label="Geopolitical Escalation"
              description="Composite trigger — auto-sets defaults for all related disruptions"
              enabled={d.geopoliticalEscalation.enabled}
              probability={d.geopoliticalEscalation.probability}
              onToggle={toggleGeopolitical}
              onProbability={(v) => updateDisruption({ geopoliticalEscalation: { ...d.geopoliticalEscalation, probability: v } })}
            />
          </div>
        </div>

        {/* Advanced Mode */}
        {advancedMode && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
            <h3 className="text-sm font-semibold text-blue-300">Advanced Mode</h3>
            <p className="mt-1 text-xs text-slate-400">
              Correlation matrices and custom probability curves. Available in the full release.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Route Correlation", "Node Correlation", "Custom Curves"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center text-xs text-slate-500">
                  {item}
                  <div className="mt-1 text-[10px] text-blue-500/60">Coming soon</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 bg-[#0D1526]/60 px-6 py-4">
        <button
          type="button"
          onClick={() => router.push("/engine/simulation/new")}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/engine/simulation/new/execute")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next: Execution
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

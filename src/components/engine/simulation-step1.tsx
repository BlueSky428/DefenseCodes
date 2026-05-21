"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WizardSteps } from "./wizard-steps";
import { NetworkCanvas } from "./network-canvas";
import { useSimulationStore } from "@/lib/engine/stores";
import { mockGetTemplates } from "@/lib/engine/mock-api";
import type { NetworkNode, NetworkEdge } from "@/lib/engine/types";

type InputTab = "manual" | "import" | "templates";

export function SimulationStep1() {
  const router = useRouter();
  const { network, setNetwork } = useSimulationStore();
  const [tab, setTab] = useState<InputTab>("manual");
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; description: string }>>([]);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);

  const handleNetworkChange = useCallback(
    (nodes: NetworkNode[], edges: NetworkEdge[]) => {
      setNetwork({ nodes, edges });
    },
    [setNetwork]
  );

  const loadTemplates = async () => {
    if (templatesLoaded) return;
    setTemplateLoading(true);
    const tmpl = await mockGetTemplates();
    setTemplates(tmpl);
    setTemplatesLoaded(true);
    setTemplateLoading(false);
  };

  const handleTabChange = (t: InputTab) => {
    setTab(t);
    if (t === "templates") void loadTemplates();
  };

  const applyTemplate = (templateId: string) => {
    const baseNodes: NetworkNode[] =
      templateId === "t1"
        ? [
            { id: "n1", type: "manufacturer", label: "Manufacturer A", position: { x: 80, y: 200 } },
            { id: "n2", type: "transit_hub", label: "Regional Hub", position: { x: 320, y: 200 } },
            { id: "n3", type: "endpoint_delivery", label: "End-Point 1", position: { x: 560, y: 100 } },
            { id: "n4", type: "endpoint_delivery", label: "End-Point 2", position: { x: 560, y: 220 } },
            { id: "n5", type: "endpoint_delivery", label: "End-Point 3", position: { x: 560, y: 340 } },
          ]
        : templateId === "t2"
        ? [
            { id: "n1", type: "manufacturer", label: "Manufacturer Alpha", position: { x: 60, y: 100 } },
            { id: "n2", type: "manufacturer", label: "Manufacturer Beta", position: { x: 60, y: 280 } },
            { id: "n3", type: "transit_hub", label: "Hub West", position: { x: 280, y: 100 } },
            { id: "n4", type: "transit_hub", label: "Hub East", position: { x: 280, y: 280 } },
            { id: "n5", type: "customs_port", label: "Port of Entry", position: { x: 480, y: 190 } },
            { id: "n6", type: "storage_depot", label: "Depot Alpha", position: { x: 680, y: 100 } },
            { id: "n7", type: "endpoint_delivery", label: "End-Point Final", position: { x: 880, y: 190 } },
          ]
        : [
            { id: "n1", type: "manufacturer", label: "Composite Supplier", position: { x: 80, y: 180 } },
            { id: "n2", type: "transit_hub", label: "Autoclave Hub", position: { x: 300, y: 120 } },
            { id: "n3", type: "storage_depot", label: "Tier-2 Depot", position: { x: 300, y: 280 } },
            { id: "n4", type: "endpoint_delivery", label: "Assembly Final", position: { x: 520, y: 180 } },
          ];

    const baseEdges: NetworkEdge[] =
      templateId === "t1"
        ? [
            { id: "e1", source: "n1", target: "n2" },
            { id: "e2", source: "n2", target: "n3" },
            { id: "e3", source: "n2", target: "n4" },
            { id: "e4", source: "n2", target: "n5" },
          ]
        : templateId === "t2"
        ? [
            { id: "e1", source: "n1", target: "n3" },
            { id: "e2", source: "n2", target: "n4" },
            { id: "e3", source: "n3", target: "n5" },
            { id: "e4", source: "n4", target: "n5" },
            { id: "e5", source: "n5", target: "n6" },
            { id: "e6", source: "n6", target: "n7" },
          ]
        : [
            { id: "e1", source: "n1", target: "n2" },
            { id: "e2", source: "n1", target: "n3" },
            { id: "e3", source: "n2", target: "n4" },
            { id: "e4", source: "n3", target: "n4" },
          ];

    setNetwork({ nodes: baseNodes, edges: baseEdges });
    setTab("manual");
  };

  const canProceed = network.nodes.length >= 2 && network.edges.length >= 1;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0D1526]/60 px-6 py-4">
        <WizardSteps current={1} />
        <h1 className="mt-3 text-lg font-semibold text-white">Network Definition</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Build your supply chain topology. Add nodes and draw transit routes between them.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 bg-[#0D1526]/40 px-6">
        <div className="flex gap-1" role="tablist" aria-label="Input method">
          {(["manual", "import", "templates"] as InputTab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              type="button"
              onClick={() => handleTabChange(t)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition capitalize ${
                tab === t
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "import" ? "Bulk Import" : t === "templates" ? "Template Library" : "Manual"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === "manual" && (
        <div className="flex-1 min-h-0">
          <NetworkCanvas
            onChange={handleNetworkChange}
            initialNodes={network.nodes}
            initialEdges={network.edges}
          />
        </div>
      )}

      {tab === "import" && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg">
            <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-10 w-10 text-slate-500" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="mt-3 text-sm font-medium text-slate-300">Upload CSV or Excel file</p>
              <p className="mt-1 text-xs text-slate-500">
                Columns: node_id, node_type, label, source_id, target_id
              </p>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition">
                <input type="file" accept=".csv,.xlsx" className="sr-only" aria-label="Upload network file" />
                Choose file
              </label>
              <p className="mt-4 text-xs text-slate-600">
                After upload, nodes and edges will populate the canvas.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "templates" && (
        <div className="flex-1 overflow-y-auto p-6">
          {templateLoading ? (
            <div className="text-sm text-slate-500">Loading templates…</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => applyTemplate(tmpl.id)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-blue-500/40 hover:bg-blue-500/5 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 mb-3">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-blue-400" aria-hidden>
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition">{tmpl.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{tmpl.description}</p>
                  <span className="mt-3 inline-block text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition">
                    Apply template →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 bg-[#0D1526]/60 px-6 py-4">
        <p className="text-xs text-slate-500">
          {network.nodes.length} nodes · {network.edges.length} edges
          {!canProceed && " · Need ≥2 nodes and ≥1 edge to continue"}
        </p>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/engine/simulation/new/variables")}
          aria-disabled={!canProceed}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next: Variables
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

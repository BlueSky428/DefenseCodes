"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { NetworkNode, NetworkEdge, NodeType } from "@/lib/engine/types";

const NODE_TYPE_CONFIG: Record<NodeType, { label: string; color: string; bg: string }> = {
  manufacturer: { label: "Manufacturer", color: "#60a5fa", bg: "#1e3a5f" },
  transit_hub: { label: "Transit Hub", color: "#a78bfa", bg: "#2e1b5e" },
  storage_depot: { label: "Storage Depot", color: "#34d399", bg: "#064e3b" },
  endpoint_delivery: { label: "End-Point Delivery", color: "#fbbf24", bg: "#451a03" },
  customs_port: { label: "Customs / Port", color: "#f87171", bg: "#450a0a" },
};

function SupplyChainNode({ data }: { data: { label: string; nodeType: NodeType } }) {
  const cfg = NODE_TYPE_CONFIG[data.nodeType] ?? NODE_TYPE_CONFIG.manufacturer;
  return (
    <div
      className="rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-lg min-w-[120px] text-center"
      style={{
        borderColor: cfg.color + "60",
        background: cfg.bg,
        color: cfg.color,
        boxShadow: `0 0 16px ${cfg.color}20`,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: cfg.color }} />
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] font-medium opacity-70 uppercase tracking-wider">
          {cfg.label}
        </span>
        <span className="text-sm font-bold">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: cfg.color }} />
    </div>
  );
}

const NODE_TYPES = { supplyChainNode: SupplyChainNode };

interface NetworkCanvasProps {
  onChange: (nodes: NetworkNode[], edges: NetworkEdge[]) => void;
  initialNodes?: NetworkNode[];
  initialEdges?: NetworkEdge[];
}

function toFlowNode(n: NetworkNode): Node {
  return {
    id: n.id,
    type: "supplyChainNode",
    position: n.position,
    data: { label: n.label, nodeType: n.type },
  };
}

function toFlowEdge(e: NetworkEdge): Edge {
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    style: { stroke: "#475569", strokeWidth: 2 },
    labelStyle: { fill: "#94a3b8", fontSize: 11 },
  };
}

const NODE_TYPE_OPTIONS: NodeType[] = [
  "manufacturer",
  "transit_hub",
  "storage_depot",
  "endpoint_delivery",
  "customs_port",
];

let nodeCounter = 1;

export function NetworkCanvas({ onChange, initialNodes = [], initialEdges = [] }: NetworkCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.map(toFlowNode));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges.map(toFlowEdge));
  const [selectedType, setSelectedType] = useState<NodeType>("manufacturer");

  // Keep a stable ref to onChange so the effect never needs it as a dep
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  // Emit to parent after every nodes/edges change — runs after render, never during
  useEffect(() => {
    const networkNodes: NetworkNode[] = nodes.map((n) => ({
      id: n.id,
      type: (n.data as { nodeType: NodeType }).nodeType,
      label: (n.data as { label: string }).label,
      position: n.position,
    }));
    const networkEdges: NetworkEdge[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: typeof e.label === "string" ? e.label : undefined,
    }));
    onChangeRef.current(networkNodes, networkEdges);
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, style: { stroke: "#475569", strokeWidth: 2 } }, eds));
    },
    [setEdges]
  );

  const addNode = useCallback(() => {
    const cfg = NODE_TYPE_CONFIG[selectedType];
    const id = `node-${Date.now()}-${nodeCounter++}`;
    const newNode: Node = {
      id,
      type: "supplyChainNode",
      position: { x: 100 + (nodes.length % 4) * 200, y: 100 + Math.floor(nodes.length / 4) * 140 },
      data: { label: `${cfg.label} ${nodeCounter}`, nodeType: selectedType },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [selectedType, nodes.length, setNodes]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#0D1526] px-4 py-2.5">
        <span className="text-xs font-medium text-slate-400">Add node:</span>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as NodeType)}
          className="rounded-lg border border-white/10 bg-[#0A0F1F] px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Select node type"
        >
          {NODE_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {NODE_TYPE_CONFIG[t].label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addNode}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/30"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Node
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <span>{nodes.length} nodes</span>
          <span>·</span>
          <span>{edges.length} edges</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative" style={{ height: "100%", minHeight: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={(_, node) => {
            const newLabel = window.prompt("Rename node:", (node.data as { label: string }).label);
            if (!newLabel) return;
            setNodes((nds) =>
              nds.map((n) =>
                n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
              )
            );
          }}
          fitView
          className="bg-[#080d1a]"
          deleteKeyCode="Delete"
          minZoom={0.2}
          maxZoom={3}
        >
          <Background variant={BackgroundVariant.Dots} color="#1e2d45" gap={20} size={1} />
          <Controls className="[&>button]:bg-[#0D1526] [&>button]:border-white/10 [&>button]:text-slate-400" />
          <MiniMap
            nodeColor={(n) => {
              const t = (n.data as { nodeType: NodeType }).nodeType;
              return NODE_TYPE_CONFIG[t]?.color ?? "#475569";
            }}
            className="bg-[#0D1526] border border-white/10 rounded-lg"
          />
        </ReactFlow>
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">Canvas is empty</p>
              <p className="mt-1 text-xs text-slate-600">
                Use the toolbar above to add nodes, then connect them by dragging from a node handle
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

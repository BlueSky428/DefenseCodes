"use client";

import { useState } from "react";

type SettingsTab = "users" | "deployment" | "templates" | "audit" | "api";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "users", label: "User Management" },
  { id: "deployment", label: "Deployment Config" },
  { id: "templates", label: "Default Templates" },
  { id: "audit", label: "Audit Log" },
  { id: "api", label: "API Access" },
];

const MOCK_USERS = [
  { id: "u1", name: "Alice Chen", email: "alice@defense.codes", role: "Admin", team: "SCRA" },
  { id: "u2", name: "Bob Martinez", email: "bob@defense.codes", role: "Analyst", team: "SCRA" },
  { id: "u3", name: "Carol Singh", email: "carol@defense.codes", role: "Viewer", team: "Aerospace" },
];

const MOCK_AUDIT = [
  { id: "a1", user: "Alice Chen", action: "Ran simulation", simulation: "Q3-2026 Baseline", timestamp: "2026-05-20 11:42", status: "completed" },
  { id: "a2", user: "Bob Martinez", action: "Exported PDF", simulation: "Port-Closure Stress Test", timestamp: "2026-05-19 15:08", status: "exported" },
  { id: "a3", user: "Alice Chen", action: "Ran simulation", simulation: "Geopolitical Scenario Alpha", timestamp: "2026-05-18 09:31", status: "completed" },
  { id: "a4", user: "Carol Singh", action: "Viewed results", simulation: "Q3-2026 Baseline", timestamp: "2026-05-17 14:22", status: "viewed" },
];

const MOCK_TEMPLATES = [
  { id: "t1", name: "Single-Source Regional Hub", author: "Alice Chen", modified: "2026-05-12" },
  { id: "t2", name: "Multi-Tier Global Grid", author: "Bob Martinez", modified: "2026-05-08" },
  { id: "t3", name: "Aerospace Component Chain", author: "Alice Chen", modified: "2026-04-30" },
];

function UsersPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Manage team members and roles.</p>
        <button type="button" className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/30">
          Invite User
        </button>
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-xs text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Name</th>
              <th className="px-5 py-3 text-left font-medium">Email</th>
              <th className="px-5 py-3 text-left font-medium">Role</th>
              <th className="px-5 py-3 text-left font-medium">Team</th>
              <th className="px-5 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((u) => (
              <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-slate-200 font-medium">{u.name}</td>
                <td className="px-5 py-3 text-slate-400">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.role === "Admin" ? "bg-blue-500/10 text-blue-400" :
                    u.role === "Analyst" ? "bg-purple-500/10 text-purple-400" :
                    "bg-slate-500/10 text-slate-400"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400">{u.team}</td>
                <td className="px-5 py-3">
                  <button type="button" className="text-xs text-slate-500 hover:text-slate-300 transition">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeploymentPanel() {
  return (
    <div className="space-y-4 max-w-xl">
      <p className="text-sm text-slate-400">Connection strings and infrastructure configuration.</p>
      {[
        { label: "Backend API URL", value: "https://engine-api.defense.codes", masked: false },
        { label: "Database Connection", value: "postgresql://engine:••••••••@db.internal:5432/engine", masked: true },
        { label: "Redis Cache URL", value: "redis://cache.internal:6379", masked: false },
        { label: "JWT Secret", value: "••••••••••••••••••••••••••••••••", masked: true },
      ].map((item) => (
        <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs font-medium text-slate-400 mb-1.5">{item.label}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-[#0A0F1F] px-3 py-2 text-xs font-mono text-slate-300">
              {item.value}
            </code>
            {item.masked && (
              <button type="button" className="text-xs text-slate-500 hover:text-slate-300 transition px-2">
                Reveal
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
        <p className="text-sm text-emerald-400 font-medium">On-Premises deployment — all data stays within your network.</p>
      </div>
    </div>
  );
}

function TemplatesPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Organisation-wide simulation templates.</p>
        <button type="button" className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/30">
          + New Template
        </button>
      </div>
      <div className="space-y-3">
        {MOCK_TEMPLATES.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-200">{t.name}</p>
              <p className="text-xs text-slate-500">By {t.author} · Last modified {t.modified}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-xs text-blue-400 hover:underline transition">Edit</button>
              <button type="button" className="text-xs text-red-400 hover:underline transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">Complete log of simulation runs and exports.</p>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-xs text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left font-medium">User</th>
              <th className="px-5 py-3 text-left font-medium">Action</th>
              <th className="px-5 py-3 text-left font-medium">Simulation</th>
              <th className="px-5 py-3 text-left font-medium">Timestamp</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_AUDIT.map((a) => (
              <tr key={a.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-slate-200">{a.user}</td>
                <td className="px-5 py-3 text-slate-400">{a.action}</td>
                <td className="px-5 py-3 text-slate-300">{a.simulation}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{a.timestamp}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    a.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                    a.status === "exported" ? "bg-blue-500/10 text-blue-400" :
                    "bg-slate-500/10 text-slate-400"
                  }`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApiPanel() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const mockKeys = [
    { id: "k1", name: "Production Key", key: "dc_engine_prod_xK8mN2qRtP9vL4wJ", created: "2026-04-01", lastUsed: "2026-05-19", rateLimit: "1000 req/hr" },
    { id: "k2", name: "CI Pipeline Key", key: "dc_engine_ci_aB7cD3eF6gH9iJ2k", created: "2026-03-15", lastUsed: "2026-05-20", rateLimit: "500 req/hr" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Manage API keys for programmatic access.</p>
        <button type="button" className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/30">
          Generate Key
        </button>
      </div>
      <div className="space-y-3">
        {mockKeys.map((k) => (
          <div key={k.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-slate-200">{k.name}</p>
                <p className="text-xs text-slate-500">Created {k.created} · Last used {k.lastUsed}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{k.rateLimit}</span>
                <button type="button" className="text-xs text-red-400 hover:underline transition">Revoke</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-[#0A0F1F] px-3 py-2 text-xs font-mono text-slate-400">
                {revealed[k.id] ? k.key : k.key.slice(0, 12) + "••••••••••••••••••••"}
              </code>
              <button
                type="button"
                onClick={() => setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))}
                className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400 transition hover:bg-white/10"
                aria-label={revealed[k.id] ? "Hide API key" : "Reveal API key"}
              >
                {revealed[k.id] ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EngineSettings() {
  const [tab, setTab] = useState<SettingsTab>("users");

  return (
    <div className="p-6 max-w-[1200px]">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Settings & Admin</h1>
        <p className="mt-1 text-sm text-slate-400">Manage users, deployment, templates, and API access.</p>
      </div>

      <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto" role="tablist" aria-label="Settings sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && <UsersPanel />}
      {tab === "deployment" && <DeploymentPanel />}
      {tab === "templates" && <TemplatesPanel />}
      {tab === "audit" && <AuditPanel />}
      {tab === "api" && <ApiPanel />}
    </div>
  );
}

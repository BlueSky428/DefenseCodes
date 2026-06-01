"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Icons ────────────────────────────────────────────────────────────────────

function Icon({ name }: { name: string }) {
  const cls = "h-4 w-4 shrink-0";
  switch (name) {
    case "grid":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      );
    case "graph":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
        </svg>
      );
    case "queue":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      );
    case "audit":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={cls} aria-hidden>
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
}

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: "OPERATIONS",
    items: [
      { href: "/engine", label: "Command Center", icon: "grid", exact: true },
      { href: "/engine/simulation/new", label: "New Simulation", icon: "plus", exact: false, prefix: true },
      { href: "/engine/scenarios", label: "Scenario Library", icon: "book", exact: false },
    ],
  },
  {
    label: "DATA & INTELLIGENCE",
    items: [
      { href: "/engine/dependency-graph", label: "Dependency Graph", icon: "graph", exact: false },
      { href: "/engine/threat-intel", label: "Threat Intel Fusion", icon: "shield", exact: false },
      { href: "/engine/sovereign-intel", label: "Sovereign Intel", icon: "globe", exact: false },
      { href: "/engine/adjudication", label: "Adjudication Queue", icon: "queue", exact: false },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { href: "/engine/override-audits", label: "Override Audits", icon: "audit", exact: false },
      { href: "/engine/analyst-reputation", label: "Analyst Reputation", icon: "user", exact: false },
      { href: "/engine/model-telemetry", label: "Model Telemetry", icon: "chart", exact: false },
      { href: "/engine/settings", label: "Engine Settings", icon: "settings", exact: false },
    ],
  },
];

// ── Status bar clock ─────────────────────────────────────────────────────────

function StatusBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const ts = now
    ? `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`
    : "----";

  return (
    <div className="flex h-7 shrink-0 items-stretch border-b border-white/[0.07] bg-[#060810] font-mono text-[10px]">
      {/* Module label */}
      <div className="flex items-center gap-2 border-r border-white/[0.07] px-3">
        <span className="text-[#00e5ff]/60 uppercase tracking-widest">Module Active</span>
        <span className="font-semibold text-white tracking-wider">MC RISK ENGINE</span>
      </div>
      {/* Classification */}
      <div className="flex items-center border-r border-white/[0.07] px-3">
        <span className="rounded border border-orange-500/40 bg-orange-500/10 px-1.5 py-px text-[9px] font-bold uppercase tracking-widest text-orange-400">
          Proprietary / NOFORN
        </span>
      </div>
      {/* System status */}
      <div className="flex items-center gap-1.5 border-r border-white/[0.07] px-3">
        <span className="text-slate-500 uppercase tracking-widest">System:</span>
        <span className="font-semibold text-emerald-400 uppercase tracking-wider">Nominal</span>
      </div>
      {/* Timestamp */}
      <div className="flex items-center border-r border-white/[0.07] px-3 text-slate-500 tabular-nums">
        {ts} ZULU
      </div>
      {/* Deployment node */}
      <div className="flex items-center border-r border-white/[0.07] px-3">
        <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-px text-[9px] font-semibold uppercase tracking-widest text-amber-400">
          On-Prem Deployment (Node: Omega)
        </span>
      </div>
      {/* Analyst */}
      <div className="flex items-center gap-2 px-3 ml-auto">
        <span className="text-slate-500 uppercase tracking-widest">Analyst:</span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#00e5ff]/20 text-[9px] font-bold text-[#00e5ff]">
          J
        </span>
        <span className="font-semibold text-white tracking-wider">J.DOE</span>
      </div>
    </div>
  );
}

// ── Nav item ─────────────────────────────────────────────────────────────────

function NavItem({
  href,
  label,
  icon,
  exact,
  prefix,
}: {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  prefix?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : prefix
    ? pathname.startsWith("/engine/simulation")
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
        isActive
          ? "bg-[#00e5ff]/10 text-[#00e5ff]"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
      }`}
    >
      <Icon name={icon} />
      <span className={prefix ? "flex items-center gap-1" : undefined}>
        {prefix && <span className="text-slate-600">+</span>}
        {label}
      </span>
    </Link>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export function EngineShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#0A0F1F]">
      {/* Status bar */}
      <StatusBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-52 shrink-0 flex-col overflow-y-auto border-r border-white/[0.07] bg-[#080C14]">
          {/* Module header */}
          <div className="border-b border-white/[0.07] px-4 py-3">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Module Active
            </p>
            <p className="mt-0.5 font-mono text-xs font-bold tracking-widest text-white">
              MC RISK ENGINE
            </p>
          </div>

          {/* Nav sections */}
          <nav className="flex-1 space-y-4 px-2 py-3" aria-label="Engine navigation">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="mb-1 px-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <NavItem key={item.href} {...item} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/[0.07] px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-[11px] text-slate-600 transition hover:text-slate-400"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 shrink-0" aria-hidden>
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-mono">defense.codes // v1.0</span>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

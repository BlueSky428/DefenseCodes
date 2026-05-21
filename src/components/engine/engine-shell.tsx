"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/engine",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm7-4a1 1 0 112 0v4a1 1 0 01-1 1H7a1 1 0 010-2h1V6z" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/engine/simulation/new",
    label: "New Simulation",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/engine/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
];

function NavItem({
  href,
  label,
  icon,
  exact,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-500/20 text-blue-400"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export function EngineShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0A0F1F]">
      {/* Left Navigation */}
      <aside
        className={`flex shrink-0 flex-col border-r border-white/10 bg-[#0D1526] transition-all duration-200 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo / Brand */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
          {!collapsed && (
            <Link href="/engine" className="flex items-center gap-2 min-w-0">
              <span className="h-6 w-6 shrink-0 rounded bg-blue-500 flex items-center justify-center">
                <svg viewBox="0 0 16 16" fill="white" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M8 1L1 5v6l7 4 7-4V5L8 1zm0 2.18L13 6l-5 2.82L3 6l5-2.82zM2 7.27l5.5 3.09v4.45L2 11.73V7.27zm7 7.54v-4.45L14.5 7.27v4.46L9 14.81z" />
                </svg>
              </span>
              <span className="truncate text-sm font-semibold text-white">DC Engine</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-slate-100 shrink-0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
              {collapsed ? (
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1" aria-label="Engine navigation">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Footer: back to site */}
        <div className="border-t border-white/10 p-2">
          <Link
            href="/"
            aria-label={collapsed ? "Back to defense.codes" : undefined}
            title={collapsed ? "Back to defense.codes" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-500 transition hover:bg-white/5 hover:text-slate-300 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {!collapsed && <span>defense.codes</span>}
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Engine Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0D1526]/80 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Defense.Codes Engine
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
              v0.1 MVP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
              On-Prem
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">
              U
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

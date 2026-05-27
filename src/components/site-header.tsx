"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@/context/wallet-context";
import { WalletIssueModal } from "@/components/wallet-issue-modal";
import {
  WalletConnectEntry,
  WalletSelectModal,
} from "@/components/wallet-connect-modal";
import { ContactModal } from "@/components/contact-modal";
import { ViewReportsCta } from "@/components/wallet-cta";

const navLinkClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:min-h-0 sm:min-w-0";

const sectorLinks = [
  { label: "Defense Reports", href: "/defense-supply-chain-risk-analysis-reports" },
  { label: "Aerospace Reports", href: "/aerospace-supply-chain-risk-analysis-reports" },
  { label: "Space Reports", href: "/space-supply-chain-risk-analysis-reports" },
  { label: "Due Diligence Reports", href: "/aerospace-defense-due-diligence-reports" },
];

function shortenAddress(addr: string): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function WalletGlyph({ label }: { label: string | null }) {
  const phantom = /phantom/i.test(label ?? "");
  if (phantom) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden>
        <path d="M12 2C7 4 4 8 4 13c0 3 2 6 5 7l1-4h4l1 4c3-1 5-4 5-7 0-5-3-9-8-11zM9 10c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm6 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden>
      <path
        d="M6 8h12v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm0-2h12v2H6V6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const {
    address,
    walletDisplayName,
    walletIconUrl,
    connecting,
    connect,
    disconnect,
    walletIssue,
    dismissWalletIssue,
    lastAttemptedConnector,
    lastAttemptedWalletLabel,
    lastAttemptedWalletRdns,
  } = useWallet();

  const [menuOpen, setMenuOpen] = useState(false);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sectorRef = useRef<HTMLDivElement>(null);

  const copyAddress = useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      setMenuOpen(false);
    } catch {
      /* ignore */
    }
  }, [address]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!sectorOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (sectorRef.current && !sectorRef.current.contains(e.target as Node)) {
        setSectorOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSectorOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [sectorOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1F]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0A0F1F]/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 max-w-full items-center gap-2 sm:gap-3"
        >
          <span className="min-w-0 truncate font-[family-name:var(--font-space)] text-base font-semibold tracking-tight text-white sm:text-lg">
            DefenseCodes
          </span>
        </Link>
        <nav className="relative flex w-full min-w-0 flex-wrap items-center gap-2 text-sm sm:w-auto sm:justify-end sm:gap-3">
          {/* Sector pages dropdown */}
          <div ref={sectorRef} className="relative">
            <button
              type="button"
              aria-expanded={sectorOpen}
              aria-haspopup="menu"
              onClick={() => setSectorOpen((o) => !o)}
              className={`${navLinkClass} gap-1`}
            >
              Intelligence
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-3.5 w-3.5 transition-transform ${sectorOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {sectorOpen && (
              <div
                role="menu"
                className="absolute left-0 top-[calc(100%+0.4rem)] z-[60] w-64 overflow-hidden rounded-xl border border-white/10 bg-[#131929] py-1 shadow-2xl ring-1 ring-black/50 sm:left-auto sm:right-0"
              >
                {sectorLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setSectorOpen(false)}
                    className="block px-4 py-3 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className={navLinkClass}>
            About
          </Link>
          <a
            href="https://newsletter.defense.codes"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
          >
            Newsletters
          </a>
          <Link href="/case-study" className={navLinkClass}>
            Case Study
          </Link>
          <ViewReportsCta
            label="Reports"
            className={navLinkClass}
            connectVariant="nav"
          />
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className={navLinkClass}
          >
            Contact
          </button>
          {address ? (
            <div ref={wrapRef} className="relative">
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex min-h-11 min-w-0 max-w-full items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2 pr-3.5 text-left text-white transition hover:border-[var(--accent)]/50 hover:bg-white/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/15">
                  {walletIconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- EIP-6963 icons are data: URIs
                    <img
                      src={walletIconUrl}
                      alt=""
                      width={36}
                      height={36}
                      className="h-full w-full object-contain p-0.5"
                    />
                  ) : (
                    <WalletGlyph label={walletDisplayName} />
                  )}
                </span>
                <span className="min-w-0 truncate font-mono text-xs font-semibold tabular-nums text-white sm:text-sm">
                  {shortenAddress(address)}
                </span>
              </button>

              {menuOpen ? (
                <div
                  className="absolute right-0 top-[calc(100%+0.4rem)] z-[60] w-[min(18rem,calc(100vw-1.5rem))] min-w-[12.5rem] overflow-hidden rounded-xl border border-white/10 bg-[#2a2a2e] py-1 shadow-2xl ring-1 ring-black/50 max-[380px]:right-auto max-[380px]:left-0"
                  role="menu"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void copyAddress()}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {copied ? (
                      <span className="text-emerald-400">Copied</span>
                    ) : (
                      "Copy address"
                    )}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setWalletPickerOpen(true);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Change wallet
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      disconnect();
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Disconnect
                  </button>
                </div>
              ) : null}

              <WalletSelectModal
                open={walletPickerOpen}
                onClose={() => setWalletPickerOpen(false)}
              />
            </div>
          ) : (
            <WalletConnectEntry
              variant="header"
              className="w-full min-w-0 sm:w-auto sm:shrink-0"
            />
          )}
        </nav>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      {walletIssue ? (
        <WalletIssueModal
          key={`${walletIssue.title}-${walletIssue.tone}-${lastAttemptedConnector ?? ""}-${lastAttemptedWalletRdns ?? ""}`}
          issue={walletIssue}
          connecting={connecting}
          canRetry={lastAttemptedConnector !== null}
          onRetry={() => {
            if (lastAttemptedConnector) {
              void connect(
                lastAttemptedConnector,
                lastAttemptedWalletLabel ?? undefined,
                lastAttemptedWalletRdns ?? undefined,
              );
            }
          }}
          onDismiss={dismissWalletIssue}
        />
      ) : null}
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@/context/wallet-context";
import { WalletIssueModal } from "@/components/wallet-issue-modal";
import {
  WalletConnectEntry,
  WalletSelectModal,
} from "@/components/wallet-connect-modal";

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
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1F]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="DefenseCodes"
            width={32}
            height={32}
            priority
            className="h-8 w-8"
          />
          <span className="font-[family-name:var(--font-space)] text-lg font-semibold tracking-tight text-white">
            DefenseCodes
          </span>
          <span className="hidden text-xs text-slate-500 sm:inline">
            supply chain intelligence
          </span>
        </Link>
        <nav className="relative flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/reports"
            className="rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Reports
          </Link>
          {address ? (
            <div ref={wrapRef} className="relative">
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2 pr-3.5 text-left text-white transition hover:border-[var(--accent)]/50 hover:bg-white/10"
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
                <span className="font-mono text-sm font-semibold tabular-nums text-white">
                  {shortenAddress(address)}
                </span>
              </button>

              {menuOpen ? (
                <div
                  className="absolute right-0 top-[calc(100%+0.4rem)] z-[60] min-w-[12.5rem] overflow-hidden rounded-xl border border-white/10 bg-[#2a2a2e] py-1 shadow-2xl ring-1 ring-black/50"
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
            <WalletConnectEntry variant="header" />
          )}
        </nav>
      </div>
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

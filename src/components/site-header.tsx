"use client";

import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@/context/wallet-context";
import { WalletIssueModal } from "@/components/wallet-issue-modal";
import { WalletConnectEntry } from "@/components/wallet-connect-modal";

export function SiteHeader() {
  const {
    address,
    walletDisplayName,
    connecting,
    connect,
    disconnect,
    walletIssue,
    dismissWalletIssue,
    lastAttemptedConnector,
    lastAttemptedWalletLabel,
    lastAttemptedWalletRdns,
  } = useWallet();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1F]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="defense.codes"
            width={32}
            height={32}
            priority
            className="h-8 w-8"
          />
          <span className="font-[family-name:var(--font-space)] text-lg font-semibold tracking-tight text-white">
            defense.codes
          </span>
          <span className="hidden text-xs text-slate-500 sm:inline">
            supply chain intelligence
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/reports"
            className="rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Reports
          </Link>
          {address ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="max-w-[min(100vw-8rem,20rem)] rounded-lg border border-white/10 bg-white/5 px-2 py-2 sm:max-w-[22rem] sm:px-3">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {walletDisplayName ?? "Wallet"}
                </div>
                <p
                  className="mt-1 break-all font-mono text-[11px] leading-snug text-[var(--accent)] sm:text-xs"
                  title={address}
                >
                  {address}
                </p>
              </div>
              <button
                type="button"
                onClick={() => disconnect()}
                className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 transition-colors hover:border-[var(--accent)]/50 hover:text-white"
              >
                Disconnect
              </button>
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

"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/glass-panel";
import { useWallet } from "@/context/wallet-context";
import { WalletConnectEntry } from "@/components/wallet-connect-modal";

export function ReportAccessGate({ children }: { children: React.ReactNode }) {
  const { address } = useWallet();

  if (!address) {
    return (
      <div className="mx-auto max-w-lg py-16 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] min-[400px]:py-20 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]">
        <GlassPanel className="p-6 text-center min-[400px]:p-8">
          <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
            Wallet required
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Connect with MetaMask or Phantom (Ethereum / EVM) to view the free
            executive summary and pay with USDT to unlock the full PDF.
          </p>
          <div className="mt-8 flex justify-center">
            <WalletConnectEntry variant="block" />
          </div>
          <Link
            href="/reports"
            className="mt-6 inline-block text-sm text-slate-500 hover:text-[var(--accent)]"
          >
            ← Reports library
          </Link>
        </GlassPanel>
      </div>
    );
  }

  return <>{children}</>;
}

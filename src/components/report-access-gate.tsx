"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/glass-panel";
import { useWallet } from "@/context/wallet-context";
import { WalletConnectEntry } from "@/components/wallet-connect-modal";

export function ReportAccessGate({ children }: { children: React.ReactNode }) {
  const { address } = useWallet();

  if (!address) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <GlassPanel className="p-8 text-center">
          <h1 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white">
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

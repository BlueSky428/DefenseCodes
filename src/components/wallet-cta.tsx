"use client";

import Link from "next/link";
import { WalletConnectEntry } from "@/components/wallet-connect-modal";
import { useWallet } from "@/context/wallet-context";

export function WalletCta() {
  const { address } = useWallet();

  if (address) {
    return (
      <Link
        href="/reports"
        className="inline-flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
      >
        Wallet connected — view reports
      </Link>
    );
  }

  return <WalletConnectEntry variant="hero" />;
}

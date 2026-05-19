"use client";

import Link from "next/link";
import {
  WalletConnectEntry,
  type WalletConnectButtonVariant,
} from "@/components/wallet-connect-modal";
import { useWallet } from "@/context/wallet-context";

type ViewReportsCtaProps = {
  className?: string;
  label?: string;
  connectVariant?: WalletConnectButtonVariant;
};

export function ViewReportsCta({
  className = "",
  label = "View Reports",
  connectVariant = "hero",
}: ViewReportsCtaProps) {
  const { address } = useWallet();

  if (address) {
    return (
      <Link href="/reports" className={className}>
        {label}
      </Link>
    );
  }

  return <WalletConnectEntry variant={connectVariant} label={label} />;
}

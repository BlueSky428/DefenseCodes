"use client";

import { PurchaseProvider } from "@/context/purchase-context";
import { WalletProvider } from "@/context/wallet-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <PurchaseProvider>{children}</PurchaseProvider>
    </WalletProvider>
  );
}

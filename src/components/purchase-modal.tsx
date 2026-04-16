"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract, formatUnits, parseUnits } from "ethers";
import { ModalPortal } from "@/components/modal-portal";
import { browserProvider } from "@/lib/eth-provider";
import { useWallet } from "@/context/wallet-context";
import { usePurchase } from "@/context/purchase-context";
import { ERC20_ABI } from "@/lib/erc20";
import {
  DEFAULT_TREASURY,
  DEFAULT_USDT_BSC,
  DEFAULT_USDT_ETH,
  type Report,
} from "@/data/reports";
import {
  CHAIN_ID_BSC,
  CHAIN_ID_MAINNET,
  CHAIN_ID_SEPOLIA,
  requestSwitchEthereumChain,
} from "@/lib/eip1193-network";
import {
  isPhantomWalletSession,
  readStoredConnector,
  resolveProviderForConnector,
} from "@/lib/wallet-injected";
import { IconBnbChain, IconEthereum } from "@/components/payment-chain-icons";

type Props = {
  report: Report;
  open: boolean;
  onClose: () => void;
};

type PaymentNotice = { title: string; message: string };

/** Sepolia “Test USDT” from .env.example; same lowercase compare. */
const SEPOLIA_TEST_USDT_LOWER =
  "0xb7268c41f53d9eb78ffa8358d0d30545991b4960";
const MAINNET_USDT_LOWER =
  "0xdac17f958d2ee523a2206206994597c13d831ec7";
/** Official BEP-20 USDT on BNB Smart Chain mainnet (lowercase). */
const BSC_MAINNET_USDT_LOWER =
  "0x55d398326f99059ff775485246999027b3197955";

const ENABLE_SIMULATION =
  process.env.NEXT_PUBLIC_ENABLE_SIMULATION === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_SIMULATION === "1";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

function networkDisplayName(chainId: bigint): string {
  const n = Number(chainId);
  if (n === 1) return "Ethereum Mainnet";
  if (n === 11155111) return "Sepolia (testnet)";
  if (n === 56) return "BNB Smart Chain";
  if (n === 97) return "BSC Testnet";
  if (n === 137) return "Polygon";
  return `chain id ${n}`;
}

function noUsdtContractNotice(chainId: bigint, usdtAddress: string): PaymentNotice {
  const netName = networkDisplayName(chainId);
  const addrLower = usdtAddress.toLowerCase();

  if (chainId === 1n && addrLower === SEPOLIA_TEST_USDT_LOWER) {
    return {
      title: "Switch your wallet to Sepolia",
      message:
        "This site is configured with Sepolia test USDT, but your wallet is on Ethereum Mainnet — that address is not USDT on mainnet. In your wallet app/extension: open the network menu → enable test networks if needed → select Sepolia → try again. To pay on mainnet instead, set NEXT_PUBLIC_USDT_ETH to mainnet USDT (see the token’s Etherscan page) and restart the dev server.",
    };
  }

  if (chainId === 11155111n && addrLower === MAINNET_USDT_LOWER) {
    return {
      title: "Wallet on Sepolia, USDT is mainnet",
      message:
        "NEXT_PUBLIC_USDT_ETH is the Ethereum mainnet USDT contract, but your wallet is on Sepolia. Either switch to Ethereum Mainnet or set NEXT_PUBLIC_USDT_ETH to a Sepolia test USDT contract.",
    };
  }

  return {
    title: "Wrong network or USDT address",
    message: `No token contract exists at the configured USDT address on ${netName}. Use NEXT_PUBLIC_USDT_ETH (ERC-20 on Ethereum) and/or NEXT_PUBLIC_USDT_BSC (BEP-20 on BNB Smart Chain) with the official token contracts for that chain, then switch your wallet to that network.`,
  };
}

export function PurchaseModal({ report, open, onClose }: Props) {
  const { address, connectorId, walletDisplayName } = useWallet();
  const hideBep20ForPhantom = useMemo(() => {
    if (!address) return false;
    if (isPhantomWalletSession()) return true;
    return /phantom/i.test((walletDisplayName ?? "").trim());
  }, [address, connectorId, walletDisplayName]);
  const { unlockReport, isUnlocked, refreshEntitlements } = usePurchase();
  const [busy, setBusy] = useState(false);
  /** Which payment rail is active (for button labels while busy). */
  const [busyTarget, setBusyTarget] = useState<"erc20" | "bep20" | null>(null);
  /** Short in-card progress only (e.g. tx submitted). */
  const [status, setStatus] = useState<string | null>(null);
  const [notice, setNotice] = useState<PaymentNotice | null>(null);

  useEffect(() => {
    if (open) {
      setNotice(null);
      setStatus(null);
      setBusyTarget(null);
    }
  }, [open]);

  useEffect(() => {
    if (!notice) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotice(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notice]);

  const tryUsdtTransfer = useCallback(
    async (target: "erc20" | "bep20") => {
    setStatus(null);
    setNotice(null);
    const id = connectorId ?? readStoredConnector();
    const eth = id ? await resolveProviderForConnector(id) : null;
    if (!eth) {
      setNotice({
        title: "Wallet not connected",
        message:
          "We could not use your browser wallet. Connect from the header, then try again.",
      });
      return;
    }
    const usdtForTarget =
      target === "erc20" ? DEFAULT_USDT_ETH : DEFAULT_USDT_BSC;
    if (usdtForTarget === ZERO_ADDR) {
      setNotice({
        title: "USDT not configured",
        message:
          target === "erc20"
            ? "Set NEXT_PUBLIC_USDT_ETH (Ethereum ERC-20 USDT) in .env.local, then restart the dev server."
            : "Set NEXT_PUBLIC_USDT_BSC (BNB Chain BEP-20 USDT) in .env.local, then restart the dev server.",
      });
      return;
    }
    setBusy(true);
    setBusyTarget(target);
    try {
      const ethLower = DEFAULT_USDT_ETH.toLowerCase();
      const isSepoliaTest =
        DEFAULT_USDT_ETH !== ZERO_ADDR && ethLower === SEPOLIA_TEST_USDT_LOWER;

      let provider = browserProvider(eth);
      let net = await provider.getNetwork();

      const labelForTarget =
        target === "erc20"
          ? isSepoliaTest
            ? "ERC-20 (Sepolia)"
            : "ERC-20 (Ethereum)"
          : "BEP-20 (BNB Smart Chain)";

      const switchTo = async (chain: bigint, label: string): Promise<boolean> => {
        setStatus(`Requesting ${label}…`);
        try {
          await requestSwitchEthereumChain(eth, chain);
        } catch (e) {
          const raw = e instanceof Error ? e.message : String(e);
          const rejected =
            /4001|user rejected|denied|rejected/i.test(raw) ||
            (e as { code?: number })?.code === 4001;
          setNotice({
            title: rejected ? "Network switch declined" : "Could not switch network",
            message: rejected
              ? `Approve switching to ${label} in your wallet, then tap the ${labelForTarget} button again.`
              : raw.length > 280
                ? `${raw.slice(0, 240)}…`
                : raw,
          });
          return false;
        } finally {
          setStatus(null);
        }
        for (let i = 0; i < 30; i++) {
          provider = browserProvider(eth);
          net = await provider.getNetwork();
          if (net.chainId === chain) return true;
          await new Promise((r) => setTimeout(r, 120));
        }
        setNotice({
          title: `Still not on ${label}`,
          message: `Pick ${label} in your wallet’s network list, then tap the ${labelForTarget} button again.`,
        });
        return false;
      };

      if (target === "erc20") {
        if (isSepoliaTest) {
          if (net.chainId !== CHAIN_ID_SEPOLIA) {
            const ok = await switchTo(CHAIN_ID_SEPOLIA, "Sepolia");
            if (!ok) return;
            if (net.chainId !== CHAIN_ID_SEPOLIA) {
              setNotice({
                title: "Not on Sepolia yet",
                message:
                  "Pick Sepolia in your wallet’s network menu, then tap ERC-20 again.",
              });
              return;
            }
          }
        } else if (net.chainId !== CHAIN_ID_MAINNET) {
          const ok = await switchTo(CHAIN_ID_MAINNET, "Ethereum Mainnet");
          if (!ok) return;
          if (net.chainId !== CHAIN_ID_MAINNET) {
            setNotice({
              title: "Not on Ethereum Mainnet yet",
              message:
                "Select Ethereum Mainnet in your wallet, then tap ERC-20 again.",
            });
            return;
          }
        }
      } else {
        if (net.chainId !== CHAIN_ID_BSC) {
          const ok = await switchTo(CHAIN_ID_BSC, "BNB Smart Chain");
          if (!ok) return;
          if (net.chainId !== CHAIN_ID_BSC) {
            setNotice({
              title: "Not on BNB Smart Chain yet",
              message:
                "Select BNB Smart Chain in your wallet, then tap BEP-20 again.",
            });
            return;
          }
        }
      }

      let usdtAddr =
        target === "erc20" ? DEFAULT_USDT_ETH : DEFAULT_USDT_BSC;

      let bytecode = await provider.getCode(usdtAddr);
      if (!bytecode || bytecode === "0x") {
        const addrL = usdtAddr.toLowerCase();
        const ethCfg = DEFAULT_USDT_ETH !== ZERO_ADDR;
        const bscCfg = DEFAULT_USDT_BSC !== ZERO_ADDR;
        const sameAddrConfigured =
          ethCfg &&
          bscCfg &&
          DEFAULT_USDT_ETH.toLowerCase() === DEFAULT_USDT_BSC.toLowerCase();

        if (
          target === "erc20" &&
          !isSepoliaTest &&
          bscCfg &&
          (sameAddrConfigured || addrL === BSC_MAINNET_USDT_LOWER)
        ) {
          setStatus("No contract on Ethereum for this address — requesting BNB Smart Chain…");
          const ok = await switchTo(CHAIN_ID_BSC, "BNB Smart Chain");
          if (!ok) return;
          usdtAddr = DEFAULT_USDT_BSC;
          bytecode = await provider.getCode(usdtAddr);
        } else if (
          target === "bep20" &&
          ethCfg &&
          (sameAddrConfigured || addrL === MAINNET_USDT_LOWER)
        ) {
          const dest = isSepoliaTest ? CHAIN_ID_SEPOLIA : CHAIN_ID_MAINNET;
          const destLabel = isSepoliaTest ? "Sepolia" : "Ethereum Mainnet";
          setStatus("No contract on BNB Chain for this address — requesting Ethereum…");
          const ok = await switchTo(dest, destLabel);
          if (!ok) return;
          usdtAddr = DEFAULT_USDT_ETH;
          bytecode = await provider.getCode(usdtAddr);
        }
      }

      if (!bytecode || bytecode === "0x") {
        setNotice(noUsdtContractNotice(net.chainId, usdtAddr));
        return;
      }
      const signer = await provider.getSigner();
      const usdt = new Contract(usdtAddr, ERC20_ABI, signer);
      const decimals = Number(await usdt.decimals());
      const amount = parseUnits(String(report.priceUsdt), decimals);
      const payer = await signer.getAddress();
      const balance = await usdt.balanceOf(payer);
      if (balance < amount) {
        setNotice({
          title: "Not enough USDT",
          message:
            process.env.NODE_ENV === "production"
              ? `This wallet needs ${report.priceUsdt} USDT on the current network. You have ${formatUnits(balance, decimals)} USDT. Add USDT on this chain or switch to the network where you hold the balance.`
              : `This wallet needs ${report.priceUsdt} USDT on the current network. You have ${formatUnits(balance, decimals)} USDT. Get test USDT for this chain, switch networks if needed, or use “Simulate payment (test mode)” while testing.`,
        });
        return;
      }
      const tx = await usdt.transfer(DEFAULT_TREASURY, amount);
      setStatus(`Submitted: ${tx.hash.slice(0, 10)}… Wait for confirmation in your wallet.`);
      await tx.wait();
      unlockReport(report.id);
      try {
        const netFinal = await provider.getNetwork();
        await fetch("/api/purchases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportId: report.id,
            walletAddress: payer,
            chainId: netFinal.chainId.toString(),
            txHash: tx.hash,
          }),
        });
      } catch {
        /* optional Neon */
      }
      await refreshEntitlements();
      onClose();
      if (typeof window !== "undefined") {
        window.alert("Payment confirmed on-chain. You can download the full PDF on the report page.");
      }
    } catch (e) {
      let msg = e instanceof Error ? e.message : "Transfer failed";
      if (/decimals|BAD_DATA|decode result|value="0x"/i.test(msg)) {
        msg =
          "Could not read this token (decimals). The address may be a wallet, not the USDT contract, or the wallet network does not match your NEXT_PUBLIC_USDT_ETH / NEXT_PUBLIC_USDT_BSC configuration. Treasury must stay your payout wallet only.";
      } else if (/CALL_EXCEPTION|estimateGas|execution reverted/i.test(msg)) {
        msg =
          process.env.NODE_ENV === "production"
            ? `On-chain transfer failed (often not enough gas (ETH on Ethereum, BNB on BSC) or USDT). Price is ${report.priceUsdt} USDT. Confirm you are on the correct chain for your configured USDT contract and that you have balance.`
            : `On-chain transfer failed (often not enough native gas or USDT). Price is ${report.priceUsdt} USDT. Confirm your network matches your USDT token env, or use Simulate payment while testing.`;
      }
      setNotice({
        title: "Payment could not complete",
        message: msg,
      });
    } finally {
      setBusy(false);
      setBusyTarget(null);
    }
  },
    [connectorId, onClose, refreshEntitlements, report.id, report.priceUsdt, unlockReport],
  );

  const simulateSuccess = useCallback(() => {
    unlockReport(report.id);
    onClose();
    if (typeof window !== "undefined") {
      window.alert("Demo: payment successful. Full report unlocked.");
    }
  }, [onClose, report.id, unlockReport]);

  if (!open) return null;

  return (
    <>
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0d1428]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        <h2 id="purchase-title" className="font-[family-name:var(--font-space)] text-xl font-semibold text-white">
          Unlock full report
        </h2>
        <div className="mt-3 space-y-1">
          <p className="text-sm text-white">{report.title}</p>
          <p className="text-sm text-[var(--accent)]">{report.priceUsdt} USDT</p>
          <p className="text-xs text-slate-500">
            {hideBep20ForPhantom
              ? "Pay on Ethereum from your connected wallet."
              : "Pick a network. You can download the full files after payment."}
          </p>
        </div>
        {!address ? (
          <p className="mt-4 text-xs text-amber-300/90">Connect a wallet in the header to pay.</p>
        ) : null}
        <div className="mt-5 flex flex-col gap-2.5">
          {DEFAULT_USDT_ETH !== ZERO_ADDR ? (
            <button
              type="button"
              disabled={busy || !address}
              onClick={() => void tryUsdtTransfer("erc20")}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-3.5 text-left transition hover:bg-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconEthereum className="h-9 w-[1.35rem] shrink-0 text-[#627EEA]" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">
                  {busy && busyTarget === "erc20"
                    ? "Working…"
                    : DEFAULT_USDT_ETH.toLowerCase() === SEPOLIA_TEST_USDT_LOWER
                      ? "Sepolia"
                      : "Ethereum"}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {DEFAULT_USDT_ETH.toLowerCase() === SEPOLIA_TEST_USDT_LOWER
                    ? "USDT · testnet"
                    : "USDT · ERC-20"}
                </span>
              </span>
            </button>
          ) : null}
          {DEFAULT_USDT_BSC !== ZERO_ADDR && !hideBep20ForPhantom ? (
            <button
              type="button"
              disabled={busy || !address}
              onClick={() => void tryUsdtTransfer("bep20")}
              className="flex w-full items-center gap-3 rounded-xl border border-cyan-400/35 bg-cyan-500/10 px-4 py-3.5 text-left transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconBnbChain className="h-9 w-9 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">
                  {busy && busyTarget === "bep20" ? "Working…" : "BNB Smart Chain"}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">USDT · BEP-20</span>
              </span>
            </button>
          ) : null}
          {DEFAULT_USDT_ETH === ZERO_ADDR && DEFAULT_USDT_BSC === ZERO_ADDR ? (
            <p className="text-xs text-amber-300/90">Payment is not configured.</p>
          ) : null}
          {process.env.NODE_ENV !== "production" || ENABLE_SIMULATION ? (
            <button
              type="button"
              onClick={simulateSuccess}
              className="rounded-xl border border-dashed border-white/20 bg-transparent px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:border-white/30 hover:text-slate-200"
            >
              Skip payment (test)
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl py-2 text-sm text-slate-500 hover:text-white"
          >
            Cancel
          </button>
        </div>
        {status ? (
          <p className="mt-3 text-xs text-[var(--accent)]">{status}</p>
        ) : null}
        {isUnlocked(report.id) ? (
          <p className="mt-3 text-xs text-emerald-400/95">
            Unlocked —{" "}
            <a
              href={report.fullReportPdfPath}
              download
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-emerald-300"
            >
              PDF
            </a>
            {" · "}
            <a
              href={report.fullReportPath}
              download
              className="underline hover:text-emerald-300"
            >
              Word
            </a>
          </p>
        ) : null}
      </div>
    </div>

    {notice ? (
      <ModalPortal>
        <div
          className="fixed inset-0 z-[220] overflow-y-auto overflow-x-hidden overscroll-y-contain bg-black/75 backdrop-blur-sm"
          role="presentation"
          onClick={() => setNotice(null)}
        >
          <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div
              className="w-full max-w-md rounded-2xl border border-amber-400/20 bg-[#0d1428]/95 p-6 shadow-2xl backdrop-blur-xl"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="payment-notice-title"
              aria-describedby="payment-notice-desc"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="payment-notice-title"
                className="font-[family-name:var(--font-space)] text-lg font-semibold text-[var(--accent)]"
              >
                {notice.title}
              </h2>
              <p
                id="payment-notice-desc"
                className="mt-3 text-sm leading-relaxed text-slate-300"
              >
                {notice.message}
              </p>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="mt-6 w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[#0A0F1F] transition hover:brightness-110"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>
    ) : null}
    </>
  );
}

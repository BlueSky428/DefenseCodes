"use client";

import { useCallback, useEffect, useState } from "react";
import { Contract, formatUnits, parseUnits } from "ethers";
import { ModalPortal } from "@/components/modal-portal";
import { browserProvider } from "@/lib/eth-provider";
import { useWallet } from "@/context/wallet-context";
import { usePurchase } from "@/context/purchase-context";
import { ERC20_ABI } from "@/lib/erc20";
import {
  DEFAULT_TREASURY,
  DEFAULT_USDT_ADDRESS,
  type Report,
} from "@/data/reports";
import {
  readStoredConnector,
  resolveProviderForConnector,
} from "@/lib/wallet-injected";

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
      title: "Switch MetaMask to Sepolia",
      message:
        "This site is configured with Sepolia test USDT, but MetaMask is on Ethereum Mainnet — that address is not USDT on mainnet. In MetaMask: open the network menu → turn on “Show test networks” → select Sepolia → try again. To pay on mainnet instead, set NEXT_PUBLIC_USDT_ADDRESS to mainnet USDT (see Etherscan token page) and restart the dev server.",
    };
  }

  if (chainId === 11155111n && addrLower === MAINNET_USDT_LOWER) {
    return {
      title: "Wallet on Sepolia, USDT is mainnet",
      message:
        "NEXT_PUBLIC_USDT_ADDRESS is the Ethereum mainnet USDT contract, but MetaMask is on Sepolia. Either switch to Ethereum Mainnet or change your .env USDT address to a Sepolia test USDT contract.",
    };
  }

  return {
    title: "Wrong network or USDT address",
    message: `No token contract exists at your NEXT_PUBLIC_USDT_ADDRESS on ${netName}. Use the USDT (or test USDT) contract that belongs to this chain — check the explorer for your network — or switch MetaMask to the network that matches your .env.`,
  };
}

export function PurchaseModal({ report, open, onClose }: Props) {
  const { address, connectorId } = useWallet();
  const { unlockReport, isUnlocked } = usePurchase();
  const [busy, setBusy] = useState(false);
  /** Short in-card progress only (e.g. tx submitted). */
  const [status, setStatus] = useState<string | null>(null);
  const [notice, setNotice] = useState<PaymentNotice | null>(null);

  useEffect(() => {
    if (open) {
      setNotice(null);
      setStatus(null);
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

  const tryUsdtTransfer = useCallback(async () => {
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
    if (!DEFAULT_USDT_ADDRESS || DEFAULT_USDT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setNotice({
        title: "USDT not configured",
        message:
          "Set NEXT_PUBLIC_USDT_ADDRESS to the USDT token contract on your network in .env.local, then restart the dev server.",
      });
      return;
    }
    setBusy(true);
    try {
      const provider = browserProvider(eth);
      const net = await provider.getNetwork();
      const bytecode = await provider.getCode(DEFAULT_USDT_ADDRESS);
      if (!bytecode || bytecode === "0x") {
        setNotice(noUsdtContractNotice(net.chainId, DEFAULT_USDT_ADDRESS));
        return;
      }
      const signer = await provider.getSigner();
      const usdt = new Contract(DEFAULT_USDT_ADDRESS, ERC20_ABI, signer);
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
              : `This wallet needs ${report.priceUsdt} USDT on the current network. You have ${formatUnits(balance, decimals)} USDT. Get test USDT for this chain, switch networks if needed, or use “Dev: simulate payment” while testing.`,
        });
        return;
      }
      const tx = await usdt.transfer(DEFAULT_TREASURY, amount);
      setStatus(`Submitted: ${tx.hash.slice(0, 10)}… Wait for confirmation in your wallet.`);
      await tx.wait();
      unlockReport(report.id);
      onClose();
      if (typeof window !== "undefined") {
        window.alert("Payment confirmed on-chain. You can download the full PDF on the report page.");
      }
    } catch (e) {
      let msg = e instanceof Error ? e.message : "Transfer failed";
      if (/decimals|BAD_DATA|decode result|value="0x"/i.test(msg)) {
        msg =
          "Could not read this token (decimals). The address may be a wallet, not the USDT contract, or the wallet network still does not match NEXT_PUBLIC_USDT_ADDRESS. Treasury must stay your payout wallet only.";
      } else if (/CALL_EXCEPTION|estimateGas|execution reverted/i.test(msg)) {
        msg =
          process.env.NODE_ENV === "production"
            ? `On-chain transfer failed (often not enough gas or USDT). Price is ${report.priceUsdt} USDT. Confirm your network matches NEXT_PUBLIC_USDT_ADDRESS and your balance.`
            : `On-chain transfer failed (often not enough native gas ETH, or still not enough USDT). Price is ${report.priceUsdt} USDT. Check network matches your NEXT_PUBLIC_USDT_ADDRESS token, or use Dev simulate while testing.`;
      }
      setNotice({
        title: "Payment could not complete",
        message: msg,
      });
    } finally {
      setBusy(false);
    }
  }, [connectorId, onClose, report.id, report.priceUsdt, unlockReport]);

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
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0d1428]/95 p-6 shadow-2xl backdrop-blur-xl">
        <h2 id="purchase-title" className="font-[family-name:var(--font-space)] text-xl font-semibold text-white">
          Unlock full report
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {report.title} · {report.priceUsdt} USDT (ERC-20 or BEP-20 on your current
          wallet network). On success you can download the full PDF.
        </p>
        <p className="mt-2 break-all font-mono text-xs text-slate-500">
          <span className="text-slate-500">Treasury: </span>
          <span className="text-[var(--accent)]">{DEFAULT_TREASURY}</span>
        </p>
        {!address ? (
          <p className="mt-4 text-sm text-amber-300/90">
            Connect your wallet from the header to attempt an on-chain transfer.
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            disabled={busy || !address}
            onClick={() => void tryUsdtTransfer()}
            className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-3 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Submitting transfer…" : "Pay with USDT (on-chain)"}
          </button>
          {process.env.NODE_ENV !== "production" ? (
            <button
              type="button"
              onClick={simulateSuccess}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Dev: simulate payment (skip chain)
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
        {status ? (
          <p className="mt-4 text-xs text-[var(--accent)]">{status}</p>
        ) : null}
        {isUnlocked(report.id) ? (
          <p className="mt-3 text-xs leading-relaxed text-emerald-400">
            Unlocked in this browser.{" "}
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
              .docx
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

"use client";

import { useEffect, useState } from "react";
import { ModalPortal } from "@/components/modal-portal";
import { discoverWalletOptions, type WalletOption } from "@/lib/wallet-injected";
import { useWallet } from "@/context/wallet-context";

export type WalletConnectButtonVariant = "header" | "hero" | "block";

const buttonStyles: Record<WalletConnectButtonVariant, string> = {
  header:
    "rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-[#0A0F1F] shadow-[0_0_24px_rgba(0,229,255,0.25)] transition hover:brightness-110 disabled:opacity-60",
  hero: "inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#0A0F1F] shadow-[0_0_28px_rgba(0,229,255,0.3)] transition hover:brightness-110 disabled:opacity-60 sm:w-auto",
  block:
    "w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[#0A0F1F] shadow-[0_0_24px_rgba(0,229,255,0.25)] transition hover:brightness-110 disabled:opacity-60",
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

function WalletSelectModal({ open, onClose }: ModalProps) {
  const { connect, connecting, lastAttemptedConnector } = useWallet();
  const [options, setOptions] = useState<WalletOption[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setScanning(true);
    void discoverWalletOptions().then((opts) => {
      if (alive) {
        setOptions(opts);
        setScanning(false);
      }
    });
    const refresh = () => {
      void discoverWalletOptions().then((opts) => {
        if (alive) setOptions(opts);
      });
    };
    window.addEventListener("focus", refresh);
    return () => {
      alive = false;
      window.removeEventListener("focus", refresh);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const anyAvailable = options.some((o) => o.available);

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[200] overflow-y-auto overflow-x-hidden overscroll-y-contain bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        onClick={onClose}
      >
        <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div
            className="relative w-full max-w-md max-h-[min(88dvh,40rem)] overflow-y-auto rounded-2xl border border-white/15 bg-[#0d1428]/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
        <h2
          id="wallet-modal-title"
          className="font-[family-name:var(--font-space)] text-xl font-semibold text-white"
        >
          Connect a wallet
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Wallets are detected with{" "}
          <span className="text-slate-300">EIP-6963</span> so every compatible
          extension (MetaMask, Rabby, Coinbase, OKX, Phantom, …) can appear
          without fighting over <span className="font-mono text-slate-500">window.ethereum</span>.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          <span className="text-slate-400">Phantom users:</span> this site needs{" "}
          <span className="text-slate-300">Ethereum (EVM)</span>, not Solana. Enable
          Ethereum in Phantom if you only use Solana normally.
        </p>
        <div className="mt-3 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-500">
          <p>
            <span className="font-medium text-slate-400">No password on this page?</span>{" "}
            That is normal.{" "}
            <span className="text-slate-300">Websites never receive your wallet password.</span>{" "}
            Only the extension does when it is locked. If it is already unlocked, you may
            see no password step.
          </p>
          <p>
            Connecting only asks permission to share your{" "}
            <span className="text-slate-300">public address</span>. To reset a prior
            connection: disconnect here, remove this site in the wallet, then connect again.
          </p>
        </div>

        <div className="mt-6 flex min-h-[120px] flex-col gap-2">
          {scanning && options.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">Scanning for wallets…</p>
          ) : null}
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={connecting || !opt.available}
              onClick={() =>
                void connect(opt.id, opt.label, opt.rdns).then(
                  (ok) => ok && onClose(),
                )
              }
              className="flex w-full items-center gap-3 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3.5 text-left text-sm font-semibold text-white transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {opt.icon ? (
                // eslint-disable-next-line @next/next/no-img-element -- wallet icons are data: URIs
                <img
                  src={opt.icon}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-lg bg-white/10 object-contain"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs text-slate-400">
                  ◈
                </span>
              )}
              <span className="min-w-0 flex-1">
                {connecting && lastAttemptedConnector === opt.id ? (
                  <span className="text-[var(--accent)]">Connecting…</span>
                ) : (
                  opt.label
                )}
              </span>
              {!opt.available ? (
                <span className="shrink-0 text-xs font-normal text-slate-500">
                  Not detected
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {!scanning && !anyAvailable ? (
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            No EIP-6963 wallets responded. Install an Ethereum wallet extension, then
            refresh. Try{" "}
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              MetaMask
            </a>
            ,{" "}
            <a
              href="https://rabby.io"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Rabby
            </a>
            , or{" "}
            <a
              href="https://phantom.app"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Phantom
            </a>{" "}
            (enable Ethereum).
          </p>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl border border-white/15 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
        >
          Cancel
        </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

type EntryProps = {
  variant: WalletConnectButtonVariant;
  className?: string;
};

/**
 * Opens a modal listing all EIP-6963 browser wallets on this page.
 */
export function WalletConnectEntry({ variant, className = "" }: EntryProps) {
  const [open, setOpen] = useState(false);
  const { connecting } = useWallet();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={connecting}
        className={`${buttonStyles[variant]} ${className}`.trim()}
      >
        {connecting ? "Connecting…" : "Connect wallet"}
      </button>
      <WalletSelectModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

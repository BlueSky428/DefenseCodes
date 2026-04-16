"use client";

import { useEffect, useState } from "react";
import { ModalPortal } from "@/components/modal-portal";
import { discoverWalletOptions, type WalletOption } from "@/lib/wallet-injected";
import { useWallet } from "@/context/wallet-context";

export type WalletConnectButtonVariant = "header" | "hero" | "block";

const buttonStyles: Record<WalletConnectButtonVariant, string> = {
  header:
    "rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[var(--accent)]/50 hover:bg-white/10 disabled:opacity-60",
  hero: "inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#0A0F1F] shadow-[0_0_28px_rgba(0,229,255,0.3)] transition hover:brightness-110 disabled:opacity-60 sm:w-auto",
  block:
    "w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[#0A0F1F] shadow-[0_0_24px_rgba(0,229,255,0.25)] transition hover:brightness-110 disabled:opacity-60",
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

export function WalletSelectModal({ open, onClose }: ModalProps) {
  const { connect, connecting, lastAttemptedConnector } = useWallet();
  const [options, setOptions] = useState<WalletOption[]>([]);
  const [scanning, setScanning] = useState(false);

  const runScan = () => {
    setScanning(true);
    void discoverWalletOptions().then((opts) => {
      setOptions(opts);
      setScanning(false);
    });
  };

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
            className="relative w-full max-w-md max-h-[min(88dvh,40rem)] overflow-y-auto rounded-2xl border border-white/15 bg-[#0d1428]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
        <h2
          id="wallet-modal-title"
          className="font-[family-name:var(--font-space)] text-xl font-semibold text-white"
        >
          Connect wallet
        </h2>
        <p className="mt-1 text-sm text-slate-400">Choose a wallet to continue.</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            {scanning
              ? "Looking for wallets…"
              : options.length > 0
                ? `${options.length} found`
                : "None found"}
          </p>
          <button
            type="button"
            disabled={scanning || connecting}
            onClick={() => runScan()}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-[var(--accent)]/40 hover:bg-white/5 disabled:opacity-50"
          >
            Scan again
          </button>
        </div>

        <div className="mt-4 flex min-h-[5rem] flex-col gap-2">
          {scanning && options.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">Looking for wallets…</p>
          ) : null}
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={connecting || !opt.available}
              onClick={() =>
                void connect(
                  opt.id,
                  opt.label,
                  opt.rdns,
                  opt.icon?.trim() || null,
                ).then((ok) => ok && onClose())
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
          <div className="mt-3 text-xs text-slate-500">
            Install an Ethereum-capable wallet, allow it on this site, then{" "}
            <button
              type="button"
              onClick={() => runScan()}
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              scan again
            </button>{" "}
            or refresh the page.
          </div>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl border border-white/15 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
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

/** Opens a modal to pick from browser-installed Ethereum wallets. */
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

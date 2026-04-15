"use client";

import { useEffect, useState } from "react";
import { ModalPortal } from "@/components/modal-portal";
import type { WalletErrorInfo } from "@/lib/wallet-injected";

type Props = {
  issue: WalletErrorInfo;
  connecting: boolean;
  canRetry: boolean;
  onRetry: () => void;
  onDismiss: () => void;
};

export function WalletIssueModal({
  issue,
  connecting,
  canRetry,
  onRetry,
  onDismiss,
}: Props) {
  const [showTips, setShowTips] = useState(
    () =>
      issue.tone === "recoverable" || issue.title === "Wallet not installed",
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  const border =
    issue.tone === "rejection"
      ? "border-white/15"
      : issue.tone === "recoverable"
        ? "border-amber-400/25"
        : "border-white/12";

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[210] overflow-y-auto overflow-x-hidden overscroll-y-contain bg-black/70 backdrop-blur-sm"
        role="presentation"
        onClick={onDismiss}
      >
        <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div
            className={`w-full max-w-lg max-h-[min(88dvh,36rem)] overflow-y-auto rounded-2xl border ${border} bg-[#0d1428]/95 p-6 shadow-2xl backdrop-blur-xl`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="wallet-issue-title"
            aria-describedby={issue.subtitle ? "wallet-issue-desc" : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 flex-1">
                <h2
                  id="wallet-issue-title"
                  className="font-[family-name:var(--font-space)] text-base font-semibold text-[var(--accent)]"
                >
                  {issue.title}
                </h2>
                {issue.subtitle ? (
                  <p
                    id="wallet-issue-desc"
                    className="mt-2 text-sm leading-relaxed text-slate-400"
                  >
                    {issue.subtitle}
                  </p>
                ) : null}
                {issue.tips && issue.tips.length > 0 ? (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowTips((v) => !v)}
                      className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
                    >
                      {showTips ? "Hide suggestions" : "Show suggestions"}
                    </button>
                    {showTips ? (
                      <ul className="mt-2 list-inside list-disc space-y-1.5 text-xs leading-relaxed text-slate-400 sm:list-outside sm:pl-4">
                        {issue.tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:w-[9.5rem]">
                <button
                  type="button"
                  onClick={() => void onRetry()}
                  disabled={connecting || !canRetry}
                  className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-semibold text-[#0A0F1F] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {connecting ? "Connecting…" : "Try again"}
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/25 hover:bg-white/5"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

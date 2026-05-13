"use client";

import Image from "next/image";
import { useEffect } from "react";
import { ModalPortal } from "@/components/modal-portal";

type Props = { open: boolean; onClose: () => void };

export function ContactModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[200] overflow-y-auto overflow-x-hidden overscroll-y-contain bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Contact on Signal"
        onClick={onClose}
      >
        <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 bg-[#0A0F1F]/90 px-3 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition hover:border-[var(--accent)]/50 hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <Image
              src="/signal-contact-modal.png"
              alt="Signal QR for DefenseCodes.42. Scan this QR code with your phone to chat on Signal."
              width={753}
              height={1024}
              className="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-white/10"
              sizes="(max-width: 640px) 100vw, 24rem"
              priority
            />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

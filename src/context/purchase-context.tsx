"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "defense-codes-unlocks-v1";
const UNLOCK_EVENT = "defense-codes-unlock";

type PurchaseContextValue = {
  unlocked: Record<string, boolean>;
  isUnlocked: (reportId: string) => boolean;
  unlockReport: (reportId: string) => void;
  resetUnlocks: () => void;
};

const PurchaseContext = createContext<PurchaseContextValue | null>(null);

function parseUnlocked(raw: string): Record<string, boolean> {
  try {
    const o = JSON.parse(raw) as Record<string, boolean>;
    return typeof o === "object" && o ? o : {};
  } catch {
    return {};
  }
}

function readSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "{}";
  } catch {
    return "{}";
  }
}

function getServerSnapshot(): string {
  return "{}";
}

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(UNLOCK_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(UNLOCK_EVENT, handler);
  };
}

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  const unlocked = useMemo(() => parseUnlocked(raw), [raw]);

  const unlockReport = useCallback((reportId: string) => {
    if (typeof window === "undefined") return;
    const next = { ...parseUnlocked(readSnapshot()), [reportId]: true };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota */
    }
    window.dispatchEvent(new Event(UNLOCK_EVENT));
  }, []);

  const isUnlocked = useCallback(
    (reportId: string) => Boolean(unlocked[reportId]),
    [unlocked],
  );

  const resetUnlocks = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(UNLOCK_EVENT));
  }, []);

  const value = useMemo(
    () => ({
      unlocked,
      isUnlocked,
      unlockReport,
      resetUnlocks,
    }),
    [unlocked, isUnlocked, unlockReport, resetUnlocks],
  );

  return (
    <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error("usePurchase must be used within PurchaseProvider");
  return ctx;
}

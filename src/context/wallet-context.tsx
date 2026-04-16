"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { browserProvider } from "@/lib/eth-provider";
import {
  backfillStoredWalletIconIfMissing,
  clearStoredConnector,
  displayNameFromConnectorId,
  displayNameFromRdns,
  parseWalletError,
  readStoredConnector,
  readStoredWalletIcon,
  resolveConnectedWalletDisplayName,
  resolveProviderForConnector,
  walletNotAvailable,
  writeStoredConnector,
  type WalletConnectorId,
  type WalletErrorInfo,
} from "@/lib/wallet-injected";

type WalletContextValue = {
  address: string | null;
  /** Human-readable wallet name (e.g. MetaMask) when connected. */
  walletDisplayName: string | null;
  /** Wallet branding image from EIP-6963 when available (often a data URI). */
  walletIconUrl: string | null;
  chainId: bigint | null;
  connectorId: WalletConnectorId | null;
  connecting: boolean;
  walletIssue: WalletErrorInfo | null;
  lastAttemptedConnector: WalletConnectorId | null;
  lastAttemptedWalletLabel: string | null;
  lastAttemptedWalletRdns: string | null;
  connect: (
    connectorId: WalletConnectorId,
    displayLabel?: string,
    walletRdns?: string,
    walletIcon?: string | null,
  ) => Promise<boolean>;
  disconnect: () => void;
  dismissWalletIssue: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [connectorId, setConnectorId] = useState<WalletConnectorId | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [walletIssue, setWalletIssue] = useState<WalletErrorInfo | null>(null);
  const [lastAttemptedConnector, setLastAttemptedConnector] =
    useState<WalletConnectorId | null>(null);
  const [lastAttemptedWalletLabel, setLastAttemptedWalletLabel] = useState<
    string | null
  >(null);
  const [lastAttemptedWalletRdns, setLastAttemptedWalletRdns] = useState<
    string | null
  >(null);
  const [walletIconUrl, setWalletIconUrl] = useState<string | null>(null);

  const refreshFromProvider = useCallback(async () => {
    const id = readStoredConnector();
    if (!id) {
      setAddress(null);
      setChainId(null);
      setConnectorId(null);
      setWalletIconUrl(null);
      return;
    }
    const eth = await resolveProviderForConnector(id);
    if (!eth) {
      clearStoredConnector();
      setConnectorId(null);
      setAddress(null);
      setChainId(null);
      setWalletIconUrl(null);
      return;
    }
    try {
      const accounts = (await eth.request({
        method: "eth_accounts",
      })) as string[];
      if (accounts?.[0]) {
        setAddress(accounts[0]);
        setConnectorId(id);
        const provider = browserProvider(eth);
        const net = await provider.getNetwork();
        setChainId(net.chainId);
        if (!readStoredWalletIcon()) {
          await backfillStoredWalletIconIfMissing();
        }
        setWalletIconUrl(readStoredWalletIcon());
      } else {
        setAddress(null);
        setChainId(null);
        setConnectorId(null);
        setWalletIconUrl(null);
      }
    } catch {
      setAddress(null);
      setChainId(null);
      setConnectorId(null);
      setWalletIconUrl(null);
    }
  }, []);

  useEffect(() => {
    void refreshFromProvider();
  }, [refreshFromProvider]);

  useEffect(() => {
    const state: {
      eth?: {
        on?: (ev: string, fn: () => void) => void;
        removeListener?: (ev: string, fn: () => void) => void;
      };
      onAccounts?: () => void;
      onChain?: () => void;
    } = {};
    let cancelled = false;

    void (async () => {
      const id = readStoredConnector();
      if (!id) return;
      const eth = await resolveProviderForConnector(id);
      if (cancelled || !eth) return;
      state.eth = eth as typeof state.eth;
      state.onAccounts = () => void refreshFromProvider();
      state.onChain = () => void refreshFromProvider();
      state.eth?.on?.("accountsChanged", state.onAccounts);
      state.eth?.on?.("chainChanged", state.onChain);
    })();

    return () => {
      cancelled = true;
      const e = state.eth;
      if (e && state.onAccounts && state.onChain) {
        e.removeListener?.("accountsChanged", state.onAccounts);
        e.removeListener?.("chainChanged", state.onChain);
      }
    };
  }, [refreshFromProvider, connectorId]);

  const dismissWalletIssue = useCallback(() => {
    setWalletIssue(null);
  }, []);

  const connect = useCallback(
    async (
      id: WalletConnectorId,
      displayLabel?: string,
      walletRdns?: string,
      walletIcon?: string | null,
    ): Promise<boolean> => {
      setLastAttemptedConnector(id);
      setLastAttemptedWalletLabel(displayLabel ?? null);
      setLastAttemptedWalletRdns(walletRdns ?? null);
      setWalletIssue(null);
      const eth = await resolveProviderForConnector(id, {
        rdns: walletRdns ?? null,
        label: displayLabel ?? null,
      });
      if (!eth) {
        setWalletIssue(walletNotAvailable(displayLabel ?? "Wallet"));
        return false;
      }
      setConnecting(true);
      try {
        await eth.request({ method: "eth_requestAccounts" });
        const provider = browserProvider(eth);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        const net = await provider.getNetwork();
        const labelToStore =
          displayLabel?.trim() ||
          displayNameFromRdns(walletRdns ?? null) ||
          displayNameFromConnectorId(id) ||
          "Connected wallet";
        const iconForStore =
          walletIcon === undefined
            ? undefined
            : walletIcon && walletIcon.trim()
              ? walletIcon.trim()
              : null;
        writeStoredConnector(id, walletRdns ?? null, labelToStore, iconForStore);
        if (iconForStore === undefined && !readStoredWalletIcon()) {
          await backfillStoredWalletIconIfMissing();
        }
        setConnectorId(id);
        setAddress(addr);
        setChainId(net.chainId);
        setWalletIconUrl(readStoredWalletIcon());
        setWalletIssue(null);
        return true;
      } catch (err) {
        console.warn("[wallet] connect failed", err);
        setWalletIssue(parseWalletError(err));
        return false;
      } finally {
        setConnecting(false);
      }
    },
    [],
  );

  const disconnect = useCallback(() => {
    clearStoredConnector();
    setConnectorId(null);
    setAddress(null);
    setChainId(null);
    setWalletIconUrl(null);
    setWalletIssue(null);
    setLastAttemptedConnector(null);
    setLastAttemptedWalletLabel(null);
    setLastAttemptedWalletRdns(null);
  }, []);

  const walletDisplayName = useMemo(
    () => (address ? resolveConnectedWalletDisplayName() : null),
    [address, connectorId],
  );

  const value = useMemo(
    () => ({
      address,
      walletDisplayName,
      walletIconUrl,
      chainId,
      connectorId,
      connecting,
      walletIssue,
      lastAttemptedConnector,
      lastAttemptedWalletLabel,
      lastAttemptedWalletRdns,
      connect,
      disconnect,
      dismissWalletIssue,
    }),
    [
      address,
      walletDisplayName,
      walletIconUrl,
      chainId,
      connectorId,
      connecting,
      walletIssue,
      lastAttemptedConnector,
      lastAttemptedWalletLabel,
      lastAttemptedWalletRdns,
      connect,
      disconnect,
      dismissWalletIssue,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

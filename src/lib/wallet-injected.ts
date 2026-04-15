import type { Eip1193Provider } from "ethers";
import {
  discoverEip6963Providers,
  eip6963ConnectorId,
  parseEip6963ConnectorId,
  type Eip6963AnnounceDetail,
} from "@/lib/eip6963";

export const WALLET_CONNECTOR_STORAGE_KEY = "defense-codes-wallet-connector";
export const WALLET_CONNECTOR_RDNS_KEY = "defense-codes-wallet-rdns";
export const WALLET_CONNECTOR_LABEL_KEY = "defense-codes-wallet-label";

/** Fallback when no EIP-6963 announcements but `window.ethereum` exists. */
export const LEGACY_INJECTED_ID = "legacy-injected";

/** Stored session value: EIP-6963 id, legacy injected, or historical MetaMask / Phantom keys. */
export type WalletConnectorId = string;

type Injected = Eip1193Provider & {
  providers?: Injected[];
  isMetaMask?: boolean;
  isPhantom?: boolean;
};

/** Wallets that spoof `isMetaMask: true` for dapp compatibility (not MetaMask). */
type WalletFlags = {
  isPhantom?: boolean;
  isBraveWallet?: boolean;
  isCoinbaseWallet?: boolean;
  isRabby?: boolean;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  isOKExWallet?: boolean;
  isOpera?: boolean;
  _metamask?: unknown;
};

function isMetaMaskImpostor(p: WalletFlags): boolean {
  return Boolean(
    p.isPhantom ||
      p.isBraveWallet ||
      p.isCoinbaseWallet ||
      p.isRabby ||
      p.isTrust ||
      p.isTrustWallet ||
      p.isOKExWallet ||
      p.isOpera,
  );
}

/**
 * True MetaMask injects `_metamask` on its provider. Many other wallets set
 * `isMetaMask: true` alone: those must NOT be offered as “MetaMask”.
 */
function isAuthenticMetaMaskProvider(p: unknown): p is Injected {
  if (typeof p !== "object" || p === null) return false;
  const w = p as Injected & WalletFlags;
  if (typeof w.request !== "function") return false;
  if (!w.isMetaMask) return false;
  if (isMetaMaskImpostor(w)) return false;
  return typeof w._metamask !== "undefined";
}

function isPhantomProvider(p: unknown): p is Injected {
  return (
    typeof p === "object" &&
    p !== null &&
    typeof (p as Injected).request === "function" &&
    Boolean((p as { isPhantom?: boolean }).isPhantom)
  );
}

/** Real MetaMask only (not Coinbase / Brave / Rabby / Phantom compatibility shims). */
export function getMetaMaskProvider(): Injected | null {
  if (typeof window === "undefined") return null;
  const eth = (window as unknown as { ethereum?: Injected }).ethereum;
  if (!eth) return null;
  const list = eth.providers;
  if (Array.isArray(list) && list.length > 0) {
    const mm = list.find((p) => isAuthenticMetaMaskProvider(p));
    if (mm) return mm;
    return null;
  }
  if (isAuthenticMetaMaskProvider(eth)) return eth;
  return null;
}

/**
 * Phantom’s Ethereum (EVM) provider (not Solana).
 * See https://docs.phantom.app/ethereum/using-the-ethereum-provider
 */
export function getPhantomEthereumProvider(): Injected | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    phantom?: { ethereum?: Injected };
    ethereum?: Injected;
  };
  const fromPhantom = w.phantom?.ethereum;
  if (fromPhantom && typeof fromPhantom.request === "function") {
    return fromPhantom;
  }
  const eth = w.ethereum;
  const list = eth?.providers;
  if (Array.isArray(list)) {
    const ph = list.find((p) => isPhantomProvider(p));
    if (ph) return ph;
  }
  return null;
}

let providerByUuid = new Map<string, Eip1193Provider>();
let providerMapAt = 0;

function rememberAnnouncements(list: { info: { uuid: string }; provider: Eip1193Provider }[]) {
  providerByUuid = new Map(list.map((d) => [d.info.uuid, d.provider]));
  providerMapAt = Date.now();
}

/**
 * Wallets discovered via EIP-6963 for the connect modal (icons + labels).
 */
export async function discoverWalletOptions(): Promise<WalletOption[]> {
  if (typeof window === "undefined") {
    return [];
  }
  const list = await discoverEip6963Providers(600);
  rememberAnnouncements(list);

  const options: WalletOption[] = [...list]
    .sort((a, b) => a.info.name.localeCompare(b.info.name))
    .map(({ info }) => ({
      id: eip6963ConnectorId(info.uuid),
      label: info.name,
      icon: info.icon,
      rdns: info.rdns,
      available: true,
    }));

  if (options.length === 0) {
    const eth = (window as unknown as { ethereum?: Injected }).ethereum;
    if (eth && typeof eth.request === "function") {
      options.push({
        id: LEGACY_INJECTED_ID,
        label: "Browser wallet (injected)",
        available: true,
      });
    }
  }

  return options;
}

export type ResolveWalletHints = {
  rdns?: string | null;
  label?: string | null;
};

/**
 * Resolve the EIP-1193 provider for a stored or selected connector id.
 * EIP-6963 UUIDs can change between scans; we fall back to rdns, then Phantom/MetaMask injection paths.
 */
export async function resolveProviderForConnector(
  id: WalletConnectorId,
  hints?: ResolveWalletHints,
): Promise<Injected | null> {
  if (typeof window === "undefined") return null;
  if (id === "metamask") return getMetaMaskProvider();
  if (id === "phantom") return getPhantomEthereumProvider();
  if (id === LEGACY_INJECTED_ID) {
    const eth = (window as unknown as { ethereum?: Injected }).ethereum;
    return eth && typeof eth.request === "function" ? eth : null;
  }

  const uuid = parseEip6963ConnectorId(id);
  if (!uuid) return null;

  const rdnsHint = hints?.rdns ?? readStoredWalletRdns();
  const labelHint = hints?.label ?? null;

  const pickFromList = (list: Eip6963AnnounceDetail[]): Injected | null => {
    rememberAnnouncements(list);
    const byUuid = providerByUuid.get(uuid) as Injected | undefined;
    if (byUuid) return byUuid;
    if (rdnsHint) {
      const hit = list.find((d) => d.info.rdns === rdnsHint);
      if (hit?.provider) return hit.provider as Injected;
    }
    return null;
  };

  const cached = providerByUuid.get(uuid);
  if (cached && Date.now() - providerMapAt < 30_000) {
    return cached as Injected;
  }

  let list = await discoverEip6963Providers(600);
  let found = pickFromList(list);
  if (found) return found;

  list = await discoverEip6963Providers(900);
  found = pickFromList(list);
  if (found) return found;

  if (rdnsHint && /phantom/i.test(rdnsHint)) {
    const ph = getPhantomEthereumProvider();
    if (ph) return ph;
  }
  if (labelHint && /phantom/i.test(labelHint)) {
    const ph = getPhantomEthereumProvider();
    if (ph) return ph;
  }
  if (
    rdnsHint &&
    (rdnsHint === "io.metamask" || rdnsHint.endsWith(".metamask"))
  ) {
    const mm = getMetaMaskProvider();
    if (mm) return mm;
  }
  if (labelHint && /^metamask$/i.test(labelHint.trim())) {
    const mm = getMetaMaskProvider();
    if (mm) return mm;
  }

  return null;
}

export type WalletOption = {
  id: WalletConnectorId;
  label: string;
  available: boolean;
  /** EIP-6963 data URI or URL */
  icon?: string;
  /** Stable wallet id from EIP-6963 (e.g. io.metamask, app.phantom) */
  rdns?: string;
};

function isValidStoredConnectorId(v: string): v is WalletConnectorId {
  if (v === "metamask" || v === "phantom" || v === LEGACY_INJECTED_ID) return true;
  if (v.startsWith("eip6963:") && v.length > 12) return true;
  return false;
}

export function readStoredConnector(): WalletConnectorId | null {
  if (typeof window === "undefined") return null;
  try {
    const v = sessionStorage.getItem(WALLET_CONNECTOR_STORAGE_KEY);
    if (v && isValidStoredConnectorId(v)) return v;
  } catch {
    /* private mode */
  }
  return null;
}

export function readStoredWalletRdns(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(WALLET_CONNECTOR_RDNS_KEY);
  } catch {
    return null;
  }
}

export function readStoredWalletLabel(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = sessionStorage.getItem(WALLET_CONNECTOR_LABEL_KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

/** Best-effort name when EIP-6963 label was not stored (older sessions). */
export function displayNameFromRdns(rdns: string | null): string | null {
  if (!rdns) return null;
  const r = rdns.toLowerCase();
  if (r.includes("phantom")) return "Phantom";
  if (r.includes("metamask")) return "MetaMask";
  if (r.includes("coinbase")) return "Coinbase Wallet";
  if (r.includes("rabby")) return "Rabby";
  if (r.includes("okx") || r.includes("okex")) return "OKX Wallet";
  if (r.includes("trust")) return "Trust Wallet";
  if (r.includes("brave")) return "Brave Wallet";
  if (r.includes("opera")) return "Opera Wallet";
  return null;
}

export function displayNameFromConnectorId(id: WalletConnectorId | null): string | null {
  if (!id) return null;
  if (id === "metamask") return "MetaMask";
  if (id === "phantom") return "Phantom";
  if (id === LEGACY_INJECTED_ID) return "Browser wallet";
  return null;
}

export function resolveConnectedWalletDisplayName(): string {
  const explicit = readStoredWalletLabel();
  if (explicit) return explicit;
  const fromRdns = displayNameFromRdns(readStoredWalletRdns());
  if (fromRdns) return fromRdns;
  const fromId = displayNameFromConnectorId(readStoredConnector());
  if (fromId) return fromId;
  return "Connected wallet";
}

export function writeStoredConnector(
  id: WalletConnectorId,
  rdns?: string | null,
  label?: string | null,
): void {
  try {
    sessionStorage.setItem(WALLET_CONNECTOR_STORAGE_KEY, id);
    if (rdns) {
      sessionStorage.setItem(WALLET_CONNECTOR_RDNS_KEY, rdns);
    } else {
      sessionStorage.removeItem(WALLET_CONNECTOR_RDNS_KEY);
    }
    if (label && label.trim()) {
      sessionStorage.setItem(WALLET_CONNECTOR_LABEL_KEY, label.trim());
    } else {
      sessionStorage.removeItem(WALLET_CONNECTOR_LABEL_KEY);
    }
  } catch {
    /* ignore */
  }
}

export function clearStoredConnector(): void {
  try {
    sessionStorage.removeItem(WALLET_CONNECTOR_STORAGE_KEY);
    sessionStorage.removeItem(WALLET_CONNECTOR_RDNS_KEY);
    sessionStorage.removeItem(WALLET_CONNECTOR_LABEL_KEY);
  } catch {
    /* ignore */
  }
}

export type WalletErrorTone = "recoverable" | "rejection" | "neutral";

export type WalletErrorInfo = {
  title: string;
  subtitle?: string;
  tips?: string[];
  tone: WalletErrorTone;
};

function rawMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "";
}

export function parseWalletError(err: unknown): WalletErrorInfo {
  const text = rawMessage(err);

  if (text.includes("User denied") || text.includes("user rejected") || /4001/.test(text)) {
    return {
      title: "Connection cancelled",
      subtitle: "No worries. You can connect whenever you’re ready.",
      tone: "rejection",
    };
  }

  if (
    text.includes("-32603") ||
    text.includes("Unexpected error") ||
    text.includes("could not coalesce error")
  ) {
    return {
      title: "Wallet didn’t respond in time",
      subtitle:
        "This is usually temporary, often caused by multiple wallet extensions or a locked wallet.",
      tips: [
        "Unlock your wallet, reload this page, then try again.",
        "Pick your wallet explicitly from the list (EIP-6963 discovery).",
        "Pause other crypto extensions for this site, or use Chrome/Edge.",
        "If you’re on localhost, try http://127.0.0.1:3000 instead.",
      ],
      tone: "recoverable",
    };
  }

  if (text.length > 200) {
    return {
      title: "Couldn’t connect",
      subtitle: `${text.slice(0, 160).trim()}…`,
      tips: ["Open the browser console (F12) for the full technical message."],
      tone: "neutral",
    };
  }

  if (text) {
    return {
      title: "Couldn’t connect",
      subtitle: text,
      tone: "neutral",
    };
  }

  return {
    title: "Couldn’t connect",
    subtitle: "Something went wrong. Please try again.",
    tone: "neutral",
  };
}

export const noWalletInstalled: WalletErrorInfo = {
  title: "Wallet not installed",
  subtitle:
    "Install an Ethereum browser wallet (MetaMask, Rabby, OKX, etc.) or refresh after installing.",
  tips: [
    "This site uses EIP-6963 to list every compatible extension on this page.",
    "Phantom: enable Ethereum in the extension if you usually use Solana only.",
  ],
  tone: "neutral",
};

export function walletNotAvailable(label: string): WalletErrorInfo {
  const phantom = /phantom/i.test(label);
  return {
    title: `${label} isn’t available`,
    subtitle: phantom
      ? "Phantom is installed, but we could not use its Ethereum (EVM) provider. Open Phantom, turn on Ethereum for this site or set Ethereum as the active chain, then refresh. This app does not use Solana."
      : "We couldn’t reach that wallet. Install it, refresh, or pick another wallet from the list.",
    tone: "neutral",
  };
}

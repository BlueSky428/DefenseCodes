import type { Eip1193Provider } from "ethers";

/** https://eips.ethereum.org/EIPS/eip-6963 */
export const EIP6963_ANNOUNCE_PROVIDER = "eip6963:announceProvider";
export const EIP6963_REQUEST_PROVIDER = "eip6963:requestProvider";

export type Eip6963ProviderInfo = {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
};

export type Eip6963AnnounceDetail = {
  info: Eip6963ProviderInfo;
  provider: Eip1193Provider;
};

export function eip6963ConnectorId(uuid: string): string {
  return `eip6963:${uuid}`;
}

export function parseEip6963ConnectorId(id: string): string | null {
  if (!id.startsWith("eip6963:")) return null;
  const uuid = id.slice(9);
  return uuid.length > 0 ? uuid : null;
}

/**
 * Collect every wallet that announces via EIP-6963 (MetaMask, Rabby, Coinbase, OKX, etc.).
 * Dispatches `requestProvider` twice so slow extensions still announce before the window closes.
 */
export function discoverEip6963Providers(
  timeoutMs = 1000,
): Promise<Eip6963AnnounceDetail[]> {
  if (typeof window === "undefined") return Promise.resolve([]);

  return new Promise((resolve) => {
    const byUuid = new Map<string, Eip6963AnnounceDetail>();

    const onAnnounce = (event: Event) => {
      const ce = event as CustomEvent<Eip6963AnnounceDetail>;
      const d = ce.detail;
      if (
        d?.info?.uuid &&
        d.provider &&
        typeof (d.provider as Eip1193Provider).request === "function"
      ) {
        byUuid.set(d.info.uuid, d);
      }
    };

    window.addEventListener(EIP6963_ANNOUNCE_PROVIDER, onAnnounce);
    window.dispatchEvent(new Event(EIP6963_REQUEST_PROVIDER));
    const redispatch = window.setTimeout(() => {
      window.dispatchEvent(new Event(EIP6963_REQUEST_PROVIDER));
    }, 200);

    window.setTimeout(() => {
      window.clearTimeout(redispatch);
      window.removeEventListener(EIP6963_ANNOUNCE_PROVIDER, onAnnounce);
      resolve([...byUuid.values()]);
    }, timeoutMs);
  });
}

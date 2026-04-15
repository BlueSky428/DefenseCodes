import type { Eip1193Provider } from "ethers";

/** Ethereum mainnet */
export const CHAIN_ID_MAINNET = 1n;
/** Sepolia testnet */
export const CHAIN_ID_SEPOLIA = 11155111n;

function chainIdHex(chainId: bigint): `0x${string}` {
  const h = chainId.toString(16);
  return `0x${h}` as `0x${string}`;
}

/**
 * Ask the wallet to switch to `chainId` (EIP-3326). If the chain is not added (4902),
 * Sepolia is registered via EIP-3085, then the user can approve the switch.
 */
export async function requestSwitchEthereumChain(
  ethereum: Eip1193Provider,
  chainId: bigint,
): Promise<void> {
  const idHex = chainIdHex(chainId);
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: idHex }],
    });
    return;
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 4902 && chainId === CHAIN_ID_SEPOLIA) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: idHex,
            chainName: "Sepolia",
            nativeCurrency: {
              name: "Sepolia Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: idHex }],
      });
      return;
    }
    throw err;
  }
}

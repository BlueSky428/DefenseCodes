import type { Eip1193Provider } from "ethers";

/** Ethereum mainnet */
export const CHAIN_ID_MAINNET = 1n;
/** BNB Smart Chain mainnet */
export const CHAIN_ID_BSC = 56n;
/** Sepolia testnet */
export const CHAIN_ID_SEPOLIA = 11155111n;

function chainIdHex(chainId: bigint): `0x${string}` {
  const h = chainId.toString(16);
  return `0x${h}` as `0x${string}`;
}

async function addSepolia(ethereum: Eip1193Provider, idHex: `0x${string}`) {
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
}

async function addBscMainnet(ethereum: Eip1193Provider, idHex: `0x${string}`) {
  await ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: idHex,
        chainName: "BNB Smart Chain",
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        rpcUrls: ["https://bsc-dataseed.binance.org"],
        blockExplorerUrls: ["https://bscscan.com"],
      },
    ],
  });
}

/**
 * Ask the wallet to switch to `chainId` (EIP-3326). If the chain is missing (4902),
 * Sepolia or BSC mainnet is registered via EIP-3085, then switch is requested again.
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
    if (code !== 4902) throw err;

    if (chainId === CHAIN_ID_SEPOLIA) {
      await addSepolia(ethereum, idHex);
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: idHex }],
      });
      return;
    }
    if (chainId === CHAIN_ID_BSC) {
      await addBscMainnet(ethereum, idHex);
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: idHex }],
      });
      return;
    }

    throw err;
  }
}

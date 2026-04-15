import { BrowserProvider, type Eip1193Provider } from "ethers";

export function browserProvider(ethereum: unknown): BrowserProvider {
  return new BrowserProvider(ethereum as Eip1193Provider);
}

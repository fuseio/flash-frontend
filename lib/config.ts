import { Address } from "viem";
import { mainnet } from "viem/chains";

type Addresses = {
  ethereum: {
    teller: Address;
    weth: Address;
    usdc: Address;
    usdt: Address;
    usds: Address;
    nativeFeeToken: Address;
    vault: Address;
    paymasterAddress: Address;
    bridgePaymasterAddress: Address;
    boringQueue: Address;
    accountant: Address;
  }
  fuse: {
    vault: Address;
    teller: Address;
    nativeFeeToken: Address;
    bridgePaymasterAddress: Address;
  }
}

export const ADDRESSES: Addresses = {
  ethereum: {
    teller: process.env.EXPO_PUBLIC_MAINNET_TELLER_ADDRESS as Address ?? "0x",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usds: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
    nativeFeeToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    vault: process.env.EXPO_PUBLIC_MAINNET_BORING_VAULT_ADDRESS as Address ?? "0x",
    paymasterAddress: "0x6666666666667849c56f2850848ce1c4da65c68b",
    bridgePaymasterAddress: "0x1C8d847799858a8f4CD3b5dF46D222ae04eC79b1",
    boringQueue: process.env.EXPO_PUBLIC_MAINNET_BORING_QUEUE_ADDRESS as Address ?? "0x",
    accountant: process.env.EXPO_PUBLIC_MAINNET_ACCOUNTANT_ADDRESS as Address ?? "0x",
  },
  fuse: {
    vault: process.env.EXPO_PUBLIC_FUSE_VAULT_ADDRESS as Address ?? "0x",
    teller: process.env.EXPO_PUBLIC_FUSE_TELLER_ADDRESS as Address ?? "0x",
    nativeFeeToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    bridgePaymasterAddress: "0x7Af15A003de1937bD6CA60c70598DBaca2401e1E",
  }
};


export const EXPO_PUBLIC_ETHEREUM_API_KEY = process.env.EXPO_PUBLIC_ETHEREUM_API_KEY ?? ""
export const EXPO_PUBLIC_COIN_GECKO_API_KEY = process.env.EXPO_PUBLIC_COIN_GECKO_API_KEY ?? ""
export const EXPO_PUBLIC_PIMLICO_API_KEY = process.env.EXPO_PUBLIC_PIMLICO_API_KEY ?? ""
export const EXPO_PUBLIC_FLASH_API_BASE_URL = process.env.EXPO_PUBLIC_FLASH_API_BASE_URL ?? ""
export const EXPO_PUBLIC_FLASH_ANALYTICS_API_BASE_URL = process.env.EXPO_PUBLIC_FLASH_ANALYTICS_API_BASE_URL ?? ""

export const USER = {
  storageKey: 'flash_user',
  passkeyStorageKey: 'flash_passkey_list',
  pimlicoUrl: (chainId: number = mainnet.id) => `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${EXPO_PUBLIC_PIMLICO_API_KEY}`,
}

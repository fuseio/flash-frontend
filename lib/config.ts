import { Address } from "viem";
import { mainnet } from "viem/chains";

type Addresses = {
  ethereum: {
    teller: Address;
    weth: Address;
    usdc: Address;
    usdt: Address;
    usds: Address;
  }
  fuse: {
    vault: Address;
  }
}

export const ADDRESSES: Addresses = {
  ethereum: {
    teller: "0xc17Ee998335741D930D12F33581E0Ea42501Beec",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usds: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  },
  fuse: {
    vault: "0x445395FB71f2Dc65F80F947995af271c25807d88"
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
  pimlicoUrl: `https://api.pimlico.io/v2/${mainnet.id}/rpc?apikey=${EXPO_PUBLIC_PIMLICO_API_KEY}`,
}

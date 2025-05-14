import { ImageSourcePropType } from "react-native";
import { mainnet } from "viem/chains";

import { ADDRESSES } from "@/lib/config";
import { TokenMap } from "@/lib/types";

export const TOKEN_MAP: TokenMap = {
  [mainnet.id]: [
    {
      name: "USDC",
      address: ADDRESSES.ethereum.usdc,
      symbol: "USDC",
      decimals: 6,
      imageId: "usdc",
      coingeckoId: "usd-coin",
    },
    {
      name: "WETH",
      address: ADDRESSES.ethereum.weth,
      symbol: "WETH",
      decimals: 18,
      coingeckoId: "weth",
      imageId: "weth",
      isComingSoon: true,
    },
    {
      name: "USDT",
      address: ADDRESSES.ethereum.usdt,
      symbol: "USDT",
      decimals: 6,
      coingeckoId: "tether",
      imageId: "usdt",
      isComingSoon: true,
    },
    {
      name: "USDS",
      address: ADDRESSES.ethereum.usds,
      symbol: "USDS",
      decimals: 18,
      coingeckoId: "usds",
      imageId: "usds",
      isComingSoon: true,
    }
  ],
}

export const TOKEN_IMAGES: Record<string, ImageSourcePropType> = {
  usdc: require("@/assets/images/usdc.png"),
  weth: require("@/assets/images/eth.png"),
  usdt: require("@/assets/images/usdt.png"),
  usds: require("@/assets/images/usds.png"),
}

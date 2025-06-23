import { createClient, createPublicClient } from 'viem';
import { createConfig, http } from 'wagmi';
import { Chain, fuse, mainnet } from 'wagmi/chains';
import {
  createAppKit,
  defaultWagmiConfig
} from "@reown/appkit-wagmi-react-native";

import { EXPO_PUBLIC_ETHEREUM_API_KEY, EXPO_PUBLIC_REOWN_PROJECT_ID } from './config';

const chains: readonly [Chain, ...Chain[]] = [
  fuse,
  mainnet,
]

export const rpcUrls: Record<number, string> = {
  [fuse.id]: fuse.rpcUrls.default.http[0],
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${EXPO_PUBLIC_ETHEREUM_API_KEY}`,
}

const transports: Record<number, ReturnType<typeof http>> = {
  [fuse.id]: http(rpcUrls[fuse.id]),
  [mainnet.id]: http(rpcUrls[mainnet.id]),
}

export const config = createConfig({
  chains,
  multiInjectedProviderDiscovery: false,
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: transports[chain.id],
    });
  },
});

export const publicClient = (chainId: number) => createPublicClient({
  chain: chains.find(chain => chain.id === chainId),
  transport: http(rpcUrls[chainId])
})

export const evmNetworks = chains.map(chain => ({
  blockExplorerUrls: [chain.blockExplorers?.default?.apiUrl],
  chainId: chain.id,
  chainName: chain.name,
  iconUrls: ['@/assets/images/fuse.png'],
  name: chain.name,
  nativeCurrency: {
    decimals: chain.nativeCurrency.decimals,
    name: chain.nativeCurrency.name,
    symbol: chain.nativeCurrency.symbol,
  },
  networkId: chain.id,
  rpcUrls: [...chain.rpcUrls.default.http],
  vanityName: chain.name,
})).map(network => ({
  ...network,
  blockExplorerUrls: network.blockExplorerUrls.filter((url): url is string => !!url)
}));

const metadata = {
  name: "Solid",
  description: "Your crypto savings app",
  url: __DEV__ ? "http://localhost:8081" : "https://solid.xyz",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
  redirect: {
    native: "solid://",
    universal: "solid.xyz",
  },
};

export const wagmiConfig = defaultWagmiConfig({ chains, projectId: EXPO_PUBLIC_REOWN_PROJECT_ID, metadata });

createAppKit({
  projectId: EXPO_PUBLIC_REOWN_PROJECT_ID,
  wagmiConfig,
  defaultChain: mainnet
});

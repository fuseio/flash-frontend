import { createClient, createPublicClient } from 'viem';
import { createConfig, http } from 'wagmi';
import { Chain, fuse, mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { EXPO_PUBLIC_ETHEREUM_API_KEY } from './config';

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
  connectors: [
    injected(),
  ],
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

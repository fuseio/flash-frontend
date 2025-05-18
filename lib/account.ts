import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { http } from "viem";
import {
  entryPoint07Address
} from "viem/account-abstraction";
import { mainnet } from "viem/chains";
import { EXPO_PUBLIC_PIMLICO_API_KEY } from "./config";

const bundlerUrl = `https://api.pimlico.io/v2/${mainnet.id}/rpc?apikey=${EXPO_PUBLIC_PIMLICO_API_KEY}`;

// const publicClient = createPublicClient({
//   transport: http(rpcUrls[mainnet.id]),
//   chain: mainnet,
// })

export const pimlicoBaseSepoliaUrl = `https://api.pimlico.io/v2/${mainnet.id}/rpc?apikey=${EXPO_PUBLIC_PIMLICO_API_KEY}`;
 
export const pimlicoClient = createPimlicoClient({
  transport: http(bundlerUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: '0.7',
  },
})
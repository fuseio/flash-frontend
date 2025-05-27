import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Address, formatUnits } from "viem";
import { fuse } from "viem/chains";
import { readContractQueryOptions } from "wagmi/query";

import FuseVault from "@/lib/abis/FuseVault";
import { ADDRESSES } from "@/lib/config";
import { config } from "@/lib/wagmi";

const VAULT = "vault";

export const fetchVaultBalance = async (
  queryClient: QueryClient,
  safeAddress: Address,
  decimals: number = 6,
) => {
  const balance = await queryClient.fetchQuery(
    readContractQueryOptions(config, {
      abi: FuseVault,
      address: ADDRESSES.fuse.vault,
      functionName: 'balanceOf',
      args: [safeAddress],
      chainId: fuse.id,
    })
  );

  return Number(formatUnits(balance, decimals)) || 0;
};

export const useVaultBalance = (safeAddress: Address) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: [VAULT, 'balance', safeAddress],
    queryFn: () => fetchVaultBalance(queryClient, safeAddress),
    enabled: !!safeAddress,
    refetchOnWindowFocus: false,
  });
};

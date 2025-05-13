import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { mainnet } from "viem/chains";
import { readContractQueryOptions } from "wagmi/query";

import ERC20_ABI from "@/lib/abis/ERC20";
import { fetchTokenPriceUsd } from "@/lib/api";
import { Token, TokenWithBalance } from "@/lib/types";
import { config } from "@/lib/wagmi";

type TokenSelectorProps = {
  tokens: Token[];
  safeAddress?: Address;
};

export const tokenPriceUsdQueryOptions = (tokenId: string) => {
  return {
    queryKey: ["tokenPriceUsd", tokenId],
    queryFn: () => fetchTokenPriceUsd(tokenId),
    enabled: !!tokenId,
  }
}

export const useTokenPriceUsd = (tokenId: string) => {
  return useQuery(tokenPriceUsdQueryOptions(tokenId));
};

export const useTokenSelector = ({
  tokens,
  safeAddress,
}: TokenSelectorProps) => {
  const queryClient = useQueryClient()
  const [tokensWithBalance, setTokensWithBalance] = useState<TokenWithBalance[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!safeAddress) return;

      const tokensWithBalance = await Promise.all(tokens.map(async (token) => {
        const balance = await queryClient.fetchQuery(
          readContractQueryOptions(config, {
            abi: ERC20_ABI,
            address: token.address,
            functionName: "balanceOf",
            args: [safeAddress],
            chainId: mainnet.id,
          })
        );

        const price = await queryClient.fetchQuery(
          tokenPriceUsdQueryOptions(token.coingeckoId)
        );

        return {
          ...token,
          balance: balance ? Number(formatUnits(balance, token.decimals)) : 0,
          balanceUSD:
            balance && price
              ? Number(formatUnits(balance, token.decimals)) * price
              : 0,
        };
      }));

      setTokensWithBalance(tokensWithBalance);
    };

    fetchTokens();
  }, [tokens, safeAddress, queryClient]);

  return {
    tokensWithBalance,
  };
};

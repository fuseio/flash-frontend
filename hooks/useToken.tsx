import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { mainnet } from "viem/chains";
import { readContractQueryOptions } from "wagmi/query";

import ERC20_ABI from "@/lib/abis/ERC20";
import { fetchTokenPriceUsd } from "@/lib/api";
import { Status, Token, TokenWithBalance } from "@/lib/types";
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
  const [tokenStatus, setTokenStatus] = useState<Status>(Status.IDLE);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        if (!safeAddress) return;

        setTokenStatus(Status.PENDING);

        const tokensWithBalance = await Promise.all(tokens.map(async (token) => {
          if (token.isComingSoon) {
            return {
              ...token,
              balance: 0,
              balanceUSD: 0,
            };
          }

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

          const formattedBalance = balance ? Number(formatUnits(balance, token.decimals)) : 0;
          const balanceUSD = price ? formattedBalance * price : 0;

          return {
            ...token,
            balance: formattedBalance,
            balanceUSD
          };
        }));

        setTokensWithBalance(tokensWithBalance);
        setTotalBalance(tokensWithBalance.reduce((acc, token) => acc + token.balance, 0));
        setTokenStatus(Status.SUCCESS);
      } catch (error) {
        console.error(error);
        setTokenStatus(Status.ERROR);
      }
    };

    fetchTokens();
  }, [tokens, safeAddress, queryClient]);

  return {
    tokensWithBalance,
    tokenStatus,
    totalBalance,
  };
};

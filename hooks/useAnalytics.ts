import { QueryClient, useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { infoClient } from "@/graphql/clients";

import {
  GetUserTransactionsDocument,
  GetUserTransactionsQuery
} from "@/graphql/generated/user-info";
import {
  fetchLayerZeroBridgeTransactions,
  fetchTokenTransfer,
  fetchTotalAPY
} from "@/lib/api";
import { Transaction } from "@/lib/types";

const ANALYTICS = "analytics";

export const useTotalAPY = () => {
  return useQuery({
    queryKey: [ANALYTICS, "totalAPY"],
    queryFn: fetchTotalAPY,
    refetchOnWindowFocus: false,
  });
};

export const useLatestTokenTransfer = (address: string, token: string) => {
  return useQuery({
    queryKey: [ANALYTICS, "latestTokenTransfer", address, token],
    queryFn: async () => {
      if (!address) return 0;
      const response = await fetchTokenTransfer(address, token);
      const latest = response.items.reduce((prev, curr) =>
        new Date(curr.timestamp) > new Date(prev.timestamp) ? curr : prev
      );
      return new Date(latest.timestamp).getTime();
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
  });
};

export const formatTransactions = (
  transactions: GetUserTransactionsQuery | undefined
) => {
  const formattedTransactions: Transaction[] = [];

  transactions?.deposits.forEach(async (internalTransaction) => {
    const lzTransactions = await fetchLayerZeroBridgeTransactions(
      internalTransaction.transactionHash
    );
    formattedTransactions.push({
      title: "Deposit USDC",
      timestamp: internalTransaction.depositTimestamp,
      amount: Number(formatUnits(BigInt(internalTransaction.depositAmount), 6)),
      status: lzTransactions.data[0].status.name,
    });
  });

  return formattedTransactions;
};

export const isDepositedQueryOptions = (safeAddress: string) => {
  return {
    queryKey: [ANALYTICS, "isDeposited", safeAddress],
    queryFn: async () => {
      const { data } = await infoClient.query({
        query: GetUserTransactionsDocument,
        variables: {
          address: safeAddress,
        },
      });

      return data?.deposits?.length;
    },
    enabled: !!safeAddress,
    refetchOnWindowFocus: false,
  };
};

export const fetchIsDeposited = (
  queryClient: QueryClient,
  safeAddress: string
) => {
  return queryClient.fetchQuery(isDepositedQueryOptions(safeAddress));
};

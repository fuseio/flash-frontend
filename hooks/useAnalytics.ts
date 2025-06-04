import { useQuery } from "@tanstack/react-query"
import { formatUnits } from "viem"

import { fetchInternalTransactions, fetchLayerZeroBridgeTransactions, fetchTokenTransfer, fetchTotalAPY, fetchTransactionTokenTransfers } from "@/lib/api"
import { ADDRESSES } from "@/lib/config"
import { Transaction } from "@/lib/types"

const ANALYTICS = "analytics"

export const useTotalAPY = () => {
  return useQuery({
    queryKey: [ANALYTICS, "totalAPY"],
    queryFn: fetchTotalAPY,
    refetchOnWindowFocus: false
  })
}

export const useLatestTokenTransfer = (address: string, token: string) => {
  return useQuery({
    queryKey: [ANALYTICS, "latestTokenTransfer", address, token],
    queryFn: async () => {
      if (!address) return 0
      const response = await fetchTokenTransfer(address, token)
      const latest = response.items.reduce((prev, curr) =>
        new Date(curr.timestamp) > new Date(prev.timestamp) ? curr : prev
      )
      return new Date(latest.timestamp).getTime()
    },
    enabled: !!address,
    refetchOnWindowFocus: false
  })
}

export const useTransactions = (
  safeAddress: string,
) => {
  return useQuery({
    queryKey: [ANALYTICS, "transactions", safeAddress],
    queryFn: async () => {
      const internalTransactions = await fetchInternalTransactions(safeAddress)
      const transactions: Transaction[] = []

      internalTransactions.items.forEach(async (internalTransaction) => {
        if (internalTransaction.to.hash !== ADDRESSES.ethereum.teller) return;

        const transactionTokenTransfers = await fetchTransactionTokenTransfers(internalTransaction.transaction_hash)
        const lzTransactions = await fetchLayerZeroBridgeTransactions(internalTransaction.transaction_hash)

        transactionTokenTransfers.items.forEach((transactionTokenTransfer) => {
          if (transactionTokenTransfer.token.address !== ADDRESSES.ethereum.usdc) return;

          transactions.push({
            title: "Deposit USDC",
            timestamp: internalTransaction.timestamp,
            amount: Number(formatUnits(BigInt(transactionTokenTransfer.total.value), Number(transactionTokenTransfer.total.decimals))),
            status: lzTransactions.data[0].status.name,
          })
        })
      })

      return transactions
    },
    enabled: !!safeAddress,
    refetchOnWindowFocus: false
  })
}

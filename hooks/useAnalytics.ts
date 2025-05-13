import { useQuery } from "@tanstack/react-query"

import { fetchTotalAPY, fetchTokenTransfer } from "@/lib/api"

const ANALYTICS = "analytics"

export const useTotalAPY = () => {
  return useQuery({
    queryKey: [ANALYTICS, "totalAPY"],
    queryFn: fetchTotalAPY
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
    enabled: !!address
  })
}

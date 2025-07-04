import { fetchTokenPriceUsd } from "@/lib/api";
import { publicClient } from "@/lib/wagmi";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";

export const useEstimateDepositGas = () => {
  const [costInUsd, setCostInUsd] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const estimateGas = async () => {
      setLoading(true);
      const gasPrice = await publicClient(mainnet.id).getGasPrice();
      const tokenPriceUsd = await fetchTokenPriceUsd("ETH");
      const gasEstimate = 700000n;
      const costInUsd = gasEstimate * gasPrice;
      setCostInUsd((Number(costInUsd) * tokenPriceUsd) / 10 ** 18);
      setLoading(false);
    };
    estimateGas();
  }, []);

  return { costInUsd, loading };
};

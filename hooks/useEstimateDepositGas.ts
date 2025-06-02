import { getPaymasterQuote, getUserOperationGasPrice } from "@/lib/pimlico";
import { useEffect, useState } from "react";

export const useEstimateDepositGas = () => {
  const [costInUsd, setCostInUsd] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const estimateGas = async () => {
      const { postOpGas, exchangeRate } = await getPaymasterQuote();

      const userOperationGasPrice = await getUserOperationGasPrice();

      const userOperationMaxGas = 1260233n;
      const userOperationMaxCost =
        userOperationMaxGas * userOperationGasPrice.standard.maxFeePerGas;

      // represents the userOperation's max cost in demoniation of wei
      const maxCostInWei =
        userOperationMaxCost +
        postOpGas * userOperationGasPrice.standard.maxFeePerGas;

      // represents the userOperation's max cost in usd (with 6 decimals of precision)
      const rawCostInUsd =
        (maxCostInWei * exchangeRate) / 10n ** 18n;

      // represents the userOperation's max cost in usd
      // (human readable format after dividing by 6 decimal places)
      const costInUsd = Number(rawCostInUsd) / 10 ** 6;
      setCostInUsd(costInUsd);
      setLoading(false);
    };
    estimateGas();
  }, []);

  return { costInUsd, loading };
};

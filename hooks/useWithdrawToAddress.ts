import ERC20_ABI from "@/lib/abis/ERC20";
import { ADDRESSES } from "@/lib/config";
import { executeTransactions } from "@/lib/execute";
import { Status } from "@/lib/types";
import { Address } from "abitype";
import { useState } from "react";
import { TransactionReceipt } from "viem";
import { mainnet } from "viem/chains";
import { encodeFunctionData, parseUnits } from "viem/utils";
import useUser from "./useUser";

type WithdrawResult = {
  withdrawToAddress: (amount: string, to: Address) => Promise<TransactionReceipt>;
  withdrawStatus: Status;
  error: string | null;
};

const useWithdrawToAddress = (): WithdrawResult => {
  const { user, safeAA } = useUser();
  const [withdrawStatus, setWithdrawStatus] = useState<Status>(Status.IDLE);
  const [error, setError] = useState<string | null>(null);

  const withdrawToAddress = async (amount: string, to: Address) => {
    try {
      if (!user?.passkey) {
        throw new Error("Passkey not found");
      }

      setWithdrawStatus(Status.PENDING);
      setError(null);

      const amountWei = parseUnits(amount, 6);

      const transactions = [
        {
          to: ADDRESSES.ethereum.usdc,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [to, amountWei],
          }),
          value: 0n,
        }
      ];


      const smartAccountClient = await safeAA(user.passkey, mainnet);

      const transaction = await executeTransactions(
        smartAccountClient,
        user.passkey,
        transactions,
        "Withdraw to address failed",
        mainnet
      );

      setWithdrawStatus(Status.SUCCESS);
      return transaction;
    } catch (error) {
      console.error(error);
      setWithdrawStatus(Status.ERROR);
      setError(error instanceof Error ? error.message : "Unknown error");
      throw error;
    }
  };

  return { withdrawToAddress, withdrawStatus, error };
};

export default useWithdrawToAddress;

import { useState } from "react";
import { useReadContract } from "wagmi";
import { encodeFunctionData, Hash, parseEther, type Address } from "viem";
import { mainnet } from "viem/chains";

import ERC20_ABI from "@/lib/abis/ERC20";
import ETHEREUM_TELLER_ABI from "@/lib/abis/EthereumTeller";
import { ADDRESSES } from "@/lib/config";
import { Status } from "@/lib/types";
import useUser from "./useUser";
import { publicClient } from "@/lib/wagmi";

type DepositResult = {
  allowance: bigint | undefined;
  balance: bigint | undefined;
  approve: (amount: string) => Promise<void>;
  deposit: (amount: string) => Promise<void>;
  approveStatus: Status;
  depositStatus: Status;
  error: string | null;
};

const useDeposit = (): DepositResult => {
  const { user, safeAA, userOpReceipt } = useUser();
  const [approveStatus, setApproveStatus] = useState<Status>(Status.IDLE);
  const [depositStatus, setDepositStatus] = useState<Status>(Status.IDLE);
  const [error, setError] = useState<string | null>(null);

  const { data: balance } = useReadContract({
    abi: ERC20_ABI,
    address: ADDRESSES.ethereum.weth,
    functionName: "balanceOf",
    args: [user?.safeAddress as Address],
    chainId: mainnet.id,
    query: {
      enabled: !!user?.safeAddress,
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    address: ADDRESSES.ethereum.weth,
    functionName: "allowance",
    args: [user?.safeAddress as Address, ADDRESSES.ethereum.teller],
    chainId: mainnet.id,
    query: {
      enabled: !!user?.safeAddress,
    },
  });

  const approve = async (amount: string) => {
    try {
      if (!user?.passkey) {
        throw new Error("Passkey not found");
      }

      setApproveStatus(Status.PENDING);
      setError(null);

      const amountWei = parseEther(amount);
      if (balance && balance < amountWei) {
        throw new Error("Insufficient WETH balance");
      }

      const safe4337Pack = await safeAA(user.passkey)
      const approveTransaction = {
        to: ADDRESSES.ethereum.weth,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [ADDRESSES.ethereum.teller, amountWei],
        }),
        value: '0'
      }

      const safeOperation = await safe4337Pack.createTransaction({
        transactions: [approveTransaction]
      })
      const signedSafeOperation = await safe4337Pack.signSafeOperation(safeOperation)

      const userOperationHash = await safe4337Pack.executeTransaction({
        executable: signedSafeOperation
      })
      const userOperationReceipt = await userOpReceipt(safe4337Pack, userOperationHash)
      if (!userOperationReceipt.success) {
        throw new Error("User operation failed");
      }

      const transactionHash = userOperationReceipt.receipt.transactionHash as Hash
      const transaction = await publicClient(mainnet.id).waitForTransactionReceipt(
        { hash: transactionHash }
      )

      await refetchAllowance();
      if (transaction.status === 'success') {
        setApproveStatus(Status.SUCCESS);
      } else {
        throw new Error("Approval failed");
      }
    } catch (error) {
      console.error(error);
      setApproveStatus(Status.ERROR);
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const deposit = async (amount: string) => {
    try {
      if (!user?.passkey) {
        throw new Error("Passkey not found");
      }

      setDepositStatus(Status.PENDING);
      setError(null);

      const amountWei = parseEther(amount);
      if (balance && balance < amountWei) {
        throw new Error("Insufficient WETH balance");
      }

      if (allowance && allowance < amountWei) {
        throw new Error("Insufficient allowance. Please approve first.");
      }

      const safe4337Pack = await safeAA(user.passkey)
      const depositTransaction = {
        to: ADDRESSES.ethereum.teller,
        data: encodeFunctionData({
          abi: ETHEREUM_TELLER_ABI,
          functionName: "deposit",
          args: [amountWei],
        }),
        value: '0'
      }

      const safeOperation = await safe4337Pack.createTransaction({
        transactions: [depositTransaction]
      })
      const signedSafeOperation = await safe4337Pack.signSafeOperation(safeOperation)

      const userOperationHash = await safe4337Pack.executeTransaction({
        executable: signedSafeOperation
      })
      const userOperationReceipt = await userOpReceipt(safe4337Pack, userOperationHash)
      if (!userOperationReceipt.success) {
        throw new Error("User operation failed");
      }

      const transactionHash = userOperationReceipt.receipt.transactionHash as Hash
      const transaction = await publicClient(mainnet.id).waitForTransactionReceipt(
        { hash: transactionHash }
      )
      if (transaction.status === 'success') {
        setDepositStatus(Status.SUCCESS);
      } else {
        throw new Error("Deposit failed");
      }
    } catch (error) {
      console.error(error);
      setDepositStatus(Status.ERROR);
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return {
    allowance,
    balance,
    approve,
    deposit,
    approveStatus,
    depositStatus,
    error,
  };
};

export default useDeposit;

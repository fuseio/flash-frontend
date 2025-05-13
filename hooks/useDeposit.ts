import { useState } from "react";
import { encodeFunctionData, Hash, parseEther, type Address } from "viem";
import { mainnet } from "viem/chains";
import { useReadContract } from "wagmi";

import ERC20_ABI from "@/lib/abis/ERC20";
import ETHEREUM_TELLER_ABI from "@/lib/abis/EthereumTeller";
import { ADDRESSES } from "@/lib/config";
import { PasskeyArgType, Status } from "@/lib/types";
import { publicClient } from "@/lib/wagmi";
import useUser from "./useUser";

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

  // Helper function to execute transactions
  const executeTransactions = async (
    passkey: PasskeyArgType,
    transactions: any[],
    errorMessage: string
  ) => {
    const safePack = await safeAA(passkey);
    
    const safeOperation = await safePack.createTransaction({
      transactions
    });
    
    const signedSafeOperation = await safePack.signSafeOperation(safeOperation);
    
    const userOperationHash = await safePack.executeTransaction({
      executable: signedSafeOperation
    });
    
    const receipt = await userOpReceipt(safePack, userOperationHash);
    
    if (!receipt.success) {
      throw new Error("User operation failed");
    }
    
    const transactionHash = receipt.receipt.transactionHash as Hash;
    
    const transaction = await publicClient(mainnet.id).waitForTransactionReceipt({
      hash: transactionHash
    });
    
    if (transaction.status !== 'success') {
      throw new Error(errorMessage);
    }
    
    return transaction;
  };

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

      const approveTransaction = {
        to: ADDRESSES.ethereum.weth,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [ADDRESSES.ethereum.teller, amountWei],
        }),
        value: '0'
      };

      await executeTransactions(
        user.passkey, 
        [approveTransaction], 
        "Approval failed"
      );

      await refetchAllowance();
      setApproveStatus(Status.SUCCESS);
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

      let transactions = [];

      // Add approve transaction if needed
      if (allowance && allowance < amountWei) {
        transactions.push({
          to: ADDRESSES.ethereum.weth,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [ADDRESSES.ethereum.teller, amountWei],
          }),
          value: '0'
        });
      }

      // Add deposit transaction
      transactions.push({
        to: ADDRESSES.ethereum.teller,
        data: encodeFunctionData({
          abi: ETHEREUM_TELLER_ABI,
          functionName: "deposit",
          args: [amountWei],
        }),
        value: '0'
      });

      await executeTransactions(
        user.passkey,
        transactions,
        "Deposit failed"
      );
      
      setDepositStatus(Status.SUCCESS);
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

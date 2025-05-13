import { useState } from "react";
import { parseEther } from "viem";

import { CheckConnectionWrapper } from "@/components/CheckConnectionWrapper";
import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import useDeposit from "@/hooks/useDeposit";
import { Status } from "@/lib/types";

export default function Deposit() {
  const [amount, setAmount] = useState<string>("");
  const {
    allowance,
    balance,
    approve,
    deposit,
    approveStatus,
    depositStatus
  } = useDeposit();
  const isLoading = approveStatus === Status.PENDING || depositStatus === Status.PENDING;

  const amountWei = parseEther(amount);

  const getButtonText = () => {
    if (!amount) return "Enter an amount";
    if (!balance || balance < amountWei) return "Insufficient balance";
    if (!allowance || allowance < amountWei) {
      if (approveStatus === Status.PENDING) return "Approving";
      if (approveStatus === Status.ERROR) return "Error while approving";
      return "Approve";
    }
    if (depositStatus === Status.PENDING) return "Depositing";
    if (depositStatus === Status.ERROR) return "Error while depositing";
    if (depositStatus === Status.SUCCESS) return "Successfully deposited";
    return "Deposit";
  };

  const handleClick = async () => {
    if (!amount) return;
    if (!balance || balance < amountWei) return;
    if (!allowance || allowance < amountWei) {
      await approve(amount);
    } else {
      await deposit(amount);
    }
  };

  return (
    <CheckConnectionWrapper props={{ size: "xl" }}>
      <Button
        onPress={handleClick}
        disabled={
          !amount ||
          !balance ||
          balance < amountWei ||
          isLoading
        }
      >
        <Text>{getButtonText()}</Text>
        {isLoading &&
          <IconSymbol
            size={28}
            name="rays"
            color="white"
          />
        }
      </Button>
    </CheckConnectionWrapper>
  );
}

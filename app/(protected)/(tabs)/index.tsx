import { useState } from "react";
import { parseEther } from "viem";

import { CheckConnectionWrapper } from "@/components/CheckConnectionWrapper";
import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import useDeposit from "@/hooks/useDeposit";
import { Status } from "@/lib/types";

export default function Deposit() {
  const [amount, ] = useState<string>("");
  const {
    balance,
    deposit,
    depositStatus
  } = useDeposit();
  const isLoading = depositStatus === Status.PENDING;

  const amountWei = parseEther(amount);

  const getButtonText = () => {
    if (!amount) return "Enter an amount";
    if (!balance || balance < amountWei) return "Insufficient balance";
    if (depositStatus === Status.PENDING) return "Depositing";
    if (depositStatus === Status.ERROR) return "Error while depositing";
    if (depositStatus === Status.SUCCESS) return "Successfully deposited";
    return "Deposit";
  };

  const handleClick = async () => {
    if (!amount) return;
    if (!balance || balance < amountWei) return;
    await deposit(amount);
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

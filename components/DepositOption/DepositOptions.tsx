import { useCallback, useState } from "react"
import { CreditCard, Landmark, Wallet } from "lucide-react-native"
import { View } from "react-native"
import { useAccount } from "wagmi"

import { useAppKit } from "@/lib/reown"
import DepositOption from "./DepositOption"
import { DepositModal } from "@/lib/types"
import { useDepositStore } from "@/store/useDepositStore"

const DepositOptions = () => {
  const { address } = useAccount();
  const { open } = useAppKit()
  const { setDepositModal } = useDepositStore();
  const [isWalletOpening, setIsWalletOpening] = useState(false);

  const openWallet = useCallback(async () => {
    try {
      if (isWalletOpening) return;
      if (address) return;

      setIsWalletOpening(true);
      await open();
    } catch (error) {
      console.error(error);
    } finally {
      setIsWalletOpening(false);
      setDepositModal(DepositModal.OPEN_FORM);
    }
  }, [isWalletOpening, open]);

  const DEPOSIT_OPTIONS = [
    {
      text: "Connect Wallet",
      icon: <Wallet color="white" size={26} />,
      onPress: openWallet,
      isLoading: isWalletOpening
    },
    {
      text: "Debit/Credit Card",
      icon: <CreditCard color="white" size={26} />,
      onPress: () => { },
      isLoading: false
    },
    {
      text: "Bank Deposit",
      icon: <Landmark color="white" size={26} />,
      onPress: () => { },
      isLoading: false
    }
  ]

  return (
    <View className="gap-y-2.5">
      {DEPOSIT_OPTIONS.map((option) => (
        <DepositOption
          key={option.text}
          text={option.text}
          icon={option.icon}
          onPress={option.onPress}
          isLoading={option.isLoading}
        />
      ))}
    </View>
  )
}

export default DepositOptions;

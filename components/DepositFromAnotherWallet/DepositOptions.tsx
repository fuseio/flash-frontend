import { View } from "react-native"
import { useConnect } from "wagmi"
import { CreditCard, Landmark, Wallet } from "lucide-react-native"

import DepositOption from "./DepositOption"

const DepositOptions = () => {
  const { connectors, connect, isPending } = useConnect()

  const DEPOSIT_OPTIONS = [
    {
      text: "Connect Wallet",
      icon: <Wallet color="white" size={26} />,
      onPress: () => { connect({ connector: connectors[0] }) },
      isLoading: isPending
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

import { View } from "react-native";

import { Text } from "../ui/text";
import WithdrawModal from "../Withdraw/WithdrawModal";

import { useState } from "react";
import DepositFromAnotherWallet from "../DepositFromAnotherWallet";

const DashboardHeader = () => {
  const [isDepositAddressModalOpen, setIsDepositAddressModalOpen] = useState(false);
  return (
    <View className="md:flex-row justify-between md:items-center gap-y-4">
      <View className="gap-4">
        <Text className="text-4.5xl font-semibold">
          Your saving account
        </Text>
        <Text className="text-xl opacity-50 max-w-md">
          Earn yield on your Earn yield on your Earn yield on your Earn yield on your Earn yield on your
        </Text>
      </View>
      <View className="flex-row items-center gap-5 h-20">
        <DepositFromAnotherWallet open={isDepositAddressModalOpen} setOpen={setIsDepositAddressModalOpen} />
        <WithdrawModal />
      </View>
    </View>
  )
}

export default DashboardHeader;

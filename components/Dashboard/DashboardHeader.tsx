import { Link } from "expo-router";
import { View } from "react-native";

import { Text } from "../ui/text";
import { path } from "@/constants/path";
import { buttonVariants } from "../ui/button";
import WithdrawModal from "../Withdraw/WithdrawModal";

import Deposit from "@/assets/images/deposit";

const DashboardHeader = () => {
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
        <Link href={path.DEPOSIT} className={buttonVariants({ className: "flex-col items-center gap-3 w-28 h-full rounded-xl md:rounded-twice" })}>
          <Deposit className="size-6" />
          <Text className="text-primary-foreground font-semibold">Deposit</Text>
        </Link>
        <WithdrawModal />
      </View>
    </View>
  )
}

export default DashboardHeader;

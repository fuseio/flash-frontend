import { View } from "react-native";

import { buttonVariants } from "../ui/button";
import { Text } from "../ui/text";
import WithdrawModal from "../Withdraw/WithdrawModal";

import { path } from "@/constants/path";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";

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
        <Link href={path.DEPOSIT} className={buttonVariants({ variant: "brand", className: "h-12 rounded-xl" })}>
          <View className="flex-row items-center gap-2">
            <Plus color="black" />
            <Text className="text-primary-foreground font-bold hidden md:block">Add funds</Text>
          </View>
        </Link>
        <WithdrawModal />
      </View>
    </View>
  )
}

export default DashboardHeader;

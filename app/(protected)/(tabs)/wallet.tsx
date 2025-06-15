import { Link } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowUpRight, Plus, SendHorizontal } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { formatNumber } from "@/lib/utils";
import { PointsBadge, SavingCard, WalletCard, WalletTabs } from "@/components/Wallet";
import { path } from "@/constants/path";
import { buttonVariants } from "@/components/ui/button";

const balance = 2112.44;
const points = 50;

export default function Wallet() {
  return (
    <SafeAreaView
      className="bg-background text-foreground flex-1"
      edges={['right', 'left', 'bottom']}
    >
      <ScrollView className="flex-1">
        <View className="gap-16 px-4 py-8 md:py-16 w-full max-w-7xl mx-auto">
          <View className="flex-col md:flex-row items-center justify-between gap-y-4">
            <View className="flex-row items-center gap-6">
              <Text className="text-5xl font-semibold">${formatNumber(balance)}</Text>
              <PointsBadge points={points} />
            </View>

            <View className="flex-row items-center gap-2">
              <Link href={path.DEPOSIT} className={buttonVariants({ variant: "brand", className: "h-12 rounded-xl" })}>
                <View className="flex-row items-center gap-2">
                  <Plus />
                  <Text className="text-primary-foreground font-bold hidden md:block">Add funds</Text>
                </View>
              </Link>
              <Link href={path.DEPOSIT} className={buttonVariants({ variant: "secondary", className: "h-12 rounded-xl" })}>
                <View className="flex-row items-center gap-2">
                  <ArrowUpRight color="white" />
                  <Text className="font-bold hidden md:block">Withdraw</Text>
                </View>
              </Link>
              <Link href={path.DEPOSIT} className={buttonVariants({ variant: "secondary", className: "h-12 rounded-xl" })}>
                <View className="flex-row items-center gap-2">
                  <SendHorizontal color="white" />
                  <Text className="font-bold hidden md:block">Send</Text>
                </View>
              </Link>
            </View>
          </View>

          <View className="flex-col md:flex-row items-center justify-between gap-6">
            <WalletCard balance={balance} className="w-full md:w-[50%] h-40" />
            <SavingCard balance={balance} className="w-full md:w-[50%] h-40" />
          </View>

          <View className="md:mt-16">
            <WalletTabs />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

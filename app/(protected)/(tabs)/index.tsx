import { Image } from "expo-image";
import { Link, Redirect } from "expo-router";
import { Plus } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { mainnet } from "viem/chains";

import Loading from "@/components/Loading";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { path } from "@/constants/path";
import { TOKEN_MAP } from "@/constants/tokens";
import { useTotalAPY } from "@/hooks/useAnalytics";
import { useTokenSelector } from "@/hooks/useToken";
import useUser from "@/hooks/useUser";
import { Status } from "@/lib/types";

export default function Home() {
  const { user } = useUser();
  const { tokenStatus, totalBalance } = useTokenSelector({ tokens: TOKEN_MAP[mainnet.id], safeAddress: user?.safeAddress })
  const { data: totalAPY, isLoading: isTotalAPYLoading } = useTotalAPY()
  const isLoading = tokenStatus === Status.IDLE || tokenStatus === Status.PENDING;

  if (isLoading) {
    return <Loading />;
  }

  if (totalBalance) {
    return <Redirect href={path.DASHBOARD} />;
  }

  return (
    <ScrollView className="bg-background text-foreground flex-1">
      <View className="w-full max-w-7xl mx-auto gap-16 px-4 py-8 md:py-16">
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
            <Link href={path.DEPOSIT} className={buttonVariants({ className: "w-48 md:w-64 h-16 rounded-xl md:rounded-2xl" })}>
              <Plus />
              <Text className="text-primary-foreground font-semibold">Deposit USD</Text>
            </Link>
          </View>
        </View>

        <View className="bg-brand border border-border rounded-xl md:rounded-twice p-6 md:p-10 gap-24">
          <Text className="text-4.5xl text-brand-foreground font-semibold max-w-lg">
            Deposit your stablecoins and earn {isTotalAPYLoading ?
              <Skeleton className="w-24 h-10" /> :
              <Text className="text-4.5xl text-brand-foreground font-bold underline">
                {totalAPY?.toFixed(2)}%
              </Text>
            } per year
          </Text>
          <View className="flex-col md:flex-row justify-between md:items-center gap-4">
            <View className="gap-4">
              <Image source={require("@/assets/images/deposit.png")} className="w-16 h-16" />
              <Text className="text-3xl text-brand-foreground">
                Deposit as little as $1
              </Text>
            </View>
            <View className="gap-4">
              <Image source={require("@/assets/images/withdraw.png")} className="w-16 h-16" />
              <Text className="text-3xl text-brand-foreground">
                Withdraw anytime
              </Text>
            </View>
            <View className="gap-4">
              <Image source={require("@/assets/images/earn.png")} className="w-16 h-16" />
              <Text className="text-3xl text-brand-foreground">
                Earn every second
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

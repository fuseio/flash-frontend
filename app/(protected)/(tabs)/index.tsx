import { Image } from "expo-image";
import { Link, Redirect } from "expo-router";
import { Plus } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { path } from "@/constants/path";
import { useTotalAPY } from "@/hooks/useAnalytics";
import useUser from "@/hooks/useUser";

export default function Home() {
  const { user } = useUser();
  const { data: totalAPY, isLoading: isTotalAPYLoading } = useTotalAPY()

  if (user?.isDeposited) {
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
            <Text className="max-w-lg">
              <Text className="font-medium opacity-70">
                Our Solid vault will automatically manage your funds to maximize your yield without exposing you to unnecessary risk.
              </Text>{" "}
              <Link href="/" className='text-primary font-medium underline hover:opacity-70'>How it works</Link>
            </Text>
          </View>
          <View className="flex-row items-center gap-5 h-20">
            <Link href={path.DEPOSIT} className={buttonVariants({ variant: "brand", className: "h-12 rounded-xl" })}>
              <Plus />
              <Text className="text-primary-foreground font-bold">Deposit USD</Text>
            </Link>
          </View>
        </View>

        <LinearGradient
          colors={['rgba(148, 242, 127, 0.3)', 'rgba(148, 242, 127, 0.2)']}
          className="rounded-xl md:rounded-twice p-6 md:p-10 gap-24"
        >
          <Text className="text-4.5xl font-semibold max-w-lg">
            Deposit your stablecoins and earn {isTotalAPYLoading ?
              <Skeleton className="w-24 h-10 bg-brand/20" /> :
              <Text className="text-4.5xl text-brand font-bold underline">
                {totalAPY?.toFixed(2)}%
              </Text>
            } per year
          </Text>
          <View className="flex-col md:flex-row justify-between md:items-center gap-4">
            <View className="gap-4">
              <Image source={require("@/assets/images/deposit.png")} className="w-16 h-16" />
              <Text className="text-3xl text-brand">
                Deposit as little as $1
              </Text>
            </View>
            <View className="gap-4">
              <Image source={require("@/assets/images/withdraw.png")} className="w-16 h-16" />
              <Text className="text-3xl text-brand">
                Withdraw anytime
              </Text>
            </View>
            <View className="gap-4">
              <Image source={require("@/assets/images/earn.png")} className="w-16 h-16" />
              <Text className="text-3xl text-brand">
                Earn every second
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

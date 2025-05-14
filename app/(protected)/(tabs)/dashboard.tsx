import { Image } from "expo-image";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";
import { Address, formatUnits } from "viem";
import { fuse } from "viem/chains";
import { useReadContract } from "wagmi";

import SavingCountUp from "@/components/SavingCountUp";
import { buttonVariants } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";
import { path } from "@/constants/path";
import { useLatestTokenTransfer, useTotalAPY } from "@/hooks/useAnalytics";
import useUser from "@/hooks/useUser";
import FuseVault from "@/lib/abis/FuseVault";
import { ADDRESSES } from "@/lib/config";

import Deposit from "@/assets/images/deposit";

export default function Dashboard() {
  const { user } = useUser();
  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    abi: FuseVault,
    address: ADDRESSES.fuse.vault,
    functionName: 'balanceOf',
    args: [user?.safeAddress as Address],
    chainId: fuse.id,
    query: {
      enabled: !!user?.safeAddress,
    },
  })
  const { data: totalAPY } = useTotalAPY()
  const { data: lastTimestamp } = useLatestTokenTransfer(user?.safeAddress ?? "", ADDRESSES.fuse.vault)

  return (
    <ScrollView className="bg-background text-foreground flex-1">
      <View className="gap-16 px-4 py-8 md:py-16">
        <View className="md:flex-row justify-between md:items-center gap-y-4 w-full max-w-7xl mx-auto">
          <View className="gap-4">
            <Text className="text-4.5xl font-semibold">
              Your saving account
            </Text>
            <Text className="text-xl opacity-50 max-w-md">
              Earn yield on your Earn yield on your Earn yield on your Earn yield on your Earn yield on your
            </Text>
          </View>
          <View className="flex-row items-center gap-5 h-20">
            <Link href={path.DEPOSIT} className={buttonVariants({ className: "flex-col items-center gap-3 w-28 h-full rounded-twice" })}>
              <Deposit className="size-6" />
              <Text className="text-primary-foreground font-semibold">Deposit</Text>
            </Link>
          </View>
        </View>

        <View className="web:md:grid web:md:grid-cols-4 w-full max-w-7xl mx-auto border border-border rounded-twice overflow-hidden">
          <View className="web:md:col-span-3 web:md:row-span-3 justify-between gap-4 bg-card p-6 md:p-12 border-b border-border md:border-b-0 md:border-r">
            <Text className="text-3xl font-medium">USDC Savings</Text>
            <View className="flex-row items-center gap-4">
              <Image source={require("@/assets/images/usdc.png")} className="hidden md:block" style={{ width: 76, height: 76 }} />
              <Image source={require("@/assets/images/usdc.png")} className="block md:hidden" style={{ width: 36, height: 36 }} />
              {(balance && totalAPY && lastTimestamp) ? (
                <SavingCountUp
                  balance={Number(formatUnits(balance, 6))}
                  apy={totalAPY}
                  lastTimestamp={lastTimestamp / 1000}
                />
              ) : (
                <Skeleton className="w-48 h-10 md:w-96 md:h-24 rounded-md" />
              )}
            </View>
          </View>

          <View className="gap-2.5 bg-card p-6 border-b border-border">
            <Text className="text-lg text-primary/50 font-medium">APY</Text>
            <Text className="text-2xl font-semibold">
              {totalAPY ? `${totalAPY.toFixed(2)}%` : <Skeleton className="w-20 h-8 rounded-md" />}
            </Text>
          </View>

          <View className="gap-2.5 bg-card p-6 border-b border-border">
            <Text className="text-lg text-primary/50 font-medium">1-year Projection</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-2xl font-semibold">
                {(totalAPY && balance) ? `+${(totalAPY * Number(formatUnits(balance, 6))).toFixed(2)}` : <Skeleton className="w-20 h-8 rounded-md" />}
              </Text>
              <Image source={require("@/assets/images/usdc.png")} style={{ width: 16, height: 16 }} />
            </View>
          </View>

          <View className="gap-2.5 bg-card p-6">
            <Text className="text-lg text-primary/50 font-medium">Your fUSDC Balance</Text>
            <View className="flex-row items-center gap-1">
              {isBalanceLoading ? (
                <Skeleton className="w-24 h-8 rounded-md" />
              ) : (
                <Text className="text-2xl font-semibold">
                  {formatUnits(balance ?? BigInt(0), 6)}
                </Text>
              )}
              <Image source={require("@/assets/images/usdc.png")} style={{ width: 16, height: 16 }} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

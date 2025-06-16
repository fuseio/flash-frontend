import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Address } from "viem";
import { useMemo } from "react";
import { Redirect } from "expo-router";

import { DashboardHeader, DashboardHeaderMobile } from "@/components/Dashboard";
import FAQ from "@/components/FAQ";
import SavingCountUp from "@/components/SavingCountUp";
import Transaction from "@/components/Transaction";
import { Image } from "@/components/ui/Image";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import faqs from "@/constants/faqs";
import { useGetUserTransactionsQuery } from "@/graphql/generated/user-info";
import {
  formatTransactions,
  useLatestTokenTransfer,
  useTotalAPY,
} from "@/hooks/useAnalytics";
import { useDimension } from "@/hooks/useDimension";
import useUser from "@/hooks/useUser";
import { useFuseVaultBalance } from "@/hooks/useVault";
import { ADDRESSES } from "@/lib/config";
import { path } from "@/constants/path";

export default function Dashboard() {
  const { user } = useUser();
  const { data: balance, isLoading: isBalanceLoading } = useFuseVaultBalance(
    user?.safeAddress as Address
  );
  const { data: totalAPY, isLoading: isTotalAPYLoading } = useTotalAPY();
  const { data: lastTimestamp } = useLatestTokenTransfer(
    user?.safeAddress ?? "",
    ADDRESSES.fuse.vault
  );
  const { data: userTransactions, loading: isTransactionsLoading } =
    useGetUserTransactionsQuery({
      variables: {
        address: user?.safeAddress?.toLowerCase() ?? "",
      },
    });
  const transactions = useMemo(
    () => formatTransactions(userTransactions),
    [userTransactions]
  );
  const { isScreenMedium } = useDimension();

  if (user?.isDeposited !== undefined && !user.isDeposited) {
    return <Redirect href={path.HOME} />;
  }

  return (
    <SafeAreaView
      className="bg-background text-foreground flex-1"
      edges={["right", "left", "bottom"]}
    >
      <ScrollView className="flex-1">
        <View className="gap-16 px-4 py-8 md:py-16 w-full max-w-7xl mx-auto">
          {isScreenMedium ? (
            <DashboardHeader />
          ) : (
            <DashboardHeaderMobile
              balance={balance ?? 0}
              totalAPY={totalAPY ?? 0}
              lastTimestamp={lastTimestamp ?? 0}
            />
          )}
          <View className="web:md:grid web:md:grid-cols-4 border border-border rounded-xl md:rounded-twice overflow-hidden">
            {isScreenMedium && (
              <View className="web:md:col-span-3 web:md:row-span-3 justify-between gap-4 bg-card p-6 md:p-12 border-b border-border md:border-b-0 md:border-r">
                <Text className="text-3xl font-medium">USDC Savings</Text>
                <View className="flex-row items-center gap-4">
                  <Image
                    source={require("@/assets/images/usdc-4x.png")}
                    className="hidden md:block"
                    style={{ width: 76, height: 76 }}
                  />
                  <Image
                    source={require("@/assets/images/usdc.png")}
                    className="block md:hidden"
                    style={{ width: 36, height: 36 }}
                  />
                  <SavingCountUp
                    balance={balance ?? 0}
                    apy={totalAPY ?? 0}
                    lastTimestamp={lastTimestamp ? lastTimestamp / 1000 : 0}
                  />
                </View>
              </View>
            )}

            <View className="gap-2.5 bg-card p-6 border-b border-border">
              <Text className="text-lg text-primary/50 font-medium">APY</Text>
              <Text className="text-2xl text-brand font-semibold">
                {isTotalAPYLoading ? (
                  <Skeleton className="w-20 h-8 rounded-md" />
                ) : totalAPY ? (
                  `${totalAPY.toFixed(2)}%`
                ) : (
                  "0%"
                )}
              </Text>
            </View>

            <View className="gap-2.5 bg-card p-6 border-b border-border">
              <Text className="text-lg text-primary/50 font-medium">
                1-year Projection
              </Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-2xl font-semibold">
                  {isTotalAPYLoading || isBalanceLoading ? (
                    <Skeleton className="w-20 h-8 rounded-md" />
                  ) : totalAPY && balance ? (
                    `+${(totalAPY * balance).toFixed(2)}`
                  ) : (
                    "0"
                  )}
                </Text>
                <Image
                  source={require("@/assets/images/usdc.png")}
                  style={{ width: 16, height: 16 }}
                />
              </View>
            </View>

            <View className="gap-2.5 bg-card p-6">
              <Text className="text-lg text-primary/50 font-medium">
                Your fUSDC Balance
              </Text>
              <View className="flex-row items-center gap-1">
                {isBalanceLoading ? (
                  <Skeleton className="w-24 h-8 rounded-md" />
                ) : (
                  <Text className="text-2xl font-semibold">{balance ?? 0}</Text>
                )}
                <Image
                  source={require("@/assets/images/usdc.png")}
                  style={{ width: 16, height: 16 }}
                />
              </View>
            </View>
          </View>

          <View className="gap-4">
            <Text className="text-2xl font-medium">Recent transactions</Text>
            <View className="gap-2">
              {isTransactionsLoading ? (
                <Skeleton className="w-full h-16 bg-card rounded-xl md:rounded-twice" />
              ) : transactions?.length ? (
                transactions.map((transaction) => (
                  <Transaction key={transaction.timestamp} {...transaction} />
                ))
              ) : (
                <Text className="text-muted-foreground">
                  No transactions found
                </Text>
              )}
            </View>
          </View>

          <View className="flex-col items-center gap-16 w-full max-w-screen-md mx-auto md:mt-20">
            <Text className="text-4.5xl font-semibold max-w-80 text-center">
              Frequently asked questions
            </Text>
            <FAQ faqs={faqs} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

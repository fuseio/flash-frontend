import { Image } from "expo-image";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";
import { Address } from "viem";

import SavingCountUp from "@/components/SavingCountUp";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { path } from "@/constants/path";
import { useLatestTokenTransfer, useTotalAPY, useTransactions } from "@/hooks/useAnalytics";
import useUser from "@/hooks/useUser";
import { ADDRESSES } from "@/lib/config";
import { useVaultBalance } from "@/hooks/useVault";
import Transaction from "@/components/Transaction";

import Deposit from "@/assets/images/deposit";

export default function Dashboard() {
  const { user } = useUser();
  const { data: balance, isLoading: isBalanceLoading } = useVaultBalance(user?.safeAddress as Address)
  const { data: totalAPY, isLoading: isTotalAPYLoading } = useTotalAPY()
  const { data: lastTimestamp } = useLatestTokenTransfer(user?.safeAddress ?? "", ADDRESSES.fuse.vault)
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactions(user?.safeAddress ?? "")

  return (
    <ScrollView className="bg-background text-foreground flex-1">
      <View className="gap-16 px-4 py-8 md:py-16 w-full max-w-7xl mx-auto">
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
          </View>
        </View>

        <View className="web:md:grid web:md:grid-cols-4 border border-border rounded-xl md:rounded-twice overflow-hidden">
          <View className="web:md:col-span-3 web:md:row-span-3 justify-between gap-4 bg-card p-6 md:p-12 border-b border-border md:border-b-0 md:border-r">
            <Text className="text-3xl font-medium">USDC Savings</Text>
            <View className="flex-row items-center gap-4">
              <Image source={require("@/assets/images/usdc-4x.png")} className="hidden md:block" style={{ width: 76, height: 76 }} />
              <Image source={require("@/assets/images/usdc.png")} className="block md:hidden" style={{ width: 36, height: 36 }} />
              <SavingCountUp
                balance={balance ?? 0}
                apy={totalAPY ?? 0}
                lastTimestamp={lastTimestamp ? lastTimestamp / 1000 : 0}
              />
            </View>
          </View>

          <View className="gap-2.5 bg-card p-6 border-b border-border">
            <Text className="text-lg text-primary/50 font-medium">APY</Text>
            <Text className="text-2xl text-brand font-semibold">
              {isTotalAPYLoading ?
                <Skeleton className="w-20 h-8 rounded-md" /> :
                totalAPY ?
                  `${totalAPY.toFixed(2)}%` :
                  "0%"
              }
            </Text>
          </View>

          <View className="gap-2.5 bg-card p-6 border-b border-border">
            <Text className="text-lg text-primary/50 font-medium">1-year Projection</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-2xl font-semibold">
                {(isTotalAPYLoading || isBalanceLoading) ?
                  <Skeleton className="w-20 h-8 rounded-md" /> :
                  (totalAPY && balance) ?
                    `+${(totalAPY * balance).toFixed(2)}` :
                    "0"
                }
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
                  {balance ?? 0}
                </Text>
              )}
              <Image source={require("@/assets/images/usdc.png")} style={{ width: 16, height: 16 }} />
            </View>
          </View>
        </View>

        <View className="gap-4">
          <Text className="text-2xl font-medium">
            Recent transactions
          </Text>
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
      </View>
    </ScrollView>
  );
}

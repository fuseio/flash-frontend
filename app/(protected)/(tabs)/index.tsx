import {DashboardHeader, DashboardHeaderMobile} from "@/components/Dashboard";
import FAQ from "@/components/FAQ";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import Ping from "@/components/Ping";
import SavingCountUp from "@/components/SavingCountUp";
import SavingsEmptyState from "@/components/Savings/EmptyState";
import Transaction from "@/components/Transaction";
import {Skeleton} from "@/components/ui/skeleton";
import {Text} from "@/components/ui/text";
import faqs from "@/constants/faqs";
import {useGetUserTransactionsQuery} from "@/graphql/generated/user-info";
import {
  formatTransactions,
  useLatestTokenTransfer,
  useTotalAPY,
} from "@/hooks/useAnalytics";
import {useDashboardCalculations} from "@/hooks/useDashboardCalculations";
import {useDimension} from "@/hooks/useDimension";
import useUser from "@/hooks/useUser";
import {useFuseVaultBalance} from "@/hooks/useVault";
import {ADDRESSES} from "@/lib/config";
import {useQuery} from "@tanstack/react-query";
import {LinearGradient} from "expo-linear-gradient";
import React, {useEffect} from "react";
import {ImageBackground, ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Address} from "viem";
import {mainnet} from "viem/chains";
import {useBlockNumber} from "wagmi";

export default function Dashboard() {
  const {user} = useUser();
  const {isScreenMedium, isDesktop} = useDimension();
  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
    isRefetching: isBalanceRefetching,
  } = useFuseVaultBalance(user?.safeAddress as Address);

  const {data: blockNumber} = useBlockNumber({
    watch: true,
    chainId: mainnet.id,
  });

  const {data: totalAPY, isLoading: isTotalAPYLoading} = useTotalAPY();
  const {data: lastTimestamp} = useLatestTokenTransfer(
    user?.safeAddress ?? "",
    ADDRESSES.fuse.vault
  );

  const {
    data: userDepositTransactions,
    loading: isTransactionsLoading,
    refetch: refetchTransactions,
  } = useGetUserTransactionsQuery({
    variables: {
      address: user?.safeAddress?.toLowerCase() ?? "",
    },
  });

  const {
    data: transactions,
    isLoading: isFormattingTransactions,
    refetch: refetchFormattedTransactions,
  } = useQuery({
    queryKey: ["formatted-transactions", userDepositTransactions],
    queryFn: () => formatTransactions(userDepositTransactions),
    enabled: !!userDepositTransactions,
  });

  const {originalDepositAmount, firstDepositTimestamp} =
    useDashboardCalculations(userDepositTransactions, balance, lastTimestamp);

  useEffect(() => {
    refetchBalance();
    refetchTransactions();
    refetchFormattedTransactions();
  }, [blockNumber]);

  if (isBalanceLoading || isTransactionsLoading) {
    return <Loading />;
  }

  if (!balance && !userDepositTransactions?.deposits?.length) {
    return <SavingsEmptyState />;
  }

  return (
    <>
      {!isDesktop && <NavbarMobile />}
      <SafeAreaView
        className="bg-background text-foreground flex-1"
        edges={["right", "left", "bottom"]}
      >
        <ScrollView className="flex-1">
          {isDesktop && <Navbar />}
          <View className="gap-16 px-4 py-8 w-full max-w-7xl mx-auto">
            {isScreenMedium ? (
              <DashboardHeader />
            ) : (
              <DashboardHeaderMobile
                balance={balance ?? 0}
                totalAPY={totalAPY ?? 0}
                lastTimestamp={firstDepositTimestamp ?? 0}
                principal={originalDepositAmount}
              />
            )}
            <LinearGradient
              colors={["rgba(126, 126, 126, 0.3)", "rgba(126, 126, 126, 0.2)"]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className="web:md:flex web:md:flex-row rounded-xl md:rounded-twice overflow-hidden"
            >
              <ImageBackground
                source={require("@/assets/images/solid-black-large.png")}
                resizeMode="contain"
                className="flex-1"
                imageStyle={{
                  width: 461,
                  height: 625,
                  marginTop: -100,
                  marginRight: 50,
                  marginLeft: "auto",
                }}
              >
                <View className="flex-1 bg-transparent p-6 md:px-10 md:py-8 justify-between gap-4 border-b border-border md:border-b-0 md:border-r">
                  <View>
                    <Text className="text-lg text-primary/50 font-medium">
                      Total value
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-5xl md:text-8xl text-foreground font-semibold">
                        $
                      </Text>
                      <SavingCountUp
                        balance={balance ?? 0}
                        apy={totalAPY ?? 0}
                        lastTimestamp={firstDepositTimestamp ?? 0}
                        principal={originalDepositAmount}
                        mode="total"
                        classNames={{
                          wrapper: "text-foreground",
                          decimalSeparator:
                            "text-2xl md:text-4.5xl font-medium",
                        }}
                        styles={{
                          wholeText: {
                            fontSize: isDesktop ? 96 : 48,
                            fontWeight: isDesktop ? "medium" : "semibold",
                            color: "#ffffff",
                            marginRight: -5,
                          },
                          decimalText: {
                            fontSize: isDesktop ? 40 : 24,
                            fontWeight: isDesktop ? "medium" : "semibold",
                            color: "#ffffff",
                          },
                        }}
                      />
                    </View>
                  </View>
                  <View className="gap-1">
                    <Text className="text-lg text-primary/50 font-medium">
                      Interest earned
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-2xl md:text-4.5xl font-medium">
                        $
                      </Text>
                      <SavingCountUp
                        balance={balance ?? 0}
                        apy={totalAPY ?? 0}
                        lastTimestamp={firstDepositTimestamp ?? 0}
                        principal={originalDepositAmount}
                        mode="interest-only"
                        decimalPlaces={8}
                        classNames={{
                          decimalSeparator: "md:text-xl font-medium",
                        }}
                        styles={{
                          wholeText: {
                            fontSize: isDesktop ? 40 : 24,
                            fontWeight: "bold",
                            color: "#ffffff",
                          },
                          decimalText: {
                            fontSize: isDesktop ? 20 : 16,
                            color: "#ffffff",
                          },
                        }}
                      />
                    </View>
                  </View>
                </View>
              </ImageBackground>

              <View className="web:md:w-80 bg-transparent p-6 md:p-6 justify-center gap-8">
                <View>
                  <Text className="text-lg text-primary/50 font-medium">
                    Current Yield
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-2xl text-brand font-semibold">
                      {isTotalAPYLoading ? (
                        <Skeleton className="w-20 h-8 rounded-md" />
                      ) : totalAPY ? (
                        `${totalAPY.toFixed(1)}%`
                      ) : (
                        "0%"
                      )}
                    </Text>
                    <Ping />
                  </View>
                </View>

                <View className="border-t border-border/50 -mx-6 md:-mx-6" />

                <View>
                  <Text className="text-lg text-primary/50 font-medium">
                    Total deposited
                  </Text>
                  <Text className="text-2xl font-semibold">
                    {isBalanceLoading && !isBalanceRefetching ? (
                      <Skeleton className="w-24 h-8 bg-primary/10 rounded-twice" />
                    ) : (
                      `$${originalDepositAmount.toLocaleString()}`
                    )}
                  </Text>
                </View>

                <View className="border-t border-border/50 -mx-6 md:-mx-6" />

                <View>
                  <Text className="text-lg text-primary/50 font-medium">
                    Total earned
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-semibold">$</Text>
                    {(isTotalAPYLoading || isBalanceLoading) &&
                    !isBalanceRefetching ? (
                      <Skeleton className="w-20 h-8 bg-primary/10 rounded-twice" />
                    ) : (
                      <SavingCountUp
                        balance={balance ?? 0}
                        apy={totalAPY ?? 0}
                        lastTimestamp={firstDepositTimestamp ?? 0}
                        principal={originalDepositAmount}
                        mode="total"
                        styles={{
                          wholeText: {
                            fontSize: 24,
                            fontWeight: "semibold",
                            color: "#ffffff",
                          },
                          decimalText: {
                            fontSize: 16,
                            color: "#ffffff",
                          },
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>

            <View className="gap-4">
              <Text className="text-2xl font-medium">Recent transactions</Text>
              <View className="gap-2">
                {isTransactionsLoading || isFormattingTransactions ? (
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

            <View className="flex-col items-center gap-12 w-full max-w-screen-md mx-auto md:mt-20">
              <Text className="text-3xl font-semibold">
                Frequently asked questions
              </Text>
              <FAQ faqs={faqs} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

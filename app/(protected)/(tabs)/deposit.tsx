import { Image } from "expo-image";
import { Fuel } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { formatUnits, parseUnits } from "viem";

import { CheckConnectionWrapper } from "@/components/CheckConnectionWrapper";
import TokenCard from "@/components/TokenCard";
import TokenDetail from "@/components/TokenCard/TokenDetail";
import TokenDetails from "@/components/TokenCard/TokenDetails";
import TokenDivider from "@/components/TokenCard/TokenDivider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useTotalAPY } from "@/hooks/useAnalytics";
import useDeposit from "@/hooks/useDeposit";
import { Status } from "@/lib/types";
import { compactNumberFormat } from "@/lib/utils";

export default function Deposit() {
  const [amount, setAmount] = useState<string>("");
  const { balance, deposit, depositStatus } = useDeposit();
  const isLoading = depositStatus === Status.PENDING;
  const { data: totalAPY } = useTotalAPY();

  const amountWei = parseUnits(amount, 6);
  const formattedBalance = balance ? formatUnits(balance, 6) : "0";

  const getButtonText = () => {
    if (!amount) return "Enter an amount";
    if (
      !balance ||
      balance < amountWei
      // || balance < parseUnits(costInUsd.toFixed(3), 6)
    )
      return "Insufficient balance";
    if (depositStatus === Status.PENDING) return "Depositing";
    if (depositStatus === Status.ERROR) return "Error while depositing";
    if (depositStatus === Status.SUCCESS) return "Successfully deposited";
    return "Deposit";
  };

  const handleClick = async () => {
    if (!amount) return;
    if (!balance || balance < amountWei) return;
    await deposit(amount);
  };

  return (
    <ScrollView className="bg-background text-foreground flex-1">
      <View className="w-full max-w-2xl mx-auto gap-16 px-4 py-8 md:py-16">
        <View className="gap-4">
          <Text className="text-4.5xl font-semibold">
            Deposit to your saving account
          </Text>
          <Text className="text-xl opacity-50 max-w-md">
            Earn yield on your Earn yield on your Earn yield on your Earn yield
            on your Earn yield on your
          </Text>
        </View>
        <View className="gap-4">
          <View className="gap-1">
            <TokenCard
              amount={amount}
              onAmountChange={setAmount}
              balance={formattedBalance}
              price={1}
            />
            <TokenDivider />
            <TokenDetails>
              <TokenDetail className="md:flex-row md:items-center gap-4 md:gap-10">
                <Text className="text-lg opacity-40 md:w-40">
                  You will receive
                </Text>
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require("@/assets/images/usdc.png")}
                    style={{ width: 34, height: 34 }}
                    contentFit="contain"
                  />
                  <Text className="text-2xl font-semibold">
                    {compactNumberFormat(Number(amount))} fUSDC
                  </Text>
                  {/* <Text className="text-lg opacity-40 text-right">
                    {`(${compactNumberFormat(costInUsd)} USDC in fee)`}
                  </Text> */}
                </View>
              </TokenDetail>
              <TokenDetail className="md:flex-row md:items-center gap-4 md:gap-10">
                <Text className="text-lg opacity-40 md:w-40">APY</Text>
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-2xl font-semibold">
                    {totalAPY ? (
                      `${totalAPY.toFixed(2)}%`
                    ) : (
                      <Skeleton className="w-20 h-8" />
                    )}
                  </Text>
                  <Text className="text-sm opacity-40">
                    {totalAPY ? (
                      `Earn ~${compactNumberFormat(
                        Number(amount) * (totalAPY / 100)
                      )} USDC/year`
                    ) : (
                      <Skeleton className="w-20 h-6" />
                    )}
                  </Text>
                </View>
              </TokenDetail>
            </TokenDetails>
          </View>
          <View className="gap-2">
            <CheckConnectionWrapper props={{ size: "xl" }}>
              <Button
                variant="brand"
                className="rounded-2xl h-12"
                onPress={handleClick}
                disabled={
                  !amount || !balance || balance < amountWei || isLoading
                }
              >
                <Text className="text-lg font-semibold">{getButtonText()}</Text>
              </Button>
            </CheckConnectionWrapper>
            <View className="flex-row items-center self-end gap-1">
              <Fuel size={14} />
              <Text className="text-sm text-muted-foreground">
                Gaslesss
                {/* {`~ $${
                  loading ? "..." : costInUsd.toFixed(2)
                } in gas payable in USDC`} */}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Fuel, Wallet } from "lucide-react-native"
import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ActivityIndicator, TextInput, View } from "react-native"
import { formatUnits } from "viem"
import { useWaitForTransactionReceipt } from "wagmi"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { useTotalAPY } from "@/hooks/useAnalytics"
import useDepositFromEOA from "@/hooks/useDepositFromEOA"
import { useDimension } from "@/hooks/useDimension"
import { useEstimateDepositGas } from "@/hooks/useEstimateDepositGas"
import { Status } from "@/lib/types"
import { cn, compactNumberFormat, formatNumber } from "@/lib/utils"
import { CheckConnectionWrapper } from "../CheckConnectionWrapper"
import TokenDetails from "../TokenCard/TokenDetails"
import { Skeleton } from "../ui/skeleton"
import { Text } from "../ui/text"

function DepositToVaultForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const { balance, deposit, depositStatus, error, hash } = useDepositFromEOA();
  const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransactionReceipt({ hash });

  const isLoading = depositStatus === Status.PENDING || isPending;
  const { data: totalAPY } = useTotalAPY();
  const { isDesktop } = useDimension();
  const { costInUsd, loading } = useEstimateDepositGas();

  const formattedBalance = balance ? formatUnits(balance, 6) : "0";

  // Create dynamic schema based on balance
  const depositSchema = useMemo(() => {
    const balanceAmount = balance ? Number(formatUnits(balance, 6)) : 0;

    return z.object({
      amount: z
        .string()
        .refine((val) => val !== "" && !isNaN(Number(val)), "Please enter a valid amount")
        .refine((val) => Number(val) > 0, "Amount must be greater than 0")
        .refine((val) => Number(val) <= balanceAmount, `Available balance is ${formatNumber(balanceAmount, 4)} USDC`)
        .transform((val) => Number(val)),
    });
  }, [balance]);

  type DepositFormData = { amount: string };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema) as any,
    mode: "onChange",
    defaultValues: {
      amount: '',
    },
  });

  const watchedAmount = watch("amount");

  const getButtonText = () => {
    if (errors.amount) return errors.amount.message;
    if (depositStatus === Status.PENDING) return "Check Wallet";
    if (isPending) return "Depositing...";
    if (isSuccess) return "Successfully deposited!";
    if (depositStatus === Status.ERROR) return error || "Error while depositing";
    if (!isValid || !watchedAmount) return "Enter an amount";
    return "Deposit";
  };

  const onSubmit = async (data: DepositFormData) => {
    try {
      await deposit(data.amount.toString());
    } catch (error) {
      // handled by hook
    }
  };

  useEffect(() => {
    if (isSuccess) {
      reset(); // Reset form after successful transaction
      setTimeout(() => setOpen(false), 2000);
    }
  }, [isSuccess, reset, setOpen]);

  const isFormDisabled = () => {
    return (
      isLoading ||
      !isValid ||
      !watchedAmount
    );
  };

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-muted-foreground mt-5">You're depositing</Text>
        <View className="px-2 py-4 bg-qr-background rounded-2xl flex-row items-center justify-between w-full">
          <View className="flex-1 min-w-0">
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType="decimal-pad"
                  className="text-2xl text-white font-semibold web:focus:outline-none"
                  value={value.toString()}
                  placeholder="0.0"
                  placeholderTextColor="#666"
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          <View className="items-end flex-shrink-0">
            <View className="flex-row items-center gap-2">
              <Image
                source={require("@/assets/images/usdc.png")}
                alt="USDC"
                style={{ width: 24, height: 24 }}
              />
              <Text className="font-semibold text-white text-lg">USDC</Text>
            </View>
          </View>
        </View>
        <Text
          className="flex items-center gap-2 text-muted-foreground text-left"
        >
          <Wallet size={16} /> {formatNumber(Number(formattedBalance), 6)} USDC
        </Text>
      </View>
      <View className="gap-1">
        <TokenDetails>
          <View className={cn("p-6 md:p-5", "md:flex-row md:items-center gap-4 md:gap-10")}>
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
                {compactNumberFormat(Number(watchedAmount))} soUSD
              </Text>
              {/* <Text className="text-lg opacity-40 text-right">
                      {`(${compactNumberFormat(costInUsd)} USDC in fee)`}
                    </Text> */}
            </View>
          </View>
          <View className={cn("p-6 md:p-5", "md:flex-row md:items-center gap-4 md:gap-10")}>
            <Text className="text-lg opacity-40 md:w-40">APY</Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-2xl font-semibold text-[#94F27F]">
                {totalAPY ? (
                  `${totalAPY.toFixed(2)}%`
                ) : (
                  <Skeleton className="w-20 h-8" />
                )}
              </Text>
              {/* <Text className="text-base opacity-40">
                  {totalAPY ? (
                    `Earn ~${compactNumberFormat(
                      Number(watchedAmount) * (totalAPY / 100)
                    )} USDC/year`
                  ) : (
                    <Skeleton className="w-20 h-6" />
                  )}
                </Text> */}
            </View>
          </View>
        </TokenDetails>
      </View>
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1 pb-5 pt-2">
            <Fuel color="white" size={18} />
            <Text className="text-base text-white">Fee</Text>
          </View>
          <Text className="text-base text-muted-foreground">
            {`~ $${loading ? "..." : formatNumber(costInUsd, 2)
              } USDC in fee`}
          </Text>
        </View>
        <CheckConnectionWrapper props={{ size: "xl" }}>
          <Button
            variant="brand"
            className="rounded-2xl h-12"
            onPress={handleSubmit(onSubmit)}
            disabled={isFormDisabled()}
          >
            <Text className="text-lg font-semibold">
              {getButtonText()}
            </Text>
            {isLoading && (
              <ActivityIndicator color="gray" />
            )}
          </Button>
        </CheckConnectionWrapper>
      </View>
    </View>
  )
}

export default DepositToVaultForm;

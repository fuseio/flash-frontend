import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, Linking, TextInput, View } from "react-native";
import Toast from 'react-native-toast-message';
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/useUser";
import ERC20_ABI from "@/lib/abis/ERC20";
import { Status } from "@/lib/types";
import { Address } from "abitype";
import { Skeleton } from "../ui/skeleton";

import useWithdrawToAddress from "@/hooks/useWithdrawToAddress";
import { ADDRESSES } from "@/lib/config";
import { formatNumber } from "@/lib/utils";
import { useRouter } from "expo-router";
import { ArrowUpRight } from "lucide-react-native";
import { useMemo } from "react";
import { formatUnits, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { useReadContract } from "wagmi";

const WithdrawToAddress = () => {
  const router = useRouter();
  const { user } = useUser();

  const { data: balance, isPending } = useReadContract({
    abi: ERC20_ABI,
    address: ADDRESSES.ethereum.usdc,
    functionName: "balanceOf",
    args: [user?.safeAddress as Address],
    chainId: mainnet.id,
    query: {
      enabled: !!user?.safeAddress,
    },
  });

  // Create dynamic schema based on balance
  const withdrawSchema = useMemo(() => {
    const balanceAmount = balance ? Number(formatUnits(balance, 6)) : 0;
    return z.object({
      amount: z
        .string()
        .refine((val) => val !== "" && !isNaN(Number(val)), "Please enter a valid amount")
        .refine((val) => Number(val) > 0, "Amount must be greater than 0")
        .refine((val) => Number(val) <= balanceAmount, `Available balance is ${formatNumber(balanceAmount, 4)} USDC`)
        .transform((val) => Number(val)),
      address: z
        .string()
        .refine(isAddress, "Please enter a valid Ethereum address")
        .transform(value => value.toLowerCase()),
    });
  }, [balance]);

  type WithdrawFormData = { amount: string; address: string };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawSchema) as any,
    mode: "onChange",
    defaultValues: {
      amount: "",
      address: "",
    },
  });

  const watchedAmount = watch("amount");

  const { withdrawToAddress, withdrawStatus } = useWithdrawToAddress();
  const isWithdrawLoading = withdrawStatus === Status.PENDING;

  const getWithdrawText = () => {
    if (errors.amount) return errors.amount.message;
    if (errors.address) return errors.address.message;
    if (withdrawStatus === Status.PENDING) return "Withdrawing";
    if (withdrawStatus === Status.ERROR) return "Error while Withdrawing";
    if (withdrawStatus === Status.SUCCESS) return "Withdrawal Successful";
    if (!isValid) return "Please complete the form";
    return "Withdraw";
  };

  const onSubmit = async (data: WithdrawFormData) => {
    try {
      const transaction = await withdrawToAddress(data.amount.toString(), data.address as Address);
      reset(); // Reset form after successful transaction
      Toast.show({
        type: 'success',
        text1: 'Withdrawal transaction completed',
        text2: 'Click to view on block explorer',
        onPress: () => {
          Linking.openURL(`https://etherscan.io/tx/${transaction.transactionHash}`);
        },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error while withdrawing',
      });
    }
  };

  const isFormDisabled = () => {
    return (
      isWithdrawLoading ||
      !isValid
    );
  };

  return (
    <View className="flex-col gap-6 p-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="opacity-60">Withdraw amount</Text>
        <Text className="text-sm opacity-60">Balance: {
          isPending ? (
            <Skeleton className="w-16 h-4 rounded-md" />
          ) : balance ? (
            `${formatUnits(balance, 6)} USDC`
          ) : (
            "0 USDC"
          )
        }</Text>
      </View>

      <View className={`bg-primary/10 rounded-2xl p-4 w-full ${errors.amount ? 'border border-red-500' : ''}`}>
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-1 min-w-0">
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType="decimal-pad"
                  className="text-4xl text-white font-light web:focus:outline-none"
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
            <Text className="text-xs opacity-60 mt-1">On ethereum</Text>
          </View>
        </View>
      </View>

      {/* {errors.amount && (
        <Text className="text-red-400 text-sm mt-1">{errors.amount.message}</Text>
      )} */}

      <View className="mt-4">
        <Text className="opacity-60 mb-3">Address</Text>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`bg-primary/10 rounded-2xl p-4 text-white web:focus:outline-none ${errors.address ? 'border border-red-500' : ''}`}
              value={value}
              placeholder="0x..."
              placeholderTextColor="#666"
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {/* {errors.address && (
          <Text className="text-red-400 text-sm mt-2">{errors.address.message}</Text>
        )} */}
      </View>

      <Button
        variant="brand"
        className="w-full rounded-2xl mt-6 bg-green-500 h-14"
        onPress={handleSubmit(onSubmit)}
        disabled={isFormDisabled()}
      >
        <Text className="font-semibold text-black text-lg">{getWithdrawText()}</Text>
        {isWithdrawLoading && <ActivityIndicator color="black" />}
      </Button>
    </View>
  );
};

const WithdrawTrigger = (props: any) => {
  return (
    <Button
      variant="outline"
      className={buttonVariants({ variant: "secondary", className: "h-12 rounded-xl" })}
      {...props}
    >
      <View className="flex-row items-center gap-2">
        {/* <WithdrawIcon className="size-6" /> */}
        <ArrowUpRight color="white" />
        <Text className="font-bold hidden md:block">Withdraw</Text>
      </View>
    </Button>
  );
};

const WithdrawTitle = () => {
  return <Text className="text-lg font-semibold">Withdraw</Text>;
};

export { WithdrawTitle, WithdrawToAddress, WithdrawTrigger };


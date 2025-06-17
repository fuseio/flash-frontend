import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, Linking, TextInput, View } from "react-native";
import Toast from 'react-native-toast-message';
import * as yup from "yup";

import { Button, buttonVariants } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/useUser";
import ERC20_ABI from "@/lib/abis/ERC20";
import { Status } from "@/lib/types";
import { Address } from "abitype";
import { Skeleton } from "../ui/skeleton";

import useWithdrawToAddress from "@/hooks/useWithdrawToAddress";
import { ADDRESSES } from "@/lib/config";
import { ArrowUpRight } from "lucide-react-native";
import { useMemo } from "react";
import { formatUnits, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { useReadContract } from "wagmi";

const WithdrawToAddress = () => {
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

    return yup.object().shape({
      amount: yup
        .number()
        .max(balanceAmount, `Available balance is ${balanceAmount.toFixed(6)} USDC`)
        .required("Amount is required")
        .test("is-positive", "Amount must be greater than 0", (value) => {
          return value > 0;
        })
        .test("is-number", "Please enter a valid number", (value) => {
          return !isNaN(value);
        }),
      address: yup
        .string()
        .required("Address is required")
        .test("is-valid-address", "Please enter a valid Ethereum address", (value) => {
          return value ? isAddress(value) : false;
        }),
    });
  }, [balance]);

  type WithdrawFormData = yup.InferType<typeof withdrawSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<WithdrawFormData>({
    resolver: yupResolver(withdrawSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      address: "",
    },
  });

  const watchedAmount = watch("amount");

  const { withdrawToAddress, withdrawStatus } = useWithdrawToAddress();
  const isWithdrawLoading = withdrawStatus === Status.PENDING;

  // Additional validation for balance
  const hasInsufficientBalance = () => {
    if (!balance || !watchedAmount) return false;
    const balanceAmount = Number(formatUnits(balance, 6));
    const requestedAmount = watchedAmount;
    return requestedAmount > balanceAmount;
  };

  const getWithdrawText = () => {
    if (errors.amount) return errors.amount.message;
    if (errors.address) return errors.address.message;
    if (hasInsufficientBalance()) return "Insufficient balance";
    if (withdrawStatus === Status.PENDING) return "Withdrawing";
    if (withdrawStatus === Status.ERROR) return "Error while Withdrawing";
    if (withdrawStatus === Status.SUCCESS) return "Withdrawal Successful";
    if (!isValid) return "Please complete the form";
    return "Withdraw";
  };

  const onSubmit = async (data: WithdrawFormData) => {
    if (hasInsufficientBalance()) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient balance',
      });
      return;
    }

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
      !isValid ||
      hasInsufficientBalance()
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

      <View className={`bg-gray-800 rounded-2xl p-4 w-full ${errors.amount ? 'border border-red-500' : ''}`}>
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-1 min-w-0">
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType="numeric"
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
              className={`bg-gray-800 rounded-2xl p-4 text-white web:focus:outline-none ${errors.address ? 'border border-red-500' : ''}`}
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


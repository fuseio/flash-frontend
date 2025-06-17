import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, Linking, TextInput, View } from "react-native";
import Toast from 'react-native-toast-message';
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useBridgeToMainnet from "@/hooks/useBridgeToMainnet";
import useUser from "@/hooks/useUser";
import { useEthereumVaultBalance, useFuseVaultBalance } from "@/hooks/useVault";
import useWithdraw from "@/hooks/useWithdraw";
import { Status } from "@/lib/types";
import { Address } from "abitype";
import { Skeleton } from "../ui/skeleton";

import WithdrawIcon from "@/assets/images/withdraw";

const Withdraw = () => {
  const { user } = useUser();

  const { data: fuseBalance, isLoading: isFuseBalanceLoading } =
    useFuseVaultBalance(user?.safeAddress as Address);

  const { data: ethereumBalance, isLoading: isEthereumBalanceLoading } =
    useEthereumVaultBalance(user?.safeAddress as Address);

  // Create dynamic schema for bridge form based on fuse balance
  const bridgeSchema = useMemo(() => {
    const balanceAmount = fuseBalance || 0;

    return yup.object().shape({
      amount: yup
        .number()
        .max(balanceAmount, `Available balance is ${balanceAmount.toFixed(6)} soUSD`)
        .required("Amount is required")
        .test("is-positive", "Amount must be greater than 0", (value) => {
          return value > 0;
        })
        .test("is-number", "Please enter a valid number", (value) => {
          return !isNaN(value);
        }),
    });
  }, [fuseBalance]);

  // Create dynamic schema for withdraw form based on ethereum balance
  const withdrawSchema = useMemo(() => {
    const balanceAmount = ethereumBalance || 0;

    return yup.object().shape({
      amount: yup
        .number()
        .max(balanceAmount, `Available balance is ${balanceAmount.toFixed(6)} soUSD`)
        .required("Amount is required")
        .test("is-positive", "Amount must be greater than 0", (value) => {
          return value > 0;
        })
        .test("is-number", "Please enter a valid number", (value) => {
          return !isNaN(value);
        }),
    });
  }, [ethereumBalance]);

  type BridgeFormData = yup.InferType<typeof bridgeSchema>;
  type WithdrawFormData = yup.InferType<typeof withdrawSchema>;

  // Bridge form setup
  const {
    control: bridgeControl,
    handleSubmit: handleBridgeSubmit,
    formState: { errors: bridgeErrors, isValid: isBridgeValid },
    watch: watchBridge,
    reset: resetBridge,
  } = useForm<BridgeFormData>({
    resolver: yupResolver(bridgeSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
    },
  });

  // Withdraw form setup
  const {
    control: withdrawControl,
    handleSubmit: handleWithdrawSubmit,
    formState: { errors: withdrawErrors, isValid: isWithdrawValid },
    watch: watchWithdraw,
    reset: resetWithdraw,
  } = useForm<WithdrawFormData>({
    resolver: yupResolver(withdrawSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
    },
  });

  const watchedBridgeAmount = watchBridge("amount");
  const watchedWithdrawAmount = watchWithdraw("amount");

  const { bridge, bridgeStatus } = useBridgeToMainnet();
  const isBridgeLoading = bridgeStatus === Status.PENDING;

  const { withdraw, withdrawStatus } = useWithdraw();
  const isWithdrawLoading = withdrawStatus === Status.PENDING;

  // Additional validation for bridge balance
  const hasBridgeInsufficientBalance = () => {
    if (!fuseBalance || !watchedBridgeAmount) return false;
    return watchedBridgeAmount > fuseBalance;
  };

  // Additional validation for withdraw balance
  const hasWithdrawInsufficientBalance = () => {
    if (!ethereumBalance || !watchedWithdrawAmount) return false;
    return watchedWithdrawAmount > ethereumBalance;
  };

  const getBridgeText = () => {
    if (bridgeErrors.amount) return bridgeErrors.amount.message;
    if (hasBridgeInsufficientBalance()) return "Insufficient balance";
    if (bridgeStatus === Status.PENDING) return "Bridging";
    if (bridgeStatus === Status.ERROR) return "Error while bridging";
    if (bridgeStatus === Status.SUCCESS) return "Successfully Bridged";
    if (!isBridgeValid || !watchedBridgeAmount) return "Enter an amount";
    return "Bridge to Ethereum";
  };

  const getWithdrawText = () => {
    if (withdrawErrors.amount) return withdrawErrors.amount.message;
    if (hasWithdrawInsufficientBalance()) return "Insufficient balance";
    if (withdrawStatus === Status.PENDING) return "Withdrawing";
    if (withdrawStatus === Status.ERROR) return "Error while Withdrawing";
    if (withdrawStatus === Status.SUCCESS) return "Withdrawal Successful";
    if (!isWithdrawValid || !watchedWithdrawAmount) return "Enter an amount";
    return "Withdraw";
  };

  const onBridgeSubmit = async (data: BridgeFormData) => {
    if (hasBridgeInsufficientBalance()) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient balance',
      });
      return;
    }

    try {
      const transaction = await bridge(data.amount.toString());
      resetBridge(); // Reset form after successful transaction
      Toast.show({
        type: 'success',
        text1: 'Bridge transaction submitted',
        text2: 'Click to view on LayerZero Scan',
        onPress: () => {
          Linking.openURL(`https://layerzeroscan.com/tx/${transaction.transactionHash}`);
        },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error while bridging',
      });
    }
  };

  const onWithdrawSubmit = async (data: WithdrawFormData) => {
    if (hasWithdrawInsufficientBalance()) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient balance',
      });
      return;
    }

    try {
      await withdraw(data.amount.toString());
      resetWithdraw(); // Reset form after successful transaction
      Toast.show({
        type: 'success',
        text1: 'Withdrawal transaction completed',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error while withdrawing',
      });
    }
  };

  const isBridgeFormDisabled = () => {
    return (
      isBridgeLoading ||
      !isBridgeValid ||
      hasBridgeInsufficientBalance() ||
      !watchedBridgeAmount
    );
  };

  const isWithdrawFormDisabled = () => {
    return (
      isWithdrawLoading ||
      !isWithdrawValid ||
      hasWithdrawInsufficientBalance() ||
      !watchedWithdrawAmount
    );
  };

  return (
    <View className="flex-col gap-4 min-h-64 md:min-h-72">
      <View className="flex-row justify-between items-center">
        <Text className="opacity-40">Fuse Balance</Text>
        <Text className="opacity-40">
          Balance:{" "}
          {isFuseBalanceLoading ? (
            <Skeleton className="w-20 h-8 rounded-md" />
          ) : fuseBalance ? (
            `${fuseBalance.toFixed(2)}`
          ) : (
            "0"
          )}
        </Text>
      </View>
      <View className={`bg-primary/10 rounded-2xl p-4 ${bridgeErrors.amount ? 'border border-red-500' : ''}`}>
        <View className="flex-row justify-between items-center gap-2">
          <Controller
            control={bridgeControl}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                keyboardType="numeric"
                className="w-full text-2xl md:text-3xl text-primary font-semibold web:focus:outline-none"
                value={value.toString()}
                placeholder="0.0"
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                onBlur={onBlur}
              />
            )}
          />
          <View className="flex-row items-center gap-2">
            <Image
              source={require("@/assets/images/usdc.png")}
              alt="USDC"
              style={{ width: 34, height: 34 }}
            />
            <View className="flex-col items-start">
              <Text className="font-bold">soUSD</Text>
              <Text className="text-xs opacity-40">On Fuse</Text>
            </View>
          </View>
        </View>
        <Button
          variant="brand"
          className="w-full rounded-xl mt-4"
          onPress={handleBridgeSubmit(onBridgeSubmit)}
          disabled={isBridgeFormDisabled()}
        >
          <Text className="font-bold">{getBridgeText()}</Text>
          {isBridgeLoading && <ActivityIndicator color="gray" />}
        </Button>
      </View>

      <View className="mt-5 flex-row justify-between items-center">
        <Text className="opacity-40">Ethereum Balance</Text>
        <Text className="opacity-40">
          Balance:{" "}
          {isEthereumBalanceLoading ? (
            <Skeleton className="w-20 h-8 rounded-md" />
          ) : ethereumBalance ? (
            `${ethereumBalance.toFixed(2)}`
          ) : (
            "0"
          )}
        </Text>
      </View>
      <View className={`bg-primary/10 rounded-2xl p-4 ${withdrawErrors.amount ? 'border border-red-500' : ''}`}>
        <View className="flex-row justify-between items-center gap-2">
          <Controller
            control={withdrawControl}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                keyboardType="numeric"
                className="w-full text-2xl md:text-3xl text-primary font-semibold web:focus:outline-none"
                value={value.toString()}
                placeholder="0.0"
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                onBlur={onBlur}
              />
            )}
          />
          <View className="flex-row items-center gap-2">
            <Image
              source={require("@/assets/images/usdc.png")}
              alt="USDC"
              style={{ width: 34, height: 34 }}
            />
            <View className="flex-col items-start">
              <Text className="font-bold">soUSD</Text>
              <Text className="text-xs opacity-40">On Ethereum</Text>
            </View>
          </View>
        </View>
        <Button
          variant="brand"
          className="w-full rounded-xl mt-4"
          onPress={handleWithdrawSubmit(onWithdrawSubmit)}
          disabled={isWithdrawFormDisabled()}
        >
          <Text className="font-bold">{getWithdrawText()}</Text>
          {isWithdrawLoading && <ActivityIndicator color="gray" />}
        </Button>
      </View>
    </View>
  );
};

const WithdrawTrigger = (props: any) => {
  return (
    <Button
      variant="outline"
      className="flex-col items-center gap-3 w-28 h-20 rounded-xl md:rounded-twice"
      {...props}
    >
      <WithdrawIcon className="size-6" />
      <Text className="font-semibold">Withdraw</Text>
    </Button>
  );
};

const WithdrawTitle = () => {
  return <Text className="text-lg font-semibold">Withdraw</Text>;
};

export { Withdraw, WithdrawTitle, WithdrawTrigger };

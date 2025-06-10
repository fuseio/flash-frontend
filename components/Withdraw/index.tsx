import { useState } from "react";
import { ActivityIndicator, Image, TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import WithdrawIcon from "@/assets/images/withdraw";
import useBridgeToMainnet from "@/hooks/useBridgeToMainnet";
import useUser from "@/hooks/useUser";
import { useEthereumVaultBalance, useFuseVaultBalance } from "@/hooks/useVault";
import useWithdraw from "@/hooks/useWithdraw";
import { Status } from "@/lib/types";
import { Address } from "abitype";
import { Skeleton } from "../ui/skeleton";

const Withdraw = () => {
  const [fuseAmount, setFuseAmount] = useState("");
  const [ethereumAmount, setEthereumAmount] = useState("");
  const { user } = useUser();

  const { data: fuseBalance, isLoading: isFuseBalanceLoading } =
    useFuseVaultBalance(user?.safeAddress as Address);

  const { data: ethereumBalance, isLoading: isEthereumBalanceLoading } =
    useEthereumVaultBalance(user?.safeAddress as Address);

  const { bridge, bridgeStatus } = useBridgeToMainnet();
  const isBridgeLoading = bridgeStatus === Status.PENDING;

  const { withdraw, withdrawStatus } = useWithdraw();
  const isWithdrawLoading = withdrawStatus === Status.PENDING;

  const getBridgeText = () => {
    if (!fuseAmount) return "Enter an amount";
    if (!fuseBalance || fuseBalance < parseFloat(fuseAmount))
      return "Insufficient balance";
    if (bridgeStatus === Status.PENDING) return "Bridging";
    if (bridgeStatus === Status.ERROR) return "Error while bridging";
    if (bridgeStatus === Status.SUCCESS) return "Successfully Bridged";
    return "Bridge to Ethereum";
  };

  const getWithdrawText = () => {
    if (!ethereumAmount) return "Enter an amount";
    if (!ethereumBalance || ethereumBalance < parseFloat(ethereumAmount))
      return "Insufficient balance";
    if (withdrawStatus === Status.PENDING) return "Withdrawing";
    if (withdrawStatus === Status.ERROR) return "Error while Withdrawing";
    if (withdrawStatus === Status.SUCCESS) return "Withdrawal Successful";
    return "Withdraw";
  };

  const handleBridge = async () => {
    await bridge(fuseAmount);
  };

  const handleWithdraw = async () => {
    await withdraw(ethereumAmount);
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
      <View className="bg-primary/10 rounded-2xl p-4">
        <View className="flex-row justify-between items-center gap-2">
          <TextInput
            keyboardType="numeric"
            className="w-full text-2xl md:text-3xl text-primary font-semibold web:focus:outline-none"
            value={fuseAmount}
            placeholder="0.0"
            onChangeText={setFuseAmount}
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
          onPress={handleBridge}
          disabled={
            isBridgeLoading ||
            !fuseAmount ||
            fuseAmount === "0" ||
            parseFloat(fuseAmount) > (fuseBalance || 0)
          }
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
      <View className="bg-primary/10 rounded-2xl p-4">
        <View className="flex-row justify-between items-center gap-2">
          <TextInput
            keyboardType="numeric"
            className="w-full text-2xl md:text-3xl text-primary font-semibold web:focus:outline-none"
            value={ethereumAmount}
            placeholder="0.0"
            onChangeText={setEthereumAmount}
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
          onPress={handleWithdraw}
          disabled={
            isWithdrawLoading ||
            !ethereumAmount ||
            ethereumAmount === "0" ||
            parseFloat(ethereumAmount) > (ethereumBalance || 0)
          }
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

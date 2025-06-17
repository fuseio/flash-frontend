import { useState } from "react";
import { ActivityIndicator, Linking, ScrollView, View } from "react-native";
import { parseUnits } from "viem";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useDeposit from "@/hooks/useDeposit";
import { Status } from "@/lib/types";
import { SendAddressCard, SendAmountCard } from "@/components/Send";

export default function Deposit() {
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { balance, deposit, depositStatus } = useDeposit();
  const isLoading = depositStatus === Status.PENDING;

  const amountWei = parseUnits(amount, 6);

  const getButtonText = () => {
    if (!toAddress) return "Enter an address";
    if (!amount) return "Enter an amount";
    if (!balance || balance < amountWei) return "Insufficient balance";
    if (depositStatus === Status.PENDING) return "Sending";
    if (depositStatus === Status.ERROR) return "Error while sending";
    if (depositStatus === Status.SUCCESS) return "Successfully sent";
    return "Send";
  };

  const handleClick = async () => {
    try {
      if (!amount) return;
      if (!balance || balance < amountWei) return;
      const transaction = await deposit(amount);
      Toast.show({
        type: 'success',
        text1: 'Sent successfully',
        text2: 'Click to view on Etherscan',
        onPress: () => {
          Linking.openURL(`https://etherscan.io/tx/${transaction.transactionHash}`);
        },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error while sending',
      });
    }
  };

  return (
    <SafeAreaView
      className="bg-background text-foreground flex-1"
      edges={['right', 'left', 'bottom']}
    >
      <ScrollView className="flex-1">
        <View className="w-full max-w-2xl mx-auto gap-4 px-4 py-8 md:py-16">
          <SendAddressCard toAddress={toAddress} onChange={setToAddress} />
          <SendAmountCard amount={amount} onChange={setAmount} />
          <View className="gap-2">
            <Button
              variant="brand"
              className="rounded-xl h-12"
              onPress={handleClick}
              disabled={
                !amount || !balance || balance < amountWei || isLoading
              }
            >
              <Text className="text-lg font-semibold">
                {getButtonText()}
              </Text>
              {isLoading && (
                <ActivityIndicator color="gray" />
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

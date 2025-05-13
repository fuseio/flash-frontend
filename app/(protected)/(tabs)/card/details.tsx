import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";

export default function CardDetails() {
  // Mock card data - in a real app this would come from an API or secure storage
  const cardData = {
    balance: "$1,234.56",
    spendableBalance: "$1,234.56",
    status: "Active"
  };

  return (
    <View className="flex-1 bg-background p-6">
      {/* Balance Information */}
      <View className="items-center mb-6">
        <View className="flex-row items-baseline">
          <Text className="text-xl font-semibold">$</Text>
          <Text className="text-[50px] font-semibold">{cardData.balance.substring(1)}</Text>
        </View>
        <Text className="text-base opacity-70 mt-2">Spendable balance</Text>
      </View>
      
      <Button 
        className="rounded-3xl h-14 w-auto self-center mb-6"
      >
        <View className="flex-row">
          <IconSymbol name="plus" color="black" />
          <Text className="font-bold text-base ml-2">Add funds</Text>
        </View>
      </Button>

      <View className="items-center mb-8">
        <Image
          source={require("@/assets/images/card.svg")}
          alt="Flash Card"
          style={{ width: '100%', height: '80%' }}
          contentFit="contain"
        />
      </View>
    </View>
  );
}
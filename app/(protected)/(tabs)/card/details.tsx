import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
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
      <View className="items-center mt-10 mb-6">
        <View className="flex-row items-baseline">
          <Text className="text-xl font-semibold">$</Text>
          <Text className="text-[50px] font-semibold">{cardData.balance.substring(1)}</Text>
        </View>
        <Text className="text-base opacity-70 mt-2">Spendable balance</Text>
      </View>

      <Button
        className="rounded-3xl h-10 w-auto self-center mb-6"
      >
        <View className="flex-row">
          <Plus color="black" />
          <Text className="font-bold text-base ml-2">Add funds</Text>
        </View>
      </Button>

      <View className="items-center mb-8">
        <Image
          source={require("@/assets/images/card.png")}
          alt="Flash Card"
          style={{ width: 800, height: 600 }}
          contentFit="contain"
        />
      </View>

      {/* Circular Action Buttons */}
      <View className="flex-row justify-around items-center w-1/4 self-center">
        <View className="items-center">
          <Button className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200">
            <Image
              source={require("@/assets/images/settings.png")}
              style={{ width: 34, height: 34 }}
            />
          </Button>
          <Text className="text-xs mt-2 text-[#BFBFBF]">Settings</Text>
        </View>
        
        <View className="items-center">
          <Button className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200">
            <Image
              source={require("@/assets/images/limit.png")}
              style={{ width: 34, height: 34 }}
            />
          </Button>
          <Text className="text-xs mt-2 text-[#BFBFBF]">Limit</Text>
        </View>
        
        <View className="items-center">
          <Button className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200">
            <Image
              source={require("@/assets/images/freeze.png")}
              style={{ width: 28, height: 28 }}
            />
          </Button>
          <Text className="text-xs mt-2 text-[#BFBFBF]">Freeze</Text>
        </View>
      </View>
    </View>
  );
}
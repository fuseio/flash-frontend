import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function Card() {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push("/card/details");
  };

  return (
    <View className="flex-1 justify-between items-center p-6 bg-background">
      <View className="mt-4">
        <Text className="text-[36px] font-bold text-center">Introducing the Flash card</Text>
        <Text className="text-[16px] font-medium text-center text-white/70">The world&apos;s first self-custodial{'\n'}Mastercard by Flash</Text>
      </View>
      
      <View className="flex-1 justify-center items-center w-full">
        <Image
          source={require("@/assets/images/card_with_bottom_shadow.png")}
          alt="Flash Card"
          style={{ width: '100%', height: '90%' }}
          contentFit="contain"
        />
      </View>
      
      <View className="w-full space-y-4">
        <Button className="rounded-xl h-14 w-full" onPress={handleViewDetails}>
          <Text className="text-[20px] font-bold">Activate card</Text>
        </Button>
      </View>
    </View>
  )
} 
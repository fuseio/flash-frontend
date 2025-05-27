import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { path } from "@/constants/path";

export default function Card() {
  const router = useRouter();

  const activateCard = async () => {
    router.push(path.CARD_ACTIVATE);
  };

  return (
    <View className="flex-1 justify-between items-center p-6 bg-background">
      <View className="mt-4">
        <Text className="text-4xl font-bold text-center">
          Introducing the Flash card
        </Text>
        <Text className="text-lg mt-2 font-medium text-center text-white/70 leading-[20px]">
          The world&apos;s first self-custodial{"\n"}Mastercard by Flash
        </Text>
      </View>

      <View className="flex-1 justify-center items-center w-full">
        <Image
          source={require("@/assets/images/card_with_bottom_shadow.png")}
          alt="Flash Card"
          style={{ width: "100%", height: "90%" }}
          contentFit="contain"
        />
      </View>

      <View className="w-full space-y-4">
        <Button className="rounded-xl h-14 w-full" onPress={activateCard}>
          <Text className="text-[20px] font-bold">Activate card</Text>
        </Button>
      </View>
    </View>
  );
}

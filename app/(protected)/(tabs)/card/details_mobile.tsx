import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { Pressable, View } from "react-native";

// import Loading from "@/components/Loading";
import CardDetailsIllustration from "@/assets/images/card-details-illustration";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
// import { useCardDetails } from "@/hooks/useCardDetails";

export default function CardDetailsMobile() {
  // const { data: cardDetails, isLoading } = useCardDetails();

  const cardDetails = {
    balances: {
      available: {
        currency: "USD",
        amount: "1000",
      },
    },
  };

  const availableBalance = cardDetails?.balances.available;
  const currency = availableBalance?.currency || "?";
  const currencySymbol = currency === "USD" ? "$" : "€";
  const availableAmount = availableBalance?.amount || "0";

  // if (isLoading) return <Loading />

  return (
    <View className="flex-1 bg-background p-6">
      {/* Balance Information */}
      <View className="items-center mt-2 mb-6">
        <View className="flex-row items-baseline">
          <Text className="text-[50px] font-semibold">
            {currencySymbol}
            {availableAmount}
          </Text>
        </View>
        <Text className="text-base opacity-70">Spendable balance</Text>
      </View>

      <Button className="rounded-3xl h-10 w-auto self-center mb-6">
        <View className="flex-row">
          <Plus color="black" />
          <Text className="font-bold text-base ml-2">Add funds</Text>
        </View>
      </Button>

      <View className="items-center mt-4 mb-8">
        <CardDetailsIllustration />
      </View>

      {/* Circular Action Buttons */}
      <View className="flex-row justify-around items-center w-full self-center p-2">
        <ActionButton
          imageSource={require("@/assets/images/settings.png")}
          label="Settings"
        />

        <ActionButton
          imageSource={require("@/assets/images/limit.png")}
          label="Limit"
        />

        <ActionButton
          imageSource={require("@/assets/images/freeze.png")}
          label="Freeze"
          imageStyle={{ width: 28, height: 28 }}
        />
      </View>
    </View>
  );
}

interface ActionButtonProps {
  imageSource: any;
  label: string;
  imageStyle?: { width: number; height: number };
  onPress?: () => void;
}

const ActionButton = ({
  imageSource,
  label,
  imageStyle = { width: 34, height: 34 },
  onPress,
}: ActionButtonProps) => (
  <View className="items-center">
    <Pressable onPress={onPress} className="rounded-full bg-gray-100 border border-gray-200 p-3">
      <Image source={imageSource} style={imageStyle} />
    </Pressable>
    <Text className="text-s mt-2 text-muted-foreground">{label}</Text>
  </View>
);

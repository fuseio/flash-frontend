import { Image, View } from "react-native";
import { Leaf } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from "../ui/text";
import { cn, formatNumber } from "@/lib/utils";

type SavingCardProps = {
  balance: number;
  className?: string;
}

const SavingCard = ({ balance, className }: SavingCardProps) => {
  return (
    <LinearGradient
      colors={['rgba(100, 253, 65, 0.2)', 'rgba(61, 221, 26, 0.1)']}
      className={cn("bg-card rounded-twice p-6 justify-between w-full h-full", className)}
    >
      <View className="flex-row items-center gap-2 opacity-50">
        <Leaf size={18} />
        <Text className="text-lg font-semibold">Savings</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-3xl text-brand font-semibold">${formatNumber(balance)}</Text>
        <Image source={require('@/assets/images/bitcoin-usdc-4x.png')} style={{ width: 53, height: 28 }} />
      </View>
    </LinearGradient>
  )
}

export default SavingCard;

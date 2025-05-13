import { ArrowDown } from "lucide-react-native";
import { View } from 'react-native';

const TokenDivider = () => {
  return (
    <View className="relative z-10">
      <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2.5 bg-background border border-border rounded-full items-center justify-center">
        <View className="bg-border w-8 h-8 rounded-full items-center justify-center">
          <ArrowDown />
        </View>
      </View>
    </View>
  )
}

export default TokenDivider;

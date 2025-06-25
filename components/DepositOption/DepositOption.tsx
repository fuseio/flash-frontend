import { ActivityIndicator, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { Button } from "../ui/button";
import { Text } from "../ui/text";

type DepositOptionProps = {
  text: string;
  icon: React.ReactNode;
  onPress: () => void;
  isLoading: boolean;
}

const DepositOption = ({ text, icon, onPress, isLoading }: DepositOptionProps) => {
  return (
    <Button
      className="flex-row items-center justify-between bg-primary/10 rounded-2xl h-20 p-6"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-x-2">
        {icon}
        <Text className="text-primary text-lg font-semibold">{text}</Text>
      </View>
      {isLoading ?
        <ActivityIndicator color="white" size={20} /> :
        <ChevronRight color="white" size={20} />
      }
    </Button>
  )
}

export default DepositOption;

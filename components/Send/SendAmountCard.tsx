import { TextInput, View } from "react-native";

import { Text } from "@/components/ui/text";
import TokenSelectorModal from "../TokenSelector/TokenSelectorModal";

interface SendAmountCardProps {
  amount: string;
  onChange: (value: string) => void;
}

const SendAmountCard = ({ amount, onChange }: SendAmountCardProps) => {
  return (
    <View className="flex flex-col gap-4 bg-card rounded-xl md:rounded-twice p-6 md:p-10">
      <Text className="text-lg font-medium">
        Amount
      </Text>
      <View className="flex-row justify-between items-center gap-4">
        <TokenSelectorModal />
        <View className="items-end">
          <TextInput
            keyboardType="numeric"
            className="w-full text-right text-4xl text-primary font-semibold placeholder:text-muted-foreground web:focus:outline-none"
            value={amount}
            placeholder="0"
            onChangeText={onChange}
          />
        </View>
      </View>
    </View>
  );
};

export default SendAmountCard;
